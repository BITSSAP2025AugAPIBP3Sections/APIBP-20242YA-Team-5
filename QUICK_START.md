# 🚀 Quick Start Guide

## **Getting Started with the Certificate Verification System**

### **Prerequisites**
- **Node.js** 18+ and npm 8+
- **Docker** and **Docker Compose**
- **PostgreSQL** 15+ (if running locally)
- **Redis** (optional, for caching)

### **1. Clone and Setup**
```bash
# Clone the repository
git clone <your-repo-url>
cd APIBP-20242YA-Team-5

# Install root dependencies
npm install

# Setup all backend services and frontend
npm run setup

# Copy environment file
cp environment.example .env
# Edit .env with your configuration
```

### **2. Database Setup**
```bash
# Start databases with Docker
docker-compose up -d postgres-auth postgres-university postgres-certificate redis

# Run migrations
npm run migrate

# Seed initial data (optional)
npm run seed
```

### **3. Development Options**

#### **Option A: Docker Compose (Recommended)**
```bash
# Start all services
docker-compose up

# Or start specific services
docker-compose up api-gateway auth-service certificate-service
```

#### **Option B: Local Development**
```bash
# Start all backend services locally
npm run dev

# Or start individual backend services
npm run dev:gateway
npm run dev:auth
npm run dev:certificate
# ... etc

# Start frontend applications separately
cd frontend/student-portal && npm start
cd frontend/employer-portal && npm start
cd frontend/admin-dashboard && npm start
```

### **4. Access the Application**

| Service | URL | Description |
|---------|-----|-------------|
| **API Gateway** | http://localhost:3000 | Main API entry point |
| **Admin Dashboard** | http://localhost:4001 | System administration |
| **Student Portal** | http://localhost:4002 | Student certificate access |
| **Employer Portal** | http://localhost:4003 | Certificate verification |

### **5. API Testing**

#### **Register a University**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@university.edu",
    "password": "password123",
    "fullName": "University Admin",
    "role": "university"
  }'
```

#### **Issue a Certificate**
```bash
curl -X POST http://localhost:3000/api/certificates/issue \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "studentName": "John Doe",
    "studentEmail": "john@example.com",
    "courseName": "Computer Science",
    "grade": "A",
    "cgpa": 8.5,
    "issueDate": "2024-12-01"
  }'
```

#### **Verify a Certificate**
```bash
curl -X GET http://localhost:3000/api/verify/CERT12345

# Or verify by verification code
curl -X GET http://localhost:3000/api/verify/code/ABC12345
```

### **6. Development Workflow**

#### **Team Member Workflow**
1. **Pick a service** from your assignment
2. **Navigate to service directory**: `cd services/your-service`
3. **Start development**: `npm run dev`
4. **Make changes** and test
5. **Run tests**: `npm test`
6. **Commit changes** with descriptive messages

#### **Service Development Structure**
```
backend/your-service/
├── src/
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── utils/           # Helper functions
├── tests/               # Unit and integration tests
├── Dockerfile           # Container configuration
├── package.json         # Dependencies and scripts
└── README.md           # Service documentation

frontend/your-app/
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── services/        # API service calls
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   └── styles/          # CSS/styling files
├── public/              # Static assets
├── package.json         # Dependencies and scripts
└── README.md           # Frontend documentation
```

### **7. Testing**

#### **Unit Tests**
```bash
# Test all backend services
npm run test:backend

# Test specific backend service
cd backend/auth-service && npm test

# Test frontend applications
cd frontend/student-portal && npm test
```

#### **Integration Tests**
```bash
# Start test environment
docker-compose -f docker-compose.test.yml up

# Run integration tests
npm run test:integration
```

#### **API Testing with Postman**
- Import the Postman collection from `docs/api/postman_collection.json`
- Set environment variables in Postman
- Test all endpoints

### **8. Useful Commands**

```bash
# View logs
docker-compose logs -f api-gateway
npm run docker:logs

# Restart a service
docker-compose restart auth-service

# Rebuild and restart
docker-compose up --build auth-service

# Database operations
npm run migrate:auth
npm run seed:university

# Clean up
docker-compose down -v  # Removes volumes too
```

### **9. Troubleshooting**

#### **Port Conflicts**
```bash
# Check what's using a port
lsof -i :3000

# Kill process on port
kill -9 $(lsof -t -i:3000)
```

#### **Database Connection Issues**
```bash
# Check database status
docker-compose ps

# Reset databases
docker-compose down -v
docker-compose up -d postgres-auth postgres-university postgres-certificate
npm run migrate
```

#### **Service Communication Issues**
- Check if all required services are running
- Verify environment variables
- Check Docker network connectivity

### **10. Team Collaboration**

#### **Branch Strategy**
```bash
# Feature development
git checkout -b feature/auth-service-jwt
git checkout -b feature/certificate-signing

# Service-specific branches
git checkout -b service/verification-api
git checkout -b frontend/student-portal
```

#### **Code Reviews**
- Create pull requests for each feature
- Review code for security best practices
- Test thoroughly before merging

#### **Communication**
- Use GitHub Issues for tracking tasks
- Document API changes in `/docs/api/`
- Update README files for each service

### **11. Production Deployment**

#### **Build for Production**
```bash
# Build all backend services and frontend
npm run build

# Build only backend
npm run build:backend

# Build only frontend  
npm run build:frontend

# Build Docker images
docker-compose -f docker-compose.prod.yml build
```

#### **Environment Setup**
- Set production environment variables
- Use secure database passwords
- Configure HTTPS certificates
- Set up monitoring and logging

### **12. Monitoring & Logs**

#### **Local Development**
```bash
# View real-time logs
docker-compose logs -f

# Service-specific logs
docker-compose logs -f auth-service
```

#### **Production Monitoring**
- Set up health check endpoints
- Configure log aggregation
- Monitor performance metrics
- Set up alerts for errors

---

## **Next Steps for Team**

1. **Week 1**: Each member sets up their assigned service
2. **Week 2**: Implement core functionality and APIs
3. **Week 3**: Integration testing between services
4. **Week 4**: Frontend development and UI/UX
5. **Week 5**: End-to-end testing and bug fixes
6. **Week 6**: Production deployment and documentation

## **Need Help?**

- Check service-specific README files
- Review API documentation in `/docs/api/`
- Ask team members in your communication channel
- Create GitHub issues for bugs or questions

**Happy coding! 🎉**