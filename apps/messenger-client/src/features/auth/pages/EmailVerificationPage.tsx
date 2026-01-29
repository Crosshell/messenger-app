import { Link, useSearchParams } from 'react-router-dom';
import { useVerifyEmail } from '../hooks/use-verify-email.ts';
import { Button } from '@ui/Button.tsx';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

export const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <XCircle className="text-red-600" size={32} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Invalid Link</h1>
        <p className="mb-6 text-gray-500">
          The verification link is missing or broken
        </p>
        <Link to="/login">
          <Button className="w-full">Return to Login</Button>
        </Link>
      </div>
    );
  }

  const { isLoading, isSuccess, isError, error } = useVerifyEmail(token);

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-purple-600" />
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Verifying...</h1>
        <p className="text-gray-500">Please wait while we verify your email</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="text-green-600" size={32} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Email Verified!
        </h1>
        <p className="mb-6 text-gray-500">
          Your account has been successfully activated
        </p>
        <Link to="/login">
          <Button className="w-full">Proceed to Login</Button>
        </Link>
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      typeof error.message === 'string'
        ? error.message
        : 'Something went wrong';

    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <XCircle className="text-red-600" size={32} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Verification Failed
        </h1>
        <p className="mx-auto mb-6 max-w-xs text-gray-500">{errorMessage}</p>
        <div className="flex flex-col gap-3">
          <Link to="/login">
            <Button className="w-full" variant="outline">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return null;
};
