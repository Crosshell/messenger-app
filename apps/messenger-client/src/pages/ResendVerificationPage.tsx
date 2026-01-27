import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input.tsx';
import { Button } from '../components/ui/Button.tsx';
import {
  resendVerificationSchema,
  type ResendVerificationFormData,
} from '../validators/resend-verification.validator.ts';
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
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="text-blue-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Sent!</h2>
        <p className="text-gray-500 mb-6">
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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-950">
          Resend Verification
        </h1>
        <p className="text-slate-400 mt-2">
          Didn't receive the email? Enter your address below
        </p>
      </div>

      {errors.root && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm text-center">
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
          className="text-sm text-slate-500 hover:text-gray-900 flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to log in
        </Link>
      </div>
    </>
  );
};
