# **Student Certificate Verification System**

The application provides APIs for issuing and verifying student certificates on a blockchain network.  
Universities can publish certificate details immutably, and employers can instantly validate authenticity without contacting the university.



## **Backend**
Handles business logic and communicates with the blockchain network and a relational database.  
Exposes **REST and GraphQL APIs** for operations such as certificate issuance, record management, and verification.



## **REST & GraphQL API**
Acts as the bridge between frontend clients and the blockchain layer. Supports operations like:

- **User authentication & role-based access** (university, student, employer)  
- **Certificate management** – create, update, and retrieve certificate records  
- **Hash generation & storage** – compute certificate hash (e.g., SHA-256) and write to blockchain  
- **Verification** – validate a certificate by ID, transaction hash, or QR code  

Clients can choose:
- **REST endpoints** for standard HTTP requests  
- **GraphQL queries/mutations** for flexible data fetching and combined operations  



## **Core Features**

### **University (Issuer)**
- Authenticate and issue certificates  
- Store certificate hash and metadata on blockchain  

### **Student (Holder)**
- Retrieve issued certificate details and blockchain transaction/QR code  

### **Employer (Verifier)**
- Verify certificate authenticity directly through REST or GraphQL endpoints  



## **System-Wide**
- Authentication and role-based access control  
- Secure hashing before writing to blockchain  
- Immutable, tamper-proof verification accessible via both REST and GraphQL APIs  



## **Team Members**
- **Sachin T P** – 93102 – [@SachinTP02](https://github.com/SachinTP02)  
- **Saher Mahtab** – 93103 – [@SaherMahtab](https://github.com/SaherMahtab)  
- **R Soujanya** – 93039 – [@reddeboinasoujanya09](https://github.com/reddeboinasoujanya09)  
- **Sanka Deekshitha** – 93043 – [@deekshitha-77](https://github.com/deekshitha-77)  
- **Nantha Krishnan G** – 93049 – [@spotananthu](https://github.com/spotananthu)  



**License**  
This project is licensed under the [MIT License](./LICENSE).
