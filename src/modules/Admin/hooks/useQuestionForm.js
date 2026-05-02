import { useState } from "react";

export default function useQuestionForm(onSubmit) {
    const [formData, setFormData] = useState({
        question_type: "MCQ",
        body: "",
        points: 1,
        sort_order: 0,
    });

    const [options, setOptions] = useState([
        { label: "", is_correct: false },
        { label: "", is_correct: false },
    ]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: name === "points" || name === "sort_order" ? Number(value) : value,
        }));
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
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const resetForm = () => {
        setFormData(prev => ({ ...prev, body: "", sort_order: prev.sort_order + 1 }));
        setOptions([
            { label: "", is_correct: false },
            { label: "", is_correct: false },
        ]);
    };

    const submit = () => {
        onSubmit(formData, options);
        resetForm();
    };

    return {
        formData,
        options,
        handleChange,
        handleOptionChange,
        addOption,
        removeOption,
        submit,
    };
}
