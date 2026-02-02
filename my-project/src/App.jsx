import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import SignIn from './pages/signin.jsx'
import SignUp from './pages/signup.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}