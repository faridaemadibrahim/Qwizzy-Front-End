import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import QmDashboardNavbar from "../../../shared/components/QmDashboardNavbar";
import DashboardHeader from "../../../shared/components/DashboardHeader";
import useManageQuiz from "../hooks/useManageQuiz";
import QuestionForm from "../components/QuestionForm";
import QuestionsList from "../components/QuestionsList";

export default function ManageQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    quiz,
    questions,
    loading,
    error,
    creatingQuestion,
    handleAddQuestion,
    handleDeleteQuestion,
    handlePublishQuiz,
  } = useManageQuiz(id);

  if (loading && !quiz) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border qm-text-purple" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger mb-4">{error}</div>
        <button
          className="btn btn-qm-primary"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const onAddQuestion = async (data, options) => {
    const result = await handleAddQuestion(data, options);
    if (!result.success) {
      alert(result.error);
    }
  };

  const onPublish = async () => {
    if (questions.length === 0) {
      alert("Please add at least one question before publishing.");
      return;
    }
    const result = await handlePublishQuiz();
    if (result.success) {
      alert("Quiz published successfully!");
      navigate("/admin");
    } else {
      alert(result.error);
    }
  };

  return (
    <>
      <QmDashboardNavbar user={user} />
      <main className="container py-5">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <DashboardHeader
            title="Manage Quiz"
            userName={quiz?.title || quiz?.name || quiz?.quiz_title || quiz?.quizTitle || "Quiz"}
            description={quiz?.description || quiz?.quiz_description}
          />
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary px-4 rounded-3"
              onClick={() => navigate("/admin")}
            >
              Back
            </button>
            <button
              className="btn btn-qm-primary px-4 rounded-3 d-flex align-items-center gap-2"
              onClick={onPublish}
              disabled={loading || questions.length === 0}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : null}
              {quiz?.is_published ? "Published" : "Publish Quiz"}
            </button>
          </div>
        </div>

        <div className=" d-flex justify-content-center ">
          <div className="d-flex w-50  flex-column gap-4 box-shadow">
            <QuestionForm onSubmit={onAddQuestion} loading={creatingQuestion} />
            <QuestionsList
              questions={questions}
              onDelete={handleDeleteQuestion}
            />
          </div>
        </div>
      </main>
    </>
  );
}
