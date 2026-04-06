import jwt from "jsonwebtoken";
import Students from "../models/mainStudents.js";
import adminUser from "../models/adminUser.js";


export const protectStudent = async (req, res, next) => {
  let token;


  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      // Attach student to request, excluding password
      const student = await Students.findById(decoded.studentId).select("-password");

      if (!student) {
        return res.status(401).json({ success: false, message: "Student not found" });
      }

      req.student = student; // Available in next middleware or route
      next();
    } catch (error: any) {
      console.error("Auth Middleware Error:", error);
      res.status(401).json({ success: false, message: "Not authorized, invalid token" });
    }
  } else {
    res.status(401).json({ success: false, message: "No token, authorization denied" });
  }
};

export const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      // Attach admin to request, excluding password
      const admin = await adminUser.findById(decoded.id).select("-password");

      if (!admin) {
        return res.status(401).json({ success: false, message: "Admin not found" });
      }

      req.user = admin; // Available in next middleware or route
      next();
    } catch (error: any) {
      console.error("Admin Auth Middleware Error:", error);
      res.status(401).json({ success: false, message: "Not authorized, invalid token" });
    }
  } else {
    res.status(401).json({ success: false, message: "No token, authorization denied" });
  }
};
