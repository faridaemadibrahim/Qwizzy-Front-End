import React from 'react';
import useDeleteQuiz from '../hooks/useDeleteQuiz';
import ConfirmDeleteModal from '../../../shared/components/ConfirmDeleteModal';
import { Trash } from '@phosphor-icons/react';

export default function DeleteQuizButton({ quizId, onDeleteSuccess }) {
    const {
        handleDeleteQuiz,
        loading,
        showModal,
        openModal,
        closeModal
    } = useDeleteQuiz();

    return (
        <>
            <button
                className="btn btn-sm btn-link link-danger text-decoration-none d-flex align-items-center gap-2"
                onClick={openModal}
                disabled={loading}
                title="Delete Quiz"
                style={{ padding: "0.25rem 0.5rem" }}
            >
                <Trash size={18} />
            </button>

            <ConfirmDeleteModal
                show={showModal}
                onHide={closeModal}
                onConfirm={() => handleDeleteQuiz(quizId, onDeleteSuccess)}
                loading={loading}
                title="Delete Quiz"
                message="Are you sure you want to delete this quiz? This action cannot be undone."
            />
        </>
    );
}
