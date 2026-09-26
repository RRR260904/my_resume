import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioHome } from './pages/PortfolioHome';
import { ProjectDetails } from './pages/ProjectDetails';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { MouseFollowGlow } from './components/MouseFollowGlow';

export default function App() {
  return (
    <BrowserRouter>
      {/* Subtle futuristic cursor follower */}
      <MouseFollowGlow />

      <Routes>
        {/* Public Portfolio */}
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/projects/:slug" element={<ProjectDetails />} />

        {/* Admin Portal */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
