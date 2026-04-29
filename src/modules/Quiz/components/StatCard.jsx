import useGetUserStates from "../hooks/useGetUserStates";

export default function StatCard({ label, value, emoji }) {

  return (
    <div className="card border-0 flex-grow-1 stat-card">
      <div className="card-body d-flex justify-content-between align-items-center p-4">
        <div>
          <p className="mb-1 qm-text-muted" style={{ fontSize: "0.85rem" }}>
            {label}
          </p>
          <p className="mb-0 fw-bold" style={{ fontSize: "1.6rem" }}>
            {value}
          </p>
        </div>
        <span style={{ fontSize: "2rem" }}>{emoji}</span>
      </div>
    </div>
  );
}
