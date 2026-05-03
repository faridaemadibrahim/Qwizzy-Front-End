import { useCallback, useEffect, useState } from "react";
import { getAllQuizzesWithQuestionCount } from "../services/quizService.js";

/** Maps `/quizzes/question_count/` row → props expected by QuizCard / AdminQuizCard */
function normalizeQuiz(quiz) {
  return {
    id: quiz.id,
    title: quiz.title,
    category_id: quiz.category_id,
    category: quiz.category_name,
    description: quiz.description,
    duration: quiz.time_limit_minutes,
    difficulty: quiz.difficulty,
    questions: quiz.questions_count,
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
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      void load();
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  return { quizzes, loading, error, refetch: load };
}
