export default function CreateQuizzModal({ 
    show, 
    onHide, 
    formData, 
    onChange, 
    onSubmit, 
    loading, 
    error, 
    success 
}) {
    if (!show) return null;

    return (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "1.25rem" }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="fw-bold mt-2 ms-2">Create New Quiz</h5>
                        <button
                            type="button"
                            className="btn-close me-2"
                            onClick={onHide}
                        ></button>
                    </div>
                    <div className="modal-body p-4">
                        {error && (
                            <div className="alert alert-danger small py-2 mb-3">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success small py-2 mb-3">
                                Quiz created successfully!
                            </div>
                        )}

                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Quiz Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    placeholder="e.g. JavaScript Basics"
                                    value={formData.title}
                                    onChange={onChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    className="form-control"
                                    placeholder="e.g. Programming, History, etc."
                                    value={formData.category}
                                    onChange={onChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Description</label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="3"
                                    placeholder="What is this quiz about?"
                                    value={formData.description}
                                    onChange={onChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Time Limit (mins)</label>
                                    <input
                                        type="number"
                                        name="time_limit_minutes"
                                        className="form-control"
                                        value={formData.time_limit_minutes}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Difficulty</label>
                                    <select
                                        name="difficulty"
                                        className="form-select"
                                        value={formData.difficulty}
                                        onChange={onChange}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4 d-flex align-items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    name="is_published"
                                    className="form-check-input"
                                    checked={formData.is_published}
                                    onChange={onChange}
                                />
                                <label htmlFor="is_published" className="form-check-label small mt-1">
                                    Publish immediately
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-qm-primary w-100 py-2 fw-bold"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : null}
                                Create Quiz
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

