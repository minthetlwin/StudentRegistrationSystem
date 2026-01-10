import express from "express";
import  {addAdmin, addSemester, getDormRegistrations} from "../controllers/adminController.js";

const router = express.Router();

router.post("/add-admin", addAdmin);
router.post("/add-semester", addSemester);
router.get("/dorm-registrations", getDormRegistrations);

export default router;