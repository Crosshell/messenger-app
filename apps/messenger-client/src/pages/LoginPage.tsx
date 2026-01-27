import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, User } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input.tsx';
import { Button } from '../components/ui/Button.tsx';
import { loginSchema, type LoginFormData } from '../validators/login.ts';
import { useLogin } from '../hooks/useLogin.ts';

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const navigate = useNavigate();

  const { mutate, isPending } = useLogin({
    setError,
    onSuccess: () => {
      navigate('/chat');
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-950">Welcome Back</h1>
        <p className="text-slate-400 mt-2">Please sign in to continue</p>
      </div>

      {errors.root && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm flex items-center justify-center">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          type="text"
          placeholder="Username or Email"
          icon={<User size={20} />}
          {...register('login')}
          error={errors.login?.message}
        />

        <div className="space-y-1">
          <Input
            type="password"
            placeholder="Password"
            icon={<Lock size={20} />}
            {...register('password')}
            error={errors.password?.message}
          />
          <div className="text-right">
            <NavLink
              to="/forgot-password"
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              Forgot password?
            </NavLink>
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Signing in...' : 'Log In'}
        </Button>
      </form>

      <div className="mt-4 text-center text-xs">
        <span className="text-slate-400">Didn't receive confirmation? </span>
        <Link
          to="/resend-verification"
          className="text-blue-500 hover:text-blue-700"
        >
          Resend email
        </Link>
      </div>

      <div className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-blue-500 font-semibold hover:underline"
        >
          Register
        </Link>
      </div>
    </>
  );
};
