# 📅 DayPlan - Smart Task Management Application

A modern full-stack web application for planning and managing your daily tasks with email notifications, productivity tracking, and intelligent scheduling.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Features

### 🔐 User Authentication & Authorization
- Secure user registration and login system
- JWT token-based authentication
- Password encryption with bcrypt
- Password reset functionality via email
- Protected routes and API endpoints

### ✅ Task Management
- Create, read, update, and delete tasks
- Set task priorities (Low, Medium, High)
- Task categories and tags
- Due date and time tracking
- Task completion status
- Recurring tasks support

### 📊 Dashboard & Analytics
- Real-time task statistics
  - Today's tasks count
  - Completed tasks tracking
  - Upcoming tasks overview
  - Productivity score calculation
- Recent tasks activity feed
- Visual progress indicators

### 📧 Email Notifications
- Daily task reminders
- Test email functionality
- Password reset emails
- Automated notification scheduling
- Gmail SMTP integration with retry logic

### 📆 Calendar View
- Monthly calendar interface
- Task visualization by date
- Drag-and-drop task scheduling
- Date-based filtering

### 📈 Reports & Insights
- Task completion reports
- Productivity analytics
- Time tracking
- Performance metrics

### ⚙️ User Settings
- Profile management (name, email, avatar)
- Password change functionality
- Notification preferences
- Email notification toggles
- Task reminder settings
- Account deletion option

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark mode / Light mode toggle
- Beautiful gradients and animations
- Tailwind CSS styling
- Mobile-friendly interface

### 🤖 Additional Features
- Health Bot assistant
- Theme customization
- Accessibility support

---

## 🛠️ Technologies Used

### Frontend
- **React 19** - Modern UI library
- **Vite** - Lightning-fast build tool
- **React Router DOM v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Context API** - State management
- **Date-fns** - Date manipulation library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **Sequelize** - ORM for MySQL
- **JWT (jsonwebtoken)** - Authentication tokens
- **Bcrypt** - Password hashing
- **Nodemailer** - Email sending
- **Node-cron** - Task scheduling
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

---

## 📁 Project Structure

```
DayPlan/
├── backend/
│   ├── config/
│   │   ├── database.js          # Sequelize configuration
│   │   ├── db.js                # Database connection
│   │   └── db-fallback.js       # Fallback DB config
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── taskController.js    # Task CRUD operations
│   │   ├── userController.js    # User profile management
│   │   └── notificationController.js
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification
│   ├── models/
│   │   ├── index.js             # Model aggregator
│   │   ├── User.js              # User model (Sequelize)
│   │   └── Task.js              # Task model (Sequelize)
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── taskRoutes.js        # Task endpoints
│   │   ├── userRoutes.js        # User endpoints
│   │   └── notificationRoutes.js
│   ├── services/
│   │   ├── emailService.js      # Email sending logic
│   │   └── taskScheduler.js     # Task scheduling
│   ├── scripts/
│   │   ├── setupDatabase.js     # Database initialization
│   │   ├── testEmail.js         # Email testing
│   │   ├── checkEmailConnection.js
│   │   └── allowFirewall.bat    # Firewall configuration
│   ├── .env                      # Environment variables
│   ├── server.js                # Application entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Footer.jsx
    │   │   ├── HealthBot.jsx
    │   │   └── Themetoggle.jsx
    │   ├── context/
    │   │   ├── TaskContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── navbar/
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── Landing.jsx       # Landing page
    │   │   ├── Signin.jsx        # Login page
    │   │   ├── Signup.jsx        # Registration page
    │   │   ├── Home.jsx          # Dashboard
    │   │   ├── DayPlan.jsx       # Daily planner
    │   │   ├── MyTasks.jsx       # Task list
    │   │   ├── Calendar.jsx      # Calendar view
    │   │   ├── Reports.jsx       # Analytics
    │   │   ├── Settings.jsx      # User settings
    │   │   ├── ForgotPassword.jsx
    │   │   └── ResetPassword.jsx
    │   ├── services/
    │   │   └── api.js            # API service layer
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── public/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 📦 Installation

### Prerequisites
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** or **yarn** package manager
- Gmail account (for email notifications)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/dayplan.git
cd dayplan
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dayplan_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Email Development Settings
SKIP_EMAIL_VERIFY=true

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### Setup Gmail App Password
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification → App passwords
3. Generate an app password for "Mail"
4. Copy the 16-character password to `EMAIL_PASSWORD` in `.env`

#### Initialize Database
```bash
node scripts/setupDatabase.js
```

#### Start Backend Server
```bash
# Development mode with auto-reload
npm start

# The server will run on http://localhost:5000
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Start Development Server
```bash
npm run dev

# The app will open at http://localhost:5173
```

---

