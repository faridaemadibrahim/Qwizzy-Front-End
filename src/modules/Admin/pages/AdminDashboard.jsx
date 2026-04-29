import { useState } from "react";
import { Navigate } from "react-router-dom";
import QmDashboardNavbar from "../../../shared/components/QmDashboardNavbar";
import StatCard from "../../../shared/components/StatCard";
import DifficultyBadge from "../../../shared/components/DifficultyBadge";
import DashboardHeader from "../../../shared/components/DashboardHeader";
import { useAuth } from "../../../context/useAuth.jsx";

import AdminQuizCard from "../components/AdminQuizCard";
import UsersCard from "../components/UsersCard";

import "../../Quiz/styles/QuizzesList.css";

// Dummy Data
const dummyQuizzes = [
  { id: 1, title: "JavaScript Basics", category: "Programming", description: "Test your JS knowledge", questions: 5, duration: 10, difficulty: "easy" },
  { id: 2, title: "React Fundamentals", category: "Web Development", description: "Learn React", questions: 10, duration: 15, difficulty: "medium" },
  { id: 3, title: "Advanced Node.js", category: "Backend", description: "Master Node", questions: 8, duration: 20, difficulty: "hard" },
];

const dummyUsers = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", role: "Learner", quizzesTaken: 12 },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", role: "Learner", quizzesTaken: 5 },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Learner", quizzesTaken: 8 },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "Learner", quizzesTaken: 15 },
];

const stats = [
  { label: "Total Users", value: dummyUsers.length, emoji: "👥" },
  { label: "Total Quizzes", value: dummyQuizzes.length, emoji: "🗂️" },
  { label: "Active Sessions", value: "12", emoji: "🔥" },
];


export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <QmDashboardNavbar user={user} />

      <main className="container py-5">
        <DashboardHeader 
          title="Instructor Dashboard" 
          userName={user.name} 
          description="Manage your quizzes and track user progress" 
        />

        {/* Stats */}
        <div className="d-flex flex-wrap gap-3 mb-5">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Quizzes Section */}
        <div className="mb-5">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h2 className="fw-bold mb-0" style={{ fontSize: "1.4rem" }}>
                All Quizzes
              </h2>
              <p className="mb-0 qm-text-muted" style={{ fontSize: "0.88rem" }}>
                Manage the {dummyQuizzes.length} available quizzes
              </p>
            </div>

            <button className="btn-start-quiz d-flex align-items-center justify-content-center gap-2" style={{ padding: "0.6rem 1.2rem", width: "auto", cursor: "pointer" }}>
              <span style={{ fontSize: "1.2rem" }}>+</span> Add New Quiz
            </button>
          </div>

          <div className="row g-4">
            {dummyQuizzes.map((quiz) => (
              <div className="col-12 col-md-6 col-lg-4" key={quiz.id}>
                <AdminQuizCard quiz={quiz} />
              </div>
            ))}
          </div>
        </div>

        {/* Users Section */}
        <div>
          <div className="mb-4">
            <h2 className="fw-bold mb-0" style={{ fontSize: "1.4rem" }}>
              All Users
            </h2>
            <p className="mb-0 qm-text-muted" style={{ fontSize: "0.88rem" }}>
              Registered students in the platform
            </p>
          </div>

          <div className="row g-4">
            {dummyUsers.map((u) => (
              <div className="col-12 col-md-6 col-lg-3" key={u.id}>
                <UsersCard user={u} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
