import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { getQuizById, getQuestionsByQuizId } from "../../Quiz/services/quizService";
import { createQuestion, updateQuiz, createQuestionOption, getOptionsByQuestionId, deleteQuestion } from "../services/admin.api";

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

/** Unwrap common API shapes around a single quiz object. */
function unwrapQuizResponse(response) {
    const body = response?.data;
    if (!body || typeof body !== "object") return null;

    const candidates = [
        body.data?.quiz,
        body.quiz,
        body.result,
        body.payload?.quiz,
        typeof body.payload === "object" && body.payload?.id != null ? body.payload : null,
        typeof body.data === "object" && body.data !== null && !Array.isArray(body.data)
            ? body.data.quiz ?? body.data
            : null,
    ];

    for (const raw of candidates) {
        if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
        const looksLikeQuiz =
            "id" in raw ||
            "title" in raw ||
            "questions" in raw ||
            raw.name != null ||
            raw.quiz_title != null;
        if (looksLikeQuiz) return raw;
    }

    return typeof body.data === "object" && body.data !== null && !Array.isArray(body.data)
        ? body.data
        : body;
}

/** Ensure title/category_id align with PUT validation after GET. */
function normalizeFetchedQuiz(raw) {
    if (!raw || typeof raw !== "object") return raw;
    const pickTitle = (...cands) => {
        for (const c of cands) {
            if (typeof c === "string" && c.trim()) return c.trim();
        }
        return "";
    };
    const titled = pickTitle(
        raw.title,
        raw.name,
        raw.quiz_title,
        raw.quizTitle,
        raw.quiz_name
    );
    let category_id = raw.category_id ?? raw.categoryId;
    if (category_id == null && raw.category != null) {
        if (typeof raw.category === "object") category_id = raw.category.id;
        else if (typeof raw.category === "number") category_id = raw.category;
    }
    return {
        ...raw,
        title: titled,
        ...(category_id != null ? { category_id } : {}),
    };
}

function categoryIdFromQuiz(quiz) {
    if (!quiz) return undefined;
    if (quiz.category_id != null && quiz.category_id !== "") return quiz.category_id;
    if (quiz.category != null && typeof quiz.category === "object" && quiz.category.id != null) {
        return quiz.category.id;
    }
    if (typeof quiz.category === "number") return quiz.category;
    return undefined;
}

/** GET /quizzes/:id may use `questions`, `questions_list`, or nested shapes */
function pickQuestionsArray(raw) {
    if (!raw || typeof raw !== "object") return [];
    const tries = [
        raw.questions,
        raw.questions_list,
        raw.questionsList,
        raw.question_list,
        raw.quiz_questions,
    ];
    let emptyFallback = [];
    for (const t of tries) {
        if (!Array.isArray(t)) continue;
        if (t.length > 0) return t;
        emptyFallback = t;
    }
    return emptyFallback;
}

/** Prefer questions on quiz slice; walk common envelope nests */
function resolveQuestions(quizSlice, envelope) {
    const buckets = [quizSlice, envelope, envelope?.data].filter(
        (b) => b && typeof b === "object"
    );
    for (const b of buckets) {
        const arr = pickQuestionsArray(b);
        if (arr.length > 0) return arr;
    }
    return [];
}

function normalizeManageOption(opt) {
    if (opt == null) return { label: "", is_correct: false };
    if (typeof opt === "string") return { label: opt, is_correct: false };
    return {
        label: String(
            opt.label ?? opt.text ?? opt.option_text ?? opt.title ?? opt.value ?? ""
        ),
        is_correct: Boolean(opt.is_correct ?? opt.isCorrect ?? opt.correct),
    };
}

/** Shape expected by QuestionsList: body, question_type, points, options[{ label, is_correct }] */
function normalizeManageQuestion(q) {
    if (!q || typeof q !== "object") return q;
    const optRaw = q.options ?? q.question_options ?? q.answers ?? [];
    return {
        ...q,
        id: q.id,
        body:
            (typeof q.body === "string" && q.body) ||
            (typeof q.text === "string" && q.text) ||
            (typeof q.question_text === "string" && q.question_text) ||
            (typeof q.content === "string" && q.content) ||
            "",
        question_type: q.question_type ?? q.type ?? "MCQ",
        points: q.points ?? q.score ?? 1,
        options: Array.isArray(optRaw) ? optRaw.map(normalizeManageOption) : [],
    };
}

