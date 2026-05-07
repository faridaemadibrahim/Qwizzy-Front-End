import { useState } from "react";
import { Trash as TrashIcon, Plus as PlusIcon, PencilSimple as PencilSimpleIcon } from "@phosphor-icons/react";
import ConfirmDeleteModal from "../../../shared/components/ConfirmDeleteModal";
import EditQuestionForm from "./EditQuestionForm";

export default function QuestionsList({ questions, onDelete, onUpdate, onAddClick }) {
  const [showModal, setShowModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  if (questions.length === 0) {
    return null; // Form is shown by parent when no questions
  }

  const handleDeleteClick = (id) => {
    setQuestionToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (questionToDelete) {
      setIsDeleting(true);
      await onDelete(questionToDelete);
      setIsDeleting(false);
      setShowModal(false);
      setQuestionToDelete(null);
    }
  };

  return (
    <>
      <div className="d-flex flex-column gap-3 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="fw-bold mb-0">Quiz Questions ({questions.length})</h5>
          <button
            className="btn btn-qm-primary btn-sm d-flex align-items-center gap-1 fw-bold"
            onClick={onAddClick}
          >
            <PlusIcon size={16} />
            Add Question
          </button>
        </div>
        {questions.map((q, idx) => (
          <div key={q.id || idx}>
            {editingQuestionId === q.id ? (
              <EditQuestionForm
                question={q}
                onUpdateSuccess={() => {
                  onUpdate();
                  setEditingQuestionId(null);
                }}
                onCancel={() => setEditingQuestionId(null)}
              />
            ) : (
              <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: "1rem" }}
              >
                <div className="card-body p-3">
                  <div className="d-flex gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center bg-light fw-bold"
                      style={{
                        width: "32px",
                        height: "32px",
                        fontSize: "0.85rem",
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div className="w-100">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <p className="mb-0 fw-medium">{q.body}</p>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-link text-primary p-0 border-0 me-2"
                            onClick={() => setEditingQuestionId(q.id)}
                            title="Edit Question"
                          >
                            <PencilSimpleIcon size={24} />
                          </button>
                          <button
                            className="btn btn-link text-danger p-0 border-0"
                            onClick={() => handleDeleteClick(q.id)}
                            title="Delete Question"
                          >
                            <TrashIcon size={24} />
                          </button>
                        </div>
                      </div>

                      {/* Options List */}
                      <div className="row g-2 mb-3">
                        {q.options &&
                          q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="col-6">
                              <div
                                className={`p-2 rounded-3 small border ${opt.is_correct ? "bg-success-subtle border-success" : "bg-light"}`}
                              >
                                {opt.is_correct && <span className="me-2">✅</span>}
                                {opt.label}
                              </div>
                            </div>
                          ))}
                      </div>

                      <div className="d-flex gap-2">
                        <span
                          className="badge bg-light text-purple border small"
                          style={{ color: "#7c3aed" }}
                        >
                          {q.question_type}
                        </span>
                        <span className="text-muted small">{q.points} points</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmDeleteModal 
        show={showModal}
        onHide={() => {
          if (!isDeleting) {
            setShowModal(false);
            setQuestionToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        loading={isDeleting}
      />
    </>
  );
}
