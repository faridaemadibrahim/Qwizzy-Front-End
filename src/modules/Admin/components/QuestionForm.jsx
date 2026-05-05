import useQuestionForm from "../hooks/useQuestionForm";
import { validateQuestion } from "../utils/questionValidation";

export default function QuestionForm({ onSubmit, loading }) {
    const {
        formData,
        options,
        handleChange,
        handleOptionChange,
        addOption,
        removeOption,
        submit,
    } = useQuestionForm(onSubmit);

    const handleSubmit = (e) => {
        e.preventDefault();

        const error = validateQuestion(options);
        if (error) {
            alert(error);
            return;
        }

        submit();
    };

    return (
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "1rem" }}>
            <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Add New Question</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Question Text</label>
                        <textarea
                            name="body"
                            className="form-control"
                            rows="3"
                            placeholder="Type your question here..."
                            value={formData.body}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Question Type</label>
                            <select
                                name="question_type"
                                className="form-select"
                                value={formData.question_type}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            >
                                <option value="MCQ">Multiple Choice (MCQ)</option>
                                <option value="TRUE_FALSE">True / False</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Points</label>
                            <input
                                type="number"
                                name="points"
                                className="form-control"
                                value={formData.points}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                min="1"
                                step="0.5"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Order</label>
                            <input
                                type="number"
                                name="sort_order"
                                className="form-control"
                                value={formData.sort_order}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label small fw-bold mb-0">Answer Options</label>
                            {formData.question_type === "MCQ" && (
                                <button
                                    type="button"
                                    className="btn btn-sm qm-text-purple p-0 fw-bold"
                                    onClick={addOption}
                                    disabled={options.length >= 6}
                                >
                                    + Add Option
                                </button>
                            )}
                        </div>

                        <div className="d-flex flex-column gap-2">
                            {options.map((opt, idx) => (
                                <div key={idx} className="input-group input-group-sm">
                                    <div className="input-group-text bg-white border-end-0">
                                        <input
                                            className="form-check-input mt-0"
                                            type="radio"
                                            name="correct_option"
                                            checked={opt.is_correct}
                                            onChange={() => handleOptionChange(idx, "is_correct", true)}
                                            required
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder={`Option ${idx + 1}`}
                                        value={opt.label}
                                        onChange={(e) => handleOptionChange(idx, "label", e.target.value)}
                                        disabled={formData.question_type === "TRUE_FALSE"}
                                        required
                                    />
                                    {formData.question_type === "MCQ" && options.length > 2 && (
                                        <button
                                            className="btn btn-outline-danger"
                                            type="button"
                                            onClick={() => removeOption(idx)}
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-muted mt-2 mb-0" style={{ fontSize: "0.75rem" }}>
                            Select the radio button next to the correct answer.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-qm-primary w-100 py-2 fw-bold"
                        disabled={loading || !formData.body.trim()}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : (
                            <span className="me-2">+</span>
                        )}
                        Add Question to Quiz
                    </button>
                </form>
            </div>
        </div>
    );
}
