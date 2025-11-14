#  Certificate Service

This service is responsible for **issuing, updating, revoking, and managing digital academic certificates**.
It forms part of the **Student Certificate Verification System** backend microservices suite.

---

## **Service Overview**

| Service                 | Port   | Purpose                                            | Database         |
| ----------------------- | ------ | -------------------------------------------------- | ---------------- |
| **Certificate Service** | `3003` | Certificate issuance, storage, and digital signing | `certificate_db` |

---

## **Features**

* Issue new certificates for verified students
* Update or revoke issued certificates
* Generate and hash digital signatures
* Secure inter-service communication via JWT (handled by Auth Service)
* RESTful APIs with consistent response format
* Uses PostgreSQL for persistent storage
* Prepares certificate metadata for blockchain anchoring

---

## **Quick Start**

### **Local Development Setup**

#### **Clone Repository**

```bash
git clone https://github.com/<your-org>/<your-repo>.git
cd backend/certificate-service
```

####  **Configure Database**

Make sure PostgreSQL is running and update your credentials in:

```
src/main/resources/application.yml
```

#### **Build & Run**

```bash
# Clean and compile
mvn clean install

# Run Spring Boot application
mvn spring-boot:run
```

#### **Access Service**

```bash
http://localhost:3003/api/v1/certificates
```

---

###  **Docker Setup**

#### **Build Docker Image**

```bash
docker build -t certificate-service:latest .
```

#### **Run Container**

```bash
docker run -d \
  -p 3003:3003 \
  --name certificate-service \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/certificate_db \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=postgres \
  certificate-service:latest
```

#### **Check Logs**

```bash
docker logs -f certificate-service
```

---

## **API Endpoints**

| Method | Endpoint                                   | Description                 |
| ------ | ------------------------------------------ | --------------------------- |
| `POST` | `/api/v1/certificates/issue`               | Issue a new certificate     |
| `PUT`  | `/api/v1/certificates/update`              | Update existing certificate |
| `POST` | `/api/v1/certificates/revoke`              | Revoke a certificate        |
| `GET`  | `/api/v1/certificates/{certificateNumber}` | Fetch certificate details   |
| `GET`  | `/api/v1/certificates`                     | Get all certificates        |


---

## **Architecture**

### **Tech Stack**

* **Spring Boot 3 (Java 17+)**
* **Spring Data JPA (PostgreSQL)**
* **Spring WebFlux (WebClient for inter-service calls)**
* **Lombok** for boilerplate reduction
* **Docker** for containerization

### **Service Dependencies**

* **Auth Service**: Handles JWT validation
* **Notification Service**: Sends certificate-related emails

---

## **Database Schema**

`schema.sql` initializes the `certificate` table with constraints and indexes:

```sql
CREATE TABLE certificate (
    certificate_id UUID PRIMARY KEY,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    student_id UUID NOT NULL,
    university_id UUID NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    grade VARCHAR(10),
    cgpa FLOAT,
    issue_date DATE NOT NULL,
    completion_date DATE,
    certificate_hash VARCHAR(255),
    digital_signature TEXT,
    verification_code VARCHAR(20),
    pdf_path TEXT,
    status VARCHAR(20),
    revocation_reason TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## **Testing**

Run unit tests with Maven:

```bash
mvn test
```

Integration test commands:

```bash
mvn verify
```

---

## **Deployment**

###  **Docker Compose**

Add the service to your main `docker-compose.yml`:

```yaml
certificate-service:
  build: ./backend/certificate-service
  ports:
    - "3003:3003"
  environment:
    SPRING_DATASOURCE_URL: jdbc:postgresql://certificate-db:5432/certificate_db
    SPRING_DATASOURCE_USERNAME: postgres
    SPRING_DATASOURCE_PASSWORD: postgres
  depends_on:
    - certificate-db
```

### ️ **Kubernetes Deployment**

```bash
kubectl apply -f k8s/certificate-deployment.yaml
kubectl apply -f k8s/certificate-service.yaml
```

---

## **Troubleshooting**

| Issue                        | Possible Cause                              | Fix                              |
| ---------------------------- | ------------------------------------------- | -------------------------------- |
| `Port already in use`        | Port 3003 used by another process           | Kill process or change port      |
| `Database connection failed` | PostgreSQL not running or wrong credentials | Check `application.yml`          |
| `JWT validation errors`      | Auth service unavailable                    | Ensure `auth-service` is running |
| `CORS issues`                | Missing CORS config                         | Add CORS mappings in controller  |

---

## **Contributing**

1. Fork the repository
2. Create your branch (`feature/certificate-enhancements`)
3. Commit your changes (`git commit -m "Added certificate revocation flow"`)
4. Push to branch (`git push origin feature/certificate-enhancements`)
5. Create a pull request
6. Review and merge