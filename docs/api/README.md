# API Documentation

This directory contains comprehensive API documentation for the Student Certificate Verification System.

## **Files Overview**

| File | Description |
|------|-------------|
| `openapi.yaml` | Complete OpenAPI 3.0.3 specification |
| `postman_collection.json` | Postman collection for testing |
| `graphql_schema.graphql` | GraphQL schema definition |
| `api_examples.md` | API usage examples |
| `authentication.md` | Authentication guide |
| `error_codes.md` | Error codes reference |

## **Quick Start**

### **View API Documentation**
```bash
# Install swagger-ui-express
npm install -g swagger-ui-serve

# Serve the documentation
swagger-ui-serve docs/api/openapi.yaml
```

### **Test with Postman**
1. Import `postman_collection.json` into Postman
2. Set environment variables:
   - `base_url`: `http://localhost:3000`
   - `token`: Your JWT token from login

### **API Base URLs**

| Environment | URL | Description |
|-------------|-----|-------------|
| **Development** | `http://localhost:3000` | Local API Gateway |
| **Staging** | `https://staging-api.student-cert.com` | Staging environment |
| **Production** | `https://api.student-cert.com` | Production environment |

## **Service Endpoints**

Each microservice can also be accessed directly during development:

| Service | Port | Direct URL |
|---------|------|------------|
| **API Gateway** | 3000 | `http://localhost:3000` |
| **Auth Service** | 3001 | `http://localhost:3001` |
| **University Service** | 3002 | `http://localhost:3002` |
| **Certificate Service** | 3003 | `http://localhost:3003` |
| **Verification Service** | 3004 | `http://localhost:3004` |
| **File Service** | 3005 | `http://localhost:3005` |
| **Notification Service** | 3006 | `http://localhost:3006` |

## **Authentication**

All protected endpoints require a JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/certificates
```

## **Rate Limiting**

| Endpoint Type | Rate Limit | Window |
|---------------|------------|---------|
| **Authentication** | 5 requests | 15 minutes |
| **Verification (Public)** | 100 requests | 15 minutes |
| **Certificate Operations** | 50 requests | 15 minutes |
| **File Operations** | 20 requests | 15 minutes |

## **Response Format**

All API responses follow a consistent format :

### **Success Response**
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### **Error Response**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {},
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## **Common Error Codes**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

## **Testing Guidelines**

### **Unit Testing APIs**
```bash
# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@university.edu","password":"password123"}'

# Test certificate verification (public)
curl -X GET http://localhost:3000/api/verify/CERT-12345
```

### **Integration Testing**
1. Start all services: `docker-compose up`
2. Run test suite: `npm run test:integration`
3. Check health endpoints: `curl http://localhost:3000/api/health`

## **API Versioning**

- **Current Version**: `v1`
- **Version Header**: `Accept: application/vnd.api+json;version=1`
- **URL Versioning**: `/api/v1/certificates` (future versions)

## **Security Considerations**

1. **Always use HTTPS** in production 
2. **Validate JWT tokens** on every request 
3. **Implement rate limiting** to prevent abuse 
4. **Log all verification requests** for audit trails 
5. **Use strong passwords** for user accounts 
6. **Regularly rotate signing keys** for universities 

## **Support**

- **API Issues**: Create GitHub issue with `api` label
- **Documentation**: Check `docs/` directory
- **Examples**: See `api_examples.md`
- **Postman Collection**: Import and test endpoints
