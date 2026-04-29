import { useEffect, useState } from "react";
import { getQuizById } from "../services/quizService.js";

function normalizeQuiz(quiz) {
  if (!quiz || typeof quiz !== "object") return null;
  const normalizedTitle =
    (typeof quiz.title === "string" && quiz.title.trim()) ||
    (typeof quiz.name === "string" && quiz.name.trim()) ||
    "Untitled Quiz";

  const normalizedDescription =
    (typeof quiz.description === "string" && quiz.description.trim()) ||
    "No description available.";

  return {
    id: quiz.id ?? quiz._id,
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
    questionsList: quiz.questionsList ?? quiz.questions_list ?? [],
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

        // Robustly find the quiz object in the response
        let quizData = data;
        if (data?.quiz) quizData = data.quiz;
        else if (data?.data?.quiz) quizData = data.data.quiz;
        else if (data?.data) quizData = data.data;

        if (quizData) {
          const normalized = normalizeQuiz(quizData);
          if (normalized) {
            setQuiz(normalized);
          } else {
            setError("Failed to parse quiz details.");
          }
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
