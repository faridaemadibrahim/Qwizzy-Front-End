import { Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "./modules/Landing/pages/LandingPage.jsx";
import Login from "./modules/auth/pages/Login.jsx";
import ForgetPassword from "./modules/auth/pages/ForgetPassword.jsx";
import ResetPassword from "./modules/auth/pages/ResetPassword.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import Register from "./modules/auth/pages/Register.jsx";
import VerifyEmail from "./modules/auth/pages/VerifyEmail.jsx";
import QuizzesList from "./modules/Quiz/Pages/QuizzesList.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>

        <Route path="/quizzes" element={<QuizzesList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
