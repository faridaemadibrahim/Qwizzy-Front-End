export default function FeatureCard({ iconClass, title, description }) {
  return (
    <div className="col-md-4">
      <div className="card h-100 border shadow-sm feature-card border-qm-light">
        <div className="card-body p-4 text-start">
          <i className={`bi ${iconClass} feature-icon d-block mb-3`} aria-hidden />
          <h3 className="h5 fw-bold mb-2">{title}</h3>
          <p className="small text-qm-muted mb-0">{description}</p>
        </div>
      </div>
    </div>
  )
}
