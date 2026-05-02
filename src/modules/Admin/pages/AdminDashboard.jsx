import { useState } from "react";
import { Navigate } from "react-router-dom";
import QmDashboardNavbar from "../../../shared/components/QmDashboardNavbar";
import StatCard from "../../../shared/components/StatCard";
import DifficultyBadge from "../../../shared/components/DifficultyBadge";
import DashboardHeader from "../../../shared/components/DashboardHeader";
import { useAuth } from "../../../context/useAuth.jsx";

import AdminQuizCard from "../components/AdminQuizCard";
import UsersCard from "../components/UsersCard";
import CreateQuizzModal from "../components/CreateQuizzModal";

import "../../Quiz/styles/QuizzesList.css";
import useQuizzes from "../../Quiz/hooks/useGetQuizzes";
import useCreateQuiz from "../hooks/useCreateQuiz";

// Dummy Data
const dummyUsers = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", role: "Learner", quizzesTaken: 12 },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", role: "Learner", quizzesTaken: 5 },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Learner", quizzesTaken: 8 },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "Learner", quizzesTaken: 15 },
];

// Removed static stats definition to move it inside the component for live data tracking.


export default function AdminDashboard() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { quizzes, loading: quizzesLoading, refetch: refetchQuizzes } = useQuizzes();

  // Live stats based on actual data
  const stats = [
    { label: "Total Users", value: dummyUsers.length, emoji: "👥" },
    { label: "Total Quizzes", value: quizzes.length, emoji: "🗂️" },
    { label: "Active Sessions", value: "12", emoji: "🔥" },
  ];

  const { 
    formData: createQuizFormData, 
    handleChange: handleCreateQuizChange, 
    handleSubmit: handleCreateQuizSubmit, 
    loading: createQuizLoading, 
    error: createQuizError, 
    success: createQuizSuccess 
  } = useCreateQuiz(showCreateModal, () => setShowCreateModal(false), refetchQuizzes);

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
                Manage the {quizzes.length} available quizzes
              </p>
            </div>

            <button
              className="btn-start-quiz d-flex align-items-center justify-content-center gap-2"
              style={{ padding: "0.6rem 1.2rem", width: "auto", cursor: "pointer" }}
              onClick={() => setShowCreateModal(true)}
            >
              <span style={{ fontSize: "1.2rem" }}>+</span> Add New Quiz
            </button>
          </div>

          <div className="row g-4">
            {quizzesLoading ? (
              <div className="text-center py-5 w-100">
                <div className="spinner-border qm-text-purple" role="status"></div>
              </div>
            ) : quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div className="col-12 col-md-6 col-lg-4" key={quiz.id}>
                  <AdminQuizCard quiz={quiz} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p className="qm-text-muted">No quizzes found. Click "Add New Quiz" to get started.</p>
              </div>
            )}
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

      <CreateQuizzModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        formData={createQuizFormData}
        onChange={handleCreateQuizChange}
        onSubmit={handleCreateQuizSubmit}
        loading={createQuizLoading}
        error={createQuizError}
        success={createQuizSuccess}
      />
    </>
  );
}
