# API Usage Examples

This document provides practical examples for using the Student Certificate Verification System API.

## **🔐 Authentication Examples**

### **1. User Registration**

#### **University Registration**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@university.edu",
    "password": "securePassword123",
    "fullName": "University Admin",
    "role": "university"
  }'
```

#### **Student Registration**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@student.edu", 
    "password": "studentPass123",
    "fullName": "John Doe",
    "role": "student",
    "universityId": "550e8400-e29b-41d4-a716-446655440000",
    "studentId": "STU2024001"
  }'
```

#### **Employer Registration**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hr@company.com",
    "password": "employerPass123", 
    "fullName": "HR Manager",
    "role": "employer"
  }'
```

### **2. User Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@university.edu",
    "password": "securePassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "admin@university.edu",
      "fullName": "University Admin",
      "role": "university"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  },
  "message": "Authentication successful"
}
```

### **3. Get User Profile**
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## **🏛️ University Management Examples**

### **1. Register University**
```bash
curl -X POST http://localhost:3000/api/universities \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Example University",
    "email": "registrar@example-university.edu",
    "address": "123 University Ave, City, State 12345",
    "phone": "+1-555-123-4567"
  }'
```

### **2. List Universities**
```bash
# All universities
curl -X GET http://localhost:3000/api/universities

# Verified universities only
curl -X GET http://localhost:3000/api/universities?verified=true

# Paginated results
curl -X GET http://localhost:3000/api/universities?page=1&limit=10
```

### **3. Get University Public Key**
```bash
curl -X GET http://localhost:3000/api/universities/550e8400-e29b-41d4-a716-446655440000/public-key
```

## **📜 Certificate Management Examples**

### **1. Issue a Certificate**
```bash
curl -X POST http://localhost:3000/api/certificates \
  -H "Authorization: Bearer UNIVERSITY_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John Doe",
    "studentEmail": "john.doe@student.edu",
    "courseName": "Bachelor of Computer Science",
    "specialization": "Artificial Intelligence",
    "grade": "A",
    "cgpa": 8.5,
    "issueDate": "2024-01-15",
    "completionDate": "2024-01-10"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cert-550e8400-e29b-41d4-a716-446655440000",
    "certificateNumber": "CERT-2024-001",
    "studentName": "John Doe",
    "courseName": "Bachelor of Computer Science",
    "grade": "A",
    "verificationCode": "ABC12345",
    "certificateHash": "sha256hash...",
    "digitalSignature": "base64signature...",
    "status": "active"
  },
  "message": "Certificate issued successfully"
}
```

### **2. List Certificates**
```bash
# University: List all issued certificates
curl -X GET http://localhost:3000/api/certificates \
  -H "Authorization: Bearer UNIVERSITY_JWT_TOKEN"

# Student: List own certificates
curl -X GET http://localhost:3000/api/certificates \
  -H "Authorization: Bearer STUDENT_JWT_TOKEN"

# Filter by status
curl -X GET http://localhost:3000/api/certificates?status=active \
  -H "Authorization: Bearer UNIVERSITY_JWT_TOKEN"
```

### **3. Get Certificate Details**
```bash
curl -X GET http://localhost:3000/api/certificates/cert-550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer JWT_TOKEN"
```

### **4. Update Certificate**
```bash
curl -X PUT http://localhost:3000/api/certificates/cert-550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer UNIVERSITY_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "grade": "A+",
    "cgpa": 9.0,
    "specialization": "Machine Learning"
  }'
```

### **5. Revoke Certificate**
```bash
curl -X POST http://localhost:3000/api/certificates/cert-550e8400-e29b-41d4-a716-446655440000/revoke \
  -H "Authorization: Bearer UNIVERSITY_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Academic misconduct discovered after graduation"
  }'
```

### **6. Batch Issue Certificates**
```bash
curl -X POST http://localhost:3000/api/certificates/batch-issue \
  -H "Authorization: Bearer UNIVERSITY_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "certificates": [
      {
        "studentName": "Alice Smith",
        "studentEmail": "alice@student.edu",
        "courseName": "Bachelor of Engineering",
        "grade": "B+",
        "issueDate": "2024-01-15"
      },
      {
        "studentName": "Bob Johnson",
        "studentEmail": "bob@student.edu", 
        "courseName": "Bachelor of Engineering",
        "grade": "A-",
        "issueDate": "2024-01-15"
      }
    ]
  }'
```

## **✅ Certificate Verification Examples**

### **1. Verify by Certificate ID**
```bash
# Using POST endpoint
curl -X POST http://localhost:3000/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "certificateId": "cert-550e8400-e29b-41d4-a716-446655440000"
  }'

# Using GET endpoint (simpler)
curl -X GET http://localhost:3000/api/verify/cert-550e8400-e29b-41d4-a716-446655440000
```

### **2. Verify by Verification Code**
```bash
# Using POST endpoint
curl -X POST http://localhost:3000/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "verificationCode": "ABC12345"
  }'

# Using GET endpoint (simpler)
curl -X GET http://localhost:3000/api/verify/code/ABC12345
```

