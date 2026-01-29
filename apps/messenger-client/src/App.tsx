import { RegisterPage } from './pages/RegisterPage';
import { Navigate, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { AuthLayout } from './components/layouts/AuthLayout';
import { EmailVerificationPage } from './pages/EmailVerificationPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ResendVerificationPage } from './pages/ResendVerificationPage';
import { ChatPage } from './pages/ChatPage';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { useAutoRefresh } from './hooks/use-auto-refresh.ts';
import { SocketProvider } from './context/SocketContext.tsx';

export default function App() {
  useAutoRefresh();

  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/confirm" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/resend-verification"
            element={<ResendVerificationPage />}
          />
        </Route>

        <Route
          element={
            <SocketProvider>
              <ProtectedRoute />
            </SocketProvider>
          }
        >
          <Route path="/chat" element={<ChatPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
