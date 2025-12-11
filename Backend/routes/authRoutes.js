import express from "express";
import { verifyAdmittedStudent, setStudentPassword, loginStudent } from "../controllers/authController.js";


const router = express.Router();

router.post("/verify-admitted", verifyAdmittedStudent);
router.post("/set-password", setStudentPassword);
router.post("/login", loginStudent);

export default router;
