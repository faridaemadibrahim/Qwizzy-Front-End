import { useState } from "react";
import { Navigate } from "react-router-dom";

import QmDashboardNavbar from "../components/QmDashboardNavbar";
import StatCard from "../components/StatCard";
import QuizCard from "../components/QuizCard";
import { useAuth } from "../../../context/AuthContext.jsx";

import { stats, quizzes, difficultyFilters } from "../data/QuizzesContent";

import "../styles/QuizzesList.css";

export default function QuizzesList() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const filtered = quizzes.filter((q) => {
    const matchSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase());
    const matchDiff = filter === "all" || q.difficulty === filter;
    return matchSearch && matchDiff;
  });

  return (
    <>
      <QmDashboardNavbar user={user} />

      <main className="container py-5">
        {/* Welcome */}
        <div className="mb-5">
          <h1 className="fw-bold mb-1" style={{ fontSize: "2rem" }}>
            Welcome back, <span className="qm-text-purple">{user.name}</span>
          </h1>
          <p className="qm-text-muted">
            Continue your learning journey with our curated quizzes
          </p>
        </div>

        {/* Stats */}
        <div className="d-flex flex-wrap gap-3 mb-5">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Section header + filters */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-0" style={{ fontSize: "1.4rem" }}>
              Available Quizzes
            </h2>
            <p className="mb-0 qm-text-muted" style={{ fontSize: "0.88rem" }}>
              Challenge yourself with {quizzes.length} quizzes
            </p>
          </div>

          <div className="d-flex gap-2 flex-wrap align-items-center">
            <input
              type="text"
              className="quizzes-search"
              placeholder="Search quizzes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {difficultyFilters.map((d) => (
              <button
                key={d}
                className={`filter-btn ${filter === d ? "active" : ""}`}
                onClick={() => setFilter(d)}
              >
                {d === "all" ? "All" : d}
              </button>
            ))}
          </div>
        </div>

        {/* Quiz grid */}
        {filtered.length > 0 ? (
          <div className="row g-4">
            {filtered.map((quiz) => (
              <div className="col-12 col-md-6 col-lg-4" key={quiz.id}>
                <QuizCard quiz={quiz} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 quizzes-empty">
            <p className="quizzes-empty-icon">🔍</p>
            <p>No quizzes match your search.</p>
          </div>
        )}
      </main>
    </>
  );
}
