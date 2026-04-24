import { Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "./modules/Landing/pages/LandingPage.jsx";
import Login from "./modules/auth/pages/login.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import Register from "./modules/auth/pages/register.jsx";
import QuizzesList from "./modules/Quiz/Pages/QuizzesList.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/quizzes" element={<QuizzesList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
