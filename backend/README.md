# DayPlan Backend

Backend API for DayPlan application with authentication.

## Features

- User Registration (Sign Up)
- User Authentication (Sign In)
- JWT-based authentication
- MongoDB database
- Password hashing with bcrypt
- Input validation
- CORS enabled for frontend integration

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dayplan
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### 1. Sign Up
- **URL:** `/api/auth/signup`
- **Method:** `POST`
- **Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response:** `201 Created`
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "createdAt": "..."
    },
    "token": "jwt_token_here"
  }
}
```

#### 2. Sign In
- **URL:** `/api/auth/signin`
- **Method:** `POST`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "createdAt": "..."
    },
    "token": "jwt_token_here"
  }
}
```

#### 3. Get Current User (Protected)
- **URL:** `/api/auth/me`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Success Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "createdAt": "..."
    }
  }
}
```

#### 4. Health Check
- **URL:** `/api/health`
- **Method:** `GET`
- **Success Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "..."
}
```

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   └── authController.js  # Authentication logic
├── middleware/
│   └── authMiddleware.js  # JWT verification
├── models/
│   └── User.js           # User model
├── routes/
│   └── authRoutes.js     # Auth routes
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
├── server.js             # Entry point
└── README.md
```

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for stateless authentication
- Input validation on all routes
- CORS configured for frontend
- Environment variables for sensitive data

## Error Handling

All errors return a consistent format:
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Notes

- Tokens expire after 7 days (configurable in .env)
- Password minimum length: 6 characters
- Email validation included
- MongoDB connection retry logic implemented
