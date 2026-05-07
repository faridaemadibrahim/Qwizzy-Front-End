import React from 'react';
import { createPortal } from 'react-dom';

export default function ConfirmDeleteModal({ show, onHide, onConfirm, title, message, loading }) {
    if (!show) return null;

    const modalContent = (
        <div
            className="modal fade show d-block"
            style={{ 
                backgroundColor: "rgba(0,0,0,0.4)", 
                backdropFilter: "blur(4px)",
                zIndex: 1050,
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh"
            }}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "1rem" }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="fw-bold mt-2 ms-2 text-danger">{title || "Confirm Delete"}</h5>
                        <button
                            type="button"
                            className="btn-close me-2"
                            onClick={onHide}
                            disabled={loading}
                        ></button>
                    </div>
                    <div className="modal-body p-4">
                        <p className="mb-0 text-muted">{message || "Are you sure you want to delete this item? This action cannot be undone."}</p>
                    </div>
                    <div className="modal-footer border-0 pt-0 pb-4 pe-4">
                        <button 
                            type="button" 
                            className="btn btn-light rounded-3 px-4" 
                            onClick={onHide}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-danger rounded-3 px-4 d-flex align-items-center gap-2" 
                            onClick={onConfirm}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : null}
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
