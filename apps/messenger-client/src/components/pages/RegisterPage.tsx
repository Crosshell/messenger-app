import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, LockKeyhole } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import {
  registerSchema,
  type RegisterFormData,
} from '../../validators/register.ts';
import { NavLink, useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });

  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    console.log(data);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-950">Create Account</h1>
          <p className="text-slate-400 mt-2">Your conversations start here</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Username"
            icon={<User size={20} />}
            {...register('username')}
            error={errors.username?.message}
          />

          <Input
            type="email"
            placeholder="Email"
            icon={<Mail size={20} />}
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            type="password"
            placeholder="Password"
            icon={<Lock size={20} />}
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            icon={<LockKeyhole size={20} />}
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : 'Register'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <NavLink
            to="/login"
            className="text-blue-500 font-semibold hover:underline"
          >
            Log in
          </NavLink>
        </div>
      </div>
    </div>
  );
};
