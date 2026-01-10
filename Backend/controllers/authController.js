import { AdmittedStudents } from "../models/admittedStudents.js";
import  Students  from "../models/mainStudents.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const verifyAdmittedStudent = async (req, res) => {
  try {
    const { nrc, g12_exam_id, enrollment_number, date_of_birth } = req.body;

    if (!enrollment_number || !nrc || !date_of_birth) {
      return res.status(400).json({
        success: false,
        message: "Enrollment number, NRC and Date of Birth are required"
      });
    }

    console.log('Verifying student:', { enrollment_number, nrc, date_of_birth });

    //  Search in AdmittedStudents
    const admittedStudent = await AdmittedStudents.findOne({
      nrc,
      enrollment_number
    });

    if (!admittedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found in admitted records"
      });
    }

    //  Validate DOB
    const inputDate = new Date(date_of_birth).toISOString().split("T")[0];
    const storedDate = new Date(admittedStudent.date_of_birth).toISOString().split("T")[0];

    if (inputDate !== storedDate) {
      return res.status(400).json({
        success: false,
        message: "Date of birth does not match"
      });
    }

    // Optional G12 check
    if (g12_exam_id && admittedStudent.g12_exam_id !== g12_exam_id) {
      return res.status(400).json({
        success: false,
        message: "G12 exam ID does not match"
      });
    }

    //  Ensure they didn’t create account already
    const existingStudent = await Students.findOne({
      enrollment_number,
      nrc
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Account already created. Please login."
      });
    }

    //  Prepare response
    const responseData = {
      success: true,
      message: "Student verified successfully",
      student: {
        nrc: admittedStudent.nrc,
        enrollment_number: admittedStudent.enrollment_number,
        date_of_birth: admittedStudent.date_of_birth,
        full_name: admittedStudent.full_name,
        g12_exam_id: admittedStudent.g12_exam_id
      }
    };

    console.log('Student verified successfully:', responseData.student.enrollment_number);

    return res.status(200).json(responseData);

  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



export const setStudentPassword = async (req, res) => {
  try {
    const { enrollment_number, nrc, date_of_birth, new_password, confirm_password } = req.body;

    if (!enrollment_number || !nrc || !date_of_birth || !new_password || !confirm_password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Find the admitted student first
    const admittedStudent = await AdmittedStudents.findOne({ enrollment_number, nrc });

    if (!admittedStudent) {
      return res.status(404).json({ success: false, message: "Admitted student not found" });
    }

    // Check if student already exists in Students collection
    const existingStudent = await Students.findOne({ enrollment_number });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: "Password already set. Please login." });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Create new student in Students collection
    const student = new Students({
      enrollment_number: admittedStudent.enrollment_number,
      nrc: admittedStudent.nrc,
      full_name: admittedStudent.full_name,
      date_of_birth: admittedStudent.date_of_birth,
      program: admittedStudent.program,
      role : "student",
      admission_year: admittedStudent.admission_year,
      g12_exam_id: admittedStudent.g12_exam_id,
      password: hashedPassword,
      status: "REGISTERED"
    });

    await student.save();

    res.json({ success: true, message: "Password set successfully" });

  } catch (error) {
    console.error("Set Password Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { enrollment_number, nrc, password } = req.body;

    if (!enrollment_number || !nrc || !password) {
      return res.status(400).json({ success: false, message: "Enrollment number, NRC, and password are required" });
    }

    // Find student by BOTH enrollment + NRC
    const student = await Students.findOne({ 
      enrollment_number,
      nrc,
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found or NRC mismatch" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        studentId: student._id, 
        enrollment_number: student.enrollment_number,
        role: student.role || 'student'
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: "7d" }
    );

    // Remove password from response
    const { password: _, ...studentData } = student.toObject();

    res.json({
      success: true,
      message: "Login successful",
      user: studentData,
      role: "student",
      token
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
