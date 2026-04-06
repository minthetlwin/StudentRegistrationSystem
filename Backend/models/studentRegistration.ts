import mongoose from "mongoose";

const studentRegistrationSchema = new mongoose.Schema(
  {
    // ── Link to authenticated student ─────────────────────────────────────────
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
      required: true,
      unique: true, // one registration per student
    },

    // ── Step 1: Academic Info ─────────────────────────────────────────────────
    academic_year: { type: String, required: true },   // e.g. "2024-2025"
    year_of_study: { 
      type: String, 
      enum: ["ပထမနှစ်", "ဒုတိယနှစ်", "တတိယနှစ်", "စတုတ္ထနှစ်", "ပဉ္စမနှစ်", "Final Year"], 
      required: true 
    },
    major: { type: String, enum: ["CS", "CT","none"], required: true },
    roll_no: { type: String, required: true },          // e.g. "1-CS-1"
    reg_no: { type: String },                           // university reg no
    yr_no: { type: String },                            // university entrance year

    // Previous Exam Results (for senior students)
    previous_exams: [
      {
        exam_name: { type: String },
        major: { type: String },
        roll_no: { type: String },
        year: { type: String },
        result: { type: String },
      }
    ],

    // ── Step 2: Personal Info ─────────────────────────────────────────────────
    name_mm: { type: String, required: true },          // Myanmar name
    name_en: { type: String, required: true },          // English name
    race: { type: String },                             // လူမျိုး
    religion: { type: String },                         // ကိုးကွယ်သည့်ဘာသာ
    dob: { type: Date, required: true },                // မွေးသက္ကရာဇ်
    birth_place: { type: String },                      // မွေးဖွားရာဇာတိ
    state_division: { type: String },                   // မြို့နယ်/ပြည်နယ်/တိုင်း
    nrc: { type: String, required: true },              // မှတ်ပုံတင်အမှတ်
    nationality: { type: String },                      // နိုင်ငံသား/နိုင်ငံခြားသား

    // Father Info
    father_name: { type: String },
    father_name_en: { type: String },
    father_race: { type: String },
    father_religion: { type: String },
    father_birth_place: { type: String },
    father_state_division: { type: String },
    father_nrc: { type: String },
    father_nationality: { type: String },

    // Mother Info
    mother_name: { type: String },
    mother_name_en: { type: String },
    mother_race: { type: String },
    mother_religion: { type: String },
    mother_birth_place: { type: String },
    mother_state_division: { type: String },
    mother_nrc: { type: String },
    mother_nationality: { type: String },

    // Matriculation Exam Info (တက္ကသိုလ်ဝင်တန်းစာမေးပွဲ)
    matric_roll_no: { type: String },                   // ခုံအမှတ်
    matric_year: { type: String },                      // ခုနှစ်
    matric_dept: { type: String },                      // စာစစ်ဌာန

    // ── Step 3: Address & Contact ─────────────────────────────────────────────
    address: { type: String },
    phone: { type: String },
    place_of_birth: { type: String },

    // ── Step 4: Photos (stored as URL paths served via /uploads) ─────────────
    profile_photo_url: { type: String },   // e.g. "/uploads/profile-<id>.jpg"
    live_photo_url: { type: String },      // e.g. "/uploads/live-<id>.jpg"

    // ── Step 5: Guarantor / Pledge ────────────────────────────────────────────
    guarantor_name: { type: String },
    guarantor_occupation: { type: String },
    guarantor_address: { type: String },
    guarantor_phone: { type: String },
    guarantor_nrc: { type: String },
    sponsor_name: { type: String },
    pledge_agreed: { type: Boolean, default: false, required: true },

    // ── Admin Review ──────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    adminRemark: { type: String },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
    },
    reviewedAt: { type: Date },

    // Optimistic concurrency lock
    version: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("StudentRegistration", studentRegistrationSchema);
