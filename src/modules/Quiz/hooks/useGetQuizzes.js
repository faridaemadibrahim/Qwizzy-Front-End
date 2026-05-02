import { useCallback, useEffect, useState } from "react";
import { getAllQuizzes, getQuestionsByQuizId } from "../services/quizService.js";

function normalizeQuiz(quiz, idx) {
  const normalizedTitle =
    (typeof quiz.title === "string" && quiz.title.trim()) ||
    (typeof quiz.name === "string" && quiz.name.trim()) ||
    "Untitled Quiz";

  const normalizedDescription =
    (typeof quiz.description === "string" && quiz.description.trim()) ||
    "No description available.";

  return {
    id: quiz.id ?? quiz._id ?? idx + 1,
    title: normalizedTitle,
    category: quiz.category ?? "General",
    description: normalizedDescription,
    questions:
      quiz.questionsCount ??
      quiz.totalQuestions ??
      quiz.question_count ??
      (Array.isArray(quiz.questions) ? quiz.questions.length : quiz.questions) ??
      0,
    duration:
      quiz.duration ??
      quiz.durationMinutes ??
      quiz.timeLimit ??
      quiz.time_limit_minutes ??
      0,
    difficulty: (quiz.difficulty ?? "medium").toLowerCase(),
  };
}

function getQuizArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.quizzes)) return payload.quizzes;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

export default function useQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getAllQuizzes();
      const rawQuizzes = getQuizArray(data);
      const normalized = rawQuizzes.map((q, i) => normalizeQuiz(q, i));

      setQuizzes(normalized);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load quizzes. Try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { quizzes, loading, error, refetch: load };
}
