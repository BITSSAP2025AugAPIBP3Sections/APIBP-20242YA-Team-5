# Verification Service

Certificate verification microservice built with Java Spring Boot.

## Overview

Read-only service that verifies student certificates by:
- Fetching certificate data from Certificate Service
- Fetching university public keys from University Service
- Verifying digital signatures using RSA cryptography
- Returning verification results

**No database required** - this service only reads data from other services.

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Cloud OpenFeign** (service-to-service calls)
- **Bouncy Castle** (RSA cryptography)
- **Springdoc OpenAPI** (Swagger documentation)
- **Maven** (build tool)

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Certificate Service running on port 3003
- University Service running on port 3002

## Quick Start

### Run Locally
```bash
# Build
mvn clean package

# Run
java -jar target/verification-service-1.0.0.jar

# Or using Maven
mvn spring-boot:run
```

Service runs on: **http://localhost:3004**

### Run with Docker
```bash
# Build image
docker build -t verification-service .

# Run container
docker run -p 3004:3004 \
  -e CERTIFICATE_SERVICE_URL=http://certificate-service:3003 \
  -e UNIVERSITY_SERVICE_URL=http://university-service:3002 \
  verification-service
```

## API Endpoints

### Verification

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/verify` | Verify by ID or code |
| GET | `/api/verify/{id}` | Quick verify by ID |
| GET | `/api/verify/code/{code}` | Quick verify by code |
| POST | `/api/verify/bulk` | Bulk verification |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | Service info |

### Documentation

- **Swagger UI:** http://localhost:3004/swagger-ui.html
- **OpenAPI Spec:** http://localhost:3004/api-docs

## Configuration

Edit `src/main/resources/application.yml`:
```yaml
server:
  port: 3004

services:
  certificate:
    url: http://localhost:3003
  university:
    url: http://localhost:3002
```

Or use environment variables:
- `CERTIFICATE_SERVICE_URL`
- `UNIVERSITY_SERVICE_URL`

## Example Usage

### Verify by ID
```bash
curl -X POST http://localhost:3004/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "certificateId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### Verify by Code
```bash
curl http://localhost:3004/api/verify/code/ABC12345
```

### Bulk Verification
```bash
curl -X POST http://localhost:3004/api/verify/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "certificates": [
      {"certificateId": "550e8400-e29b-41d4-a716-446655440000"},
      {"verificationCode": "ABC12345"}
    ]
  }'
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "valid": true,
    "certificate": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "studentName": "John Doe",
      "courseName": "Computer Science",
      "grade": "A",
      "status": "active"
    },
    "university": {
      "id": "uni-123",
      "name": "Tech University",
      "verified": true
    },
    "verificationMethod": "id",
    "timestamp": "2025-11-08T10:00:00"
  },
  "message": "Certificate verified successfully"
}
```

### Invalid Certificate
```json
{
  "success": true,
  "data": {
    "valid": false,
    "verificationMethod": "id",
    "timestamp": "2025-11-08T10:00:00",
    "reason": "Certificate has been revoked"
  },
  "message": "Certificate verification failed"
}
```

## How It Works

1. **Receive verification request** (ID or code)
2. **Fetch certificate** from Certificate Service via Feign
3. **Check status** (active/revoked/suspended)
4. **Fetch university public key** from University Service
5. **Verify digital signature** using RSA (Bouncy Castle)
6. **Return result** (valid/invalid with reason)

## Verification Flow
```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /api/verify
       ▼
┌─────────────────────┐
│ Verification Service│
└──────┬──────────────┘
       │
       ├─→ GET /api/certificates/{id}
       │   ┌──────────────────┐
       │   │Certificate Service│
       │   └──────────────────┘
       │
       ├─→ GET /api/universities/{id}/public-key
       │   ┌─────────────────┐
       │   │University Service│
       │   └─────────────────┘
       │
       ├─→ Verify RSA Signature
       │   (Bouncy Castle)
       │
       ▼
    Return Result
```

## Security

- **RSA Digital Signature Verification** (2048-bit)
- **SHA-256 Hashing**
- **Input Validation** (Jakarta Validation)
- **CORS Protection**
- **No data storage** (read-only service)

## Troubleshooting

### Cannot Connect to Certificate Service
```bash
# Check if Certificate Service is running
curl http://localhost:3003/health

# Update application.yml with correct URL
services:
  certificate:
    url: http://correct-url:3003
```

### Cannot Connect to University Service
```bash
# Check if University Service is running
curl http://localhost:3002/health

# Update application.yml
services:
  university:
    url: http://correct-url:3002
```

### Signature Verification Fails

- Ensure Certificate Service is generating valid signatures
- Ensure University Service returns correct public keys
- Check that keys are in PEM format

## Development

### Build
```bash
mvn clean package
```

### Run Tests
```bash
mvn test
```

### Generate Swagger Docs
```bash
# Start application
mvn spring-boot:run

# Access Swagger UI
open http://localhost:3004/swagger-ui.html
```

## Deployment

### Docker Compose

See root `docker-compose.yml` for integration with all services.

### Environment Variables
```bash
export CERTIFICATE_SERVICE_URL=http://certificate-service:3003
export UNIVERSITY_SERVICE_URL=http://university-service:3002
java -jar verification-service.jar
```

## Team Integration

**Service depends on:**
- Certificate Service (port 3003) - for certificate data
- University Service (port 3002) - for public keys

**Used by:**
- Employer Portal (frontend)
- API Gateway (if implemented)

## License

MIT