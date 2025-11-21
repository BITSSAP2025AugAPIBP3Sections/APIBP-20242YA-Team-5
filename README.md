# Student Certificate Management System

A web application for managing and verifying student certificates. Universities can issue digital certificates, students can access their records, and employers can verify certificate authenticity in real-time.

## 🎯 Overview

This system provides a secure platform for the complete certificate lifecycle - from issuance by universities to verification by employers, eliminating manual verification processes and preventing fraud.

## 🛠 Tech Stack

- **Backend:** Java 17+, Spring Boot 3.x, Feign Client, PostgreSQL
- **Frontend:** React 18+, TypeScript
- **API:** REST (HTTP), Swagger/OpenAPI 3.0
- **Testing:** Bruno

## 🏗 Architecture

The application consists of 4 independent services communicating via HTTP REST APIs:
```
Frontend (React + TypeScript)
         │
    ┌────┼─────┬────────┬──────────┐
    ▼    ▼     ▼        ▼          │
  Auth  Univ  Cert  Verification   │
  3001  3002  3003      3004       │
                    │               │
              Feign Client          │
                    │               │
              ┌─────┴───────────────┘
              ▼
          Database
```

## 🚀 Quick Start

### Backend Setup
```bash
# Start each service in separate terminals
cd backend/auth-service && ./mvnw spring-boot:run        # Port 3001
cd backend/university-service && ./mvnw spring-boot:run  # Port 3002
cd backend/certificate-service && ./mvnw spring-boot:run # Port 3003
cd backend/verification-service && ./mvnw spring-boot:run # Port 3004
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📚 Services

| Service | Port | Purpose |
|---------|------|---------|
| Auth Service | 3001 | User authentication & authorization |
| University Service | 3002 | Manage university profiles |
| Certificate Service | 3003 | Issue and manage certificates |
| Verification Service | 3004 | Verify certificate authenticity |

## API Documentation

Once services are running:

- **Auth:** http://localhost:3001/swagger-ui.html
- **University:** http://localhost:3002/swagger-ui.html
- **Certificate:** http://localhost:3003/swagger-ui.html
- **Verification:** http://localhost:3004/swagger-ui.html

## 🧪 Testing with Bruno

1. **Install Bruno:** https://www.usebruno.com/
2. **Test workflow:**
   - Health checks → Create university → Issue certificate → Verify

## 🤝 Team Members

- **Sachin T P** – 93102 – [@SachinTP02](https://github.com/SachinTP02)
- **Saher Mahtab** – 93103 – [@SaherMahtab](https://github.com/SaherMahtab)
- **R Soujanya** – 93039 – [@reddeboinasoujanya09](https://github.com/reddeboinasoujanya09)
- **Sanka Deekshitha** – 93043 – [@deekshitha-77](https://github.com/deekshitha-77)
- **Anantha Krishnan G** – 93049 – [@spotananthu](https://github.com/spotananthu)

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

**Note:** Each service has its own detailed README in their respective directories for service-specific documentation.
