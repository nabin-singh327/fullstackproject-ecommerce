import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUpUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "user with this email already exist",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullname,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" },
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "user signed up",
      success: true,
      token,
      data: {
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      success: false,
      error,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "user not found",
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "incorrect password",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" },
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "user logged in",
      success: true,
      token,
      data: {
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      success: false,
      error,
    });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "user logged out",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      success: false,
      error,
    });
  }
};

export const getMe = (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      message: "user fetched",
      success: true,
      data: {
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      success: false,
      error,
    });
  }
};

export const getUsers = async (req, res) => {
  const users = await userModel.find({}, "-password");
  if (!users) {
    return res.status(404).json({
      message: "No users found",
      success: false,
    });
  }
  res.status(200).json({
    message: "users fetched",
    success: true,
    data: users,
  });
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
        success: false,
      });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true, select: "fullname email role createdAt" },
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "User role updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Failed to update user", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Failed to delete user", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
