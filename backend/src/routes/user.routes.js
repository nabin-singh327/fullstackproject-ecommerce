import express from "express";
import {
  getMe,
  loginUser,
  logoutUser,
  signUpUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const userRoutes = express.Router();

userRoutes.route("/sign-up").post(signUpUser);
userRoutes.route("/login").post(loginUser);
userRoutes.route("/logout").post(logoutUser);
userRoutes.route("/getme").get(verifyToken, getMe);
userRoutes.route("/").get(verifyToken, isAdmin, getUsers);
userRoutes.route("/:id")
  .put(verifyToken, updateUser)
  .delete(verifyToken, deleteUser);

export default userRoutes;
