import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { getQuizById } from "../../Quiz/services/quizService";
import {
    createQuestion,
    updateQuiz,
    createQuestionOption,
    getOptionsByQuestionId,
    deleteQuestion,
} from "../services/admin.api";

function formatUpdateQuizError(err) {
    const body = err?.response?.data;
    if (!body) return err?.message || "Failed to publish quiz";
    let msg = body.message || "Failed to publish quiz";
    const errors = body.errors;
    if (Array.isArray(errors) && errors.length) {
        msg = errors.map(String).join(" ");
    } else if (errors && typeof errors === "object" && !Array.isArray(errors)) {
        const parts = Object.entries(errors).flatMap(([key, val]) => {
            const msgs = Array.isArray(val) ? val : [String(val)];
            return msgs.map((m) => `${key}: ${m}`);
        });
        if (parts.length) msg = parts.join(" ");
    }
    return msg;
}

/**
 * GET /quizzes/:id → { success: true, data: [ rows ] }
 * Each row repeats quiz fields and carries one question (`id` = question id, `quiz_id` = quiz id).
 */
function parseQuizWithQuestionsResponse(response) {
    const envelope = response?.data;
    if (!envelope || typeof envelope !== "object" || !envelope.success) return null;
    if (!Array.isArray(envelope.data)) return null;

    const rows = envelope.data;
    if (rows.length === 0) {
        return { quiz: null, questionRows: [] };
    }

    const row0 = rows[0];
    const quiz = {
        id: row0.quiz_id,
        category_id: row0.category_id,
        title: row0.title,
        description: row0.description ?? "",
        created_by_user_id: row0.created_by_user_id,
        is_published: row0.is_published,
        time_limit_minutes: row0.time_limit_minutes,
        difficulty: row0.difficulty,
        created_at: row0.created_at,
        updated_at: row0.updated_at,
    };

    const questionRows = rows.map((r) => ({
        id: r.id,
        quiz_id: r.quiz_id,
        question_type: r.question_type,
        body: r.body,
        points: r.points,
        sort_order: r.sort_order,
    }));

    return { quiz, questionRows };
}

function normalizeManageOption(opt) {
    if (opt == null || typeof opt !== "object") return { label: "", is_correct: false };
    return {
        label: String(opt.label ?? ""),
        is_correct: Boolean(opt.is_correct),
    };
}

/** Shape expected by QuestionsList: body, question_type, points, options[{ label, is_correct }] */
function normalizeManageQuestion(q) {
    if (!q || typeof q !== "object") return q;
    const optRaw = Array.isArray(q.options) ? q.options : [];
    const pointsNum = Number.parseFloat(String(q.points ?? "1"));
    return {
        ...q,
        id: q.id,
        body: typeof q.body === "string" ? q.body : "",
        question_type: q.question_type ?? "MCQ",
        points: Number.isFinite(pointsNum) ? pointsNum : 1,
        options: optRaw.map(normalizeManageOption),
    };
}

/** Options list from GET /question-options/question/:id */
function optionsFromResponse(optRes) {
    const raw = optRes?.data;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
}

