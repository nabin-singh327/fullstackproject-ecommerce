import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MANGODB_URI);
    console.log("DB Connected");
  } catch (error) {
    console.log("Failed to connect DB", error);
  }
};

export default connectDB;
