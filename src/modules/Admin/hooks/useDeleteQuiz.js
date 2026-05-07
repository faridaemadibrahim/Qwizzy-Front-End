import { useState, useCallback } from "react";
import { deleteQuiz } from "../services/admin.api";

export default function useDeleteQuiz() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleDeleteQuiz = useCallback(async (id, onSuccess) => {
        setLoading(true);
        setError(null);

        try {
            await deleteQuiz(id);
            closeModal();
            
            if (onSuccess) {
                onSuccess(id);
            }
            
            return { success: true };
        } catch (err) {
            const body = err?.response?.data;
            const msg = body?.message || err.message || "Failed to delete quiz.";
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    return { 
        handleDeleteQuiz, 
        loading, 
        error, 
        showModal,
        openModal,
        closeModal,
        setError
    };
}
