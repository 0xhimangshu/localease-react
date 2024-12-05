import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { Services } from '../components/Services';
import { About } from '../components/About';
import { Toast } from '../components/Toast';

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');

  useEffect(() => {
    const success = searchParams.get('success');
    const token = searchParams.get('token');
    const encodedUser = searchParams.get('user');

    if (success === 'true' && token && encodedUser) {
      try {
        localStorage.setItem('token', decodeURIComponent(token));
        
        const user = JSON.parse(decodeURIComponent(encodedUser));
        localStorage.setItem('user', JSON.stringify(user));
        
        setShowToast(true);
        
        setSearchParams({});
        
        setTimeout(() => {
          navigate('/profile', { replace: true });
        }, 1500);
        
      } catch (error) {
        console.error('Error processing auth data:', error);
      }
    } else if (location.state?.showSuccess) {
      setShowToast(true);
      navigate('.', { replace: true, state: {} });
    }
  }, [searchParams, location.state, navigate, setSearchParams]);

  useEffect(() => {
    const state = location.state as { 
      showVerifyEmail?: boolean; 
      userEmail?: string;
      showWelcome?: boolean;
      message?: string;
    } | null;

    if (state?.showVerifyEmail && state?.userEmail) {
      setToastMessage(`Please verify your email address (${state.userEmail}). Check your inbox for the verification link.`);
      setToastType('warning');
      setShowToast(true);
      // Clear the state after showing the message
      window.history.replaceState({}, document.title);
    } else if (state?.showWelcome && state?.message) {
      setToastMessage(state.message);
      setToastType('success');
      setShowToast(true);
      // Clear the state after showing the message
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <>
      <Hero />
      <Services />
      <About />
      
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={6000} // Show for longer since it's an important message
        />
      )}
    </>
  );
}