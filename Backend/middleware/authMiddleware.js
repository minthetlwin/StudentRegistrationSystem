import jwt from "jsonwebtoken";
import Students from "../models/studentModel.js";


export const protectStudent = async (req, res, next) => {
  let token;


  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach student to request, excluding password
      const student = await Students.findById(decoded.studentId).select("-password");

      if (!student) {
        return res.status(401).json({ success: false, message: "Student not found" });
      }

      req.student = student; // Available in next middleware or route
      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);
      res.status(401).json({ success: false, message: "Not authorized, invalid token" });
    }
  } else {
    res.status(401).json({ success: false, message: "No token, authorization denied" });
  }
};