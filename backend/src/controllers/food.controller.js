import uploadToCloudinary from "../utils/cloudinary.js";
import foodModel from "../models/food.model.js"; // adjust path/name to your actual model

export const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    console.log(req.file);
    let url = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      url = result.secure_url;
    }

    const food = await foodModel.create({
      name,
      description,
      price,
      category,
      image: url,
    });

    res.status(200).json({
      message: "Food added successfully",
      success: true,
      food,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message, // send message string, not the raw Error object
    });
  }
};

export const getFoods = async (req, res) => {
  try {
    const foods = await foodModel.find();
    if (!foods || foods.length === 0) {
      return res.status(404).json({
        message: "No foods found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Foods retrieved successfully",
      success: true,
      foods,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        message: "Food not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Food retrieved successfully",
      success: true,
      food,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const updateFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const updateData = { name, description, price, category };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      updateData.image = result.secure_url;
    }

    const food = await foodModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Food updated successfully",
      success: true,
      food,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const food = await foodModel.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Food deleted successfully",
      success: true,
      food,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

  
