import { useLocation, useNavigate, useParams, Navigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth.jsx";
import QuizResultCard from "../components/QuizResultCard";
import { CheckCircle, XCircle, ChartBar } from "@phosphor-icons/react";
import "../styles/QuizResult.css";

export default function QuizResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const resultData = location.state?.resultData;
  const quizTitle = location.state?.quizTitle;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!resultData) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">No result data found.</div>
        <button
          className="btn btn-qm-primary"
          onClick={() => navigate("/quizzes")}
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const { score, max_score, percentage, results } = resultData;
  const correctCount = results?.filter((r) => r.is_correct).length || 0;
  const incorrectCount = (results?.length || 0) - correctCount;

  // Motivational message based on score
  const getMessage = () => {
    if (percentage >= 80)
      return { text: "Excellent Work! 🎉", sub: "Outstanding performance! You really know your stuff." };
    if (percentage >= 60)
      return { text: "Good Job! 👏", sub: "Nice work! Review the missed questions to improve further." };
    if (percentage >= 40)
      return { text: "Not Bad! 📚", sub: "You're getting there. Review the material and try again." };
    return { text: "Keep Practicing! 💪", sub: "Review the material and try this quiz again. You'll improve with practice." };
  };

  const message = getMessage();

  // Color based on percentage
  const getScoreColor = () => {
    if (percentage >= 80) return "#22c55e";
    if (percentage >= 60) return "#eab308";
    if (percentage >= 40) return "#f97316";
    return "#ef4444";
  };

  return (
    <div className="quiz-result-container">
      <div className="container py-5">
        {/* Score Header */}
        <div className="text-center mb-4">
          <div className="mb-3">
            <ChartBar size={80} weight="bold" color="#f59e0b" />
          </div>
          <h1 className="fw-bold mb-1" style={{ fontSize: "1.8rem" }}>
            Quiz Completed!
          </h1>
          <p className="text-muted" style={{ fontSize: "1rem" }}>
            {quizTitle || "Quiz"}
          </p>
        </div>

        {/* Score Card */}
        <div className="score-card mx-auto mb-4">
          <div
            className="score-percentage"
            style={{ color: getScoreColor() }}
          >
            {percentage}%
          </div>
          <p className="score-detail mb-1">
            {score} out of {max_score} correct
          </p>
        </div>

        {/* Motivation */}
        <div className="text-center mb-5">
          <h3
            className="fw-bold"
            style={{ color: getScoreColor(), fontSize: "1.3rem" }}
          >
            {message.text}
          </h3>
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>
            {message.sub}
          </p>
        </div>

        {/* Stats Row */}
        <div className="stats-row mx-auto mb-5">
          <div className="stat-box">
            <div className="text-start w-100 px-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="stat-label">Correct Answers</span>
                <CheckCircle size={32} weight="bold" style={{ color: "#7c3aed" }} />
              </div>
              <span className="stat-value">{correctCount}</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <div className="text-start w-100 px-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="stat-label">Incorrect Answers</span>
                <XCircle size={32} weight="bold" style={{ color: "#7c3aed" }} />
              </div>
              <span className="stat-value">{incorrectCount}</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <div className="text-start w-100 px-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="stat-label">Accuracy Rate</span>
                <ChartBar size={32} weight="bold" style={{ color: "#7c3aed" }} />
              </div>
              <span className="stat-value">{percentage}%</span>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="question-review mx-auto">
          <h3 className="fw-bold mb-4" style={{ fontSize: "1.25rem" }}>
            Question Review
          </h3>

          <div className="d-flex flex-column gap-3">
            {results?.map((item, idx) => (
              <QuizResultCard key={item.question_id || idx} item={item} />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="d-flex justify-content-center gap-3 mt-5">
          <button
            className="btn btn-outline-secondary px-4 rounded-3"
            onClick={() => navigate("/quizzes")}
          >
            Back to Dashboard
          </button>
          <button
            className="btn btn-qm-primary px-4 rounded-3 d-flex align-items-center gap-2"
            onClick={() => navigate(`/quiz/${id}`)}
          >
            Retake Quiz <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
