import mongoose from "mongoose";
import orderModel from "../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const userID = req.user._id;
    const { foods, paymentStatus } = req.body;

    if (!Array.isArray(foods) || foods.length === 0) {
      return res.status(400).json({
        message: "At least one food item is required",
        success: false,
      });
    }

    const normalizedFoods = foods.map((item) => {
      if (!item?.foodID) {
        throw new Error("Each food item must include a foodID");
      }

      const foodID = item.foodID;
      const normalizedFoodID =
        typeof foodID === "string" && mongoose.Types.ObjectId.isValid(foodID)
          ? new mongoose.Types.ObjectId(foodID)
          : foodID;

      return {
        foodID: normalizedFoodID,
        quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
      };
    });

    const order = await orderModel.create({
      userID,
      foods: normalizedFoods,
      paymentStatus: paymentStatus || "PENDING",
    });

    return res.status(201).json({
      message: "Order created successfully",
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order creation failed", error);

    if (
      error.message.includes("foodID") ||
      error.message.includes("validation")
    ) {
      return res.status(400).json({
        message: error.message,
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const success = async (req, res) => {
  try {
    const { transaction_uuid, status } = JSON.parse(
      atab(req.query.data) || "{}",
    );
    const order = await orderModel.findById(transaction_uuid);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }
    await orderModel.findByIdAndUpdate(
      transaction_uuid,
      { paymentStatus: status },
      { new: true },
    );
    res.redirect(
      `https://localhost:5173/success?transaction_uuid=${transaction_uuid}&status=${status}`,
    );
  } catch (error) {
    console.error("Failed to update payment status", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderModel.findById(orderId).populate("foods.foodID").populate("userID");
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Order found",
      success: true,
      order,
    });
  } catch (error) {
    console.error("Failed to get order", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        message: "paymentStatus is required",
        success: false,
      });
    }

    const allowedStatuses = ["PENDING", "COMPLETED", "FULL REFUND", "PARTIAL REFUND", "AMBIGUOUS", "NOT FOUND", "CANCELLED"];
    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid paymentStatus value",
        success: false,
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true, runValidators: true },
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Order updated successfully",
      success: true,
      order,
    });
  } catch (error) {
    console.error("Failed to update order", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderModel.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Order deleted successfully",
      success: true,
      order,
    });
  } catch (error) {
    console.error("Failed to delete order", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  const orders = await orderModel.find({}, "-password");
  if (!orders) {
    return res.status(404).json({
      message: "No orders found",
      success: false,
    });
  }
  res.status(200).json({
    message: "orders fetched",
    success: true,
    data: orders,
  });
};