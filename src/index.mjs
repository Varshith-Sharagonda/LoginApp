import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "../backend-app/connect.database.js";
import authRoutes from "../backend-app/auth.routing.js";

dotenv.config();

const app = express();


app.use(express.json());

app.use("/api/auth", authRoutes);


app.listen(process.env.PORT, () => {
  connectDatabase();
  console.log(`Server is running on port ${process.env.PORT}`);
});