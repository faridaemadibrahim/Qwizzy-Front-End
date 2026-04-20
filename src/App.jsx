import { Navigate, Route, Routes } from 'react-router-dom'

import LandingPage from './modules/landing/pages/LandingPage.jsx'
import Login from './modules/auth/pages/login.jsx'
import RootLayout from './layouts/RootLayout.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
