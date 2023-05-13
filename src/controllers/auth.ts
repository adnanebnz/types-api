import express from "express";
import {
  getUserByEmail,
  getUserById,
  getUserBySessionToken,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "models/User";
import { hashPassword, comparePasswords } from "helpers";
export const register = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      res.status(400).json({ message: "Missing fields" });
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
    }

    const user = await createUser({
      email,
      username,
      authentification: {
        password: await hashPassword(password),
      },
    });
    return res.status(200).json(user).end();
  } catch (error) {
    next(error);
  }
};
