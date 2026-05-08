import { describe, it, expect } from 'vitest';
import QuestionFactory, { QuestionTypes } from './QuestionFactory';

describe('QuestionFactory', () => {
    it('should create default options for MCQ', () => {
        const options = QuestionFactory.createDefaultOptions(QuestionTypes.MCQ);
        expect(options).toHaveLength(2);
        expect(options[0]).toEqual({ label: "", is_correct: false });
        expect(options[1]).toEqual({ label: "", is_correct: false });
    });

    it('should create default options for TRUE_FALSE', () => {
        const options = QuestionFactory.createDefaultOptions(QuestionTypes.TRUE_FALSE);
        expect(options).toHaveLength(2);
        expect(options[0]).toEqual({ label: "True", is_correct: false });
        expect(options[1]).toEqual({ label: "False", is_correct: false });
    });

    it('should return empty array for unknown type', () => {
        const options = QuestionFactory.createDefaultOptions('UNKNOWN');
        expect(options).toEqual([]);
    });

    it('should return correct label for MCQ', () => {
        const label = QuestionFactory.getLabel(QuestionTypes.MCQ);
        expect(label).toBe("Multiple Choice (MCQ)");
    });

    it('should return correct label for TRUE_FALSE', () => {
        const label = QuestionFactory.getLabel(QuestionTypes.TRUE_FALSE);
        expect(label).toBe("True / False");
    });
});
