export const QuestionTypes = {
    MCQ: "MCQ",
    TRUE_FALSE: "TRUE_FALSE",
};

class QuestionFactory {
    static createDefaultOptions(type) {
        switch (type) {
            case QuestionTypes.TRUE_FALSE:
                return [
                    { label: "True", is_correct: false },
                    { label: "False", is_correct: false },
                ];
            case QuestionTypes.MCQ:
                return [
                    { label: "", is_correct: false },
                    { label: "", is_correct: false },
                ];
            default:
                return [];
        }
    }

    static getLabel(type) {
        switch (type) {
            case QuestionTypes.TRUE_FALSE:
                return "True / False";
            case QuestionTypes.MCQ:
                return "Multiple Choice (MCQ)";
            default:
                return "Unknown Type";
        }
    }
}

export default QuestionFactory;
