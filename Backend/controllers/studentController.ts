import DormRegistration from "../models/dormRegistration.js";
import Semester from "../models/semesterUni.js";
import StudentRegistration from "../models/studentRegistration.js";
import Payment from "../models/payment.js";
import PaymentSettings from "../models/paymentSettings.js";
import { saveBase64Image } from "../utils/fileUpload.js";
import logger from "../utils/logger.js";

export async function getDashboard(req, res) {
  try {
    const student = req.student;
    res.json({ success: true, student });
  } catch (error: any) {
    logger.error(`getDashboard error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function registerDorm(req, res) {
  try {
    const studentId = req.student._id; 

    const activeSemester = await Semester.findOne({ isActive: true });
    if (!activeSemester) {
      return res.status(400).json({ success: false, message: "No active semester" });
    }

    // Check if student already submitted for this semester
    const exists = await DormRegistration.findOne({
      student: studentId,
      semester: activeSemester._id,
    });

    if (exists) {
      return res.status(400).json({ success: false, message: "Already submitted" });
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
    logger.error(`registerDorm error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
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
        success: true,
        exists: false,
        message: "No dorm registration found for you",
      });
    }

    res.json({
      success: true,
      exists: true,
      data: record,
    });

  } catch (err: any) {
    logger.error(`getMyDormRegistration error: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function submitStudentRegistration(req: any, res: any) {
  try {
    const studentId = req.student._id;

    // Get active semester
    const activeSemester = await Semester.findOne({ isActive: true });
    if (!activeSemester) {
      return res.status(400).json({ success: false, message: "No active semester for registration." });
    }

    // Check if registration already exists for THIS semester
    const existingRegistration = await StudentRegistration.findOne({ 
      student: studentId,
      semester: activeSemester._id 
    });

    if (existingRegistration && existingRegistration.status !== 'REJECTED') {
      return res.status(400).json({ 
        success: false, 
        message: `You have already submitted a registration for ${activeSemester.name} or it is being processed.` 
      });
    }

    const { profile_photo, live_photo, ...formData } = req.body;

    // Save photos to disk (async)
    const profile_photo_url = await saveBase64Image(profile_photo, 'profile');
    const live_photo_url = await saveBase64Image(live_photo, 'live');

    if (!profile_photo_url || !live_photo_url) {
      return res.status(400).json({ success: false, message: "Invalid photo data" });
    }

    // Create or Update registration
    let registration;
    if (existingRegistration && existingRegistration.status === 'REJECTED') {
      // Re-submission for this semester
      registration = await StudentRegistration.findOneAndUpdate(
        { _id: existingRegistration._id },
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
      // New submission for this semester
      registration = await StudentRegistration.create({
        student: studentId,
        semester: activeSemester._id,
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
    logger.error(`submitStudentRegistration error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getMyRegistrationStatus(req: any, res: any) {
  try {
    const studentId = req.student._id;

    // Get active semester to check current status
    const activeSemester = await Semester.findOne({ isActive: true });
    
    // Find registration for current active semester
    const registration = activeSemester 
      ? await StudentRegistration.findOne({ student: studentId, semester: activeSemester._id })
      : null;

    if (!registration) {
      return res.json({ 
        success: true, 
        exists: false,
        message: activeSemester ? `No registration for ${activeSemester.name}` : "No active semester"
      });
    }

    res.json({
      success: true,
      exists: true,
      status: registration.status,
      adminRemark: registration.adminRemark,
      data: registration
    });

  } catch (error: any) {
    logger.error(`getMyRegistrationStatus error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getPaymentStatus(req: any, res: any) {
  try {
    const studentId = req.student._id;

    const payment = await Payment.findOne({
      student: studentId,
    }).populate("student", "full_name enrollment_number");

    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = { feeBreakdown: [], totalAmountRequired: 0 } as any;
    }

    // 1. If NO payment record exists yet in DB
    if (!payment) {
      return res.json({
        success: true,
        exists: false,
        data: {
          status: "UNPAID",
          amountRequired: settings.totalAmountRequired,
          feeBreakdown: settings.feeBreakdown,
          adminRemark: "",
        },
      });
    }

    // 2. If a payment record DOES exist in DB
    const paymentObj = payment.toObject();
    const useLatestSettings = payment.status === "UNPAID" || payment.status === "REJECTED";

    return res.json({
      success: true,
      exists: true,
      data: {
        ...paymentObj,
        amountRequired: useLatestSettings ? settings.totalAmountRequired : payment.amountRequired,
        feeBreakdown: useLatestSettings ? settings.feeBreakdown : payment.feeBreakdown,
      },
    });
  } catch (error: any) {
    logger.error(`getPaymentStatus error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
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

    const slip_image_url = await saveBase64Image(slip_image, 'slip');
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
    logger.error(`submitPayment error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
