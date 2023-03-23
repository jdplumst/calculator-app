import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import prisma from "@/prisma";
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
        // Add new user to db
        const user = await prisma.users.create({
          data: { username: username, password: hash }
        });
        res.setHeader(
          "Set-Cookie",
          serialize("username", username, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 60 * 60, // 1 hour
            path: "/"
          })
        );

        return res.status(200).json({ username: username });
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
