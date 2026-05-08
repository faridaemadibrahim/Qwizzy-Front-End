import { useState, useEffect, useCallback } from "react";

export default function useQuizSession({ quizId, quizDuration, totalQuestions, onSubmit }) {
    const storageKey = `quiz_session_${quizId}`;

    // Initialize state from localStorage or defaults
    const [currentIndex, setCurrentIndex] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved).currentIndex : 0;
    });

    const [selectedAnswers, setSelectedAnswers] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved).selectedAnswers : {};
    });

    const [timeLeft, setTimeLeft] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved).timeLeft : -1;
    });

    // Sync state to localStorage on every change
    useEffect(() => {
        if (timeLeft === -1) return;
        const state = { currentIndex, selectedAnswers, timeLeft };
        localStorage.setItem(storageKey, JSON.stringify(state));
    }, [currentIndex, selectedAnswers, timeLeft, storageKey]);

    // Handle initial duration setting if no saved session
    useEffect(() => {
        if (quizDuration && timeLeft === -1) {
            setTimeLeft(quizDuration * 60);
        }
    }, [quizDuration, timeLeft]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(async (answers = selectedAnswers) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        
        const success = await onSubmit(answers);
        if (success) {
            localStorage.removeItem(storageKey);
        } else {
            setIsSubmitting(false);
        }
    }, [onSubmit, selectedAnswers, storageKey, isSubmitting]);

    // Auto-submit when time is up
    useEffect(() => {
        if (timeLeft === 0 && !isSubmitting) {
            handleSubmit();
        }
    }, [timeLeft, handleSubmit, isSubmitting]);

    // Timer logic
    useEffect(() => {
        if (timeLeft <= 0) return;
        
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, [timeLeft > 0]); // Start timer once timeLeft is initialized

    const handleOptionSelect = (option) => {
        if (timeLeft <= 0 || isSubmitting) return;
        setSelectedAnswers(prev => ({
            ...prev,
            [currentIndex]: option
        }));
    };

    const nextQuestion = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const prevQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const goToQuestion = (index) => {
        setCurrentIndex(index);
    };

    return {
        currentIndex,
        selectedAnswers,
        timeLeft,
        handleOptionSelect,
        nextQuestion,
        prevQuestion,
        goToQuestion,
        handleSubmit,
    };
}
