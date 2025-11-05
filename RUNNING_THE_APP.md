# Getting Started - Running the Application

This guide will help you get the Student Certificate Verification System up and running.

## Current Status ✅

The project structure is set up with:
- ✅ **API Gateway** - Running on port 3000
- ✅ **Complete API Documentation** - OpenAPI 3.0.3 specification
- ✅ **Project Structure** - Microservices architecture defined
- ✅ **Docker Setup** - Full docker-compose configuration
- 🔄 **Individual Services** - Need to be implemented
- 🔄 **Database Setup** - PostgreSQL configurations ready
- 🔄 **Frontend Applications** - To be built

## Quick Start (Current Working Setup)

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install API Gateway dependencies  
cd backend/api-gateway
npm install
```

### 2. Start the API Gateway
```bash
# From the api-gateway directory
npm run dev
```

The API Gateway will start on **http://localhost:3000** and show:
- Service proxy configurations
- Health check endpoint: http://localhost:3000/api/health

### 3. Test the Gateway
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Expected response: {"status":"healthy","timestamp":"...","services":{"available":0,"total":6}}
```

## API Endpoints Available

The API Gateway is configured to route requests to these services:

| Route | Target Service | Port | Status |
|-------|----------------|------|---------|
| `/api/auth/*` | Auth Service | 3001 | 🔄 To implement |
| `/api/universities/*` | University Service | 3002 | 🔄 To implement |
| `/api/certificates/*` | Certificate Service | 3003 | 🔄 To implement |
| `/api/verify/*` | Verification Service | 3004 | 🔄 To implement |
| `/api/files/*` | File Service | 3005 | 🔄 To implement |
| `/api/notifications/*` | Notification Service | 3006 | 🔄 To implement |

## Development Workflow

### Phase 1: Basic Services (Current)
1. ✅ API Gateway running
2. 🔄 Implement Auth Service (JWT tokens)
3. 🔄 Basic University Service
4. 🔄 Certificate Service

### Phase 2: Database & Storage
1. 🔄 Set up PostgreSQL databases
2. 🔄 Implement database schemas
3. 🔄 File storage service

### Phase 3: Frontend
1. 🔄 University Portal (React)
2. 🔄 Student Portal (React)  
3. 🔄 Admin Panel (React)

### Phase 4: Advanced Features
1. 🔄 Email notifications
2. 🔄 Advanced verification
3. 🔄 Reporting & analytics

## Next Steps to Run the Full App

### Option 1: Service by Service (Recommended for Development)
```bash
# 1. Create Auth Service
mkdir -p backend/auth-service/src
cd backend/auth-service

# 2. Set up Auth Service with JWT authentication
npm init -y
npm install express jsonwebtoken bcryptjs dotenv cors helmet express-rate-limit

# 3. Implement basic auth endpoints
# /api/auth/login, /api/auth/register, /api/auth/refresh
```

### Option 2: Docker Compose (Full Environment)
```bash
# Start all services with Docker
docker-compose up -d

# This will start:
# - All 7 backend services
# - 3 PostgreSQL databases
# - Redis for caching
# - All frontend applications
```

## Project Structure Reference

```
├── backend/
│   ├── api-gateway/        ✅ RUNNING
│   ├── auth-service/       🔄 Next to implement
│   ├── university-service/ 🔄 To implement
│   ├── certificate-service/🔄 To implement
│   ├── verification-service/🔄 To implement
│   ├── file-service/       🔄 To implement
│   └── notification-service/🔄 To implement
├── frontend/
│   ├── university-portal/  🔄 To implement
│   ├── student-portal/     🔄 To implement
│   └── admin-panel/        🔄 To implement
├── docs/
│   ├── api/
│   │   ├── openapi.yaml    ✅ Complete API spec
│   │   └── examples.md     ✅ API examples
│   └── PROJECT_STRUCTURE.md ✅ Architecture guide
└── docker-compose.yml      ✅ Full environment setup
```

## Checking Service Status

### API Gateway Health Check
```bash
curl http://localhost:3000/api/health
```

### Individual Service Health (when implemented)
```bash
# Auth Service
curl http://localhost:3001/health

# University Service  
curl http://localhost:3002/health

# Certificate Service
curl http://localhost:3003/health
```

## Environment Configuration

The API Gateway uses these environment variables:
```env
PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
UNIVERSITY_SERVICE_URL=http://localhost:3002
CERTIFICATE_SERVICE_URL=http://localhost:3003
VERIFICATION_SERVICE_URL=http://localhost:3004
FILE_SERVICE_URL=http://localhost:3005
NOTIFICATION_SERVICE_URL=http://localhost:3006
CORS_ORIGIN=http://localhost:3000,http://localhost:4001,http://localhost:4002,http://localhost:4003
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## Troubleshooting

### API Gateway Issues
- **Port 3000 in use**: Kill the process with `lsof -ti:3000 | xargs kill -9`
- **Service connection errors**: Normal until individual services are implemented
- **CORS errors**: Check CORS_ORIGIN environment variable

### Development Tips
- Use `npm run dev` for hot reload during development
- Check logs for service routing information
- Individual services can be developed independently
- API Gateway will proxy requests when services are available

## Documentation

- **Complete API Specification**: `docs/api/openapi.yaml`
- **API Examples**: `docs/api/examples.md`
- **Architecture Guide**: `docs/PROJECT_STRUCTURE.md`
- **This Guide**: `RUNNING_THE_APP.md`

---

**Current Status**: API Gateway is running and ready to route requests to individual services as they're implemented.