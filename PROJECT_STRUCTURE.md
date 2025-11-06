# **Scalable Microservices Architecture**

## **Project Structure Overview**

```
APIBP-20242YA-Team-5/
├── backend/                           # Backend Microservices
│   ├── api-gateway/                   # API Gateway & Load Balancer
│   ├── auth-service/                  # Authentication & Authorization
│   ├── certificate-service/          # Certificate Management & File Operations
│   ├── verification-service/         # Certificate Verification
│   ├── university-service/           # University Management
│   └── shared/                       # Shared Libraries
│       ├── common/                   # Common utilities
│       ├── types/                    # TypeScript interfaces
│       └── proto/                    # gRPC proto files (optional)
├── frontend/                         # Frontend Applications
│   ├── admin-dashboard/              # University Admin Panel
│   ├── student-portal/               # Student Certificate Portal
│   └── employer-portal/              # Employer Verification Portal
├── infrastructure/                   # DevOps & Infrastructure
│   ├── docker/                       # Docker configurations
│   ├── kubernetes/                   # K8s manifests
│   ├── terraform/                    # Infrastructure as Code
│   └── monitoring/                   # Logging & Monitoring
├── databases/                        # Database migrations
│   ├── auth-db/                      # Auth service database
│   ├── certificate-db/               # Certificate service database
│   └── shared-db/                    # Shared reference data
└── docs/                             # Documentation
    ├── api/                          # API documentation
    ├── architecture/                 # Architecture diagrams
    └── deployment/                   # Deployment guides
```

## **Microservices Architecture**

### **1. API Gateway** (`api-gateway/`)
- **Purpose**: Single entry point, routing, rate limiting, CORS
- **Technology**: Express.js + express-http-proxy or Kong
- **Port**: 3000
- **Responsibilities**:
  - Route requests to appropriate services
  - Handle authentication middleware
  - Rate limiting and security headers
  - Request/response logging
  - Load balancing

### **2. Auth Service** (`auth-service/`)
- **Purpose**: User authentication and authorization
- **Technology**: Node.js + Express + JWT
- **Port**: 3001
- **Database**: PostgreSQL (auth-db)
- **Responsibilities**:
  - User registration/login
  - JWT token generation/validation
  - Role-based access control
  - Password reset functionality
  - Session management

### **3. University Service** (`university-service/`)
- **Purpose**: University management and verification
- **Technology**: Node.js + Express
- **Port**: 3002
- **Database**: PostgreSQL (university-db)
- **Responsibilities**:
  - University registration
  - Public key management
  - University verification process
  - University profile management

### **4. Certificate Service** (`certificate-service/`)
- **Purpose**: Certificate issuance and management
- **Technology**: Node.js + Express + Crypto
- **Port**: 3003
- **Database**: PostgreSQL (certificate-db)
- **Responsibilities**:
  - Certificate creation and issuance
  - Digital signature generation
  - Certificate metadata management
  - Batch certificate operations
  - Certificate revocation

### **5. Verification Service** (`verification-service/`)
- **Purpose**: Certificate verification and validation
- **Technology**: Node.js + Express
- **Port**: 3004
- **Database**: Read replicas of certificate-db
- **Responsibilities**:
  - Certificate verification by ID/code
  - Digital signature validation
  - Verification logging
  - Public verification APIs

---

## 🔧 **Development Guidelines**
  - SMS notifications (optional)
  - Notification templates
  - Delivery tracking

## **Frontend Applications**

### **1. Admin Dashboard** (`frontend/admin-dashboard/`)
- **Technology**: React.js + TypeScript + Material-UI
- **Port**: 4001
- **Users**: System administrators
- **Features**:
  - University verification management
  - System analytics and monitoring
  - User management
  - System configuration

### **2. Student Portal** (`frontend/student-portal/`)
- **Technology**: React.js + TypeScript + Material-UI
- **Port**: 4002
- **Users**: Students
- **Features**:
  - View issued certificates
  - Download certificate PDFs
  - Certificate sharing and printing

### **3. Employer Portal** (`frontend/employer-portal/`)
- **Technology**: React.js + TypeScript + Tailwind CSS
- **Port**: 4003
- **Users**: Employers/Verifiers
- **Features**:
  - Certificate verification interface
  - Bulk verification capabilities
  - Verification history and reports
  - API integration guides

## **Shared Libraries** (`backend/shared/`)

### **Common Utils** (`backend/shared/common/`)
```typescript
// Database connection utilities
// Logging utilities
// Validation schemas
// Error handling
// Cryptographic utilities
```

