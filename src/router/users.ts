import express from "express";

import {
  getAllUsers,
  getSingleUser,
  removeUser,
  modifyUser,
} from "../controllers/users";
import { isAuthenticated } from "../middlewares/index";
export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.get("/users/:userId", isAuthenticated, getSingleUser);
  router.delete("/users/:userId", isAuthenticated, removeUser);
  router.put("/users/:userId", isAuthenticated, modifyUser);
};
