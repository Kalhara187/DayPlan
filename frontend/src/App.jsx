import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { TaskProvider } from './context/TaskContext.jsx'
import Landing from './pages/Landing.jsx'
import SignIn from './pages/Signin.jsx'
import SignUp from './pages/Signup.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Home from './pages/Home.jsx'
import Settings from './pages/Settings.jsx'
import DayPlan from './pages/DayPlan.jsx'
import Calendar from './pages/Calendar.jsx'
import Reports from './pages/Reports.jsx'
import MyTasks from './pages/MyTasks.jsx'
import Navbar from './navbar/Navbar.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            {/*  Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/dayplan" element={<DayPlan />} />

            <Route path="/settings" element={<Settings />} />
            <Route path="/tasks" element={<MyTasks />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/reports" element={<Reports />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </ThemeProvider>
  )
}