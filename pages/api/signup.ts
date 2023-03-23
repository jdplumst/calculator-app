import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import prisma from "@/prisma";
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

      // Create a hash for password with salt
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);

      try {
        // Add new user to db and create JWT
        const user = await prisma.users.create({
          data: { username: username, password: hash }
        });
        const token = jsonwebtoken.sign(
          { id: user.id },
          process.env.TOKEN_SECRET as string,
          { expiresIn: 60 * 60 } // expires in 1 hour
        );
        res.setHeader(
          "Set-Cookie",
          serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 60 * 60,
            path: "/"
          })
        );
        return res.status(200).json({ username: username, token: token });
      } catch (error: any) {
        // Catch if user already exists in db or other errors
        if (error.code === "P2002") {
          return res.status(400).json({ error: "Username is already in use" });
        } else {
          return res
            .status(400)
            .json({ error: "Something went wrong. Try again." });
        }
      }

    // Send error message if other methods used
    default:
      return res.status(405).json({ error: "Method Not Allowed" });
  }
};
