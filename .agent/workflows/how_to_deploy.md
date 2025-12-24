---
description: How to deploy the Sentinel application
---

# Deploying Sentinel

Sentinel consists of two parts:
1.  **Backend**: A Java Spring Boot application.
2.  **Frontend**: A React + Vite application.

You can run them separately for development or package them for production.

## 1. Local Development (Quick Start)

Run the backend and frontend in separate terminals.

### Backend (Port 8080)
```bash
# From project root
./mvnw spring-boot:run
# OR if you have maven installed
mvn spring-boot:run
```

### Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Access the app at `http://localhost:5173`.

---

## 2. Docker Deployment (Backend Only)

The root `Dockerfile` builds the backend service.

### Build Image
```bash
docker build -t sentinel-backend .
```

### Run Container
```bash
docker run -p 8080:8080 sentinel-backend
```

---

## 3. Production Build (Frontend)

To generate static files for production (e.g., to host on Nginx, Vercel, or S3):

```bash
cd frontend
npm run build
```
The build artifacts will be in `frontend/dist`.

---

## 4. Full Stack Deployment (Docker Compose - Recommended)

Create a `docker-compose.yml` in the root (if not exists) to run both:

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod

  frontend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./frontend:/app
    command: sh -c "npm install && npm run dev -- --host"
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

---

## 5. Public / Cloud Deployment

To make Sentinel active for the public, you need to host it on a cloud provider.

### Option A: PaaS (Platform as a Service) - Easiest

### Step 1: Deploy Backend (The Foundation)

We will use **Railway** because it has a free trial and handles Java/Docker easily.

1.  **Sign up** at [railway.app](https://railway.app) (login with GitHub).
2.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
3.  Select your **Sentinel/Loom repository**.
4.  Click **"Add Variables"** before deploying (or go to "Variables" tab after):
    *   **NIXPACKS_PKGS**: `maven jdk17` (This tells Railway to install Java and Maven).
    *   `PORT`: `8080`.
    *   `loom.cors.allowed-origins`: `*` (Set to `*` initially to make it work, then change to your frontend URL later for security).
5.  Click **Deploy**.
6.  Once deployed, go to the **Settings** tab -> **Domains**.
7.  Click **Generated Domain** to get your public backend URL (e.g., `https://sentinel-backend-production.up.railway.app`).
    *   **COPY THIS URL**. You will need it for the frontend.

2.  **Frontend (React):**
    *   Deploy to **Vercel** or **Netlify**.
    *   Connect your GitHub repo and select the `frontend` folder.
    *   Build Command: `npm run build`.
    *   Output Directory: `dist`.
    *   Build Command: `npm run build`.
    *   Output Directory: `dist`.
    *   **CRITICAL STEP:** Go to Settings > Environment Variables for your frontend project.
        *   Add key: `VITE_API_URL`
        *   Add value: `https://loom-production-d02f.up.railway.app/api`
        *   *Without this, the frontend will try to talk to localhost and fail.*

### Option B: VPS (Virtual Private Server) - Cheaper/More Control

1.  Get a Linux VPS (DigitalOcean, Linode, AWS EC2).
2.  Install Docker and Docker Compose.
3.  Clone the repository.
4.  Run `docker-compose up -d`.
5.  Set up **Nginx** as a reverse proxy to forward traffic:
    *   `example.com` -> Frontend Container (Port 5173/80)
    *   `api.example.com` -> Backend Container (Port 8080)
