import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://frontend:5173'],
  credentials: true
}));
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

mongoose.connection.once("open", () => {
  console.log(" Connected to DB:", mongoose.connection.name);
});

mongoose.connection.on("error", (err) => {
  console.error(" MongoDB connection error:", err.message);
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(` Server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error(' Server error:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error(' Unhandled rejection:', err.message);
});
