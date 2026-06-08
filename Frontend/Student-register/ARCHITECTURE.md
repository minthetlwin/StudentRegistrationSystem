# Frontend Architecture Diagram

## New Portal-Based Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MAIN APP.JSX                               │
│              (Central Router - Orchestrates Portals)                │
└─────────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │ AUTH ROUTES  │  │   STUDENT    │  │    ADMIN     │
        │   /auth/*    │  │   /student/* │  │  /admin/*    │
        └──────────────┘  └──────────────┘  └──────────────┘
              │                  │                  │
              ▼                  ▼                  ▼
       ┌────────────────┐  ┌─────────────┐  ┌─────────────┐
       │  Auth Pages    │  │  StudentApp │  │  AdminApp   │
       ├────────────────┤  ├─────────────┤  ├─────────────┤
       │• Login         │  │• Home       │  │• Dashboard  │
       │• Register      │  │• Register   │  │  (Protected)│
       │• Admin Login   │  │• Dashboard  │  └─────────────┘
       │  (Protected)   │  │  (Protected)│
       └────────────────┘  └─────────────┘
```

## Data Flow

```
USER ENTRY
    │
    ├─► / ────────────────────► /student (redirect)
    │
    ├─► /student
    │      │
    │      ├─► StudentLayout (with Navbar)
    │      │      │
    │      │      ├─► HomePage
    │      │      └─► RegistrationPage
    │      │
    │      └─► /student/dashboard (ProtectedRoute)
    │             │
    │             └─► StudentDashboardPage
    │
    └─► /auth
           │
           ├─► /auth/login ────► StudentLoginPage
           │                     │
           │                     └─► Sets localStorage
           │                        └─► Redirects to /student/dashboard
           │
           ├─► /auth/register ─► StudentRegistrationPage
           │
           └─► /auth/admin-login ─► AdminLoginPage
                                    │
                                    └─► Sets localStorage
                                       └─► Redirects to /admin/dashboard
    
    └─► /admin
           │
           └─► /admin/dashboard (ProtectedRoute)
                  │
                  └─► AdminLayout
                     │
                     └─► AdminDashboardPage
```

## Service Layer Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                        API UTILS                               │
│                    (src/utils/api.js)                          │
└───────────────────────────────────────────────────────────────┘
                              ▲
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │ Auth Service │  │ Student API  │  │  Admin API   │
        ├──────────────┤  ├──────────────┤  ├──────────────┤
        │loginStudent()│  │getDashboard()│  │createAdmin() │
        │loginAdmin()  │  │registerDorm()│  │getDorms()    │
        │verifyStudent()  │submitPayment()  │updateStatus()│
        └──────────────┘  └──────────────┘  └──────────────┘
                │                  │                  │
                ▼                  ▼                  ▼
        Auth Pages/Containers  Student Pages  Admin Pages
```

## Component Organization

```
src/components/
├── (SHARED - used by multiple portals)
│   ├── Navbar.jsx
│   ├── Dashboard.jsx (role-based rendering)
│   ├── authComponents/
│   │   ├── LoginForm.jsx
│   │   ├── SetPasswordForm.jsx
│   │   ├── StudentVerifyForm.jsx
│   │   └── PasswordStrengthIndicator.jsx
│   ├── Notifications.jsx
│   ├── Sidebar.jsx
│   └── ...

src/admin/components/
├── (ADMIN-ONLY)
│   ├── Modals/
│   │   ├── AddAdmittedStudentModal.jsx ← TO MOVE
│   │   ├── EditStudentModal.jsx ← TO MOVE
│   │   └── ...
│   ├── Tables/
│   │   ├── StudentList.jsx ← TO MOVE
│   │   ├── StudentRegistrationList.jsx ← TO MOVE
│   │   └── ...
│   └── Layout/
│       └── (custom admin components)

src/student/components/
├── (STUDENT-ONLY)
│   ├── Sections/
│   │   ├── dormRegisterList.jsx ← TO MOVE
│   │   ├── PaymentList.jsx ← TO MOVE
│   │   └── ...
│   ├── Forms/
│   │   ├── dormRegistrationForm.jsx ← TO MOVE
│   │   ├── PaymentForm.jsx ← TO MOVE
│   │   └── ...
│   └── Layout/
│       └── (custom student components)
```

## Authentication Flow

```
┌─────────────────────────┐
│  User Visits App        │
│  http://localhost:5173  │
└────────────┬────────────┘
             │
             ▼
    ┌────────────────────┐
    │ App.jsx Router     │
    │ (Central Router)   │
    └────────┬───────────┘
             │
    ┌────────┴──────────────────────────┐
    │                                   │
    ▼                                   ▼
 STUDENT FLOW                      ADMIN FLOW
    │                                   │
    ▼                                   ▼
/student ──► StudentLayout         /auth/admin-login
    │         (with Navbar)        │
    ├─► HomePage                   ▼
    │                          AdminLoginPage
    ├─► RegisterPage               │
    │                              ▼
    ├─► /auth/login            Calls: loginAdmin()
    │   │                           │
    │   ▼                           ▼
    │ StudentLoginPage          Sets localStorage
    │   │                        (user, token, role)
    │   ▼                           │
    │ Calls: loginStudent()         ▼
    │   │                       /admin/dashboard
    │   ▼                        │
    │ Sets localStorage          ▼
    │ (user, token, role)    ProtectedRoute
    │   │                   (checks role='admin')
    │   ▼                        │
    └─► /student/dashboard       ▼
        │                    AdminDashboard
        ▼                    (with AdminLayout)
    ProtectedRoute
    (checks role='student')
        │
        ▼
    StudentDashboard
    (with StudentLayout)
```

## URL Routing Map

```
/
├── Redirects to /student

/auth
├── /login ────────────► StudentLoginPage
├── /register ─────────► StudentRegistrationPage
└── /admin-login ──────► AdminLoginPage

/student (StudentApp)
├── / ──────────────────► HomePage (public)
├── /register ──────────► RegistrationPage (public)
└── /dashboard ────────► StudentDashboardPage (🔒 protected)

/admin (AdminApp)
└── /dashboard ────────► AdminDashboardPage (🔒 protected)

LEGACY REDIRECTS (Backward Compatible)
├── /login ────────────► /auth/login
├── /register ─────────► /auth/register
├── /admin-login ──────► /auth/admin-login
└── /dashboard ────────► /student/dashboard
```

## Key Features of New Architecture

### ✅ Separation of Concerns
- **Student Portal**: Only student routes, components, and services
- **Admin Portal**: Only admin routes, components, and services
- **Auth**: Shared auth logic but separate pages for each role

### ✅ Protected Routes
- Dashboard routes require valid token
- Role-based access control (student vs admin)
- Automatic redirect to login if not authenticated

### ✅ Scalability
- Easy to add new student features → `src/student/pages/` and `src/student/components/`
- Easy to add new admin features → `src/admin/pages/` and `src/admin/components/`
- Shared utilities in `src/shared/`

### ✅ Maintainability
- Clear folder structure
- Easy to locate components
- Reduced component coupling
- Easier to test individual portals

### ✅ Performance
- Each portal can be lazy-loaded separately
- Smaller bundle for each portal
- Better tree-shaking potential

### ✅ Backward Compatibility
- Old URLs still work (redirects to new structure)
- Existing components can be used during migration
- No breaking changes during transition
