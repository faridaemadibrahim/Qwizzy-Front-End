import { useState } from "react";
import { UploadSimple as UploadIcon } from "@phosphor-icons/react";
import QuestionFormBase from "./QuestionFormBase";
import useUpdateQuestion from '../hooks/useUpdateQuestion';
import useManageOptions from '../hooks/useManageOptions';
import { QuestionTypes } from '../utils/QuestionFactory';

export default function EditQuestionForm({ question, onUpdateSuccess, onCancel }) {
    const { handleUpdateQuestion, loading: updatingQuestion } = useUpdateQuestion();
    const { handleUpdateOption, handleDeleteOption, handleCreateOption, loading: optionsLoading, setLoading: setOptionsLoading } = useManageOptions();

    const initialData = {
        body: question.body || "",
        question_type: question.question_type || QuestionTypes.MCQ,
        points: question.points || 1,
        sort_order: question.sort_order || 0,
    };

    const [initialOptions, setInitialOptions] = useState(
        question.options && question.options.length > 0
            ? question.options.map((opt, idx) => ({
                id: opt.id,
                label: opt.label || opt.option_text || "",
                is_correct: opt.is_correct || opt.isCorrect || false,
                sort_order: opt.sort_order || idx + 1
            }))
            : [
                { label: "", is_correct: false, sort_order: 1 },
                { label: "", is_correct: false, sort_order: 2 },
            ]
    );

    const onOptionDeleted = async (id) => {
        const result = await handleDeleteOption(id);
        if (result.success) {
            // Remove from initialOptions so handleSubmit doesn't try to delete it again
            setInitialOptions(prev => prev.filter(opt => opt.id !== id));
        }
        return result;
    };

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

        // 2. Cleanup: Delete options that are no longer in the list (e.g. if type changed)
        const currentOptionIds = options.map(opt => opt.id).filter(id => !!id);
        const optionsToDelete = initialOptions.filter(opt => opt.id && !currentOptionIds.includes(opt.id));

        for (const opt of optionsToDelete) {
            await handleDeleteOption(opt.id);
        }

        // 3. Process remaining options
        const incorrectOptions = options.filter(opt => !opt.is_correct);
        const correctOption = options.find(opt => opt.is_correct);

        const processOption = async (opt, idx) => {
            const optData = {
                question_id: question.id,
                label: opt.label,
                is_correct: opt.is_correct,
                sort_order: idx + 1
            };

            if (opt.id) {
                return handleUpdateOption(opt.id, optData);
            } else {
                return handleCreateOption(optData);
            }
        };

        for (const opt of incorrectOptions) {
            const res = await processOption(opt, options.indexOf(opt));
            if (!res.success) {
                alert(`Failed to save option: ${res.error}`);
                setOptionsLoading(false);
                return;
            }
        }

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
            onDeleteOption={onOptionDeleted}
            loading={updatingQuestion || optionsLoading}
            submitButtonText="Save Changes"
            submitButtonIcon={UploadIcon}
        />
    );
}
