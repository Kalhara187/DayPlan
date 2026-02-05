import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Landing from './pages/Landing.jsx'
import SignIn from './pages/Signin.jsx'
import SignUp from './pages/Signup.jsx'
import Navbar from './navbar/Navbar.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/landing" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}