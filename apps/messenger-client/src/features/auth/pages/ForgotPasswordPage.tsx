import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@ui/Input.tsx';
import { Button } from '@ui/Button.tsx';
import {
  type ForgotPasswordFormData,
  forgotPasswordSchema,
} from '../model/validators/forgot-password.validator.ts';
import { useForgotPassword } from '../hooks/use-forgot-password.ts';

export const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
  });

  const { mutate, isPending, isSuccess } = useForgotPassword({
    setError,
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="text-green-600" size={32} />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Check your mail
        </h2>
        <p className="mb-6 text-gray-500">
          We have sent a password recover instructions to your email
        </p>
        <Link to="/login">
          <Button className="w-full">Back to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-purple-950">Forgot Password?</h1>
        <p className="mt-2 text-slate-400">
          No worries, we'll send you reset instructions
        </p>
      </div>

      {errors.root && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-100 p-3 text-center text-sm text-red-700">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          type="email"
          placeholder="Enter your email"
          icon={<Mail size={20} />}
          {...register('email')}
          error={errors.email?.message}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Sending...' : 'Reset Password'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm text-slate-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to log in
        </Link>
      </div>
    </>
  );
};
