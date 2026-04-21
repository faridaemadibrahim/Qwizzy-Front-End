import { Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "./modules/landing/pages/LandingPage.jsx";
import Login from "./modules/auth/pages/login.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import Register from "./modules/auth/pages/register.jsx";
export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
