export default function UsersCard({ user }) {
  return (
    <div className="card border-0 h-100 quiz-card">
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#7c3aed",
              color: "white",
              marginRight: "12px",
            }}
          >
            {user.name.charAt(0)}
          </div>
          <div>
            <h6 className="fw-bold mb-0" style={{ fontSize: "1rem" }}>
              {user.name}
            </h6>
            <span className="qm-text-muted" style={{ fontSize: "0.75rem" }}>
              {user.role}
            </span>
          </div>
        </div>
        <p className="mb-2 qm-text-muted" style={{ fontSize: "0.85rem" }}>
          📧 {user.email}
        </p>
        <p
          className="mb-0"
          style={{ fontSize: "0.85rem", fontWeight: "600", color: "#333" }}
        >
          🎯 Quizzes Taken:{" "}
          <span style={{ color: "#7c3aed" }}>{user.quizzesTaken}</span>
        </p>
      </div>
    </div>
  );
}
