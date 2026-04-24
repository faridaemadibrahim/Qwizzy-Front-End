export const currentUser = {
  name: "Demo User",
  role: "Learner",
};

export const stats = [
  { label: "Quizzes Completed", value: 0, emoji: "🗂️" },
  { label: "Average Score", value: "0%", emoji: "🎯" },
  { label: "Total Points", value: 0, emoji: "⭐" },
];

export const quizzes = [
  {
    id: 1,
    title: "JavaScript Basics",
    category: "Programming",
    description: "Test your knowledge of fundamental JavaScript concepts",
    questions: 5,
    duration: 10,
    difficulty: "easy",
  },
  {
    id: 2,
    title: "React Fundamentals",
    category: "Web Development",
    description: "Learn about React components, hooks, and state management",
    questions: 5,
    duration: 15,
    difficulty: "medium",
  },
  {
    id: 3,
    title: "HTML & CSS",
    category: "Web Development",
    description: "Test your knowledge of HTML and CSS fundamentals",
    questions: 3,
    duration: 12,
    difficulty: "easy",
  },
  {
    id: 4,
    title: "Node.js Essentials",
    category: "Backend",
    description: "Explore server-side JavaScript with Node.js",
    questions: 6,
    duration: 20,
    difficulty: "hard",
  },
  {
    id: 5,
    title: "TypeScript Basics",
    category: "Programming",
    description: "Get started with TypeScript types and interfaces",
    questions: 4,
    duration: 12,
    difficulty: "medium",
  },
];

export const difficultyFilters = ["all", "easy", "medium", "hard"];
