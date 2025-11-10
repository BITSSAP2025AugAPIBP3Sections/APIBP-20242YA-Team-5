# Quick Start (5 Minutes)

## Prerequisites
✅ Node.js installed
✅ PostgreSQL installed

## Setup
```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
nano .env  # Set DB_PASSWORD

# 3. Database
createdb verification_db
npm run migrate

# 4. Run
npm run dev
```

## Test
```bash
curl http://localhost:3004/health
```

Done! 🎉
