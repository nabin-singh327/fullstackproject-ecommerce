import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  const tokenFromCookie = req.cookies?.token;
  const tokenFromHeader = req.headers.authorization?.split(" ")[1];
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(400).json({
      message: "Token not provided",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Invalid Token",
      success: false,
    });
  }
};


export const isAdmin = (req, res, next) => {
  const user = req.user;
  if (user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only.",
      success: false,
    });
  }
  next();
};