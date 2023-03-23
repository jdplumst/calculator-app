import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { serialize } from "cookie";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Ensure only POST methods can be used on this route
  switch (req.method) {
    case "POST":
      const { username, password } = req.body;

      // Make sure both username and password are non-empty
      if (!username || !password) {
        return res.status(400).json({ error: "All fields must be filled" });
      }

      try {
        // Fetch user from database
        const user = await prisma.users.findFirst({
          where: { username: username }
        });

        // Send error message if user not found in database
        if (!user) {
          res.status(400).json({ error: "User does not exist" });
        } else {
          // Check that password is correct
          const check = await bcrypt.compare(password, user.password);
          if (!check) {
            res.status(400).json({ error: "Incorrect password" });
          }
          // Sign JWT and set cookies
          const token = jsonwebtoken.sign(
            { id: user.id },
            process.env.TOKEN_SECRET as string,
            { expiresIn: 60 * 60 } // expires in 1 hour
          );
          res.setHeader("Set-Cookie", [
            serialize("token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV !== "development",
              sameSite: "strict",
              maxAge: 60 * 60,
              path: "/"
            }),
            serialize("username", username, {
              httpOnly: true,
              secure: process.env.NODE_ENV !== "development",
              sameSite: "strict",
              maxAge: 60 * 60,
              path: "/"
            })
          ]);
          return res.status(200).json({ username: username, token: token });
        }
      } catch (error) {
        return res
          .status(400)
          .json({ error: "Something went wrong. Try again." });
      }
    // Send error message if other methods used
    default:
      return res.status(405).json({ error: "Method Not Allowed" });
  }
};