**Verification Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "certificate": {
      "id": "cert-550e8400-e29b-41d4-a716-446655440000",
      "studentName": "John Doe",
      "courseName": "Bachelor of Computer Science",
      "grade": "A",
      "issueDate": "2024-01-15",
      "status": "active"
    },
    "university": {
      "name": "Example University",
      "verified": true
    },
    "verificationMethod": "api",
    "timestamp": "2024-01-15T14:30:00Z"
  },
  "message": "Certificate is valid"
}
```

### **3. Bulk Verification**
```bash
curl -X POST http://localhost:3000/api/verify/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "certificates": [
      {"certificateId": "cert-550e8400-e29b-41d4-a716-446655440000"},
      {"verificationCode": "ABC12345"},
      {"verificationCode": "XYZ67890"}
    ]
  }'
```

### **4. Verify Digital Signature**
```bash
curl -X POST http://localhost:3000/api/verify/signature \
  -H "Content-Type: application/json" \
  -d '{
    "certificateHash": "sha256hashofcertificatedata...",
    "digitalSignature": "base64encodedsignature...",
    "universityId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

## **📄 File Management Examples**

### **1. Generate Certificate PDF**
```bash
curl -X POST http://localhost:3000/api/files/certificates/cert-550e8400-e29b-41d4-a716-446655440000/generate-pdf \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "template": "official"
  }'
```

### **2. Download Certificate PDF**
```bash
curl -X GET http://localhost:3000/api/files/certificates/cert-550e8400-e29b-41d4-a716-446655440000/pdf \
  -H "Authorization: Bearer JWT_TOKEN" \
  -o certificate.pdf
```

### **3. Upload File**
```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "Authorization: Bearer JWT_TOKEN" \
  -F "file=@document.pdf" \
  -F "type=document"
```

## **👤 Admin Examples**

### **1. Get Dashboard Data**
```bash
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### **2. List All Users**
```bash
# All users
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# Filter by role
curl -X GET http://localhost:3000/api/admin/users?role=university \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### **3. Verify University**
```bash
curl -X POST http://localhost:3000/api/universities/550e8400-e29b-41d4-a716-446655440000/verify \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## **🏥 Health Check Examples**

### **1. API Gateway Health**
```bash
curl -X GET http://localhost:3000/api/health
```

### **2. Service Metrics**
```bash
curl -X GET http://localhost:3000/api/metrics
```

## **🔍 Error Handling Examples**

### **1. Validation Error**
```bash
# Missing required fields
curl -X POST http://localhost:3000/api/certificates \
  -H "Authorization: Bearer UNIVERSITY_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John"
  }'
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": {
      "studentEmail": "Student email is required",
      "courseName": "Course name is required",
      "grade": "Grade is required"
    },
    "timestamp": "2024-01-15T14:30:00Z"
  }
}
```

### **2. Unauthorized Access**
```bash
# Missing JWT token
curl -X GET http://localhost:3000/api/certificates
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED", 
    "message": "Access token is missing or invalid",
    "timestamp": "2024-01-15T14:30:00Z"
  }
}
```

### **3. Certificate Not Found**
```bash
curl -X GET http://localhost:3000/api/verify/INVALID-ID
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Certificate not found",
    "timestamp": "2024-01-15T14:30:00Z"
  }
}
```

## **📱 Frontend Integration Examples**

### **JavaScript/React Example**
```javascript
// API service class
class CertificateAPI {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async verifyCertificate(certificateId) {
    const response = await fetch(`${this.baseURL}/api/verify/${certificateId}`);
    return await response.json();
  }

  async issueCertificate(certificateData) {
    const response = await fetch(`${this.baseURL}/api/certificates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(certificateData)
    });
    return await response.json();
  }
}

// Usage
const api = new CertificateAPI('http://localhost:3000', userToken);
const result = await api.verifyCertificate('cert-12345');
```

### **Python Example**
```python
import requests

class CertificateAPI:
    def __init__(self, base_url, token=None):
        self.base_url = base_url
        self.headers = {'Content-Type': 'application/json'}
        if token:
            self.headers['Authorization'] = f'Bearer {token}'
    
    def verify_certificate(self, certificate_id):
        response = requests.get(f'{self.base_url}/api/verify/{certificate_id}')
        return response.json()
    
    def issue_certificate(self, certificate_data):
        response = requests.post(
            f'{self.base_url}/api/certificates',
            headers=self.headers,
            json=certificate_data
        )
        return response.json()

# Usage
api = CertificateAPI('http://localhost:3000', user_token)
result = api.verify_certificate('cert-12345')
```

## **🧪 Testing Workflow**

### **Complete Testing Flow**
```bash
#!/bin/bash

# 1. Health check
curl -X GET http://localhost:3000/api/health

# 2. Register university
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@university.edu","password":"password123","fullName":"Test University","role":"university"}')

# 3. Login and get token
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@university.edu","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')

# 4. Issue certificate
CERT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/certificates \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"studentName":"Test Student","studentEmail":"student@test.com","courseName":"Computer Science","grade":"A","issueDate":"2024-01-15"}')

CERT_ID=$(echo $CERT_RESPONSE | jq -r '.data.id')

# 5. Verify certificate
curl -X GET http://localhost:3000/api/verify/$CERT_ID

echo "Testing complete!"
```

This comprehensive set of examples should help your team understand and test every aspect of the API!