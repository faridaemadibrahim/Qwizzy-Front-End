import { useState, useEffect } from "react";
import { UploadSimple as UploadIcon } from "@phosphor-icons/react";
import { getCategories } from "../../Quiz/services/quizService";
import { getCategoryOptionLabel } from "../../../utils/categoryDisplay";

export default function QuizEditForm({ quiz, onSubmit, loading }) {
    const [categories, setCategories] = useState([]);
    const [fetchingCategories, setFetchingCategories] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category_id: "",
        time_limit_minutes: "",
        difficulty: "medium",
        is_published: false,
    });

    // Populate form when quiz data loads
    useEffect(() => {
        if (quiz) {
            setFormData({
                title: quiz.title || "",
                description: quiz.description || "",
                category_id: quiz.category_id || (quiz.category?.id || ""),
                time_limit_minutes: quiz.time_limit_minutes || quiz.duration || "5",
                difficulty: quiz.difficulty || "medium",
                is_published: quiz.is_published || false,
            });
        }
    }, [quiz]);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            setFetchingCategories(true);
            try {
                const response = await getCategories();
                const body = response.data;
                const data = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setCategories([]);
            } finally {
                setFetchingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const title = typeof formData.title === "string" ? formData.title.trim() : "";
        const description = typeof formData.description === "string" ? formData.description.trim() : "";
        const category_id = formData.category_id;

        if (!title) {
            alert("Quiz title is required.");
            return;
        }
        if (!description) {
            alert("Description is required.");
            return;
        }
        if (!category_id) {
            alert("Category is required.");
            return;
        }

        const payload = {
            title,
            description,
            category_id: String(category_id).trim(),
            time_limit_minutes: Number.parseInt(String(formData.time_limit_minutes), 10) || 5,
            difficulty: formData.difficulty,
            is_published: formData.is_published,
        };

        onSubmit(payload);
    };

    return (
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "1rem" }}>
            <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Quiz Details</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Quiz Title</label>
                        <input
                            type="text"
                            name="title"
                            className="form-control"
                            placeholder="e.g. JavaScript Basics"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold">Category</label>
                        <select
                            name="category_id"
                            className="form-select qm-select-readable"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                            disabled={fetchingCategories}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {getCategoryOptionLabel(cat)}
                                </option>
                            ))}
                        </select>
                        {fetchingCategories && <div className="form-text small">Loading categories...</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold">Description</label>
                        <textarea
                            name="description"
                            className="form-control"
                            rows="3"
                            placeholder="What is this quiz about?"
                            value={formData.description}
                            onChange={handleChange}
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
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Difficulty</label>
                            <select
                                name="difficulty"
                                className="form-select qm-select-readable"
                                value={formData.difficulty}
                                onChange={handleChange}
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
                            onChange={handleChange}
                        />
                        <label htmlFor="is_published" className="form-check-label small mt-1">
                            Published
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-qm-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                            <UploadIcon size={20} />
                        )}
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
