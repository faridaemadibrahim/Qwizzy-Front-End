import { UploadSimple as UploadIcon } from "@phosphor-icons/react";
import QuestionFormBase from "../../../shared/components/QuestionFormBase";
import useUpdateQuestion from '../hooks/useUpdateQuestion';

export default function EditQuestionForm({ question, onUpdateSuccess, onCancel }) {
    const { handleUpdateQuestion, loading } = useUpdateQuestion();

    const initialData = {
        body: question.body || "",
        question_type: question.question_type || "MCQ",
        points: question.points || 1,
        sort_order: question.sort_order || 0,
    };

    const initialOptions = question.options && question.options.length > 0
        ? question.options.map(opt => ({
            label: opt.label || opt.option_text || "",
            is_correct: opt.is_correct || opt.isCorrect || false,
        }))
        : [
            { label: "", is_correct: false },
            { label: "", is_correct: false },
        ];

    const handleSubmit = async (formData, options) => {
        // Update question data - include quiz_id which is required by backend
        const updateData = {
            ...formData,
            quiz_id: question.quiz_id
        };
        const result = await handleUpdateQuestion(question.id, updateData, onUpdateSuccess);
        if (!result.success) {
            alert(result.error);
        }
    };

    return (
        <QuestionFormBase
            title="Edit Question"
            initialData={initialData}
            initialOptions={initialOptions}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            loading={loading}
            submitButtonText="Save Changes"
            submitButtonIcon={UploadIcon}
        />
    );
}