### **TypeScript Types** (`backend/shared/types/`)
```typescript
// User interfaces
// Certificate interfaces
// API request/response types
// Database entity types
```

## **Database Design (Per Service)**

### **Auth Service Database**
```sql
-- Users table
-- Roles table
-- Sessions table
-- Password_resets table
```

### **University Service Database**
```sql
-- Universities table
-- University_keys table
-- University_verifications table
```

### **Certificate Service Database**
```sql
-- Certificates table
-- Certificate_revocations table
-- Batch_operations table
```

## **Communication Between Services**

### **1. HTTP REST APIs**
- Primary communication method
- Service-to-service calls via HTTP
- API versioning (/v1/, /v2/)

### **2. Event-Driven (Optional)**
- Redis Pub/Sub or RabbitMQ
- For notifications and async operations
- Certificate issued → Send notification

### **3. Database Sharing (Minimal)**
- Read replicas for verification service
- Shared reference data (universities, etc.)

## **Deployment Architecture**

### **Development Environment**
```yaml
# docker-compose.yml
version: '3.8'
services:
  api-gateway:
    build: ./services/api-gateway
    ports: ["3000:3000"]
  
  auth-service:
    build: ./services/auth-service
    ports: ["3001:3001"]
    
  certificate-service:
    build: ./services/certificate-service
    ports: ["3003:3003"]
    
  # ... other services
  
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: certificates_db
      
  redis:
    image: redis:alpine
```

### **Production Environment (Kubernetes)**
```yaml
# Each service gets:
- Deployment
- Service
- ConfigMap
- Secret
- HorizontalPodAutoscaler
- Ingress (for public services)
```

## **Scaling Strategy**

### **1. Horizontal Scaling**
- Each service can scale independently
- Load balancers distribute requests
- Database read replicas

### **2. Service-Specific Scaling**
```yaml
# High traffic services
verification-service: 5 replicas
certificate-service: 3 replicas

# Low traffic services  
notification-service: 1 replica
university-service: 2 replicas
```

### **3. Database Scaling**
- Master-slave replication
- Read replicas for verification service
- Connection pooling

## **Security Architecture**

### **1. API Gateway Security**
- HTTPS termination
- Rate limiting
- CORS configuration
- Request validation

### **2. Service-to-Service**
- Internal network communication
- Service mesh (Istio) for advanced setups
- mTLS for sensitive communications

### **3. Database Security**
- Network isolation
- Encrypted connections
- Database-level access controls

## **Monitoring & Observability**

### **1. Logging**
- Centralized logging (ELK stack)
- Structured JSON logs
- Request correlation IDs

### **2. Metrics**
- Prometheus + Grafana
- Service health checks
- Business metrics (certificates issued, verifications)

### **3. Tracing**
- Distributed tracing (Jaeger)
- Request flow visualization
- Performance bottleneck identification

## **Development Workflow**

### **1. Local Development**
- Each service runs independently
- Docker Compose for full stack
- Hot reloading for development

### **2. CI/CD Pipeline**
```yaml
# Per service pipeline:
1. Unit tests
2. Integration tests
3. Build Docker image
4. Deploy to staging
5. Run E2E tests
6. Deploy to production
```

### **3. Database Migrations**
- Per-service migration scripts
- Automated migration in CI/CD
- Rollback strategies

## **Team Assignment Suggestions**

### **Backend Services** (3-4 people)
- **Utsav Jain**: API Gateway + Auth Service  
- **Supriya Bhagat**: University Service + Certificate Service (including file operations)
- **Saher Mahtab**: Verification Service + Integration Testing

### **Frontend Applications** (2-3 people)
- **Soujanya R**: Student Portal + PDF Generation
- **Sanka Deekshitha**: Employer Portal + Admin Dashboard

### **DevOps & Integration** (1-2 people)
- **Rotation**: Docker, API integration, testing, deployment

## **Implementation Timeline**

### **Phase 1: Core Services (Week 1-2)**
- API Gateway basic setup
- Auth Service with JWT
- University Service
- Basic database setup

### **Phase 2: Certificate Management (Week 2-3)**
- Certificate Service with digital signatures and file operations
- Basic frontend for testing

### **Phase 3: Verification & Frontend (Week 3-4)**
- Verification Service
- Student and Employer portals
- PDF generation and download

### **Phase 4: Advanced Features (Week 4-5)**
- Admin dashboard
- Monitoring setup

### **Phase 5: Production Ready (Week 5-6)**
- Security hardening
- Performance optimization
- Comprehensive testing
- Documentation

### **Phase 6: Deployment (Week 6-7)**
- Production deployment
- Load testing
- Monitoring setup
- Final documentation