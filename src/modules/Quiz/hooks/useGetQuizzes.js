import { useCallback, useEffect, useState } from "react";
import { getAllQuizzesWithQuestionCount } from "../services/quizService.js";

function normalizeQuiz(quiz) {
  return {
    id: quiz.id,
    title: quiz.title || "Untitled Quiz",
    category: quiz.category || "General",
    description: quiz.description || "No description available.",
    duration: quiz.time_limit_minutes || 0,
    difficulty: (quiz.difficulty || "medium").toLowerCase(),
    questions: quiz.questions_count || 0,
  };
}

function getQuizArray(payload) {
  return payload?.data || payload || [];
}

export default function useQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getAllQuizzesWithQuestionCount();
      const rawQuizzes = getQuizArray(data);
      const normalized = rawQuizzes.map((q) => normalizeQuiz(q));

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
