import DormRegistration from "../models/dormRegistration.js";
import Semester from "../models/semesterUni.js";
import StudentRegistration from "../models/studentRegistration.js";
import Payment from "../models/payment.js";
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

import PaymentSettings from "../models/paymentSettings.js";

export async function getPaymentStatus(req: any, res: any) {
  try {
    const studentId = req.student._id;
    const payment = await Payment.findOne({ student: studentId }).populate("student", "full_name enrollment_number");
    
    // Always fetch global settings for the breakdown display
    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = { feeBreakdown: [], totalAmountRequired: 0 } as any;
    }

    if (!payment) {
      return res.json({ 
        exists: false, 
        amountRequired: settings.totalAmountRequired, 
        feeBreakdown: settings.feeBreakdown 
      });
    }
    
    // If payment exists but it's UNPAID/PENDING without its own snapshot, or we just want to ensure it has the global data for rendering
    res.json({ 
      exists: true, 
      data: {
        ...payment.toObject(),
        feeBreakdown: payment.feeBreakdown?.length ? payment.feeBreakdown : settings.feeBreakdown,
        amountRequired: payment.amountRequired || settings.totalAmountRequired
      } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function submitPayment(req: any, res: any) {
  try {
    const studentId = req.student._id;
    const { slip_image } = req.body;

    if (!slip_image) {
      return res.status(400).json({ success: false, message: "Slip image is required" });
    }

    const existingPayment = await Payment.findOne({ student: studentId });
    if (existingPayment && existingPayment.status !== "REJECTED" && existingPayment.status !== "UNPAID") {
      return res.status(400).json({ success: false, message: "Payment already submitted or processing" });
    }

    const slip_image_url = saveBase64Image(slip_image, 'slip');
    if (!slip_image_url) {
      return res.status(400).json({ success: false, message: "Invalid image format" });
    }

    let settings = await PaymentSettings.findOne();
    if (!settings) settings = { feeBreakdown: [], totalAmountRequired: 0 } as any;

    let payment;
    if (existingPayment && (existingPayment.status === "REJECTED" || existingPayment.status === "UNPAID")) {
      payment = await Payment.findOneAndUpdate(
        { student: studentId },
        { 
          slip_image_url, 
          status: "PENDING", 
          adminRemark: "",
          amountRequired: settings.totalAmountRequired,
          feeBreakdown: settings.feeBreakdown
        },
        { new: true }
      );
    } else {
      payment = await Payment.create({
        student: studentId,
        slip_image_url,
        amountRequired: settings.totalAmountRequired,
        feeBreakdown: settings.feeBreakdown,
        status: "PENDING"
      });
    }

    res.status(201).json({ success: true, message: "Payment submitted", data: payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
