import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, LockKeyhole, CheckCircle2, XCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Input } from '../components/ui/Input.tsx';
import { Button } from '../components/ui/Button.tsx';
import { useResetPassword } from '../hooks/use-reset-password.ts';
import {
  type ResetPasswordFormData,
  resetPasswordSchema,
} from '../validators/reset-password.validator.ts';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
  });

  const { mutate, isPending, isSuccess } = useResetPassword({
    setError,
  });

  if (!token) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="text-red-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
        <p className="text-gray-500 mb-6">
          The password reset link is missing or broken
        </p>
        <Link to="/login">
          <Button className="w-full">Return to Login</Button>
        </Link>
      </div>
    );
  }

  const onSubmit = (data: ResetPasswordFormData) => {
    mutate({
      password: data.password,
      token,
    });
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="text-green-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Password Reset!
        </h2>
        <p className="text-gray-500 mb-6">
          Your password has been successfully reset
        </p>
        <Link to="/login">
          <Button className="w-full">Proceed to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-950">Reset Password</h1>
        <p className="text-slate-400 mt-2">Enter your new password below</p>
      </div>

      {errors.root && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm text-center">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="password"
          placeholder="New Password"
          icon={<Lock size={20} />}
          {...register('password')}
          error={errors.password?.message}
        />

        <Input
          type="password"
          placeholder="Confirm New Password"
          icon={<LockKeyhole size={20} />}
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button type="submit" className="w-full mt-2" disabled={isPending}>
          {isPending ? 'Resetting...' : 'Set New Password'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Remember your password?{' '}
        <Link
          to="/login"
          className="text-blue-500 font-semibold hover:underline"
        >
          Log in
        </Link>
      </div>
    </>
  );
};
