import express from "express";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import { createOrder } from "../controllers/order.controller.js";
import { success } from "../controllers/order.controller.js";
import { getOrder } from "../controllers/order.controller.js";
import { getOrders } from "../controllers/order.controller.js";
import { updateOrder } from "../controllers/order.controller.js";
import { deleteOrder } from "../controllers/order.controller.js";


const orderRoutes = express.Router();

orderRoutes.route("/create").post(verifyToken, createOrder);
orderRoutes.route("/success").get(success);
orderRoutes.route("/").get(verifyToken, isAdmin, getOrders);

orderRoutes.route("/:id")
  .get(getOrder)
  .put(verifyToken, updateOrder)
  .delete(verifyToken, deleteOrder);
// orderRoutes.route("/get/user/:userId").get(getOrdersByUserId);

export default orderRoutes;
