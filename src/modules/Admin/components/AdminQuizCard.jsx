import { useNavigate } from "react-router-dom";
import DifficultyBadge from "../../../shared/components/DifficultyBadge";

// Admin specific Quiz Card
export default function AdminQuizCard({ quiz }) {
    const navigate = useNavigate();

    return (
        <div className="card border-0 h-100 quiz-card">
            <div className="card-body d-flex flex-column p-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-1">
                    <h5 className="fw-bold mb-0" style={{ fontSize: "1rem" }}>
                        {quiz.title}
                    </h5>
                    <DifficultyBadge level={quiz.difficulty} />
                </div>

                {/* Category */}
                <p className="mb-2 qm-text-muted" style={{ fontSize: "0.82rem" }}>
                    {quiz.category}
                </p>

                {/* Description */}
                <p
                    className="mb-3"
                    style={{ fontSize: "0.88rem", flexGrow: 1, color: "#555" }}
                >
                    {quiz.description}
                </p>

                {/* Meta */}
                <div
                    className="d-flex justify-content-between mb-3 qm-text-muted"
                    style={{ fontSize: "0.82rem" }}
                >
                    <span>{quiz.questions} questions</span>
                    <span>{quiz.duration} min</span>
                </div>

                {/* CTA */}
                <button 
                    className="btn-start-quiz" 
                    style={{ background: "#f4f0fd", color: "#7c3aed", border: "1px solid #7c3aed" }}
                    onClick={() => navigate(`/admin/quiz/${quiz.id}`)}
                >
                    Manage Quiz
                </button>
            </div>
        </div>
    );
}
