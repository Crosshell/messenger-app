import { RegisterPage } from './components/pages/RegisterPage.tsx';
import { Navigate, Routes, Route } from 'react-router-dom';
import { LoginPage } from './components/pages/LoginPage.tsx';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<div>Chat</div>} />
      </Routes>
    </>
  );
}
