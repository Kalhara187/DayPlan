# DayPlan - Day Planning Application

A full-stack web application for planning and managing your daily tasks with user authentication.

## 🚀 Features

- **User Authentication**
  - Sign up with email and password
  - Sign in with JWT token-based authentication
  - Secure password hashing
  - Form validation

- **Modern UI**
  - Responsive design with Tailwind CSS
  - Dark mode support
  - Beautiful gradients and animations
  - Mobile-friendly interface

## 📁 Project Structure
DayPlan/
├── backend/ # Node.js + Express backend
│ ├── config/ # Database configuration
│ ├── controllers/ # Request handlers
│ ├── middleware/ # Auth middleware
│ ├── models/ # MongoDB models
│ ├── routes/ # API routes
│ ├── .env # Environment variables
│ ├── .env.example # Environment template
│ └── server.js # Entry point
│
└── frontend/ # React + Vite frontend
├── public/
├── src/
│ ├── assets/
│ ├── components/ # Reusable components
│ ├── context/ # React Context
│ ├── navbar/ # Navigation components
│ ├── pages/ # Page components
│ │ ├── Landing.jsx
│ │ ├── Signin.jsx
│ │ └── Signup.jsx
│ ├── services/ # API services
│ │ └── api.js
│ ├── App.jsx
│ └── main.jsx
└── package.json

## 🛠️ Technologies Used

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin support

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend

Install dependencies:
    *npm install
Start MongoDB (if running locally):
    # Windows
net start MongoDB

    # Mac/Linux
sudo systemctl start mongod

Start the backend server:
    # Development mode with auto-reload
npm run dev

    # Production mode
npm start

Frontend Setup
    cd frontend
    npm install
    npm run dev

🎨 Frontend Features
import { authAPI } from '../services/api';

// Sign up
await authAPI.signup({ fullName, email, password });

// Sign in
await authAPI.signin({ email, password });

// Get current user
await authAPI.getMe();

// Check if authenticated
const isAuth = authAPI.isAuthenticated();

// Get stored user
const user = authAPI.getStoredUser();

// Logout
authAPI.logout();

🔒 Security Features
✅ Passwords hashed with bcrypt (salt rounds: 10)
✅ JWT tokens for stateless authentication
✅ Token expiration (7 days default)
✅ Input validation on all routes
✅ Password minimum length: 6 characters
✅ Email format validation
✅ Protected routes with middleware
✅ CORS enabled for frontend
✅ Environment variables for secrets

📝 Usage
Start MongoDB (if running locally)
Start Backend: cd backend && npm run dev
Start Frontend: cd frontend && npm run dev
Open Browser: Navigate to http://localhost:5173
Sign Up: Create a new account
Sign In: Login with your credentials
Authenticated: JWT token stored in localStorage

🚧 Development
npm start      # Start production server
npm run dev    # Start development server with nodemon

npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build

🐛 Troubleshooting
MongoDB Connection Issues
Ensure MongoDB is running: mongosh to test connection
Check MONGODB_URI in .env file
For MongoDB Atlas, ensure IP whitelist is configured
CORS Errors
Verify backend is running on port 5000
Check CORS configuration in server.js
Ensure frontend origin matches: http://localhost:5173
Authentication Issues
Clear localStorage: localStorage.clear()
Check if JWT_SECRET is set in .env
Verify token format in request headers
📄 License
This project is open source and available under the MIT License.

👥 Contributing
Fork the repository
Create your feature branch: git checkout -b feature/AmazingFeature
Commit your changes: git commit -m 'Add some AmazingFeature'
Push to the branch: git push origin feature/AmazingFeature
Open a pull request


📧 Contact
For questions or support, please open an issue on the GitHub repository.

Built with ❤️ using React, Node.js, and MongoDB

This README includes:
- Complete project overview
- Installation instructions for both frontend and backend
- API endpoint documentation
- Security features
- Troubleshooting guide
- Usage examplesThis README includes:
- Complete project overview
- Installation instructions for both frontend and backend
- API endpoint documentation
- Security features
- Troubleshooting guide
- Usage examples
