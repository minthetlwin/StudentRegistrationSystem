import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["superadmin", "admin"],
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null // null ONLY for super admin
    },

    lastLoginAt: {
      type: Date
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

export default mongoose.model("AdminUser", adminUserSchema);
