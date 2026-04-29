# STEP 2: DOCKER SETUP 🐳

## Overview

This step creates Docker containers for your application so it can run consistently everywhere:
- **Backend**: Node.js + Express + TypeScript in a container
- **Frontend**: React + Vite built and served by Nginx
- **Database**: PostgreSQL for local development

---

## What You'll Have After This Step

✅ Backend Docker image (optimized multi-stage build)
✅ Frontend Docker image (Nginx serving SPA)
✅ docker-compose.yml for local testing
✅ All containers running locally before AWS deployment
✅ Ready to push to AWS ECR (Elastic Container Registry)

---

## Part 1: Install Docker 

### Windows - Docker Desktop

1. **Download Docker Desktop:**
   - Go to: https://www.docker.com/products/docker-desktop
   - Click "Download for Windows"

2. **Install Docker Desktop:**
   - Run the installer (.exe file)
   - Follow the setup wizard
   - Choose "Install required Windows components for WSL 2"
   - Restart your computer when prompted

3. **Verify Installation:**
   - Open PowerShell
   - Run:
     ```powershell
     docker --version
     docker run hello-world
     ```
   - You should see Docker version and "Hello from Docker!" message

### macOS - Docker Desktop

1. **Download Docker Desktop:**
   - Go to: https://www.docker.com/products/docker-desktop
   - Click "Download for Mac"

2. **Install Docker Desktop:**
   - Drag Docker.app to Applications folder
   - Open Applications → Docker
   - Complete setup

3. **Verify Installation:**
   ```bash
   docker --version
   docker run hello-world
   ```

### Linux (Ubuntu/Debian)

```bash
# Install Docker
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Start Docker
sudo systemctl start docker

# Verify
docker --version
```

✅ **When done:** `docker --version` shows version number

---

## Part 2: Build Docker Images Locally

### Step 2.1: Navigate to Project Directory

```powershell
cd "C:\Users\Harshal Shah\Documents\Coding\WebDev\projects\medium"
```

### Step 2.2: Build Backend Image

```powershell
docker build -f backend/Dockerfile -t blogify-backend:latest .
```

**What this does:**
- Reads the `backend/Dockerfile`
- Compiles TypeScript to JavaScript
- Creates a production-optimized image
- Tags it as `blogify-backend:latest`

**Wait for:** "Successfully tagged blogify-backend:latest"

### Step 2.3: Build Frontend Image

```powershell
docker build -f frontend/Dockerfile -t blogify-frontend:latest .
```

**What this does:**
- Reads the `frontend/Dockerfile`
- Builds the React app with Vite
- Sets up Nginx to serve the files
- Tags it as `blogify-frontend:latest`

**Wait for:** "Successfully tagged blogify-frontend:latest"

### Step 2.4: Verify Images Built

```powershell
docker images
```

**You should see:**
```
blogify-backend    latest    ____________    123MB
blogify-frontend   latest    ____________    45MB
```

✅ **When done:** Both images are listed

---

## Part 3: Run with Docker Compose

### Step 3.1: Create Environment File (Optional)

Create a `.env` file in your project root:

```
DB_USER=neondb_owner
DB_PASSWORD=password
DB_NAME=neondb
JWT_SECRET=your-jwt-secret-here
```

**Or** use default values in docker-compose.yml

### Step 3.2: Start All Services

```powershell
docker-compose up -d
```

**What this does:**
- `-d` = detached mode (runs in background)
- Starts 3 containers:
  1. PostgreSQL database (port 5432)
  2. Backend Express server (port 3000)
  3. Frontend Nginx server (port 5173)

**Wait for:** "done" message

### Step 3.3: Check Running Containers

```powershell
docker-compose ps
```

**You should see:**
```
NAME                STATUS              PORTS
blogify-postgres    Up (healthy)        5432
blogify-backend     Up (healthy)        3000
blogify-frontend    Up (healthy)        5173
```

### Step 3.4: View Logs

```powershell
# All logs
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Exit logs: Press Ctrl+C
```

✅ **When done:** All 3 containers are running and healthy

---

## Part 4: Test the Application

### Step 4.1: Access the Application

**Frontend:**
- Open: http://localhost:5173
- You should see your blog application

