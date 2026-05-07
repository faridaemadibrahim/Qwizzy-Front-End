import { useEffect, useState } from "react";
import { getQuizById } from "../services/quizService.js";
import { getOptionsByQuestionId } from "../../Admin/services/admin.api";

function normalizeQuiz(data, fullQuestions = []) {
  if (!data) return null;

  const base = Array.isArray(data) ? data[0] : data;
  
  return {
    id: base.quiz_id || base.id,
    title: base.title || base.quiz_title || "Untitled Quiz",
    category: (typeof base.category === 'object' ? base.category?.name : base.category) || "General",
    description: base.description || base.quiz_description || "No description available.",
    duration: base.time_limit_minutes || 0,
    difficulty: (base.difficulty || "medium").toLowerCase(),
    questions: fullQuestions.length || base.questions_count || 0,
    questionsList: fullQuestions.length > 0 ? fullQuestions : (base.questions_list || []),
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
        const { data: response } = await getQuizById(id);
        if (!active) return;

        const rawData = response?.data || response;
        if (!rawData) {
          setError("No quiz details found.");
          return;
        }

        // If we have an array of rows, each row is a question
        const questionRows = Array.isArray(rawData) ? rawData : (rawData.questions_list || []);
        
        if (questionRows.length > 0) {
          // Fetch options for each question
          const fullQuestions = await Promise.all(
            questionRows.map(async (q) => {
              try {
                const optRes = await getOptionsByQuestionId(q.id);
                const opts = optRes.data?.data || optRes.data || [];
                return {
                  id: q.id,
                  text: q.body || q.question_text || q.text || "",
                  type: q.question_type || "MCQ",
                  options: opts.map(o => ({ id: o.id, label: o.label || o.text || "" })),
                  sort_order: q.sort_order || 0
                };
              } catch (err) {
                console.error("Failed to fetch options for question", q.id, err);
                return {
                  id: q.id,
                  text: q.body || q.question_text || q.text || "",
                  type: q.question_type || "MCQ",
                  options: [],
                  sort_order: q.sort_order || 0
                };
              }
            })
          );
          
          setQuiz(normalizeQuiz(rawData, fullQuestions.sort((a, b) => a.sort_order - b.sort_order)));
        } else {
          setQuiz(normalizeQuiz(rawData));
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
