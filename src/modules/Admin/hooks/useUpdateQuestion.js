import { useState, useCallback } from "react";
import { updateQuestion } from "../services/admin.api";

export default function useUpdateQuestion() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleUpdateQuestion = useCallback(async (id, data, onSuccess) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await updateQuestion(id, data);
            setSuccess(true);
            
            if (onSuccess) {
                onSuccess(id, data);
            }
            
            return { success: true };
        } catch (err) {
            const body = err?.response?.data;
            const msg = body?.message || err.message || "Failed to update question.";
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    return { 
        handleUpdateQuestion, 
        loading, 
        error, 
        success,
        setError,
        setSuccess
    };
}