export default function useManageQuiz(quizId) {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [creatingQuestion, setCreatingQuestion] = useState(false);

    const activeQuizIdRef = useRef(quizId);
    useLayoutEffect(() => {
        activeQuizIdRef.current = quizId;
    }, [quizId]);

    const fetchQuizDetails = useCallback(async () => {
        const requestedId = quizId;
        try {
            setLoading(true);
            setError(null);

            let quizResponse;
            try {
                quizResponse = await getQuizById(requestedId);
            } catch (err) {
                console.error("Quiz metadata fetch failed", err);
                setError("Failed to fetch quiz details. Please check if the quiz exists.");
                setLoading(false);
                return;
            }

            if (activeQuizIdRef.current !== requestedId) return;

            const parsed = parseQuizWithQuestionsResponse(quizResponse);
            if (!parsed) {
                setError("Quiz not found or invalid response structure.");
                setQuiz(null);
                setQuestions([]);
                setLoading(false);
                return;
            }
            if (!parsed.quiz) {
                setError("This quiz has no rows yet — the API returned an empty list.");
                setQuiz(null);
                setQuestions([]);
                setLoading(false);
                return;
            }

            if (String(parsed.quiz.id) !== String(requestedId)) {
                setError("Quiz id mismatch between URL and API response.");
                setQuiz(null);
                setQuestions([]);
                setLoading(false);
                return;
            }

            setQuiz(parsed.quiz);

            const questionsWithOpts = await Promise.all(
                parsed.questionRows.map(async (q) => {
                    try {
                        const optRes = await getOptionsByQuestionId(q.id);
                        return { ...q, options: optionsFromResponse(optRes) };
                    } catch {
                        return { ...q, options: [] };
                    }
                }),
            );
            setQuestions(questionsWithOpts.map(normalizeManageQuestion));
        } catch (err) {
            if (activeQuizIdRef.current !== requestedId) return;
            setError(err.response?.data?.message || err.message || "An unexpected error occurred");
        } finally {
            if (activeQuizIdRef.current === requestedId) {
                setLoading(false);
            }
        }
    }, [quizId]);

    useEffect(() => {
        if (!quizId) return;
        const timerId = window.setTimeout(() => {
            void fetchQuizDetails();
        }, 0);
        return () => window.clearTimeout(timerId);
    }, [quizId, fetchQuizDetails]);

    const handleAddQuestion = async (questionData, options) => {
        try {
            setCreatingQuestion(true);

            const qPayload = {
                quiz_id: quizId,
                ...questionData,
            };
            const qResponse = await createQuestion(qPayload);
            const envelope = qResponse?.data;
            const newQuestion = envelope?.data ?? envelope;
            const questionId = newQuestion.id;

            const optionPromises = options.map((opt, idx) => {
                return createQuestionOption({
                    question_id: questionId,
                    label: opt.label,
                    is_correct: opt.is_correct,
                    sort_order: idx + 1,
                });
            });

            await Promise.all(optionPromises);

            setQuestions((prev) => [
                ...prev,
                normalizeManageQuestion({
                    ...newQuestion,
                    ...questionData,
                    options,
                }),
            ]);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Failed to add question or options",
            };
        } finally {
            setCreatingQuestion(false);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;

        try {
            setLoading(true);
            await deleteQuestion(questionId);
            setQuestions((prev) => prev.filter((q) => q.id !== questionId));
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Failed to delete question",
            };
        } finally {
            setLoading(false);
        }
    };

    const handlePublishQuiz = async (overrides = {}) => {
        const titleRaw = overrides.title ?? quiz?.title ?? "";
        const title = typeof titleRaw === "string" ? titleRaw.trim() : String(titleRaw).trim();
        const catOverride = overrides.category_id;
        const categoryRaw =
            catOverride !== undefined && String(catOverride).trim() !== ""
                ? catOverride
                : quiz?.category_id;
        const category_id = String(categoryRaw ?? "").trim();

        if (!title) {
            return { success: false, error: "Quiz title cannot be empty." };
        }
        if (!category_id) {
            return {
                success: false,
                error: "category_id is required before publishing.",
            };
        }

        try {
            setLoading(true);

            const timeRaw = quiz.time_limit_minutes;
            const time_limit_minutes =
                typeof timeRaw === "number" && !Number.isNaN(timeRaw)
                    ? timeRaw
                    : Number.parseInt(String(timeRaw ?? ""), 10) || 5;

            const payload = {
                title,
                description: quiz.description ?? "",
                category_id,
                time_limit_minutes,
                difficulty: quiz.difficulty ?? "medium",
                is_published: true,
            };

            await updateQuiz(quizId, payload);
            setQuiz((prev) => ({
                ...prev,
                ...payload,
                is_published: true,
            }));
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: formatUpdateQuizError(err),
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        quiz,
        questions,
        loading,
        error,
        creatingQuestion,
        handleAddQuestion,
        handleDeleteQuestion,
        handlePublishQuiz,

        refresh: fetchQuizDetails,
    };
}
