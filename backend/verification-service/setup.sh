#!/bin/bash

echo "�� Setting up Verification Service..."

npm install
cp .env.example .env
echo "📝 Please edit .env with your database password"
createdb -U postgres verification_db 2>/dev/null || echo "Database exists"
npm run migrate

echo "✅ Setup complete!"
echo "Run: npm run dev"
