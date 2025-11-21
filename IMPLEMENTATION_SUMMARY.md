# UID System Implementation - Quick Start

## ✅ What Was Done

### 1. Backend (auth-service) ✅
- ✅ Created `UidGenerationService.java` for elegant UID generation
- ✅ Renamed `employeeId` → `uid` in `User.java` model
- ✅ Added `universityUid` field for student-university linking
- ✅ Updated all DTOs (RegisterRequest, UserDto, UpdateUserRequest, UserResponseDTO, AuthResponse)
- ✅ Updated `UserRepository` with UID query methods
- ✅ Modified `AuthController` to auto-generate UIDs and validate university selection
- ✅ Updated `AdminUserService` to handle new fields
- ✅ Created `GET /api/users/universities` endpoint for dropdown

### 2. Frontend - Student Portal ✅
- ✅ Added university dropdown in Signup page
- ✅ Made university selection MANDATORY
- ✅ Fetches universities from API on page load
- ✅ Shows auto-generated UID in success message
- ✅ Updated TypeScript types

### 3. Frontend - University Portal ✅
- ✅ Shows auto-generated UID in success message
- ✅ Updated TypeScript types
- ✅ Updated auth service to handle UID response

### 4. Database Migration ✅
- ✅ Created SQL migration script: `migration-uid.sql`
- ✅ Renames `employee_id` to `uid`
- ✅ Adds unique constraint on `uid`
- ✅ Adds `university_uid` column
- ✅ Creates index on `university_uid`

## 🚀 Next Steps - What YOU Need to Do

### Step 1: Run Database Migration ⚠️
```bash
# 1. Connect to your PostgreSQL database
psql -U postgres -d authdb

# 2. Run the migration script
\i /Users/I529006/Documents/BITS_Assignments/APIBP-20242YA-Team-5/backend/auth-service/migration-uid.sql

# 3. Verify the changes
\d users
```

**Expected Output:**
- Column `employee_id` should be renamed to `uid`
- Column `university_uid` should exist
- Unique constraint on `uid` should be present

### Step 2: Restart Backend Service ⚠️
```bash
cd /Users/I529006/Documents/BITS_Assignments/APIBP-20242YA-Team-5/backend/auth-service

# Stop the running service (Ctrl+C if running)

# Rebuild and start
mvn clean install
mvn spring-boot:run
```

**Verify:** Service starts without errors on http://localhost:8081

### Step 3: Restart Frontend Services ⚠️

#### Student Portal:
```bash
cd /Users/I529006/Documents/BITS_Assignments/APIBP-20242YA-Team-5/frontend/student-portal

# Stop the running service (Ctrl+C if running)

# Reinstall and start
npm install
npm start
```

**Verify:** Portal opens on http://localhost:3000

#### University Portal:
```bash
cd /Users/I529006/Documents/BITS_Assignments/APIBP-20242YA-Team-5/frontend/university-portal

# Stop the running service (Ctrl+C if running)

# Reinstall and start
npm install
npm start
```

**Verify:** Portal opens on http://localhost:3001

### Step 4: Test the Implementation ⚠️

#### Test 1: Register a University
1. Go to http://localhost:3001/signup
2. Fill in:
   - Full Name: "Harvard University"
   - Email: "admin@harvard.edu"
   - Password: "password123"
   - Confirm Password: "password123"
3. Click "Sign Up"
4. **Expected:** Success message shows "Your UID is: UNI-2024-001"

#### Test 2: Verify Universities Endpoint
```bash
curl http://localhost:8081/api/users/universities
```
**Expected Response:**
```json
[
  {
    "uid": "UNI-2024-001",
    "name": "Harvard University",
    "email": "admin@harvard.edu"
  }
]
```

#### Test 3: Register a Student
1. Go to http://localhost:3000/signup
2. Fill in:
   - Full Name: "John Doe"
   - Email: "john.doe@student.com"
   - **Select University:** "Harvard University (UNI-2024-001)" ← **MANDATORY**
   - Password: "password123"
   - Confirm Password: "password123"
3. Click "Sign Up"
4. **Expected:** Success message shows "Your UID is: STU-2024-001"

#### Test 4: Verify Database
```bash
psql -U postgres -d authdb
```
```sql
SELECT uid, full_name, email, role, university_uid FROM users ORDER BY uid;
```

**Expected Output:**
```
      uid      |    full_name        |        email         |   role     | university_uid
---------------+---------------------+----------------------+------------+----------------
 UNI-2024-001  | Harvard University  | admin@harvard.edu    | UNIVERSITY | NULL
 STU-2024-001  | John Doe           | john.doe@student.com | STUDENT    | UNI-2024-001
```

## 📋 UID Format

### Prefixes by Role:
- `UNI-YYYY-XXX` = Universities
- `STU-YYYY-XXX` = Students
- `EMP-YYYY-XXX` = Employers
- `ADM-YYYY-XXX` = Admins

### Examples:
```
UNI-2024-001  ← First university in 2024
UNI-2024-002  ← Second university in 2024
STU-2024-001  ← First student in 2024
STU-2024-002  ← Second student in 2024
```

## 🔧 Key Features

### 1. Auto-Generation
- UIDs are **automatically generated** on the backend
- No manual input required
- Sequential numbering per role and year

### 2. Uniqueness
- Database constraint ensures no duplicate UIDs
- Service-level synchronization prevents conflicts
- Fallback mechanism with timestamp if needed

### 3. Student-University Link
- Students **MUST** select a university during registration
- Backend validates this requirement
- `universityUid` field stores the relationship

### 4. API Endpoint
- Public endpoint `/api/users/universities`
- Returns all universities with UIDs
- Used by student registration dropdown

## ⚠️ Important Notes

1. **Database Migration FIRST**: Run migration before restarting backend
2. **Register University First**: At least one university must exist before students can register
3. **Mandatory Selection**: Students cannot register without selecting a university
4. **No Manual UID**: UIDs are auto-generated, users cannot choose them
5. **Unique Constraint**: Database prevents duplicate UIDs

## 🐛 Common Issues

### "Students must select a university"
- **Cause:** No university selected in dropdown
- **Fix:** Make sure dropdown has universities and one is selected

### Empty Universities Dropdown
- **Cause:** No universities registered yet
- **Fix:** Register at least one university first

### "Cannot connect to auth service"
- **Cause:** Backend not running or wrong port
- **Fix:** Check backend is running on http://localhost:8081

### Compilation Errors in Backend
- **Cause:** Maven dependencies not resolved
- **Fix:** Run `mvn clean install` again

## 📁 Modified Files

### Backend (9 files):
1. `UidGenerationService.java` ← NEW
2. `User.java`
3. `UserRepository.java`
4. `RegisterRequest.java`
5. `UserDto.java`
6. `UpdateUserRequest.java`
7. `UserResponseDTO.java`
8. `AuthResponse.java`
9. `AuthController.java`
10. `AdminUserService.java`
11. `UserController.java`

### Frontend Student Portal (2 files):
1. `Signup.tsx`
2. `types/index.ts`
3. `authService.ts`

### Frontend University Portal (2 files):
1. `Signup.tsx`
2. `authService.ts`

### Database:
1. `migration-uid.sql` ← RUN THIS!

## 📚 Documentation

Full details in: `UID_MIGRATION_README.md`

---

**Status: ✅ Implementation Complete**  
**Next: ⚠️ Run Database Migration + Restart Services + Test**
