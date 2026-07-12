import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foods: [
      {
        foodID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FULL REFUND", "PARTIAL REFUND", "AMBIGUOUS", "NOT FOUND", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;