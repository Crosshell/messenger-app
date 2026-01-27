import { RegisterPage } from './pages/RegisterPage.tsx';
import { Navigate, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage.tsx';
import { AuthLayout } from './components/layouts/AuthLayout.tsx';
import { EmailVerificationPage } from './pages/EmailVerificationPage.tsx';

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/confirm" element={<EmailVerificationPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </>
  );
}
