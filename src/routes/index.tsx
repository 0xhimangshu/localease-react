import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { SignUp } from '../pages/SignUp';
import { Profile } from '../pages/Profile';
import { Error } from '../pages/Error';
import { EmailVerification } from '../pages/EmailVerification';
import { Services } from '../pages/services/Services';
import { Service } from '../pages/Service';

// import { ForgotPassword } from '../pages/ForgotPassword';

// <Route path="/forgot-password" element={<ForgotPassword />} />

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/services" element={<Services />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="/service/:id" element={<Service />} />
      <Route
        path="*" 
        element={
          <Error 
            customError={{ 
              status: 404, 
              statusText: 'Page Not Found',
              message: 'The page you are looking for does not exist.'
            }} 
          />
        } 
      />
    </Routes>
  );
}