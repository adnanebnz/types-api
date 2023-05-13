import express from "express";
import { getUserById, getUsers, deleteUser, updateUser } from "../models/User";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users).end();
  } catch (error) {
    next(error);
  }
};

export const removeUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const user = await getUserById(userId);
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }
    await deleteUser(userId);
    return res.status(200).json({ message: "User deleted" }).end();
  } catch (error) {
    next(error);
  }
};

export const modifyUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const user = await getUserById(userId);
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }
    const updatedUser = await updateUser(userId, req.body);
    return res.status(200).json(updatedUser).end();
  } catch (error) {
    next(error);
  }
};

export const getSingleUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const user = await getUserById(userId);
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }
    return res.status(200).json(user).end();
  } catch (error) {
    next(error);
  }
};
