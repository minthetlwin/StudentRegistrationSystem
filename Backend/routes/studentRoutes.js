import express from "express";
import { protectStudent } from "../middleware/authMiddleware.js";
import { getDashboard } from "../controllers/studentController.js";


const router = express.Router();

router.get("/dashboard", protectStudent, getDashboard);

export default router;