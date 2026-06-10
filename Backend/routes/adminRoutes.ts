import express from "express";
import {
  addAdmin,
  addSemester,
  getSemesters,
  updateSemesterStatus,
  getDormRegistrations,
  updateDormStatus,
  getNewAdmittedStudents,
  getCurrentStudents,
  updateAdmittedStudentStatus,
  updateAdmittedStudent,
  updateCurrentStudent,
  deleteAdmittedStudent,
  deleteCurrentStudent,
  addAdmittedStudent,
  addCurrentStudent,
  getStudentRegistrations,
  updateStudentRegistrationStatus,
  getAllPayments,
  updatePaymentStatus,
  getPaymentSettings,
  updatePaymentSettings
} from "../controllers/adminController.js";
import { protectAdmin, requireSuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Superadmin-only: add new admin accounts
router.post("/add-admin", protectAdmin, requireSuperAdmin, addAdmin);

// Admin routes (all protected)
router.get("/semesters",protectAdmin, getSemesters);
router.post("/add-semester", protectAdmin, addSemester);
router.put("/semesters/:id/status", protectAdmin, updateSemesterStatus);
router.get("/dorm-registrations", protectAdmin, getDormRegistrations);
router.put("/dorm-registrations/:id/status", protectAdmin, updateDormStatus);

// Student registration management
router.get("/student-registrations", protectAdmin, getStudentRegistrations);
router.put("/student-registrations/:id/status", protectAdmin, updateStudentRegistrationStatus);

// Student listing
router.get("/new-admitted-studentlist", protectAdmin, getNewAdmittedStudents);
router.get("/current-students", protectAdmin, getCurrentStudents);

// Student management
router.put("/admitted-students/:id/status", protectAdmin, updateAdmittedStudentStatus);
router.put("/admitted-students/:id", protectAdmin, updateAdmittedStudent);
router.put("/current-students/:id", protectAdmin, updateCurrentStudent);
router.delete("/admitted-students/:id", protectAdmin, deleteAdmittedStudent);
router.delete("/current-students/:id", protectAdmin, deleteCurrentStudent);
router.post("/admitted-students", protectAdmin, addAdmittedStudent);
router.post("/current-students", protectAdmin, addCurrentStudent);

// Payment management
router.get("/payments", protectAdmin, getAllPayments);
router.put("/payments/:id/status", protectAdmin, updatePaymentStatus);
router.get("/payments/settings", protectAdmin, getPaymentSettings);
router.put("/payments/settings", protectAdmin, updatePaymentSettings);

export default router;