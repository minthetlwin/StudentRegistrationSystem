import jwt from "jsonwebtoken";
import Students from "../models/mainStudents.js";
import adminUser from "../models/adminUser.js";
import logger from "../utils/logger.js";


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
        return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
      }

      req.student = student; // Available in next middleware or route
      next();
    } catch (error: any) {
      logger.error(`Auth Middleware Error: ${error.message}`);
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
        return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
      }

      // Check if admin account is active
      if (!admin.isActive) {
        return res.status(403).json({ success: false, message: "Account is deactivated" });
      }

      req.user = admin; // Available in next middleware or route
      next();
    } catch (error: any) {
      logger.error(`Admin Auth Middleware Error: ${error.message}`);
      res.status(401).json({ success: false, message: "Not authorized, invalid token" });
    }
  } else {
    res.status(401).json({ success: false, message: "No token, authorization denied" });
  }
};

/**
 * RBAC middleware: restrict access to superadmin-only actions.
 * Must be used AFTER protectAdmin.
 */
export const requireSuperAdmin = (req, res, next) => {
  if (req.user?.role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Superadmin privileges required.'
    });
  }
  next();
};
