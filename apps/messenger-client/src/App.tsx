import { ResendVerificationPage } from '@features/auth/pages/ResendVerificationPage.tsx';
import { useAutoRefresh } from '@features/auth/hooks/use-auto-refresh.ts';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '@features/auth/layouts/AuthLayout.tsx';
import { RegisterPage } from '@features/auth/pages/RegisterPage.tsx';
import { LoginPage } from '@features/auth/pages/LoginPage.tsx';
import { EmailVerificationPage } from '@features/auth/pages/EmailVerificationPage.tsx';
import { ForgotPasswordPage } from '@features/auth/pages/ForgotPasswordPage.tsx';
import { ResetPasswordPage } from '@features/auth/pages/ResetPasswordPage.tsx';
import { SocketProvider } from '@app/providers/SocketProvider.tsx';
import { ProtectedRoute } from '@app/router/ProtectedRoute.tsx';
import { ChatPage } from '@features/chat/pages/ChatPage.tsx';

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

        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </>
  );
}
