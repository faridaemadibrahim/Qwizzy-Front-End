export default function DashboardHeader({ title, userName, description }) {
  return (
    <div className="mb-5">
      <h1 className="fw-bold mb-1" style={{ fontSize: "2rem" }}>
        {title}, <span className="qm-text-purple">{userName}</span>
      </h1>
      <p className="qm-text-muted">{description}</p>
    </div>
  );
}
