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
git clone https://github.com/BITSSAP2025AugAPIBP3Sections/APIBP-20242YA-Team-5.git
cd APIBP-20242YA-Team-5/backend/certificate-service
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
http://localhost:3003/api/certificates
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
|--------|--------------------------------------------| --------------------------- |
| `POST` | `/api/certificates`                        | Issue a new certificate     |
| `PUT`  | `/api/certificates/{certificateID}`        | Update existing certificate |
| `POST` | `/api/certificates/{certificateID}/revoke` | Revoke a certificate        |
| `GET`  | `/api/certificates/{certificateID}`        | Fetch certificate details   |
| `GET`  | `/api/certificates`                        | Get all certificates        |
| `POST` | `/api/certificates/upload`                 | Update existing certificate |
| `POST` | `/api/certificates/batch-issue`            | Revoke a certificate        |
| `GET`  | `/api/certificates/{certificateID}/pdf`    | Revoke a certificate        |


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

## **Testing**

Run unit tests with Maven:

```bash
mvn test
```

Integration test commands:

```bash
mvn verify
```

Load testing commands:

```bash
artillery run certificate-load.yml -o report.json && artillery report report.json
```
- A report.json.html file will be generated, check and validate metrics.

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