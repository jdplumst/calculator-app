import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
import bcrypt from "bcrypt";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
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
          return res.status(400).json({ error: "User does not exist" });
        } else {
          // Check that password is correct
          const check = await bcrypt.compare(password, user.password);
          if (!check) {
            return res.status(400).json({ error: "Incorrect password" });
          } else {
            return res.status(200).json({ username: user.username });
          }
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
}
