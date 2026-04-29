import { useEffect, useState } from "react";
import { getAllQuizzes } from "../services/quizService.js";

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
      quiz.questions ??
      quiz.question_count ??
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

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } = await getAllQuizzes();
        if (!active) return;
        const normalized = getQuizArray(data).map((q, i) => normalizeQuiz(q, i));
        setQuizzes(normalized);
      } catch (err) {
        if (!active) return;
        setError(
          err?.response?.data?.message || "Failed to load quizzes. Try again."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return { quizzes, loading, error };
}
