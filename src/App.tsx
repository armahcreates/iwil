import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/layouts/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { DemoCredentialsPage } from './pages/DemoCredentialsPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReportsPage } from './pages/ReportsPage';
import { ClientsPage } from './pages/ClientsPage';
import { ClientDetailPage } from './pages/ClientDetailPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { CalendarPage } from './pages/CalendarPage';
import { Sparkles } from 'lucide-react';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/demo" element={<DemoCredentialsPage />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/:clientId" element={<ClientDetailPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="analytics" element={<ComingSoonPage title="Analytics & Insights" />} />
          <Route path="compliance" element={<ComingSoonPage title="HIPAA Compliance" />} />
          <Route path="settings" element={<ComingSoonPage title="Settings" />} />
        </Route>

        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

const ComingSoonPage = ({ title }: { title: string }) => (
  <div className="flex h-full items-center justify-center p-6 md:p-8 bg-gradient-to-br from-blue-50/20 to-green-50/20">
    <div className="text-center">
       <div className="w-16 h-16 iwil-gradient rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">This feature is currently under development and will be available soon.</p>
    </div>
  </div>
);

export default App;
