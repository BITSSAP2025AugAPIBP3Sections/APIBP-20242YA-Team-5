# Backend Services

This folder contains all the microservices that make up the backend of the Student Certificate Verification System.

## **Services Overview**

| Service | Port | Purpose | Database |
|---------|------|---------|----------|
| **API Gateway** | 3000 | Entry point, routing, security | - |
| **Auth Service** | 3001 | Authentication & authorization | auth_db |
| **University Service** | 3002 | University management | university_db |
| **Certificate Service** | 3003 | Certificate issuance & signing | certificate_db |
| **Verification Service** | 3004 | Certificate verification | certificate_db (read-only) |
| **File Service** | 3005 | PDF generation & file handling | - |
| **Notification Service** | 3006 | Email & SMS notifications | - |

## **Quick Start**

### **Development Setup**
```bash
# Install dependencies for all services
npm run setup:backend

# Start all services
npm run dev

# Or start individual services
npm run dev:auth
npm run dev:certificate
```

### **Docker Setup**
```bash
# Start all services with Docker
docker-compose up backend-services
```

## **Service Architecture**

### **Shared Resources**
- **Types**: `backend/shared/types/` - Common TypeScript interfaces
- **Utils**: `backend/shared/common/` - Shared utility functions
- **Database**: Each service has its own database for data isolation

### **Inter-Service Communication**
- **HTTP REST**: Primary communication method
- **Service Discovery**: Through API Gateway
- **Error Handling**: Standardized error responses
- **Logging**: Centralized logging with correlation IDs

## **Development Guidelines**

### **Service Structure**
Each service follows this structure:
```
service-name/
├── src/
│   ├── controllers/    # HTTP route handlers
│   ├── services/       # Business logic
│   ├── models/         # Database models
│   ├── routes/         # API route definitions
│   ├── middleware/     # Express middleware
│   ├── utils/          # Service-specific utilities
│   └── config/         # Configuration files
├── tests/              # Unit and integration tests
├── Dockerfile          # Container configuration
├── package.json        # Dependencies and scripts
└── README.md          # Service-specific documentation
```

### **API Standards**
- **REST**: Follow RESTful conventions
- **Status Codes**: Use appropriate HTTP status codes
- **Error Format**: Consistent error response format
- **Validation**: Input validation using Joi/Zod
- **Documentation**: OpenAPI/Swagger specs

### **Security**
- **JWT Authentication**: Secure API endpoints
- **Input Validation**: Prevent injection attacks
- **Rate Limiting**: Prevent abuse
- **CORS**: Proper CORS configuration
- **Encryption**: Encrypt sensitive data

### **Testing**
- **Unit Tests**: Test individual functions
- **Integration Tests**: Test service interactions
- **API Tests**: Test HTTP endpoints
- **Coverage**: Maintain >80% test coverage

## **Environment Variables**

Each service uses environment variables for configuration:
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Service URLs
AUTH_SERVICE_URL=http://auth-service:3001
CERTIFICATE_SERVICE_URL=http://certificate-service:3003

# External Services
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email
SMTP_PASS=your-password
```

## **Database Migrations**

Each service manages its own database:
```bash
# Run migrations for all services
npm run migrate

# Run migrations for specific service
npm run migrate:auth
npm run migrate:certificate
```

## **Monitoring & Logging**

### **Health Checks**
Each service exposes health check endpoints:
- `GET /health` - Service health status
- `GET /metrics` - Service metrics (Prometheus format)

### **Logging**
- **Structured Logging**: JSON format with correlation IDs
- **Log Levels**: ERROR, WARN, INFO, DEBUG
- **Centralized**: Aggregate logs for monitoring

## **Deployment**

### **Docker**
Each service has its own Dockerfile for containerization:
```bash
# Build specific service
docker build -t cert-auth-service ./auth-service

# Build all services
docker-compose build
```

### **Kubernetes**
Production deployment uses Kubernetes manifests in `/infrastructure/kubernetes/`

## **Contributing**

1. **Choose a service** to work on
2. **Read the service README** for specific guidelines
3. **Create feature branch**: `feature/service-name-feature`
4. **Write tests** for new functionality
5. **Update documentation** as needed
6. **Submit pull request** for review

## **Troubleshooting**

### **Common Issues**
- **Port conflicts**: Check if ports 3001-3006 are available
- **Database connection**: Ensure PostgreSQL is running
- **Service communication**: Check if services can reach each other
- **Environment variables**: Verify all required env vars are set

### **Debugging**
```bash
# Check service logs
docker-compose logs -f auth-service

# Test service health
curl http://localhost:3001/health

# Check database connection
psql postgresql://postgres:password@localhost:5432/auth_db
```