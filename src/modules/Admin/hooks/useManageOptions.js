import { useState, useCallback } from "react";
import { updateQuestionOption, deleteQuestionOption, createQuestionOption } from "../services/admin.api";

export default function useManageOptions() {
    const [loading, setLoading] = useState(false);

    const handleUpdateOption = useCallback(async (id, data) => {
        try {
            const res = await updateQuestionOption(id, data);
            return { success: true, data: res.data };
        } catch (err) {
            return { success: false, error: err?.response?.data?.message || err.message };
        }
    }, []);

    const handleDeleteOption = useCallback(async (id) => {
        try {
            await deleteQuestionOption(id);
            return { success: true };
        } catch (err) {
            return { success: false, error: err?.response?.data?.message || err.message };
        }
    }, []);

    const handleCreateOption = useCallback(async (data) => {
        try {
            const res = await createQuestionOption(data);
            return { success: true, data: res.data };
        } catch (err) {
            return { success: false, error: err?.response?.data?.message || err.message };
        }
    }, []);

    return { handleUpdateOption, handleDeleteOption, handleCreateOption, loading, setLoading };
}
