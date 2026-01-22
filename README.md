# ORS Tracker - Vehicle Operational Roadworthiness System

A full-stack MERN application for tracking vehicle Operational Roadworthiness Scores with role-based access control.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to project folder
cd Role-Based-ORS-Tracker-with-Authentication

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

**Backend** (`server/.env`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ors-tracker
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloud-api-key
CLOUDINARY_API_SECRET=your-cloud-api-secret
```

**Frontend** (`client/.env`):

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database (First Time Only)

```bash
# From server directory
npm run seed
```

This creates 3 users and 5 sample ORS plans.

### 4. Start Development Servers

**Terminal 1 - Backend:**

```bash
# From server directory
npm run dev
```

Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
# From client directory
npm run dev
```

Client runs on `http://localhost:5173`

### 5. Login with Sample Credentials

| Role          | Email             | Password     | Permissions                         |
| ------------- | ----------------- | ------------ | ----------------------------------- |
| **Admin**     | admin@ors.com     | admin123     | Full access to all ORS plans        |
| **Inspector** | inspector@ors.com | inspector123 | Create plans, edit/delete own plans |
| **Viewer**    | viewer@ors.com    | viewer123    | Read-only access                    |

## Features

- ✅ JWT Authentication & Authorization
- ✅ Role-based Access Control (Admin, Inspector, Viewer)
- ✅ CRUD Operations for ORS Plans
- ✅ Dashboard with Analytics & Charts
- ✅ File Upload Support (Cloudinary - optional)
- ✅ Responsive Mobile UI
- ✅ Real-time Data Updates

## Tech Stack

**Backend:** Node.js, Express, TypeScript, MongoDB, JWT  
**Frontend:** React 19, TypeScript, Vite, TanStack Query, Tailwind CSS, Recharts
