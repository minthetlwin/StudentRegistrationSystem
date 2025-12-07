Current structure 

backend/
│
├── config/
│   ├── db.js                 # MongoDB connection
│   └── cloudinary.js         # (optional) for image uploads
│
├── models/
│   ├── AdmittedStudent.js
│   ├── User.js
│   ├── StudentProfile.js
│   ├── Payment.js
│   ├── Enrollment.js
│   └── AcademicProgress.js
│
├── controllers/
│   ├── authController.js
│   ├── paymentController.js
│   ├── adminController.js
│   └── studentController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── paymentRoutes.js
│   ├── adminRoutes.js
│   └── studentRoutes.js
│
├── middlewares/
│   ├── authMiddleware.js     # JWT verification
│   ├── adminMiddleware.js   # Admin-only routes
│   ├── uploadMiddleware.js  # Multer file handling
│   └── rateLimiter.js
│
├── utils/
│   ├── generateUsername.js
│   ├── generatePassword.js
│   ├── sendEmail.js
│   └── encryptNRC.js
│
├── app.js
├── server.js
└── .env


FIRST TIME PASSWORD SETUP PAGE
--------------------------------
EVERYONE uses SINGLE LOGIN PAGE
Inputs: Enrollment + NRC + DOB + (G12 ID) + Password

current data flow for fresher and senior

Freshers:
Enter Enrollment Number + NRC + DOB + G12 Exam ID → verify in AdmittedStudents.
After verification, create entry in Students and hash the password.

Seniors (existing students):
Already in Students.
Enter Enrollment + NRC + DOB → verify.
If password not set → allow them to create password.
G12 Exam ID can be optional, but stored in Students for future verification.

Password Hashing:
All passwords stored hashed.
Single endpoint (/set-password) handles both freshers and seniors.


FORM → verifyStudent() → BACKEND → VERIFIED ✅
                    ↓
                show password form
                    ↓
           setPassword() → BACKEND → ACCOUNT CREATED ✅
