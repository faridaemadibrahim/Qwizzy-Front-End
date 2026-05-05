import { useCallback, useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";

/**
 * Normalizes user data from API to ensure consistent structure for UsersCard
 */
function normalizeUser(u) {
    return {
        id: u.id || u._id || Math.random(),
        name: u.full_name || "Unknown User",
        email: u.email || "No email provided",
        role: u.role || "Learner",
        quizzesCount: u.quizzes_count ?? 0,
    };
}

export default function useGetAllUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { data } = await getAllUsers();
            // In many APIs the data is nested under .data or .users
            const rawUsers = data?.data || data?.users || data || [];
            const usersArray = Array.isArray(rawUsers) ? rawUsers : [];
            setUsers(usersArray.map(normalizeUser));
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return { users, loading, error, refetch: load };
}

