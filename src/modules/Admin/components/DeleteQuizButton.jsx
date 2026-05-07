import React, { useState } from 'react';
import useDeleteQuiz from '../hooks/useDeleteQuiz';
import ConfirmDeleteModal from '../../../shared/components/ConfirmDeleteModal';

export default function DeleteQuizButton({ quizId, onDeleteSuccess }) {
    const { handleDeleteQuiz, loading } = useDeleteQuiz();
    const [showModal, setShowModal] = useState(false);

    const handleConfirm = async () => {
        const result = await handleDeleteQuiz(quizId, onDeleteSuccess);
        if (result.success) {
            setShowModal(false);
        }
    };

    return (
        <>
            <button
                className="btn btn-sm btn-link link-danger text-decoration-none d-flex align-items-center gap-2"
                onClick={() => setShowModal(true)}
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

            <ConfirmDeleteModal 
                show={showModal}
                onHide={() => setShowModal(false)}
                onConfirm={handleConfirm}
                title="Delete Quiz"
                message="Are you sure you want to delete this quiz? This action cannot be undone."
                loading={loading}
            />
        </>
    );
}
