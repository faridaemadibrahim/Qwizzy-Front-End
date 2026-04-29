import { useState, useEffect } from "react";
import { getUserStats } from "../services/quizService";

export default function useGetUserStates() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await getUserStats();
                const data = response.data?.data || response.data;

                setStats([
                    {
                        label: "Quizzes Completed",
                        value: data?.quizzes_completed ?? 0,
                        emoji: "🗂️",
                    },
                    {
                        label: "Average Score",
                        value: `${data?.average_score ?? 0}%`,
                        emoji: "🎯",
                    },
                    {
                        label: "Total Points",
                        value: data?.total_points ?? 0,
                        emoji: "⭐",
                    },
                ]);

            } catch (err) {
                setError(err.message || "Failed to fetch stats");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
}
