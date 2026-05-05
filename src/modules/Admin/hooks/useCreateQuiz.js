import { useState, useCallback, useEffect } from "react";
import { createQuiz } from "../services/admin.api";

const INITIAL_FORM = {
    title: "",
    description: "",
    category_id: "",
    is_published: false,
    time_limit_minutes: "5",
    difficulty: "medium",
};

export default function useCreateQuiz(show, onHide, onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({ ...INITIAL_FORM });

    // Reset form when modal opens
    useEffect(() => {
        if (!show) return;
        setFormData({ ...INITIAL_FORM });
        setError(null);
        setSuccess(false);
    }, [show]);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }, []);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const title = typeof formData.title === "string" ? formData.title.trim() : "";
            const description =
                typeof formData.description === "string" ? formData.description.trim() : "";
            const category_id = formData.category_id;

            if (!title) {
                setError("Quiz title is required.");
                setLoading(false);
                return false;
            }
            if (!description) {
                setError("Description is required.");
                setLoading(false);
                return false;
            }
            if (!category_id) {
                setError("Category is required.");
                setLoading(false);
                return false;
            }

            const payload = {
                ...formData,
                title,
                description,
                category_id: String(category_id).trim(),
                time_limit_minutes: Number.parseInt(String(formData.time_limit_minutes), 10) || 5,
            };

            await createQuiz(payload);
            setSuccess(true);
            
            // Auto-close modal after success
            setTimeout(() => {
                onSuccess?.();
                onHide?.();
            }, 1500);

            return true;
        } catch (err) {
            const body = err?.response?.data;
            let msg = body?.message || err.message || "Failed to create quiz.";
            if (Array.isArray(body?.errors) && body.errors.length) {
                msg = `${msg} ${body.errors.join(" ")}`;
            }
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { 
        formData, 
        handleChange, 
        handleSubmit, 
        loading, 
        error, 
        success,
        setError,
        setSuccess
    };
}

