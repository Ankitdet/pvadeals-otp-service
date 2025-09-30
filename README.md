# PVADeals OTP Service Simulations

PVADeals OTP (One-Time Password) backend built with **Node.js**, **TypeScript**, **Express**, and **Redis**.  

This service generates and verifies 6-digit OTP codes with a 2-minute expiry.  
It includes **structured logging** with `pino` and request tracing via `requestId`.

---

## ✨ Features

- **POST /api/send-otp** → Generates a random 6-digit OTP, stores in Redis (TTL = 2 min).  
- **POST /api/verify-otp** → Verifies OTP against Redis store and deletes if valid.  
- **Structured logging** with `pino` and `requestId` for request tracing.  
- Every response includes:
  - `requestId` → unique per request
  - `timestamp` → server time in ISO format

---

## 📂 Project Structure

```
project-root/
├── src/
│   ├── config/        # Redis connection settings
│   ├── middleware/    # Logging middleware with requestId
│   ├── routes/        # OTP endpoints
│   ├── server.ts      # Express app
│   └── handler.ts     # Lambda wrapper (optional)
├── docker-compose.yml # Run API + Redis locally
├── Dockerfile         # Container build for API
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚡ Prerequisites

- [Node.js 18+](https://nodejs.org/)  
- [Docker](https://docs.docker.com/get-docker/)

---

## 🚀 Setup (Local Development)

1. Install dependencies:

```bash
npm install
```

2. Start Redis (example using Docker):

```bash
docker run -d -p 6379:6379 redis:7-alpine
```

3. Start the API:

```bash
npm run dev
```

---

## 🧪 Test Endpoints

**Send OTP**

```bash
curl -X POST http://localhost:3000/api/send-otp \
     -H "Content-Type: application/json" \
     -d '{"phone":"1234567890"}'
```

**Verify OTP**

```bash
curl -X POST http://localhost:3000/api/verify-otp \
     -H "Content-Type: application/json" \
     -d '{"phone":"1234567890", "otp":"123456"}'
```

---

## 🐳 Setup (With Docker Compose)

1. Build and start services:

```bash
docker compose up --build
```

2. API will be available at:

```
http://localhost:3000/api/send-otp
http://localhost:3000/api/verify-otp
```

3. Redis will be available on `localhost:6379`.

4. Stop services:

```bash
docker compose down -v
```

---

## 📌 Notes

- Ensure Redis is running before starting the API.  
- Responses include `requestId` and `timestamp` for traceability.  
- For production, use a managed Redis service instead of local Redis.
