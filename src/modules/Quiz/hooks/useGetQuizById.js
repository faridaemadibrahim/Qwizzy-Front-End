import { useEffect, useState } from "react";
import { getQuizById, getQuestionsByQuizId } from "../services/quizService.js";

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
        // 1. Fetch Quiz Metadata
        const { data: quizRes } = await getQuizById(id);
        if (!active) return;

        const quizData = quizRes?.data || quizRes;
        if (!quizData) {
          setError("No quiz details found.");
          return;
        }

        // 2. Fetch Questions with Options (same as instructor)
        let questionsWithOpts = [];
        try {
          const { data: questionsRes } = await getQuestionsByQuizId(id);
          const questionsBody = questionsRes?.data || questionsRes || [];
          
          if (Array.isArray(questionsBody)) {
            questionsWithOpts = questionsBody.map((q) => {
              const opts = q.options ?? q.question_options ?? q.answers ?? [];
              return {
                id: q.id,
                text: q.body || q.question_text || q.text || "",
                type: q.question_type || "MCQ",
                options: opts.map(o => ({ 
                  id: o.id, 
                  label: o.label || o.text || o.option_text || "" 
                })),
                sort_order: q.sort_order || 0
              };
            });
          }
        } catch (qErr) {
          console.warn("Failed to fetch questions separately, checking quiz response", qErr);
          // Fallback to questions in quiz metadata if any
          const questionRows = Array.isArray(quizData) ? quizData : (quizData.questions_list || []);
          if (questionRows.length > 0) {
            questionsWithOpts = questionRows.map((q) => {
              const opts = q.options ?? q.question_options ?? q.answers ?? [];
              return {
                id: q.id,
                text: q.body || q.question_text || q.text || "",
                type: q.question_type || "MCQ",
                options: opts.map(o => ({ 
                  id: o.id, 
                  label: o.label || o.text || o.option_text || "" 
                })),
                sort_order: q.sort_order || 0
              };
            });
          }
        }
        
        setQuiz(normalizeQuiz(quizData, questionsWithOpts.sort((a, b) => a.sort_order - b.sort_order)));
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
