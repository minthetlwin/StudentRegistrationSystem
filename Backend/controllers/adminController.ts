import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validatePassword } from "../utils/passwordValidator.js";
import adminUser from "../models/adminUser.js";
import Semester from "../models/semesterUni.js";
import DormRegistration from "../models/dormRegistration.js";
import AdmittedStudents from "../models/admittedStudents.js";
import MainStudents from "../models/mainStudents.js";
import StudentRegistration from "../models/studentRegistration.js";
import Notification from "../models/notification.js";
import Payment from "../models/payment.js";
import PaymentSettings from "../models/paymentSettings.js";
import logger from "../utils/logger.js";

// ── Helpers ─────────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Whitelist of fields an admin is allowed to bulk-update on a student record */
const ALLOWED_ADMITTED_UPDATE_FIELDS = [
  'full_name', 'enrollment_number', 'nrc', 'date_of_birth',
  'g12_exam_id', 'program', 'admission_year', 'status'
];

const ALLOWED_CURRENT_UPDATE_FIELDS = [
  'full_name', 'enrollment_number', 'nrc', 'date_of_birth',
  'g12_exam_id', 'program', 'admission_year', 'current_year', 'status'
];

/** Pick only allowed keys from an object */
const pickAllowedFields = (body: any, allowed: string[]) => {
  const cleaned: any = {};
  for (const key of allowed) {
    if (body[key] !== undefined) cleaned[key] = body[key];
  }
  return cleaned;
};


