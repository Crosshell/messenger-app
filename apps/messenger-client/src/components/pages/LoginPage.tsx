import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, User } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { loginSchema, type LoginFormData } from '../../validators/login';

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    console.log(data);
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-950">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Please sign in to continue</p>
        </div>

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
                to="#"
                className="text-xs text-blue-500 hover:text-blue-700"
              >
                Forgot password?
              </NavLink>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Log In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-blue-500 font-semibold hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};