export default function useManageQuiz(quizId) {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [creatingQuestion, setCreatingQuestion] = useState(false);

    /** Avoid applying an older GET after `quizId` changes mid-flight */
    const activeQuizIdRef = useRef(quizId);
    useLayoutEffect(() => {
        activeQuizIdRef.current = quizId;
    }, [quizId]);

    const fetchQuizDetails = useCallback(async () => {
        const requestedId = quizId;
        try {
            setLoading(true);
            setError(null);

            // 1. Fetch Quiz Metadata (Essential)
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

            const quizData = normalizeFetchedQuiz(unwrapQuizResponse(quizResponse));
            if (!quizData) {
                setError("Quiz not found or invalid response structure.");
                setLoading(false);
                return;
            }
            setQuiz(quizData);

            // 2. Fetch Questions (Optional fallback)
            let questionRows = [];
            try {
                const questionsResponse = await getQuestionsByQuizId(requestedId);
                const questionsBody = questionsResponse?.data?.data || questionsResponse?.data || [];

                if (Array.isArray(questionsBody) && questionsBody.length > 0) {
                    const questionsWithOpts = await Promise.all(
                        questionsBody.map(async (q) => {
                            try {
                                const optRes = await getOptionsByQuestionId(q.id);
                                const optsData = optRes.data?.data || optRes.data || [];
                                return { ...q, options: Array.isArray(optsData) ? optsData : [] };
                            } catch {
                                return { ...q, options: [] };
                            }
                        })
                    );
                    questionRows = questionsWithOpts.map(normalizeManageQuestion);
                } else {
                    const envelope = quizResponse?.data && typeof quizResponse.data === "object" ? quizResponse.data : {};
                    questionRows = resolveQuestions(quizData, envelope).map(normalizeManageQuestion);
                }
            } catch (err) {
                console.warn("Questions endpoint failed, falling back to quiz detail response", err);
                const envelope = quizResponse?.data && typeof quizResponse.data === "object" ? quizResponse.data : {};
                questionRows = resolveQuestions(quizData, envelope).map(normalizeManageQuestion);
            }

            setQuestions(questionRows);
        } catch (err) {
            if (activeQuizIdRef.current !== requestedId) return;
            setError(err.response?.data?.message || err.message || "An unexpected error occurred");
        } finally {
            if (activeQuizIdRef.current === requestedId) {
                setLoading(false);
            }
        }
    }, [quizId]);



    /** Defer GET so `useEffect` does not synchronously cascade `setLoading` inside the linter rule */
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

            // 1. Create the question
            const qPayload = {
                quiz_id: quizId,
                ...questionData,
            };
            const qResponse = await createQuestion(qPayload);
            const newQuestion = qResponse.data?.data || qResponse.data;
            const questionId = newQuestion.id;

            // 2. Create the options
            const optionPromises = options.map((opt, idx) => {
                return createQuestionOption({
                    question_id: questionId,
                    label: opt.label,
                    is_correct: opt.is_correct,
                    sort_order: idx + 1
                });
            });

            await Promise.all(optionPromises);

            // 3. Update local state (same shape as fetched questions)
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
                error: err.response?.data?.message || "Failed to add question or options"
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

    /** @param {{ title?: string; category_id?: string | number }} [overrides] — from Manage page inputs when GET omits fields */

    const handlePublishQuiz = async (overrides = {}) => {
        const titleRaw = overrides.title ?? quiz?.title ?? "";
        const title = typeof titleRaw === "string" ? titleRaw.trim() : String(titleRaw).trim();
        const catOverride = overrides.category_id;
        const categoryRaw =
            catOverride !== undefined && String(catOverride).trim() !== ""
                ? catOverride
                : categoryIdFromQuiz(quiz);
        const category_id = String(categoryRaw ?? "").trim();

        if (!title) {
            return { success: false, error: "Quiz title cannot be empty." };
        }
        if (!category_id) {
            return {
                success: false,
                error: "category_id is required — select a category before publishing.",
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

        refresh: fetchQuizDetails
    };
}
