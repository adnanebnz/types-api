import express from "express";
import jwt from "jsonwebtoken";
import {
  getUserByEmail,
  createUser,
  getUserBySessionToken,
} from "../models/User";
import bcrypt from "bcrypt";
import { hashPassword } from "../helpers";

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

export const login = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Missing fields" });
    }
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: "User doesn't exist" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.authentification.password
    );
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    user.authentification.sessionToken = token;
    await user.save();
    return res.status(200).json(user).end();
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const cookie = req.cookies.accessToken;
    const user = await getUserBySessionToken(cookie);
    if (!user) {
      res.status(400).json({ message: "User doesn't exist" });
    }
    user.authentification.sessionToken = null;
    await user.save();
    res.clearCookie("accessToken");
    return res.status(200).json("logged out").end();
  } catch (error) {
    next(error);
  }
};
