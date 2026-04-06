import express from "express";
import { verifyAdmittedStudent, setStudentPassword, loginStudent  } from "../controllers/authController.js";
import  {adminLogin ,addAdmin} from "../controllers/adminController.js";

const router = express.Router();

router.post("/verify-admitted", verifyAdmittedStudent);
router.post("/set-password", setStudentPassword);
router.post("/login", loginStudent);

router.post("/admin-login", adminLogin);

export default router;
