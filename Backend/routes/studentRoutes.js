import express from "express";
import { protectStudent } from "../middleware/authMiddleware.js";
import { getDashboard, registerDorm, getMyDormRegistration } from "../controllers/studentController.js";


const router = express.Router();

router.get("/dashboard", protectStudent, getDashboard);
router.post("/dorm/register", protectStudent, registerDorm);
router.get("/dorm/my-registration", protectStudent, getMyDormRegistration);

export default router;