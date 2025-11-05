# Frontend Applications

This folder contains all the web applications that make up the frontend of the Student Certificate Verification System.

## **Applications Overview**

| Application | Port | Users | Technology | Purpose |
|-------------|------|-------|------------|---------|
| **Admin Dashboard** | 4001 | System Admins | React + Material-UI | System management |
| **Student Portal** | 4002 | Students | React + Material-UI | Certificate access |
| **Employer Portal** | 4003 | Employers | React + Tailwind | Certificate verification |

## **Quick Start**

### **Development Setup**
```bash
# Install dependencies for all frontend apps
npm run setup:frontend

# Start all applications
cd frontend/student-portal && npm start &
cd frontend/employer-portal && npm start &
cd frontend/admin-dashboard && npm start &

# Or start individual applications
cd frontend/student-portal && npm start    # Port 3000 (default)
cd frontend/employer-portal && npm start   # Port 3001 
cd frontend/admin-dashboard && npm start   # Port 3002
```

### **Docker Setup**
```bash
# Start all frontend applications with Docker
docker-compose up student-portal employer-portal admin-dashboard
```

## **Application Architecture**

### **Technology Stack**
- **Framework**: React 18 with TypeScript
- **Styling**: Material-UI (Admin/Student), Tailwind CSS (Employer)
- **State Management**: React Context + useReducer
- **HTTP Client**: Axios for API calls
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Jest + React Testing Library

### **Shared Components**
Common components and utilities are shared across applications:
```
frontend/shared/
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
├── services/          # API service functions
├── utils/             # Helper functions
└── types/             # TypeScript interfaces
```

## **Applications Details**

### **1. Admin Dashboard** (`admin-dashboard/`)
**Purpose**: System administration and university management

**Features**:
- University verification and approval
- System analytics and monitoring  
- User management and role assignment
- Certificate issuance statistics
- System configuration and settings

**Key Components**:
- University verification queue
- Analytics dashboard with charts
- User management interface
- System health monitoring
- Configuration management

### **2. Student Portal** (`student-portal/`)
**Purpose**: Student certificate access and management

**Features**:
- View issued certificates
- Download certificate PDFs
- Certificate sharing and printing
- Profile management

**Key Components**:
- Certificate gallery/list view
- PDF viewer and download
- Print-friendly certificate layout
- Student profile management

### **3. Employer Portal** (`employer-portal/`)
**Purpose**: Certificate verification for employers

**Features**:
- Certificate verification interface
- Bulk verification capabilities
- Verification history and reports
- API integration documentation

**Key Components**:
- Verification form (ID, code)
- Bulk upload verification
- Verification results display
- API documentation and examples

## **Development Guidelines**

### **Application Structure**
Each application follows this structure:
```
app-name/
├── public/            # Static assets
├── src/
│   ├── components/    # React components
│   │   ├── common/    # Shared components
│   │   ├── layout/    # Layout components
│   │   └── pages/     # Page-specific components
│   ├── pages/         # Route/page components
│   ├── services/      # API service calls
│   ├── hooks/         # Custom React hooks
│   ├── context/       # React context providers
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript interfaces
│   └── styles/        # CSS/styling files
├── package.json       # Dependencies and scripts
└── README.md         # App-specific documentation
```

### **Component Guidelines**
- **Functional Components**: Use hooks instead of class components
- **TypeScript**: Properly type all props and state
- **Accessibility**: Follow WCAG guidelines
- **Responsive**: Mobile-first responsive design
- **Reusability**: Create reusable components

### **State Management**
- **Local State**: useState for component-specific state
- **Global State**: React Context for shared state
- **Server State**: React Query for API data
- **Form State**: React Hook Form for form handling

### **API Integration**
- **Base URL**: Configured via environment variables
- **Authentication**: JWT tokens in Authorization header
- **Error Handling**: Global error boundary and toast notifications
- **Loading States**: Loading indicators for async operations

