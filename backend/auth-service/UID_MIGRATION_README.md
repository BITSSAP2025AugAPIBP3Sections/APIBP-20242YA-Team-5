# UID System Migration Guide

## Overview
This migration implements an elegant auto-generated UID system for all users, replacing the manual `employee_id` field with an auto-generated `uid` field. Students are now required to select their university during registration.

## Changes Summary

### Database Changes
1. **Renamed Column**: `employee_id` → `uid`
2. **New Column**: `university_uid` (for students to reference their university)
3. **Unique Constraint**: Added to `uid` column
4. **Index**: Added on `university_uid` for performance

### Backend Changes (auth-service)
1. **New Service**: `UidGenerationService.java` - Generates elegant UIDs
2. **Updated Model**: `User.java` - Changed `employeeId` to `uid`, added `universityUid`
3. **Updated DTOs**: All DTOs updated to reflect new fields
4. **Updated Repository**: Added UID-related query methods
5. **Updated Controller**: Registration validates university selection for students
6. **New Endpoint**: `GET /api/users/universities` - Returns list of universities for dropdown

### Frontend Changes

#### Student Portal
1. **University Dropdown**: Added mandatory university selection during registration
2. **UID Display**: Success message shows auto-generated UID
3. **Updated Types**: Added `universityUid` to interfaces

#### University Portal
1. **UID Display**: Success message shows auto-generated UID after registration

## UID Format
UIDs follow the format: `PREFIX-YEAR-SEQUENCE`

### Prefixes
- **UNI-**: Universities (e.g., `UNI-2024-001`)
- **STU-**: Students (e.g., `STU-2024-001`)
- **EMP-**: Employers (e.g., `EMP-2024-001`)
- **ADM-**: Admins (e.g., `ADM-2024-001`)

### Examples
```
UNI-2024-001  (First university registered in 2024)
UNI-2024-002  (Second university registered in 2024)
STU-2024-001  (First student registered in 2024)
STU-2024-002  (Second student registered in 2024)
```

## Migration Steps

### 1. Database Migration
```bash
# Connect to PostgreSQL
psql -U postgres -d authdb

# Run migration script
\i migration-uid.sql

# Verify changes
\d users
```

### 2. Backend Restart
```bash
cd backend/auth-service
mvn clean install
mvn spring-boot:run
```

### 3. Frontend Rebuild
```bash
# Student Portal
cd frontend/student-portal
npm install
npm start

# University Portal
cd frontend/university-portal
npm install
npm start
```

## Testing

### 1. Test University Registration
1. Go to University Portal: http://localhost:3001/signup
2. Register a new university
3. Verify you receive a UID like `UNI-2024-001`
4. Check success message shows the UID

### 2. Test Student Registration
1. Go to Student Portal: http://localhost:3000/signup
2. Fill in name, email, password
3. **Select a university from dropdown** (MANDATORY)
4. Submit registration
5. Verify you receive a UID like `STU-2024-001`
6. Verify the student is linked to selected university

### 3. Test Universities Endpoint
```bash
curl http://localhost:8081/api/users/universities
```
Expected response:
```json
[
  {
    "uid": "UNI-2024-001",
    "name": "Harvard University",
    "email": "admin@harvard.edu"
  },
  {
    "uid": "UNI-2024-002",
    "name": "MIT",
    "email": "admin@mit.edu"
  }
]
```

### 4. Test UID Uniqueness
1. Try to register multiple users
2. Verify each gets a unique sequential UID
3. Check database: `SELECT uid, email, role FROM users ORDER BY uid;`

## Validation Rules

### Student Registration
- ✅ Full name required
- ✅ Valid email required
- ✅ Password (min 8 characters) required
- ✅ **University selection MANDATORY**
- ✅ UID auto-generated on server
- ✅ UniversityUid stored for linking

### University Registration
- ✅ Full name required
- ✅ Valid email required
- ✅ Password (min 8 characters) required
- ✅ UID auto-generated on server

## API Endpoints

### Get Universities (Public)
```
GET /api/users/universities
```
Response:
```json
[
  {
    "uid": "UNI-2024-001",
    "name": "University Name",
    "email": "contact@university.edu"
  }
]
```

### Register User
```
POST /api/auth/register
```
Request (Student):
```json
{
  "email": "student@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "STUDENT",
  "universityUid": "UNI-2024-001"
}
```

Response:
```json
{
  "success": true,
  "message": "Registration successful. Your UID is: STU-2024-001",
  "data": {
    "id": "123",
    "email": "student@example.com",
    "fullName": "John Doe",
    "role": "student",
    "token": "eyJhbGc..."
  }
}
```

## Rollback Instructions

If you need to rollback this migration:

```sql
-- Rollback script
ALTER TABLE users RENAME COLUMN uid TO employee_id;
ALTER TABLE users DROP CONSTRAINT IF EXISTS unique_uid;
ALTER TABLE users DROP COLUMN IF EXISTS university_uid;
DROP INDEX IF EXISTS idx_university_uid;
```

Then revert all code changes using git:
```bash
git checkout HEAD~1 -- backend/auth-service/
git checkout HEAD~1 -- frontend/student-portal/
git checkout HEAD~1 -- frontend/university-portal/
```

## Troubleshooting

### Issue: "Students must select a university" error
**Solution**: Make sure at least one university is registered before students can register.

### Issue: UID not showing in success message
**Solution**: Check backend logs. Ensure `UidGenerationService` is properly autowired.

### Issue: Universities dropdown is empty
**Solution**: 
1. Check if universities exist: `SELECT * FROM users WHERE role = 'UNIVERSITY';`
2. Verify endpoint is accessible: `curl http://localhost:8081/api/users/universities`
3. Check CORS settings in backend

### Issue: Duplicate UID error
**Solution**: This should not happen due to synchronized generation. If it does:
1. Check database for duplicate UIDs
2. Restart backend service
3. Clear any cached sequences

## Database Schema

### Before Migration
```sql
CREATE TABLE users (
  ...
  employee_id VARCHAR(50),  -- Manual entry
  ...
);
```

### After Migration
```sql
CREATE TABLE users (
  ...
  uid VARCHAR(50) UNIQUE,        -- Auto-generated, unique
  university_uid VARCHAR(50),     -- For students, references university
  ...
);

CREATE INDEX idx_university_uid ON users(university_uid);
```

## Notes
- UIDs are generated sequentially per role and year
- UIDs are guaranteed unique through database constraint
- Students CANNOT register without selecting a university
- Universities are auto-assigned UIDs when they register
- Old data with `employee_id` values will be renamed to `uid` but keep their values
- New registrations will get auto-generated UIDs

## Support
For issues or questions, contact the development team or check the git commit history for this migration.