// ── Auth ─────────────────────────────────────────────────────────────────────────

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const admin = await adminUser.findOne({ email });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if admin is active — same generic message to prevent enumeration
    if (!admin.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email,
        role: admin.role 
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    // Update last login
    admin.lastLoginAt = new Date();
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      role: admin.role
    });

  } catch (err: any) {
    logger.error(`adminLogin error: ${err.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const addAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    //  Basic validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email format validation
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Validate password complexity
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    const existingAdmin = await adminUser.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin (role is forced)
    const admin = await adminUser.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });

    //  Remove password from response
    const { password: _, ...adminData } = admin.toObject();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: adminData
    });

  } catch (error: any) {
    logger.error(`addAdmin error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const addSemester = async (req, res) => {
  try {
    const { name, academicYear, isActive, startDate, endDate } = req.body;

    if (!name || !academicYear || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const semester = await Semester.create({
      name,
      academicYear,
      isActive: isActive || false,
      startDate,
      endDate
    });

    res.status(201).json({
      success: true,
      message: 'Semester created successfully',
      data: semester
    });
  } catch (error: any) {
    logger.error(`addSemester error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getDormRegistrations = async (req, res) => {
  try {
    const registrations = await DormRegistration.find()
      .populate('student', 'full_name enrollment_number g12_exam_id')
      .populate('semester', 'name academicYear')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: registrations
    });
  } catch (error: any) {
    logger.error(`getDormRegistrations error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateDormStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, version, adminRemark } = req.body;

    const updated = await DormRegistration.findOneAndUpdate(
      { _id: id, version: version },
      { 
        status, 
        version: version + 1,
        adminRemark,
        reviewedBy: req.user._id,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate('student', 'full_name enrollment_number')
     .populate('semester', 'name academicYear')
     .populate('reviewedBy', 'name');

    if (!updated) {
      return res.status(409).json({ 
        success: false,
        message: 'Registration has been updated by another admin' 
      });
    }

    // Create Notification for Student
    const recipientId = updated.student?._id || updated.student;
    if (recipientId) {
      const studentDoc = updated.student as any;
      const semesterDoc = updated.semester as any;
      await Notification.create({
        recipient: recipientId,
        title: `Dormitory Registration ${status}`,
        message: `Your dormitory registration for ${semesterDoc?.name || ''} (${semesterDoc?.academicYear || ''}) has been ${status.toLowerCase()}. ${adminRemark ? `Remark: ${adminRemark}` : ''}`,
        type: status === 'APPROVED' ? 'SUCCESS' : status === 'REJECTED' ? 'ERROR' : 'INFO',
        link: '/dashboard',
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: updated
    });
  } catch (error: any) {
    logger.error(`updateDormStatus error: ${error.message}`);
    res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
};


export const getNewAdmittedStudents = async (req, res) => {
  try {
    const students = await AdmittedStudents.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error: any) {
    logger.error(`getNewAdmittedStudents error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


export const getCurrentStudents = async (req, res) => {
  try {
    const students = await MainStudents.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error: any) {
    logger.error(`getCurrentStudents error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const updateAdmittedStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const student = await AdmittedStudents.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Create Notification if student already has a MainStudents record (transfer students)
    const existingMainStudent = await MainStudents.findOne({ nrc: student.nrc, enrollment_number: student.enrollment_number });
    if (existingMainStudent) {
      await Notification.create({
        recipient: existingMainStudent._id,
        title: `Admission Status Updated`,
        message: `Your admission status has been updated to ${status}.`,
        type: status === 'REGISTERED' ? 'SUCCESS' : 'INFO',
        link: '/dashboard',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: student
    });
  } catch (error: any) {
    logger.error(`updateAdmittedStudentStatus error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const updateAdmittedStudent = async (req, res) => {
  try {
    const { id } = req.params;
    // Whitelist allowed fields instead of accepting raw body
    const updateData = pickAllowedFields(req.body, ALLOWED_ADMITTED_UPDATE_FIELDS);

    const student = await AdmittedStudents.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error: any) {
    logger.error(`updateAdmittedStudent error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const updateCurrentStudent = async (req, res) => {
  try {
    const { id } = req.params;
    // Whitelist allowed fields instead of accepting raw body
    const updateData = pickAllowedFields(req.body, ALLOWED_CURRENT_UPDATE_FIELDS);

    const student = await MainStudents.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error: any) {
    logger.error(`updateCurrentStudent error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const deleteAdmittedStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await AdmittedStudents.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error: any) {
    logger.error(`deleteAdmittedStudent error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const deleteCurrentStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete all dorm registrations for this student
    await DormRegistration.deleteMany({ student: id });

    const student = await MainStudents.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error: any) {
    logger.error(`deleteCurrentStudent error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const addAdmittedStudent = async (req, res) => {
  try {
    const { full_name, enrollment_number, nrc, date_of_birth, g12_exam_id, program, admission_year } = req.body;

    if (!full_name || !enrollment_number || !nrc || !date_of_birth || !g12_exam_id || !admission_year) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check for duplicates
    const existing = await AdmittedStudents.findOne({
      $or: [{ enrollment_number }, { nrc }, { g12_exam_id }]
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Student with this enrollment number, NRC, or G12 exam ID already exists'
      });
    }

    const student = await AdmittedStudents.create({
      full_name,
      enrollment_number,
      nrc,
      date_of_birth,
      g12_exam_id,
      program: program || 'none',
      admission_year,
      status: 'PENDING'
    });

    res.status(201).json({
      success: true,
      message: 'Admitted student added successfully',
      data: student
    });
  } catch (error: any) {
    logger.error(`addAdmittedStudent error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const addCurrentStudent = async (req, res) => {
  try {
    const { full_name, enrollment_number, nrc, date_of_birth, g12_exam_id, program, admission_year, current_year } = req.body;

    if (!full_name || !enrollment_number || !nrc || !date_of_birth || !g12_exam_id) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check for duplicates
    const existing = await MainStudents.findOne({
      $or: [{ enrollment_number }, { nrc }, { g12_exam_id }]
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Student with this enrollment number, NRC, or G12 exam ID already exists'
      });
    }

    const student = await MainStudents.create({
      full_name,
      enrollment_number,
      nrc,
      date_of_birth,
      g12_exam_id,
      program: program || 'none',
      admission_year,
      current_year: current_year || 1,
      status: 'REGISTERED'
    });

    res.status(201).json({
      success: true,
      message: 'Current student added successfully',
      data: student
    });
  } catch (error: any) {
    logger.error(`addCurrentStudent error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getStudentRegistrations = async (req: any, res: any) => {
  try {
    const registrations = await StudentRegistration.find()
      .populate('student', 'full_name enrollment_number g12_exam_id nrc date_of_birth')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: registrations
    });
  } catch (error: any) {
    logger.error(`getStudentRegistrations error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateStudentRegistrationStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status, adminRemark } = req.body;

    const updated = await StudentRegistration.findByIdAndUpdate(
      id,
      { 
        status, 
        adminRemark,
        reviewedBy: req.user._id,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate('student', 'full_name enrollment_number current_year');

    if (!updated) {
      return res.status(404).json({ 
        success: false,
        message: 'Registration not found' 
      });
    }

    // Map year of study to numeric level
    const yearMapping: Record<string, number> = {
      "ပထမနှစ်": 1,
      "ဒုတိယနှစ်": 2,
      "တတိယနှစ်": 3,
      "စတုတ္ထနှစ်": 4,
      "ပဉ္စမနှစ်": 5,
      "Final Year": 6
    };

    // Create Notification and Payment for Student
    const recipientId = updated.student?._id || updated.student;
    if (recipientId) {
      // Automatic current_year promotion on approval
      if (status === 'APPROVED') {
        const studyYearStr = updated.year_of_study;
        const mappedYear = yearMapping[studyYearStr];
        
        if (mappedYear) {
          await Students.findByIdAndUpdate(recipientId, {
            current_year: mappedYear,
            status: 'REGISTERED' // Reset to registered if they were suspended
          });
        }
      }

      await Notification.create({
        recipient: recipientId,
        title: `Student Registration ${status}`,
        message: `Your student registration has been ${status.toLowerCase()}. ${adminRemark ? `Remark: ${adminRemark}` : ''}`,
        type: status === 'APPROVED' ? 'SUCCESS' : status === 'REJECTED' ? 'ERROR' : 'INFO',
        link: '/dashboard',
      });

      if (status === 'APPROVED') {
        // Create an UNPAID payment invoice automatically if not exists
        const existingPayment = await Payment.findOne({ student: recipientId });
        if (!existingPayment) {
          await Payment.create({
            student: recipientId,
            amountRequired: 0,
            feeBreakdown: [],
            status: 'UNPAID'
          });
        }
      }
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: updated
    });
  } catch (error: any) {
    logger.error(`updateStudentRegistrationStatus error: ${error.message}`);
    res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
};

export const getAllPayments = async (req: any, res: any) => {
  try {
    const payments = await Payment.find()
      .populate('student', 'full_name enrollment_number g12_exam_id nrc date_of_birth')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: payments
    });
  } catch (error: any) {
    logger.error(`getAllPayments error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updatePaymentStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status, adminRemark } = req.body;

    const updated = await Payment.findByIdAndUpdate(
      id,
      { 
        status, 
        adminRemark,
        reviewedBy: req.user._id,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate('student', 'full_name enrollment_number');

    if (!updated) {
      return res.status(404).json({ 
        success: false,
        message: 'Payment not found' 
      });
    }

    const recipientId = updated.student?._id || updated.student;
    if (recipientId) {
      await Notification.create({
        recipient: recipientId,
        title: `Payment ${status}`,
        message: `Your payment has been ${status.toLowerCase()}. ${adminRemark ? `Remark: ${adminRemark}` : ''}`,
        type: status === 'APPROVED' ? 'SUCCESS' : status === 'REJECTED' ? 'ERROR' : 'INFO',
        link: '/dashboard',
      });
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: updated
    });
  } catch (error: any) {
    logger.error(`updatePaymentStatus error: ${error.message}`);
    res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
};

export const getPaymentSettings = async (req: any, res: any) => {
  try {
    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = await PaymentSettings.create({
        feeBreakdown: [],
        totalAmountRequired: 0
      });
    }
    res.json({
      success: true,
      data: settings
    });
  } catch (error: any) {
    logger.error(`getPaymentSettings error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updatePaymentSettings = async (req: any, res: any) => {
  try {
    const { feeBreakdown } = req.body;

    if (!Array.isArray(feeBreakdown)) {
      return res.status(400).json({
        success: false,
        message: 'Valid fee breakdown array is required'
      });
    }

    const totalAmountRequired = feeBreakdown.reduce((total, item) => total + (Number(item.amount) || 0), 0);

    let settings = await PaymentSettings.findOne();
    if (settings) {
      settings.feeBreakdown = feeBreakdown;
      settings.totalAmountRequired = totalAmountRequired;
      await settings.save();
    } else {
      settings = await PaymentSettings.create({ feeBreakdown, totalAmountRequired });
    }

    res.json({
      success: true,
      message: 'Global payment settings updated successfully',
      data: settings
    });
  } catch (error: any) {
    logger.error(`updatePaymentSettings error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
