import * as bcrypt from "bcrypt-ts";
import type { Request, Response } from "express";
import generateToken from "../utils/generatetoken.js";
import { prisma } from "../db.js";
//SIGNUP

const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
//LOGIN/SIGNIN
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const token = generateToken(existingUser.id);

    res
      .status(200)
      .json({ id: existingUser.id, email: existingUser.email, token });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { login, signup };
