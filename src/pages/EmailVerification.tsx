import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Toast } from '../components/Toast';

export function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const fromLogin = searchParams.get('from') === 'login';
      
      if (!token) {
        setStatus('error');
        setToastMessage('Invalid verification link');
        setToastType('error');
        setShowToast(true);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/email/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setStatus('success');
        setToastMessage('Email verified successfully!');
        setToastType('success');
        setShowToast(true);

        if (fromLogin) {
          setTimeout(() => {
            navigate('/', { 
              replace: true,
              state: { 
                showWelcome: true,
                message: 'Welcome to LocalEase! Your email has been verified.' 
              }
            });
          }, 2000);
        }

      } catch (error) {
        setStatus('error');
        setToastMessage(error instanceof Error ? error.message : 'Verification failed');
        setToastType('error');
        setShowToast(true);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="glass-card max-w-md w-full space-y-8 p-8 text-center">
        <h2 className="text-3xl font-bold">Email Verification</h2>
        
        {status === 'verifying' && (
          <div className="space-y-4">
            <p>Verifying your email address...</p>
            <Toast
              type="loading"
              message="Please wait while we verify your email"
              duration={10000}
              onClose={() => {}}
            />
          </div>
        )}

        {status === 'success' && searchParams.get('from') !== 'login' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-green-500 text-xl font-semibold">Your email has been verified successfully!</p>
              <p className="text-gray-600">You can now login to your account or return home.</p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="btn-gradient text-white px-6 py-2 rounded-full font-medium"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-outline px-6 py-2 rounded-full font-medium"
              >
                Go to Home
              </button>
            </div>
          </div>
        )}

        {status === 'success' && searchParams.get('from') === 'login' && (
          <div className="space-y-4">
            <p className="text-green-500 text-xl font-semibold">Your email has been verified successfully!</p>
            <p className="text-gray-600">Redirecting to home page...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <p className="text-red-500">Verification failed</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="btn-gradient text-white px-4 py-2 rounded-full"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-outline px-4 py-2 rounded-full"
              >
                Go to Home
              </button>
            </div>
          </div>
        )}
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
} 