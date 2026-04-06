import DormRegistration from "../models/dormRegistration.js";
import Semester from "../models/semesterUni.js";
import StudentRegistration from "../models/studentRegistration.js";
import { saveBase64Image } from "../utils/fileUpload.js";
import mongoose from "mongoose";

export async function getDashboard(req, res) {
  try {
    const student = req.student;
    res.json({ student });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function registerDorm(req, res) {
  try {
    const studentId = req.student._id; 

    const activeSemester = await Semester.findOne({ isActive: true });
    if (!activeSemester) {
      return res.status(400).json({ message: "No active semester" });
    }

    // Check if student already submitted for this semester
    const exists = await DormRegistration.findOne({
      student: studentId,
      semester: activeSemester._id,
    });

    if (exists) {
      return res.status(400).json({ message: "Already submitted" });
    }

    const form = await DormRegistration.create({
      student: studentId,
      semester: activeSemester._id,
      address: req.body.address,
      emergencyContact: req.body.emergencyContact,
      reason: req.body.reason,
    });

    res.status(201).json({
      success: true,
      message: "Dorm registration submitted",
      data: form,
    });

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function getMyDormRegistration(req, res) {
  try {
    const studentId = req.student._id;

    const record = await DormRegistration.findOne({ student: studentId })
      .populate("semester", "name")
      .populate("reviewedBy", "name email");

    if (!record) {
      return res.json({
        exists: false,
        message: "No dorm registration found for you",
      });
    }

    res.json({
      exists: true,
      data: record,
    });

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function submitStudentRegistration(req: any, res: any) {
  try {
    const studentId = req.student._id;

    // Check if registration already exists
    const existingRegistration = await StudentRegistration.findOne({ student: studentId });
    if (existingRegistration && existingRegistration.status !== 'REJECTED') {
      return res.status(400).json({ 
        success: false, 
        message: "You have already submitted a registration or your registration is being processed." 
      });
    }

    const { profile_photo, live_photo, ...formData } = req.body;

    // Save photos to disk
    const profile_photo_url = saveBase64Image(profile_photo, 'profile');
    const live_photo_url = saveBase64Image(live_photo, 'live');

    if (!profile_photo_url || !live_photo_url) {
      return res.status(400).json({ success: false, message: "Invalid photo data" });
    }

    // Create or Update registration
    let registration;
    if (existingRegistration && existingRegistration.status === 'REJECTED') {
      // Re-submission
      registration = await StudentRegistration.findOneAndUpdate(
        { student: studentId },
        { 
          ...formData, 
          profile_photo_url, 
          live_photo_url, 
          status: 'PENDING',
          adminRemark: '' 
        },
        { new: true }
      );
    } else {
      // New submission
      registration = await StudentRegistration.create({
        student: studentId,
        ...formData,
        profile_photo_url,
        live_photo_url,
        status: 'PENDING'
      });
    }

    res.status(201).json({
      success: true,
      message: "Registration submitted successfully",
      data: registration,
    });

  } catch (error: any) {
    console.error("Registration Submission Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getMyRegistrationStatus(req: any, res: any) {
  try {
    const studentId = req.student._id;
    const registration = await StudentRegistration.findOne({ student: studentId });

    if (!registration) {
      return res.json({ exists: false });
    }

    res.json({
      exists: true,
      status: registration.status,
      adminRemark: registration.adminRemark,
      data: registration
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
