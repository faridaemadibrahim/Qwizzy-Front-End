import { Outlet, useLocation } from "react-router-dom";

import QmBrandNavbar from "../components/QmBrandNavbar.jsx";

export default function RootLayout() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const hideAuthCtas = ["/login", "/forgot-password", "/register"].includes(
    location.pathname,
  );

  return (
    <div className={`qm-app ${isLanding ? "landing-page" : ""}`}>
      <QmBrandNavbar hideAuthCtas={hideAuthCtas} />
      <Outlet />
    </div>
  );
}
