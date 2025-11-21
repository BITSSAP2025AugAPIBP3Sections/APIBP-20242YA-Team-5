# University Portal

The University Portal is a React TypeScript application designed for universities to manage student certificates, including issuance, management, and student record keeping.

## Features

### 📊 Dashboard Overview
- Certificate issuance statistics and analytics
- Recent certificate issuance activity
- Student enrollment overview
- Quick action buttons for common tasks

### 📝 Certificate Management
- Issue new certificates for students
- View and manage all issued certificates
- Edit certificate details when needed
- Revoke certificates with proper audit trail
- Bulk certificate operations
- PDF generation and download

### 👥 Student Management
- Manage student records and enrollment
- Search and filter students by various criteria
- Add new students to the university system
- Track student academic history

### 🔐 Authentication & Security
- Secure login for university administrators
- Role-based access control
- Session management and logout

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Management**: React Hook Form with Zod validation
- **Date Handling**: date-fns

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Sidebar.tsx         # Mobile navigation sidebar
│   │   └── Layout.tsx          # Main layout wrapper
│   ├── common/
│   │   └── AcademicWatermark.tsx # Background watermark
│   └── index.ts                # Component exports
├── pages/
│   ├── Dashboard.tsx           # University dashboard
│   ├── IssueCertificate.tsx    # Certificate issuance form
│   ├── CertificateManagement.tsx # Certificate management
│   └── StudentManagement.tsx   # Student records
├── services/
│   ├── api.ts                  # API configuration
│   ├── certificateService.ts   # Certificate operations
│   ├── studentService.ts       # Student operations
│   └── universityService.ts    # University data
├── types/
│   └── index.ts                # TypeScript definitions
├── hooks/
│   └── index.ts                # Custom React hooks
├── App.tsx                     # Main application
└── index.tsx                   # Application entry point
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Access to the backend API services

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   REACT_APP_API_BASE_URL=http://localhost:3000
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   Open http://localhost:3001 in your browser

## API Integration

The University Portal integrates with the following backend endpoints:

### Certificate Endpoints
- `POST /api/certificates` - Issue new certificate
- `GET /api/certificates` - Get university's certificates
- `PUT /api/certificates/{id}` - Update certificate
- `POST /api/certificates/revoke` - Revoke certificate
- `GET /api/certificates/{id}/pdf` - Download certificate PDF

### Student Endpoints
- `GET /api/students` - Get university's students
- `POST /api/students` - Add new student
- `PUT /api/students/{id}` - Update student information
- `DELETE /api/students/{id}` - Remove student

### University Endpoints
- `GET /api/university/dashboard` - Dashboard statistics
- `GET /api/university/profile` - University profile
- `PUT /api/university/profile` - Update university profile

## Key Features in Detail

### Certificate Issuance
- **Student Selection**: Choose from enrolled students or add new ones
- **Course Information**: Select course, specialization, and academic details
- **Grade Assignment**: Input grades and CGPA information
- **Validation**: Comprehensive form validation before issuance
- **Digital Signatures**: Automatic digital signing of certificates
- **PDF Generation**: Instant PDF certificate generation

### Certificate Management
- **Comprehensive List**: View all issued certificates with filtering
- **Search Functionality**: Find certificates by student name, course, or ID
- **Status Management**: Track active, revoked, and pending certificates
- **Bulk Operations**: Perform actions on multiple certificates
- **Audit Trail**: Complete history of certificate changes

### Student Records
- **Student Database**: Maintain comprehensive student information
- **Academic History**: Track courses, grades, and certifications
- **Enrollment Management**: Manage student enrollment status
- **Contact Information**: Maintain updated contact details

## Building for Production

```bash
npm run build
```

This creates a `build` directory with optimized production files.

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new components
3. Add proper error handling and loading states
4. Include responsive design considerations
5. Test all forms and user interactions thoroughly

## Future Enhancements

- **Batch Certificate Issuance**: Upload CSV files for bulk operations
- **Advanced Analytics**: Detailed reports and visualizations
- **Email Notifications**: Automatic student notifications
- **Template Management**: Customizable certificate templates
- **Blockchain Integration**: Enhanced security and verification
- **Mobile App**: Dedicated mobile application