## 🚀 Usage

1. **Start Backend**: `cd backend && npm start`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Open Browser**: Navigate to `http://localhost:5173`
4. **Sign Up**: Create a new account
5. **Verify Email**: Check your inbox for verification (if enabled)
6. **Sign In**: Login with your credentials
7. **Start Planning**: Create tasks, set priorities, and manage your day!

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /signup            - Register new user
POST   /signin            - Login user
POST   /forgot-password   - Request password reset
POST   /reset-password    - Reset password with token
GET    /me                - Get current user profile
```

### Task Routes (`/api/tasks`) - Protected
```
GET    /                  - Get all user tasks
GET    /:id               - Get single task
POST   /                  - Create new task
PUT    /:id               - Update task
DELETE /:id               - Delete task
GET    /today             - Get today's tasks
GET    /completed         - Get completed tasks
GET    /upcoming          - Get upcoming tasks
```

### User Routes (`/api/users`) - Protected
```
GET    /profile           - Get user profile
PUT    /profile           - Update user profile
PUT    /password          - Change password
PUT    /notifications     - Update notification settings
PUT    /preferences       - Update user preferences
DELETE /account           - Delete user account
```

### Notification Routes (`/api/notifications`) - Protected
```
POST   /test              - Send test email
GET    /settings          - Get notification settings
PUT    /settings          - Update notification settings
```

---

## 🔒 Security Features

✅ **Password Security**
- Bcrypt hashing with salt rounds
- Minimum password length: 6 characters
- Password complexity validation

✅ **Authentication**
- JWT token-based authentication
- Token expiration (7 days default)
- Refresh token support
- Protected API routes

✅ **Data Validation**
- Input sanitization
- Email format validation
- SQL injection prevention (Sequelize ORM)
- XSS protection

✅ **API Security**
- CORS enabled for specific origins
- Rate limiting (optional)
- Environment variable protection
- Secure HTTP headers

---

## 🐛 Troubleshooting

### Email Notifications Not Working

**Issue**: Test email returns "Connection timeout"

**Solution**: Windows Firewall may be blocking SMTP ports

1. Open `backend/scripts/allowFirewall.bat` as **Administrator**
2. Right-click → "Run as administrator"
3. Click "Yes" on UAC prompt
4. Restart backend server
5. Test email again

**Alternative**: Check antivirus software (Norton, McAfee, Avast) and add exception for Node.js

### Database Connection Issues

**Error**: "Access denied for user 'root'@'localhost'"

**Solution**:
```bash
# Verify MySQL is running
mysql -u root -p

# Update .env with correct credentials
DB_USER=root
DB_PASSWORD=your_actual_password
```

**Error**: "Unknown database 'dayplan_db'"

**Solution**:
```bash
# Run setup script
node scripts/setupDatabase.js
```

### Port Already in Use

**Error**: "Port 5000 is already in use"

**Solution**:
```powershell
# Windows: Find and kill process
netstat -ano | findstr :5000
taskkill /F /PID <process_id>

# Or change port in .env
PORT=5001
```

### CORS Errors

**Issue**: Frontend can't connect to backend

**Solution**:
- Verify backend is running on port 5000
- Check `FRONTEND_URL` in backend `.env`
- Ensure CORS is configured in `server.js`

### Authentication Issues

**Issue**: "Invalid token" or logout loops

**Solution**:
```javascript
// Clear browser storage
localStorage.clear()
sessionStorage.clear()

// Check JWT_SECRET in .env matches
```

---

## 🧪 Testing

### Test Email Service
```bash
cd backend
node scripts/testEmail.js
```

### Test Database Connection
```bash
node scripts/checkEmailConnection.js
```

---

## 🎯 Production Deployment

### Backend Deployment

1. **Environment Variables**
```env
NODE_ENV=production
SKIP_EMAIL_VERIFY=false
```

2. **Database Migration**
```bash
npm run migrate
```

3. **Start Production Server**
```bash
npm start
```

### Frontend Deployment

1. **Build for Production**
```bash
npm run build
```

2. **Preview Build**
```bash
npm run preview
```

3. **Deploy** to Vercel, Netlify, or your preferred hosting

---

## 📚 Documentation Files

- `MYSQL_MIGRATION.md` - Database migration guide
- `SEQUELIZE_QUERY_REFERENCE.md` - Sequelize query examples
- `SETUP_COMPLETE.md` - Initial setup documentation
- `SETTINGS_PAGE_STATUS.md` - Settings page functionality

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a pull request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

Built with ❤️ using React, Node.js, MySQL, and Sequelize

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for beautiful styling
- Sequelize for powerful ORM
- Nodemailer for email functionality
- All open-source contributors

---

## 📞 Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting guide above

---

**Happy Planning! 📅✨**
