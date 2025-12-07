import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.use("/api/auth", authRoutes);


mongoose.connection.once("open", () => {
  console.log("✅ Connected to DB:", mongoose.connection.name);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Test: http://localhost:${PORT}`);
  console.log(`Auth routes: http://localhost:${PORT}/api/auth`);
});