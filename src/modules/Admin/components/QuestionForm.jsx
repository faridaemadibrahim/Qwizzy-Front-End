import QuestionFormBase from "../../../shared/components/QuestionFormBase";

export default function QuestionForm({ onSubmit, loading, onCancel }) {
    const handleSubmit = (formData, options) => {
        // Pass data in the format expected by the parent
        onSubmit(formData, options);
    };

    return (
        <QuestionFormBase
            title="Add New Question"
            onSubmit={handleSubmit}
            onCancel={onCancel}
            loading={loading}
            submitButtonText="Add Question to Quiz"
        />
    );
}
