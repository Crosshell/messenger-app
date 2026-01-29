import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <Outlet />
      </div>
    </div>
  );
};
