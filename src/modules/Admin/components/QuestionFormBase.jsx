import { X as XIcon } from "@phosphor-icons/react";
import ConfirmDeleteModal from "../../../shared/components/ConfirmDeleteModal";
import QuestionFactory, { QuestionTypes } from "../utils/QuestionFactory";
import useQuestionForm from "../hooks/useQuestionForm";

export default function QuestionFormBase({
    title,
    initialData,
    initialOptions,
    onSubmit,
    onCancel,
    onDeleteOption,
    loading,
    submitButtonText,
    submitButtonIcon: SubmitIcon,
}) {
    const {
        formData,
        options,
        showDeleteModal,
        setShowDeleteModal,
        isDeletingOption,
        handleChange,
        handleOptionChange,
        addOption,
        removeOption,
        handleConfirmDeleteOption,
        handleSubmit,
    } = useQuestionForm({
        initialData,
        initialOptions,
        onSubmit,
        onDeleteOption
    });

    return (
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "1rem" }}>
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">{title}</h5>
                    {onCancel && (
                        <button
                            type="button"
                            className="btn btn-link text-muted p-0 border-0"
                            onClick={onCancel}
                            title="Close"
                        >
                            <XIcon size={24} />
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Question Text</label>
                        <textarea
                            name="body"
                            className="form-control"
                            rows="3"
                            placeholder="Type your question here..."
                            value={formData.body}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Question Type</label>
                            <select
                                name="question_type"
                                className="form-select"
                                value={formData.question_type}
                                onChange={handleChange}
                            >
                                <option value={QuestionTypes.MCQ}>{QuestionFactory.getLabel(QuestionTypes.MCQ)}</option>
                                <option value={QuestionTypes.TRUE_FALSE}>{QuestionFactory.getLabel(QuestionTypes.TRUE_FALSE)}</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Points</label>
                            <input
                                type="number"
                                name="points"
                                className="form-control"
                                value={formData.points}
                                onChange={handleChange}
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
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label small fw-bold mb-0">Answer Options</label>
                            {formData.question_type === QuestionTypes.MCQ && (
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
                                        disabled={formData.question_type === QuestionTypes.TRUE_FALSE}
                                        required
                                    />
                                    {options.length > 0 && (
                                        <button
                                            className="btn btn-outline-danger"
                                            type="button"
                                            onClick={() => removeOption(idx)}
                                            title="Delete Option"
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
                        className="btn btn-qm-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                        disabled={loading || !formData.body.trim()}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : SubmitIcon ? (
                            <SubmitIcon size={20} />
                        ) : (
                            <span>+</span>
                        )}
                        {submitButtonText}
                    </button>
                </form>
            </div>

            <ConfirmDeleteModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDeleteOption}
                title="Delete Option"
                message="Are you sure you want to delete this option permanently? This action cannot be undone."
                loading={isDeletingOption}
            />
        </div>
    );
}
