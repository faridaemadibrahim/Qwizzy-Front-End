import React from 'react';
import useDeleteQuiz from '../hooks/useDeleteQuiz';

export default function DeleteQuizButton({ quizId, onDeleteSuccess }) {
    const { handleDeleteQuiz, loading } = useDeleteQuiz();

    const handleClick = async () => {
        if (window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
            await handleDeleteQuiz(quizId, onDeleteSuccess);
        }
    };

    return (
        <button
            className="btn btn-sm btn-link link-danger text-decoration-none d-flex align-items-center gap-2"
            onClick={handleClick}
            disabled={loading}
            title="Delete Quiz"
            style={{ padding: "0.25rem 0.5rem" }}
        >
            {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
                <i className="bi bi-trash3"></i>
            )}
        </button>
    );
}
