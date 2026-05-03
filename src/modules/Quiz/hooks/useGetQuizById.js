import { useEffect, useState } from "react";
import { getQuizById } from "../services/quizService.js";

function normalizeQuiz(quiz) {
  if (!quiz) return null;
  return {
    id: quiz.id,
    title: quiz.title || "Untitled Quiz",
    category: quiz.category || "General",
    description: quiz.description || "No description available.",
    duration: quiz.time_limit_minutes || 0,
    difficulty: (quiz.difficulty || "medium").toLowerCase(),
    questions: quiz.questions_count || 0,
    questionsList: quiz.questions_list || [],
  };
}

export default function useGetQuizById(id) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } = await getQuizById(id);
        if (!active) return;

        const quizData = data?.data || data;

        if (quizData) {
          setQuiz(normalizeQuiz(quizData));
        } else {
          setError("No quiz details found.");
        }
      } catch (err) {
        if (!active) return;
        setError(
          err?.response?.data?.message || "Failed to load quiz details."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [id]);

  return { quiz, loading, error };
}
