import express from "express";
import { verifyAdmittedStudent, setStudentPassword } from "../controllers/authController.js";


const router = express.Router();

router.post("/verify-admitted", verifyAdmittedStudent);
router.post("/set-password", setStudentPassword);

export default router;