## **Environment Variables**

Each application uses environment variables:
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_VERSION=v1

# Authentication
REACT_APP_JWT_STORAGE_KEY=certificate_app_token

# Features
REACT_APP_ENABLE_BULK_UPLOAD=true

# Environment
REACT_APP_ENVIRONMENT=development
```

## **Styling & UI**

### **Material-UI (Admin & Student)**
```jsx
// Theme configuration
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});
```

### **Tailwind CSS (Employer)**
```css
/* Custom color palette */
:root {
  --primary: #3b82f6;
  --secondary: #10b981;
  --accent: #f59e0b;
}
```

### **Responsive Design**
- **Mobile First**: Design for mobile, enhance for desktop
- **Breakpoints**: Follow Material-UI or Tailwind breakpoints
- **Touch Friendly**: Adequate touch targets (44px minimum)

## **Certificate Verification Methods**

### **Simple Verification**
Using certificate ID or verification code:
```jsx
// Verification component for simple certificate validation
const CertificateVerification = ({ onVerificationResult }) => {
  const [certificateId, setCertificateId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  const handleVerify = async () => {
    const result = await verifyCertificate(certificateId, verificationCode);
    onVerificationResult(result);
  };
  
  return (
    <form onSubmit={handleVerify}>
      <input 
        placeholder="Certificate ID" 
        value={certificateId}
        onChange={(e) => setCertificateId(e.target.value)}
      />
      <input 
        placeholder="Verification Code" 
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <button type="submit">Verify Certificate</button>
    </form>
  );
};
```

## **Testing**

### **Unit Tests**
```bash
# Test all frontend applications
cd frontend/student-portal && npm test
cd frontend/employer-portal && npm test
cd frontend/admin-dashboard && npm test
```

### **Component Testing**
```jsx
// Example component test
import { render, screen } from '@testing-library/react';
import CertificateCard from './CertificateCard';

test('renders certificate information', () => {
  render(<CertificateCard certificate={mockCertificate} />);
  expect(screen.getByText('Computer Science')).toBeInTheDocument();
});
```

### **E2E Testing**
Using Cypress for end-to-end testing:
```bash
# Run E2E tests
npx cypress run

# Open Cypress UI
npx cypress open
```

## **Build & Deployment**

### **Development Build**
```bash
# Start development server
npm start

# With specific port
PORT=4001 npm start
```

### **Production Build**
```bash
# Build for production
npm run build

# Serve production build locally
npx serve -s build -l 4001
```

### **Docker Build**
```dockerfile
# Multi-stage build for production
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
```

## **Performance Optimization**

### **Code Splitting**
```jsx
// Lazy load pages for better performance
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const CertificateList = lazy(() => import('./pages/CertificateList'));
```

### **Bundle Analysis**
```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### **Image Optimization**
- Use WebP format for images
- Implement lazy loading for images
- Compress images before deployment

## **Accessibility**

### **WCAG Compliance**
- Semantic HTML elements
- Proper ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

### **Testing Accessibility**
```bash
# Use axe-core for accessibility testing
npm install --save-dev @axe-core/react
```

## **Contributing**

1. **Choose an application** to work on
2. **Read the app-specific README** for guidelines
3. **Create feature branch**: `feature/app-name-feature`
4. **Follow component guidelines** and naming conventions
5. **Write tests** for new components
6. **Test accessibility** with screen readers
7. **Submit pull request** for review

## **Troubleshooting**

### **Common Issues**
- **API connection**: Check if backend services are running
- **CORS errors**: Verify CORS configuration in API Gateway
- **Build errors**: Clear node_modules and reinstall
- **Port conflicts**: Use different ports for each app

### **Debugging**
```bash
# Check network requests
# Open browser dev tools > Network tab

# React Developer Tools
# Install React DevTools browser extension

# Check console errors
# Open browser dev tools > Console tab
```