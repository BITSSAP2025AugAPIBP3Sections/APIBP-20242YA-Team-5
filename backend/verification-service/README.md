# Verification Service

Certificate verification microservice that checks if student certificates are real or fake.

## 🎯 What It Does

- ✅ Verifies certificates by ID or verification code
- ✅ Checks digital signatures using cryptography
- ✅ Logs all verification attempts
- ✅ No authentication required (public API)

## 📦 Prerequisites

- Node.js 16+
- PostgreSQL 13+
- Certificate Service (port 3003)
- University Service (port 3002)

## 🚀 Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Edit .env with your database password

# 3. Create database
createdb -U postgres verification_db

# 4. Run migrations
npm run migrate

# 5. Start service
npm run dev
```

Service runs on: **http://localhost:3004**

## 🔍 Test It
```bash
# Health check
curl http://localhost:3004/health

# Verify certificate
curl -X POST http://localhost:3004/api/verify \
  -H "Content-Type: application/json" \
  -d '{"certificateId": "550e8400-e29b-41d4-a716-446655440000"}'
```

## 📖 Main Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Check if service is running |
| `/api/verify` | POST | Verify by ID or code |
| `/api/verify/{id}` | GET | Quick verify by ID |
| `/api/verify/code/{code}` | GET | Quick verify by code |
| `/api/verify/bulk` | POST | Verify multiple certificates |

## 📁 Project Structure
```
src/
├── config/         # Database & app config
├── controllers/    # Request handlers
├── services/       # Business logic
├── models/         # Database models
├── routes/         # API routes
├── middleware/     # Rate limiting, errors
├── utils/          # Helpers & crypto
├── validators/     # Input validation
└── index.ts        # Entry point
```

## ⚙️ Environment Variables
```env
PORT=3004
DB_HOST=localhost
DB_NAME=verification_db
DB_USER=postgres
DB_PASSWORD=your_password
CERTIFICATE_SERVICE_URL=http://localhost:3003
UNIVERSITY_SERVICE_URL=http://localhost:3002
```

## 🧪 Testing
```bash
npm test                # Run all tests
npm run test:watch     # Watch mode
```

## 🐳 Docker
```bash
docker-compose up -d   # Start with Docker
```

## 🔧 Common Issues

**Database connection failed?**
```bash
# Check PostgreSQL is running
systemctl status postgresql
```

**Port 3004 already in use?**
```bash
# Find and kill process
lsof -i :3004
kill -9 <PID>
```

## 📝 Logs
```bash
# View logs
tail -f logs/combined-*.log
```

## 🔐 Security

- Rate limiting (100 requests/15 min)
- Input validation with Joi
- SQL injection prevention
- Digital signature verification using RSA

## 📊 Key Features

- **Multiple verification methods** (ID, code, signature)
- **Bulk verification** (up to 100 certificates)
- **Audit logging** (every verification recorded)
- **Health checks** (for Kubernetes/Docker)
- **Statistics & analytics**

## 🤝 Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Update documentation

## 📄 License

MIT
