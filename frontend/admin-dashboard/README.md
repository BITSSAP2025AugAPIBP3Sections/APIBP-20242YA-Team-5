# Admin Dashboard

This is the admin dashboard for the Student Certificate Verification System. It provides comprehensive system administration capabilities for managing users, universities, certificates, and monitoring system health.

## Features

### 🔐 Authentication & Security
- Admin-only access with role-based authentication
- JWT token-based session management
- Secure logout and session timeout handling

### 📊 Dashboard Overview
- System-wide statistics and metrics
- Real-time verification activity monitoring
- Certificate issuance trends and analytics
- User distribution charts by role

### 👥 User Management
- View and manage all system users
- Filter users by role (Admin, University, Student, Employer)
- Edit user details and verification status
- Export user data for reporting
- Bulk user operations

### 🏫 University Management
- Register new universities for certificate issuance
- Verify/unverify university accounts
- Monitor university activities and certificates issued
- Update university details and credentials

### 📋 Certificate Management
- View all certificates across universities
- Monitor certificate verification activities
- Revoke certificates when necessary
- Advanced filtering and search capabilities

### 🔍 System Monitoring
- Real-time system health monitoring
- Service status for all microservices:
  - Authentication Service
  - University Service
  - Certificate Service
  - Verification Service
  - File Service
  - Notification Service
- System metrics and performance data
- Uptime tracking

### 📈 Analytics & Reporting
- Certificate issuance trends by month
- Verification activity patterns
- User registration analytics
- System usage statistics
- Export capabilities for reports

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Management**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Charts**: Simple custom charts (can be enhanced with recharts)

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

### Demo Credentials
Use these credentials to access the admin dashboard:
- **Email**: admin@abc.com
- **Password**: adminPASS123

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Sidebar)
│   ├── common/         # Common components (StatsCard, Charts, etc.)
│   ├── Layout.tsx      # Main layout wrapper
│   └── ProtectedRoute.tsx  # Route protection component
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Login.tsx       # Login page
│   ├── UserManagement.tsx  # User management
│   └── index.ts        # Page exports
├── services/           # API services
│   ├── api.ts          # Axios instance configuration
│   ├── authService.ts  # Authentication services
│   ├── adminService.ts # Admin-specific API calls
│   └── index.ts        # Service exports
├── types/              # TypeScript type definitions
│   └── index.ts        # All type definitions
├── App.tsx             # Main app component with routing
└── index.tsx           # Entry point
```

## Key Features in Detail

### Dashboard Overview
- **Real-time Statistics**: Total users, universities, certificates, daily verifications
- **System Health**: Monitor all microservices health status
- **Recent Activity**: Latest certificate verifications with details
- **Trends**: Monthly charts showing certificate and verification patterns

### User Management
- **Comprehensive User List**: Paginated table with all user information
- **Advanced Filtering**: Search by name/email, filter by role
- **User Operations**: Edit user details, change roles, verify/unverify accounts
- **Data Export**: Export user data in CSV format for reporting

### Security Features
- **Role-Based Access**: Only admin users can access the dashboard
- **Session Management**: Automatic token refresh and logout on expiration
- **Secure API Calls**: All requests include authentication headers
- **Route Protection**: Protected routes redirect unauthorized users

## API Integration

The dashboard integrates with these backend endpoints:
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - User management
- `GET /api/universities` - University management
- `GET /api/certificates` - Certificate management
- `GET /api/health` - System health monitoring
- `POST /api/auth/login` - Authentication

## Future Enhancements

- **Advanced Charts**: Integration with recharts for more sophisticated visualizations
- **Real-time Updates**: WebSocket integration for live data updates
- **Advanced Filtering**: More granular filtering options across all modules
- **Audit Logs**: Comprehensive logging of admin actions
- **Bulk Operations**: Mass operations for user and certificate management
- **Email Notifications**: Direct email capabilities from admin dashboard
- **API Documentation**: In-dashboard API documentation viewer

## Building for Production

```bash
npm run build
```

This creates a `build` directory with optimized production files ready for deployment.

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new components
3. Add proper error handling and loading states
4. Include responsive design considerations
5. Test all authentication flows thoroughly