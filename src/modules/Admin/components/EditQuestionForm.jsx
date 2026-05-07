import React from "react";
import { UploadSimple as UploadIcon } from "@phosphor-icons/react";
import QuestionFormBase from "./QuestionFormBase";
import useEditQuestion from '../hooks/useEditQuestion';

export default function EditQuestionForm({ question, onUpdateSuccess, onCancel }) {
    const {
        initialData,
        initialOptions,
        onOptionDeleted,
        handleSubmit,
        loading
    } = useEditQuestion({ question, onUpdateSuccess });

    return (
        <QuestionFormBase
            title="Edit Question"
            initialData={initialData}
            initialOptions={initialOptions}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            onDeleteOption={onOptionDeleted}
            loading={loading}
            submitButtonText="Save Changes"
            submitButtonIcon={UploadIcon}
        />
    );
}
