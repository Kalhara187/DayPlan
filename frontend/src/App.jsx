import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Landing from './pages/Landing.jsx'
import SignIn from './pages/Signin.jsx'
import SignUp from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import Navbar from './navbar/Navbar.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/tasks" element={<><Navbar /><div className="pt-16">Tasks Content</div></>} />
          <Route path="/calendar" element={<><Navbar /><div className="pt-16">Calendar Content</div></>} />
          <Route path="/reports" element={<><Navbar /><div className="pt-16">Reports Content</div></>} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}