import { useState, useEffect } from "react";
import QuestionFactory, { QuestionTypes } from "../utils/QuestionFactory";

export default function useQuestionForm({
    initialData,
    initialOptions,
    onSubmit,
    onDeleteOption
}) {
    const [formData, setFormData] = useState({
        body: "",
        question_type: QuestionTypes.MCQ,
        points: 1,
        sort_order: 0,
        ...initialData,
    });

    const defaultOptions = initialOptions || QuestionFactory.createDefaultOptions(QuestionTypes.MCQ);
    const [options, setOptions] = useState(defaultOptions);

    // Modal state for deletions
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [optionIndexToDelete, setOptionIndexToDelete] = useState(null);
    const [isDeletingOption, setIsDeletingOption] = useState(false);

    // Sync state with initial data (for edit mode)
    useEffect(() => {
        if (initialData) {
            setFormData({
                body: "",
                question_type: QuestionTypes.MCQ,
                points: 1,
                sort_order: 0,
                ...initialData,
            });
        }
        if (initialOptions) {
            setOptions(initialOptions);
        }
    }, [initialData, initialOptions]);

    const handleChange = (eOrName, value) => {
        let name, val;
        if (eOrName && typeof eOrName === "object" && eOrName.target) {
            name = eOrName.target.name;
            val = eOrName.target.value;
        } else {
            name = eOrName;
            val = value;
        }

        // Prevent changing type if saved options exist (Update mode)
        if (name === "question_type" && val !== formData.question_type) {
            const hasSavedOptions = options.some(opt => opt.id);
            if (hasSavedOptions) {
                alert("Please delete all existing options before changing the question type to ensure a clean update.");
                return;
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: name === "points" || name === "sort_order" ? Number(val) : val,
        }));

        if (name === "question_type") {
            setOptions(QuestionFactory.createDefaultOptions(val));
        }
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...options];
        if (field === "is_correct") {
            newOptions.forEach((opt, i) => (opt.is_correct = i === index));
        } else {
            newOptions[index][field] = value;
        }
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length < 6) {
            setOptions([...options, { label: "", is_correct: false }]);
        }
    };

    const removeOption = (index) => {
        const optionToDelete = options[index];
        if (optionToDelete.id && onDeleteOption) {
            setOptionIndexToDelete(index);
            setShowDeleteModal(true);
        } else {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleConfirmDeleteOption = async () => {
        if (optionIndexToDelete === null) return;
        const optionToDelete = options[optionIndexToDelete];
        setIsDeletingOption(true);

        const result = await onDeleteOption(optionToDelete.id);
        if (result.success) {
            setOptions(options.filter((_, i) => i !== optionIndexToDelete));
            setShowDeleteModal(false);
            setOptionIndexToDelete(null);
        } else {
            alert(result.error || "Failed to delete option.");
        }
        setIsDeletingOption(false);
    };

    const validateQuestion = () => {
        const hasCorrectOption = options.some((opt) => opt.is_correct);
        if (!hasCorrectOption) return "Please select a correct answer.";
        const hasEmptyLabel = options.some((opt) => !opt.label.trim());
        if (hasEmptyLabel) return "Please fill in all option labels.";
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const error = validateQuestion();
        if (error) {
            alert(error);
            return;
        }
        onSubmit(formData, options);
    };

    return {
        formData,
        options,
        showDeleteModal,
        setShowDeleteModal,
        isDeletingOption,
        handleChange,
        handleOptionChange,
        addOption,
        removeOption,
        handleConfirmDeleteOption,
        handleSubmit,
    };
}
