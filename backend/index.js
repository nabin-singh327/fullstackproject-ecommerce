import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectDB from "./src/db/index.js";

connectDB()
  .then(() => {
    app.listen(9000, () => {
      console.log("server is running on port 9000");
    });
  })
  .catch((err) => {
    console.log("Db not connected ", err);
  });