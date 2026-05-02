export function validateQuestion(options) {
    if (options.some(opt => !opt.label.trim())) {
        return "Please fill in all option labels.";
    }

    if (!options.some(opt => opt.is_correct)) {
        return "Please select a correct answer.";
    }

    return null;
}
