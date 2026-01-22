# ORS Tracker - Role-Based Vehicle Operational Roadworthiness System

A full-stack MERN application for tracking vehicle Operational Roadworthiness Scores (ORS) with JWT authentication and role-based access control.

## How to Run

### Backend

```bash
cd server
npm install
npm run dev
```

The server will start on `http://localhost:5000`

### Frontend

```bash
cd client
npm install
npm run dev
```

The client will start on `http://localhost:5173`

## Sample Credentials

### Admin Account

- **Email**: `admin@ors.com`
- **Password**: `admin123`
- **Permissions**: Full CRUD access to all ORS plans

### Inspector Account

- **Email**: `inspector@ors.com`
- **Password**: `inspector123`
- **Permissions**: Create ORS plans, edit/delete own plans only

### Viewer Account

- **Email**: `viewer@ors.com`
- **Password**: `viewer123`
- **Permissions**: Read-only access to all ORS plans

2. **Install server dependencies**

```bash
cd server
npm install
```

3. **Install client dependencies**

```bash
cd ../client
npm install
```

4. **Configure environment variables**

Server `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ors-tracker
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Client `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Seed the database with admin user**

```bash
cd server
npm run seed
```

This creates:

- Email: `admin@ors.com`
- Password: `admin123`
- Role: `admin`

### Running the Application

1. **Start the backend server** (from server directory):

```bash
npm run dev
```

Server runs on http://localhost:5000

2. **Start the frontend client** (from client directory):

```bash
npm run dev
```

Client runs on http://localhost:5173

3. **Access the application**

- Open http://localhost:5173 in your browser
- Login with admin credentials or register a new user

## User Roles & Permissions

### Admin

- Full CRUD access to all ORS plans
- Can view all statistics
- Can edit/delete any plan

### Inspector

- Can create new ORS plans
- Can edit/delete only their own plans
- Can view all plans and statistics

### Viewer

- Read-only access
- Can view all plans and statistics
- Cannot create, edit, or delete

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### ORS Management

- `GET /api/ors` - Get all ORS plans (with optional filters)
- `GET /api/ors/:id` - Get single ORS plan
- `POST /api/ors` - Create ORS plan (Admin/Inspector)
- `PUT /api/ors/:id` - Update ORS plan (Admin/Owner)
- `DELETE /api/ors/:id` - Delete ORS plan (Admin/Owner)
- `GET /api/ors/stats` - Get statistics

## Project Structure

```
fb international/
├── server/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── scripts/        # Seed scripts
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Validators, helpers
│   │   └── index.ts        # Entry point
│   ├── .env
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context providers
│   │   ├── features/       # Feature-based modules
│   │   │   ├── auth/       # Authentication
│   │   │   └── ors/        # ORS management
│   │   ├── lib/            # API client, utilities
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Router setup
│   │   └── main.tsx        # Entry point
│   ├── .env
│   └── package.json
```

## Key Features Explained

### Score Color Coding

- **Green** (≥80%): Good roadworthiness score
- **Yellow** (60-79%): Moderate score, attention needed
- **Red** (<60%): Poor score, immediate action required

### Dynamic Forms

- Add/remove text document entries dynamically
- Form validation with Zod schemas
- Optimistic updates for better UX

### Dashboard Charts

- Bar chart for traffic score distribution
- Pie chart for grade breakdown
- Real-time statistics cards

## Development

### Server Scripts

```bash
npm run dev      # Development mode with hot reload
npm run build    # Build for production
npm run start    # Start production server
npm run seed     # Seed admin user
```

### Client Scripts

```bash
npm run dev      # Development mode
npm run build    # Build for production
npm run preview  # Preview production build
```
