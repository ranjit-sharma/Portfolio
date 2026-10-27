import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import AnimatedCursor from './components/ui/AnimatedCursor';
import { Spinner } from './components/ui/index';

// Code-split admin and error pages for optimal public initial load performance
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProjects = lazy(() => import('./pages/AdminProjects'));
const AdminEducation = lazy(() => import('./pages/AdminEducation'));
const AdminExperience = lazy(() => import('./pages/AdminExperience'));
const AdminSkills = lazy(() => import('./pages/AdminSkills'));
const AdminCertifications = lazy(() => import('./pages/AdminCertifications'));
const AdminMessages = lazy(() => import('./pages/AdminMessages'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));

function RouteLoadingFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Spinner size={32} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AnimatedCursor />
        <AuthProvider>
          <MotionConfig reducedMotion="never">
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                {/* Public routes */}
                <Route element={<RootLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Admin login (no layout) */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin protected routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="education" element={<AdminEducation />} />
                  <Route path="experience" element={<AdminExperience />} />
                  <Route path="skills" element={<AdminSkills />} />
                  <Route path="certifications" element={<AdminCertifications />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </Suspense>
          </MotionConfig>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
