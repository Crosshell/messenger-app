import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Lock, LockKeyhole, XCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Input } from '@ui/Input.tsx';
import { Button } from '@ui/Button.tsx';
import { useResetPassword } from '../hooks/use-reset-password.ts';
import {
  type ResetPasswordFormData,
  resetPasswordSchema,
} from '../model/validators/reset-password.validator.ts';

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
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <XCircle className="text-red-600" size={32} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Invalid Link</h1>
        <p className="mb-6 text-gray-500">
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
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="text-green-600" size={32} />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Password Reset!
        </h2>
        <p className="mb-6 text-gray-500">
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
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-purple-950">Reset Password</h1>
        <p className="mt-2 text-slate-400">Enter your new password below</p>
      </div>

      {errors.root && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-100 p-3 text-center text-sm text-red-700">
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

        <Button type="submit" className="mt-2 w-full" disabled={isPending}>
          {isPending ? 'Resetting...' : 'Set New Password'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Remember your password?{' '}
        <Link
          to="/login"
          className="font-semibold text-blue-500 hover:underline"
        >
          Log in
        </Link>
      </div>
    </>
  );
};
