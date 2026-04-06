import AdmittedStudents  from "../models/admittedStudents.js";
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

    // Search in AdmittedStudents first
    let student = await AdmittedStudents.findOne({ nrc, enrollment_number });
    let isTransferStudent = false;

    // If not found, check CurrentStudents (for transfer students without password)
    if (!student) {
      student = await Students.findOne({ nrc, enrollment_number });
      
      if (student) {
        if (student.password) {
          return res.status(400).json({
            success: false,
            message: "Account already created. Please login."
          });
        }
        isTransferStudent = true;
      }
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found in records"
      });
    }

    // Validate DOB
    const inputDate = new Date(date_of_birth).toISOString().split("T")[0];
    const storedDate = new Date(student.date_of_birth).toISOString().split("T")[0];

    if (inputDate !== storedDate) {
      return res.status(400).json({
        success: false,
        message: "Date of birth does not match"
      });
    }

    // Optional G12 check
    if (g12_exam_id && student.g12_exam_id !== g12_exam_id) {
      return res.status(400).json({
        success: false,
        message: "G12 exam ID does not match"
      });
    }

    // Prepare response
    const responseData = {
      success: true,
      message: "Student verified successfully",
      student: {
        nrc: student.nrc,
        enrollment_number: student.enrollment_number,
        date_of_birth: student.date_of_birth,
        full_name: student.full_name,
        g12_exam_id: student.g12_exam_id,
        isTransferStudent
      }
    };

    return res.status(200).json(responseData);

  } catch (error: any) {
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

    // Check if student exists in CurrentStudents (transfer student)
    const currentStudent = await Students.findOne({ enrollment_number, nrc });
    
    if (currentStudent) {
      if (currentStudent.password) {
        return res.status(400).json({ success: false, message: "Password already set. Please login." });
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);
      currentStudent.password = hashedPassword;
      await currentStudent.save();

      return res.json({ success: true, message: "Password set successfully" });
    }

    // Check AdmittedStudents (new student)
    const admittedStudent = await AdmittedStudents.findOne({ enrollment_number, nrc });

    if (!admittedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (!admittedStudent.g12_exam_id) {
      return res.status(400).json({ success: false, message: "G12 exam ID is missing in student record" });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Create new student in Students collection
    const student = new Students({
      enrollment_number: admittedStudent.enrollment_number,
      nrc: admittedStudent.nrc,
      full_name: admittedStudent.full_name,
      date_of_birth: admittedStudent.date_of_birth,
      program: admittedStudent.program,
      role: "student",
      admission_year: admittedStudent.admission_year,
      g12_exam_id: admittedStudent.g12_exam_id,
      password: hashedPassword,
      status: "REGISTERED"
    });

    await student.save();

    // Delete from AdmittedStudents
    await AdmittedStudents.findByIdAndDelete(admittedStudent._id);

    res.json({ success: true, message: "Password set successfully" });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
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
    const isPasswordValid = await bcrypt.compare(password, student.password as string);

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

  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
