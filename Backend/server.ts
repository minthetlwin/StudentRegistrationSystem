import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger.js';
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://frontend:5173'],
  credentials: true
}));
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static('uploads'));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

connectDB();

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check for admin routes
app.get('/admin-api-test', (req, res) => {
  res.json({ message: 'Admin API routes are being registered' });
});

// Diagnostic route for student registrations (to debug 404)
app.get('/api/admin/student-registrations-test', (req, res) => {
  res.json({ message: 'Student registration endpoint is reachable from server.ts' });
});

mongoose.connection.once("open", () => {
  logger.info(`Connected to DB: ${mongoose.connection.name}`);
});

mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB connection error: ${err.message}`);
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  logger.error(`Server error: ${err.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (err: any) => {
  logger.error(`Unhandled rejection: ${err.message}`);
});
