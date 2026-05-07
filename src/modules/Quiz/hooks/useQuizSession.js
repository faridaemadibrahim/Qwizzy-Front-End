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
        return saved ? JSON.parse(saved).timeLeft : 600;
    });

    // Sync state to localStorage on every change
    useEffect(() => {
        const state = { currentIndex, selectedAnswers, timeLeft };
        localStorage.setItem(storageKey, JSON.stringify(state));
    }, [currentIndex, selectedAnswers, timeLeft, storageKey]);

    // Handle initial duration setting if no saved session
    useEffect(() => {
        if (quizDuration && !localStorage.getItem(storageKey)) {
            setTimeLeft(quizDuration * 60);
        }
    }, [quizDuration, storageKey]);

    // Timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleOptionSelect = (option) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentIndex]: option
        }));
    };

    const handleSubmit = async () => {
        // Important: Pass selectedAnswers to ensuring we use the current state
        const success = await onSubmit(selectedAnswers);
        if (success) {
            localStorage.removeItem(storageKey);
        }
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