**Backend API:**
- Test: http://localhost:3000/health
- You should see: `{"status":"ok","database":"connected","timestamp":"..."}`

**Database:**
- Connect via: `localhost:5432`
- Username: `neondb_owner` (or DB_USER)
- Password: `password` (or DB_PASSWORD)

### Step 4.2: Run Database Migrations

```powershell
# Run inside backend container
docker-compose exec backend npx prisma migrate deploy
```

**Or reset database:**

```powershell
docker-compose exec backend npx prisma migrate reset --force
```

### Step 4.3: Test Backend API

```powershell
# Health check
curl http://localhost:3000/health

# If you have test data, try:
curl http://localhost:3000/api/v1/user/profile
```

✅ **When done:** Application is running, frontend loads, API responds

---

## Part 5: Useful Docker Commands

### Container Management

```powershell
# Stop all containers
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart services
docker-compose restart

# Rebuild images and start
docker-compose up --build

# View running containers
docker ps

# View all containers
docker ps -a
```

### Debugging

```powershell
# Shell into backend container
docker-compose exec backend sh

# Shell into frontend container
docker-compose exec frontend sh

# View container logs
docker logs -f blogify-backend

# Inspect container
docker inspect blogify-backend
```

### Cleanup

```powershell
# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove stopped containers
docker container prune
```

---

## Part 6: Fix Common Issues

| Problem | Solution |
|---------|----------|
| **Docker not found** | Install Docker Desktop (Part 1) |
| **Port 5432 already in use** | Change port in docker-compose.yml: `"5433:5432"` |
| **Port 3000 already in use** | Change port in docker-compose.yml: `"3001:3000"` |
| **Port 5173 already in use** | Change port in docker-compose.yml: `"5174:80"` |
| **Container crashes** | Run `docker-compose logs backend` to see error |
| **Database connection failed** | Ensure postgres is healthy: `docker-compose ps` |
| **Frontend shows error** | Clear cache: `docker-compose down -v` then restart |
| **Permission denied** | Run PowerShell as Administrator |

---

## Part 7: Verify Everything Works

**Checklist:**

- [ ] Docker installed (`docker --version` works)
- [ ] Backend image built (`docker images` shows blogify-backend)
- [ ] Frontend image built (`docker images` shows blogify-frontend)
- [ ] docker-compose.yml exists in project root
- [ ] All 3 containers running (`docker-compose ps` shows healthy)
- [ ] Frontend loads at http://localhost:5173
- [ ] Backend responds at http://localhost:3000/health
- [ ] Database migrations completed
- [ ] No error logs in `docker-compose logs`

---

## 📁 Files Created in This Step

```
project-root/
├── backend/
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── docker-compose.yml
└── .github/
    └── STEP2_DOCKER_SETUP.md (this file)
```

---

## 🚀 Next: Step 3

When this step is complete:
1. Reply with confirmation
2. Show output of `docker-compose ps`
3. Tell me if you hit any issues

Then we'll move to **Step 3: Build Docker Workflows** which will:
- Automatically build images on git push
- Push to AWS ECR (Elastic Container Registry)
- Store images for deployment

---

## ✅ STEP 2 COMPLETE CHECKLIST

- [ ] Docker Desktop installed
- [ ] Backend image built
- [ ] Frontend image built
- [ ] docker-compose.yml configured
- [ ] All 3 containers running
- [ ] Frontend accessible at http://localhost:5173
- [ ] Backend responding at http://localhost:3000/health
- [ ] Database migrations completed
- [ ] No errors in logs

---

## When You're Done

Reply with:
```
✅ STEP 2 COMPLETE!

Docker: ✅ Desktop installed
Images: ✅ Backend & Frontend built
Containers: ✅ All running and healthy
Frontend: ✅ Accessible at http://localhost:5173
Backend: ✅ Responding at http://localhost:3000/health
Database: ✅ PostgreSQL connected

Ready for Step 3: Docker Push Workflows! 🚀
```

---

## 📞 Need Help?

If stuck:
1. Tell me what step you're on
2. Share error message
3. Run and share output of:
   ```powershell
   docker-compose ps
   docker-compose logs
   ```

I'll help immediately!

