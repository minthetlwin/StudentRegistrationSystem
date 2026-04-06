import express from "express";
import { protectStudent } from "../middleware/authMiddleware.js";
import { 
  getDashboard, 
  registerDorm, 
  getMyDormRegistration,
  submitStudentRegistration,
  getMyRegistrationStatus
} from "../controllers/studentController.js";


const router = express.Router();

router.get("/dashboard", protectStudent, getDashboard);
router.post("/dorm/register", protectStudent, registerDorm);
router.get("/dorm/my-registration", protectStudent, getMyDormRegistration);
router.post("/register", protectStudent, submitStudentRegistration);
router.get("/registration-status", protectStudent, getMyRegistrationStatus);


export default router;