import DormRegistration from "../models/dormRegistration.js";
import Semester from "../models/semesterUni.js";

export async function getDashboard(req, res) {
  try {
    const student = req.student;
    res.json({ student });
  } catch (error) {
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

  } catch (err) {
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

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}