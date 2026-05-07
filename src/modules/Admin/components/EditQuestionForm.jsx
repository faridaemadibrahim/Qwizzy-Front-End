import { UploadSimple as UploadIcon } from "@phosphor-icons/react";
import QuestionFormBase from "../../../shared/components/QuestionFormBase";
import useUpdateQuestion from '../hooks/useUpdateQuestion';
import useManageOptions from '../hooks/useManageOptions';

export default function EditQuestionForm({ question, onUpdateSuccess, onCancel }) {
    const { handleUpdateQuestion, loading: updatingQuestion } = useUpdateQuestion();
    const { handleUpdateOption, handleDeleteOption, handleCreateOption, loading: optionsLoading, setLoading: setOptionsLoading } = useManageOptions();

    const initialData = {
        body: question.body || "",
        question_type: question.question_type || "MCQ",
        points: question.points || 1,
        sort_order: question.sort_order || 0,
    };

    const initialOptions = question.options && question.options.length > 0
        ? question.options.map((opt, idx) => ({
            id: opt.id,
            label: opt.label || opt.option_text || "",
            is_correct: opt.is_correct || opt.isCorrect || false,
            sort_order: opt.sort_order || idx + 1
        }))
        : [
            { label: "", is_correct: false, sort_order: 1 },
            { label: "", is_correct: false, sort_order: 2 },
        ];

    const handleSubmit = async (formData, options) => {
        setOptionsLoading(true);
        // 1. Update question basic data
        const updateData = {
            ...formData,
            quiz_id: question.quiz_id
        };
        const questionResult = await handleUpdateQuestion(question.id, updateData);

        if (!questionResult.success) {
            alert(questionResult.error);
            setOptionsLoading(false);
            return;
        }

        // 2. Cleanup: Delete options that are no longer in the list (important for type changes)
        const currentOptionIds = options.map(opt => opt.id).filter(id => !!id);
        const optionsToDelete = initialOptions.filter(opt => opt.id && !currentOptionIds.includes(opt.id));

        for (const opt of optionsToDelete) {
            await handleDeleteOption(opt.id);
        }

        // 3. Process options sequentially to avoid conflicts
        const incorrectOptions = options.filter(opt => !opt.is_correct);
        const correctOption = options.find(opt => opt.is_correct);

        const processOption = async (opt, idx) => {
            const optData = {
                question_id: question.id,
                label: opt.label,
                is_correct: opt.is_correct,
                sort_order: idx + 1 // Always use current list position
            };

            if (opt.id) {
                return handleUpdateOption(opt.id, optData);
            } else {
                return handleCreateOption(optData);
            }
        };

        // Update incorrect ones first (to clear the correct flag in DB)
        for (const opt of incorrectOptions) {
            const res = await processOption(opt, options.indexOf(opt));
            if (!res.success) {
                alert(`Failed to save option: ${res.error}`);
                setOptionsLoading(false);
                return;
            }
        }

        // Update the correct one last
        if (correctOption) {
            const res = await processOption(correctOption, options.indexOf(correctOption));
            if (!res.success) {
                alert(`Failed to save correct option: ${res.error}`);
                setOptionsLoading(false);
                return;
            }
        }

        onUpdateSuccess();
        setOptionsLoading(false);
    };

    return (
        <QuestionFormBase
            title="Edit Question"
            initialData={initialData}
            initialOptions={initialOptions}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            onDeleteOption={handleDeleteOption}
            loading={updatingQuestion || optionsLoading}
            submitButtonText="Save Changes"
            submitButtonIcon={UploadIcon}
        />
    );
}
