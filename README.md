# **Student Certificate Verification System**

The application provides APIs for issuing and verifying student certificates using digital signatures and cryptographic verification.  
Universities can publish certificate details securely, and employers can instantly validate authenticity without contacting the university.

## **Quick Start - API Documentation**

### **To view API Specification**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run Swagger UI:**
   ```bash
   npm run swagger
   ```

3. **Access API Documentation:**
   - Open: **http://localhost:8080**
   - Or directly: **http://localhost:8080/api-docs**


### **Alternative Commands:**
```bash
# Same as npm run swagger
npm run api-docs

# Or run directly
node swagger-server.js
```

## **📋 API Specification File**
The complete OpenAPI 3.0.3 specification is located at:
- **File**: `docs/api/openapi.yaml`
- **Format**: YAML (industry standard)
- **Version**: OpenAPI 3.0.3

---

## **Backend**
Handles business logic and communicates with the database and cryptographic services.  
Exposes **REST and GraphQL APIs** for operations such as certificate issuance, record management, and verification.



## **REST & GraphQL API**
Acts as the bridge between frontend clients and the certificate verification layer. Supports operations like:

- **User authentication & role-based access** (university, student, employer)  
- **Certificate management** – create, update, and retrieve certificate records  
- **Digital signature & hash generation** – compute certificate hash (e.g., SHA-256) and cryptographic signatures  
- **Verification** – validate a certificate by ID or verification code  

Clients can choose:
- **REST endpoints** for standard HTTP requests  
- **GraphQL queries/mutations** for flexible data fetching and combined operations  



## **Core Features**

### **University (Issuer)**
- Authenticate and issue certificates  
- Store certificate hash and digital signature in secure database  

### **Student (Holder)**
- Retrieve issued certificate details and verification information  

### **Employer (Verifier)**
- Verify certificate authenticity directly through REST or GraphQL endpoints  



## **System-Wide**
- Authentication and role-based access control  
- Secure digital signing and cryptographic hashing  
- Tamper-proof verification accessible via both REST and GraphQL APIs  



## **Team Members**
- **Sachin T P** – 93102 – [@SachinTP02](https://github.com/SachinTP02)  
- **Saher Mahtab** – 93103 – [@SaherMahtab](https://github.com/SaherMahtab)  
- **R Soujanya** – 93039 – [@reddeboinasoujanya09](https://github.com/reddeboinasoujanya09)  
- **Sanka Deekshitha** – 93043 – [@deekshitha-77](https://github.com/deekshitha-77)  
- **Anantha Krishnan G** – 93049 – [@spotananthu](https://github.com/spotananthu)  



**License**  
This project is licensed under the [MIT License](./LICENSE).
