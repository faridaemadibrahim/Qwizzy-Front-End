import { Outlet } from 'react-router-dom'

import QmBrandNavbar from '../components/QmBrandNavbar.jsx'

export default function RootLayout() {
  return (
    <div className="qm-app">
      <QmBrandNavbar />
      <Outlet />
    </div>
  )
}

