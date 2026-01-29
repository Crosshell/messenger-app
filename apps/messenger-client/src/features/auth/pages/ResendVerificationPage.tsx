import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@ui/Input.tsx';
import { Button } from '@ui/Button.tsx';
import {
  type ResendVerificationFormData,
  resendVerificationSchema,
} from '../model/validators/resend-verification.validator.ts';
import { useResendVerification } from '../hooks/use-resend-verification.ts';

export const ResendVerificationPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResendVerificationFormData>({
    resolver: zodResolver(resendVerificationSchema),
    mode: 'onTouched',
  });

  const { mutate, isPending, isSuccess } = useResendVerification({
    setError,
  });

  const onSubmit = (data: ResendVerificationFormData) => {
    mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Send className="text-blue-600" size={32} />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Email Sent!</h2>
        <p className="mb-6 text-gray-500">
          If an account exists with this email, you will receive a new
          verification link shortly
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
        <h1 className="text-3xl font-bold text-purple-950">
          Resend Verification
        </h1>
        <p className="mt-2 text-slate-400">
          Didn't receive the email? Enter your address below
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
          {isPending ? 'Sending...' : 'Send Link'}
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
