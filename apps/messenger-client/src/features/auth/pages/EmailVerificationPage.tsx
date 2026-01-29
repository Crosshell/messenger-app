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
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="text-red-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
        <p className="text-gray-500 mb-6">
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
      <div className="text-center py-8">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying...</h1>
        <p className="text-gray-500">Please wait while we verify your email</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="text-green-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Email Verified!
        </h1>
        <p className="text-gray-500 mb-6">
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
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="text-red-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Verification Failed
        </h1>
        <p className="text-gray-500 mb-6 max-w-xs mx-auto">{errorMessage}</p>
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
