import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, LockKeyhole } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import {
  registerSchema,
  type RegisterFormData,
} from '../validators/register.validator';
import { NavLink } from 'react-router-dom';
import { useRegister } from '../hooks/use-register';

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });

  const { mutate, isPending, isSuccess } = useRegister({
    setError,
  });

  const onSubmit = (data: RegisterFormData) => {
    mutate(data);
  };

  if (isSuccess) {
    return (
      <>
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Registration Successful!
        </h2>

        <p className="text-gray-600 mb-6">
          Confirmation email has been sent to your inbox
        </p>

        <NavLink
          to="/login"
          className="text-blue-500 font-semibold hover:underline"
        >
          Go to Login
        </NavLink>
      </>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-950">Create Account</h1>
        <p className="text-slate-400 mt-2">Your conversations start here</p>
      </div>

      {errors.root && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="text"
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

        <Button type="submit" className="w-full mt-2" disabled={isPending}>
          {isPending ? 'Loading...' : 'Register'}
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
    </>
  );
};
