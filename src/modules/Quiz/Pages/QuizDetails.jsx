import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useGetQuizById from "../hooks/useGetQuizById";
import useSubmitQuiz from "../hooks/useSubmitQuiz";
import { useAuth } from "../../../context/useAuth.jsx";
import "../styles/QuizPlay.css";

export default function QuizDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { quiz, loading, error } = useGetQuizById(id);
  const { handleSubmit: submitQuiz, loading: submitting } = useSubmitQuiz();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default

  useEffect(() => {
    if (quiz?.duration) {
      setTimeLeft(quiz.duration * 60);
    }
  }, [quiz]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="spinner-border qm-text-purple" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error || "Quiz not found."}</div>
        <button
          className="btn btn-qm-primary"
          onClick={() => navigate("/quizzes")}
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  // Fallback questions if none provided by API yet
  const questions =
    quiz.questionsList?.length > 0
      ? quiz.questionsList
      : [
          {
            id: 1,
            text: "What is the correct syntax to declare a variable in JavaScript?",
            type: "Multiple Choice",
            options: [
              "var x = 5;",
              "variable x = 5;",
              "v x = 5;",
              "declare x = 5;",
            ],
          },
          {
            id: 2,
            text: "Which company developed JavaScript?",
            type: "Multiple Choice",
            options: ["Netscape", "Microsoft", "Sun Microsystems", "Oracle"],
          },
          {
            id: 3,
            text: "Which of the following is a JavaScript data type?",
            type: "Multiple Choice",
            options: ["String", "Number", "Boolean", "All of the above"],
          },
          {
            id: 4,
            text: "How do you write 'Hello World' in an alert box?",
            type: "Multiple Choice",
            options: [
              "msgBox('Hello World');",
              "alert('Hello World');",
              "msg('Hello World');",
              "alertBox('Hello World');",
            ],
          },
          {
            id: 5,
            text: "How do you create a function in JavaScript?",
            type: "Multiple Choice",
            options: [
              "function:myFunction()",
              "function myFunction()",
              "function = myFunction()",
              "myFunction():function",
            ],
          },
        ];

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOptionSelect = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: option });
  };

  const handleSubmitQuiz = async () => {
    const answers = questions.map((q, idx) => ({
      question_id: q.id,
      selected_option_id: selectedAnswers[idx]?.id || null,
    }));

    const result = await submitQuiz(quiz.id, answers);
    if (result.success) {
      navigate(`/quiz/${id}/result`, {
        state: { resultData: result.data, quizTitle: quiz.title },
      });
    } else {
      alert(result.error || "Failed to submit quiz.");
    }
  };

  return (
    <div className="quiz-play-container">
      <div className="container">
        {/* Header */}
        <div className="quiz-header d-flex justify-content-between align-items-end">
          <div>
            <h2 className="fw-bold mb-1" style={{ fontSize: "1.25rem" }}>
              {quiz.title}
            </h2>
            <p className="text-muted mb-0 small">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="timer-display">
            <span style={{ fontSize: "1.2rem", marginRight: "8px" }}>🕒</span>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="quiz-progress-wrapper">
        <div className="quiz-progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="container py-4">
        {/* Question Card */}
        <div className="question-card">
          <h1 className="question-text">{currentQuestion.text}</h1>
          <p className="question-type">Question Type: {currentQuestion.type}</p>

          <div className="options-container mb-5">
            {currentQuestion.options.map((option, idx) => (
              <div
                key={option.id || idx}
                className={`option-item ${
                  selectedAnswers[currentIndex]?.id === option.id ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="option-radio"></div>
                <span className="option-label">{typeof option === "object" ? option.label : option}</span>
              </div>
            ))}
          </div>

          <hr className="my-4" style={{ opacity: 0.1 }} />

          {/* Footer Navigation */}
          <div className="quiz-footer">
            <button
              className="btn nav-btn btn-prev"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
            >
              <span>⟨</span> Previous
            </button>

            <div className="question-dots d-none d-md-flex align-items-center">
              {currentIndex > 2 && questions.length > 5 && (
                <span className="text-muted mx-1">...</span>
              )}
              {questions
                .map((_, idx) => idx)
                .filter((idx) => {
                  if (questions.length <= 5) return true;
                  let start = Math.max(0, currentIndex - 2);
                  let end = Math.min(questions.length - 1, start + 4);
                  if (end === questions.length - 1) {
                    start = Math.max(0, end - 4);
                  }
                  return idx >= start && idx <= end;
                })
                .map((idx) => (
                  <div
                    key={idx}
                    className={`dot ${currentIndex === idx ? "active" : ""} ${
                      selectedAnswers[idx] ? "completed" : ""
                    }`}
                    onClick={() => setCurrentIndex(idx)}
                  >
                    {idx + 1}
                  </div>
                ))}
              {currentIndex < questions.length - 3 && questions.length > 5 && (
                <span className="text-muted mx-1">...</span>
              )}
            </div>

            <button
              className="btn nav-btn btn-next"
              disabled={submitting}
              onClick={() => {
                if (currentIndex < questions.length - 1) {
                  setCurrentIndex((prev) => prev + 1);
                } else {
                  handleSubmitQuiz();
                }
              }}
            >
              {submitting ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : null}
              {currentIndex === questions.length - 1 ? "Submit" : "Next"}{" "}
              <span className="ms-2">⟩</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
