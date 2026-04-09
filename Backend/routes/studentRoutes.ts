import express from "express";
import { protectStudent } from "../middleware/authMiddleware.js";
import { 
  getDashboard, 
  registerDorm, 
  getMyDormRegistration,
  submitStudentRegistration,
  getMyRegistrationStatus,
  getPaymentStatus,
  submitPayment
} from "../controllers/studentController.js";


const router = express.Router();

router.get("/dashboard", protectStudent, getDashboard);
router.post("/dorm/register", protectStudent, registerDorm);
router.get("/dorm/my-registration", protectStudent, getMyDormRegistration);
router.post("/register", protectStudent, submitStudentRegistration);
router.get("/registration-status", protectStudent, getMyRegistrationStatus);
router.get("/payment-status", protectStudent, getPaymentStatus);
router.post("/payment", protectStudent, submitPayment);

export default router;