import { useState } from "react";

export default function QuizResultCard({ item }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className={`result-card ${item.is_correct ? "correct" : "incorrect"}`}
            onClick={() => setExpanded(!expanded)}
        >
            <div className="d-flex align-items-start justify-content-between">
                <div className="d-flex align-items-start gap-3">
                    <span className={`result-icon ${item.is_correct ? "correct" : "incorrect"}`}>
                        {item.is_correct ? "✓" : "✕"}
                    </span>
                    <div>
                        <p className="mb-1 fw-semibold" style={{ fontSize: "0.95rem" }}>
                            {item.body}
                        </p>
                        <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>
                            Your answer:{" "}
                            <strong>{item.selected_option_label || "Not answered"}</strong>
                        </p>
                    </div>
                </div>
                <button
                    className="btn btn-sm expand-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }}
                >
                    {expanded ? "−" : "+"}
                </button>
            </div>

            {expanded && (
                <div className="result-details mt-3 pt-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                            Points: {item.earned_points}/{item.points}
                        </span>
                        <span
                            className={`badge ${item.is_correct ? "bg-success" : "bg-danger"}`}
                            style={{ fontSize: "0.78rem" }}
                        >
                            {item.is_correct ? "Correct" : "Incorrect"}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
