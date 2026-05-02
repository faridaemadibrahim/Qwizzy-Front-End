export default function QuestionsList({ questions }) {
    if (questions.length === 0) {
        return (
            <div className="text-center py-5 bg-light rounded-4 border-dashed mb-4">
                <p className="text-muted mb-0">No questions added yet. Use the form above to start building your quiz.</p>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column gap-3 mb-4">
            <h5 className="fw-bold mb-2">Quiz Questions ({questions.length})</h5>
            {questions.map((q, idx) => (
                <div key={q.id || idx} className="card border-0 shadow-sm" style={{ borderRadius: "1rem" }}>
                    <div className="card-body p-3">
                        <div className="d-flex gap-3">
                            <div 
                                className="rounded-circle d-flex align-items-center justify-content-center bg-light fw-bold"
                                style={{ width: "32px", height: "32px", fontSize: "0.85rem", flexShrink: 0 }}
                            >
                                {idx + 1}
                            </div>
                            <div className="w-100">
                                <p className="mb-2 fw-medium">{q.body}</p>
                                
                                {/* Options List */}
                                <div className="row g-2 mb-3">
                                    {q.options && q.options.map((opt, oIdx) => (
                                        <div key={oIdx} className="col-6">
                                            <div className={`p-2 rounded-3 small border ${opt.is_correct ? 'bg-success-subtle border-success' : 'bg-light'}`}>
                                                {opt.is_correct && <span className="me-2">✅</span>}
                                                {opt.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="d-flex gap-2">
                                    <span className="badge bg-light text-purple border small" style={{ color: "#7c3aed" }}>
                                        {q.question_type}
                                    </span>
                                    <span className="text-muted small">
                                        {q.points} points
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
