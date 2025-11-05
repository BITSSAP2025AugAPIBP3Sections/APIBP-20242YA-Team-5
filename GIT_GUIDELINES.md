# Git Commit Guidelines

##  What to Commit (Safe to push to GitHub)

### Source Code
- `backend/*/src/` - All TypeScript source files
- `frontend/*/src/` - All React/TypeScript source files
- `docs/` - All documentation files
- `*.md` - Documentation files (README, guides, etc.)

### Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `docker-compose.yml` - Development environment setup
- `.gitignore` - Git ignore rules

### Project Structure
- `PROJECT_STRUCTURE.md` - Architecture documentation
- `RUNNING_THE_APP.md` - Setup instructions
- API documentation in `docs/api/`

##  What NOT to Commit (Ignored by .gitignore)

### Environment Files
- `.env` - Contains secrets and local configuration
- `.env.local`, `.env.production` - Environment-specific configs

### Dependencies
- `node_modules/` - All npm packages (will be installed via `npm install`)
- `package-lock.json` - Lock file (some prefer to commit this, others don't)

### Build Outputs
- `dist/`, `build/` - Compiled TypeScript/JavaScript
- `*.tsbuildinfo` - TypeScript build cache

### System Files
- `.DS_Store` - macOS system files
- `Thumbs.db` - Windows system files
- IDE configuration (`.vscode/`, `.idea/`)

### Sensitive Data
- Database files (`*.sqlite`, `*.db`)
- Certificate files (`*.pem`, `*.key`, `*.crt`)
- Log files (`*.log`)

##  Before Pushing to Git

### 1. Check Git Status
```bash
git status
```

### 2. Review What Will Be Committed
```bash
git diff --cached
```

### 3. Make Sure No Secrets Are Included
Check that no `.env` files or sensitive data will be committed:
```bash
# This should NOT show any .env files
git ls-files | grep -E '\\.env'
```

### 4. Test the Build
Make sure your code compiles:
```bash
# From api-gateway
cd backend/api-gateway
npm run build

# From auth-service  
cd backend/auth-service
npm run build
```

##  Recommended Commit Structure

### First Commit (Initial Setup)
```bash
git add .
git commit -m "Initial project setup: API Gateway + Auth Service

- Add microservices architecture with API Gateway
- Implement JWT-based authentication service
- Add comprehensive API documentation (OpenAPI 3.0.3)
- Set up Docker development environment
- Add project structure and documentation"
```

### Subsequent Commits
```bash
# Add specific services
git commit -m "feat: implement University service with CRUD operations"

# Add features
git commit -m "feat: add email verification to auth service"

# Fix bugs
git commit -m "fix: resolve JWT token validation issue"

# Update docs
git commit -m "docs: update API examples and setup guide"
```

##  Security Checklist Before Push

- [ ] No `.env` files are being committed
- [ ] No hardcoded passwords or API keys in source code
- [ ] No database files or dumps
- [ ] No private certificates or keys
- [ ] JWT secrets are in environment variables only
- [ ] All sensitive config is in `.env` (which is ignored)

## 🔄 Team Development Workflow

### 1. Clone the Repository
```bash
git clone <repository-url>
cd APIBP-20242YA-Team-5
```

### 2. Install Dependencies
```bash
npm install
cd backend/api-gateway && npm install
cd ../auth-service && npm install
```

### 3. Set Up Environment
```bash
# Copy and configure environment files
cp backend/api-gateway/.env.example backend/api-gateway/.env
cp backend/auth-service/.env.example backend/auth-service/.env
```

### 4. Start Development
```bash
# Start API Gateway
cd backend/api-gateway && npm run dev

# In another terminal, start Auth Service
cd backend/auth-service && npm run dev
```

This way, each team member can:
1. Clone the repository
2. Install dependencies with `npm install`
3. Set up their own `.env` files with their local configuration
4. Start developing without conflicts