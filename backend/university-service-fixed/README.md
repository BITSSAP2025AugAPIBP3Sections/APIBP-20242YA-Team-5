# Universities Service

A lightweight Spring Boot service for managing universities and their verification status.

## Features
- Register, update, delete universities
- List universities (`?verified=true|false`)
- Verify universities
- Fetch public key

## Run
```bash
mvn clean install
mvn spring-boot:run
```

Service URL: **http://localhost:3002/api**

## Database (PostgreSQL)
- **Host:** localhost
- **Port:** 5434
- **Database:** universitiesdb
- **User:** postgres
- **Password:** admin

Configured in `application.yaml`.

## Endpoints
- **POST** `/universities` – register
- **GET** `/universities` – list
- **GET** `/universities/{id}` – get by ID
- **PUT** `/universities/{id}` – update
- **DELETE** `/universities/{id}` – delete
- **POST** `/universities/{id}/verify` – verify
- **GET** `/universities/{id}/public-key` – fetch public key
