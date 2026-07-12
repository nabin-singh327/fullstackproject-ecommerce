import express from "express";
import {
  addFood,
  getFoodById,
  getFoods,
  updateFood,
  deleteFood,
} from "../controllers/food.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const foodRoutes = express.Router();

foodRoutes.route("/").post(verifyToken, isAdmin, upload.single("image"), addFood).get(getFoods);
foodRoutes
  .route("/:id")
  .get(getFoodById)
  .put(verifyToken, isAdmin, upload.single("image"), updateFood)
  .delete(verifyToken, isAdmin, deleteFood);

export default foodRoutes;
