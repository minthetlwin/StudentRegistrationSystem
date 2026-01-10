import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import adminUser from "../models/adminUser.js";
import Semester from "../models/semesterUni.js";
import DormRegistration from "../models/dormRegistration.js";
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin or superadmin by email
    const totalAdmins = await adminUser.countDocuments();
   
    
    const admin = await adminUser.findOne({ email });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials - no admin found' });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email,
        role: admin.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
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

  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error' });
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

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
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

  } catch (error) {
    console.error('Add Admin Error:', error);
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
      return res.status(400).json({ message: 'All fields are required' });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};