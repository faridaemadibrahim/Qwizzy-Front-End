import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useQuestionForm from './useQuestionForm';
import { QuestionTypes } from '../utils/QuestionFactory';

describe('useQuestionForm Hook', () => {
    const mockOnSubmit = vi.fn();

    it('should initialize with default MCQ values', () => {
        const { result } = renderHook(() => useQuestionForm({ onSubmit: mockOnSubmit }));
        
        expect(result.current.formData.question_type).toBe(QuestionTypes.MCQ);
        expect(result.current.options).toHaveLength(2);
        expect(result.current.options[0].label).toBe("");
    });

    it('should change question type and update options', () => {
        const { result } = renderHook(() => useQuestionForm({ onSubmit: mockOnSubmit }));

        act(() => {
            result.current.handleChange('question_type', QuestionTypes.TRUE_FALSE);
        });

        expect(result.current.formData.question_type).toBe(QuestionTypes.TRUE_FALSE);
        expect(result.current.options[0].label).toBe("True");
        expect(result.current.options[1].label).toBe("False");
    });

    it('should add an option in MCQ mode', () => {
        const { result } = renderHook(() => useQuestionForm({ onSubmit: mockOnSubmit }));

        act(() => {
            result.current.addOption();
        });

        expect(result.current.options).toHaveLength(3);
    });

    it('should remove an option in MCQ mode', () => {
        const { result } = renderHook(() => useQuestionForm({ onSubmit: mockOnSubmit }));

        // Add one first
        act(() => {
            result.current.addOption();
        });
        expect(result.current.options).toHaveLength(3);

        // Remove one
        act(() => {
            result.current.removeOption(2);
        });
        expect(result.current.options).toHaveLength(2);
    });

    it('should update option labels', () => {
        const { result } = renderHook(() => useQuestionForm({ onSubmit: mockOnSubmit }));

        act(() => {
            result.current.handleOptionChange(0, 'label', 'New Label');
        });

        expect(result.current.options[0].label).toBe('New Label');
    });

    it('should handle correct option selection', () => {
        const { result } = renderHook(() => useQuestionForm({ onSubmit: mockOnSubmit }));

        act(() => {
            result.current.handleOptionChange(1, 'is_correct', true);
        });

        expect(result.current.options[0].is_correct).toBe(false);
        expect(result.current.options[1].is_correct).toBe(true);
    });

    it('should call onSubmit when submitted', () => {
        const { result } = renderHook(() => useQuestionForm({ onSubmit: mockOnSubmit }));

        act(() => {
            result.current.handleChange('body', 'Test Question');
            // Fill labels and select correct option to pass validation
            result.current.handleOptionChange(0, 'label', 'Option 1');
            result.current.handleOptionChange(1, 'label', 'Option 2');
            result.current.handleOptionChange(0, 'is_correct', true);
        });

        act(() => {
            result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(mockOnSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ body: 'Test Question' }),
            expect.any(Array)
        );
    });
});
