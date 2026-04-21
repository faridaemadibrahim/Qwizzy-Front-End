import { cta } from "../data/landingContent.js";
import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <section
      className="py-5 text-center"
      id="get-started"
      aria-labelledby="cta-heading"
    >
      <div className="container py-lg-2">
        <h2 id="cta-heading" className="h2 fw-bold mb-3">
          {cta.title}
        </h2>
        <p className="text-qm-muted mb-4">{cta.subtitle}</p>

        <Link className="btn btn-lg btn-qm-gradient rounded-3" to="/register">
          {cta.button}
        </Link>
      </div>
    </section>
  );
}
