import express from 'express';
import passport from 'passport';
import {
  formatUserData,
  generateToken,
  handleGoogleAuthResponse,
  validatePassword
} from '../helpers/auth.js';
import { sendVerificationEmail } from '../helpers/mail.js';
import User from '../models/User.js';

import { loginLimiter, registerLimiter } from '../middleware/rateLimiter.js';
import { validateLogin, validateRegistration } from '../middleware/validate.js';

const router = express.Router();

// Registration route with validation and rate limiting
router.post('/register', 
  registerLimiter,
  validateRegistration,
  async (req, res) => {
    try {
      const { 
        email, 
        password, 
        firstName, 
        lastName, 
        phone, 
        address, 
        userType, 
        businessDetails 
      } = req.body;
      
      console.log('Received phone:', phone);

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const userData = {
        email,
        password,
        firstName,
        lastName,
        phone: phone || '',
        address: address || '',
        userType,
        businessDetails: userType === 'business' ? {
          businessName: businessDetails?.name,
          businessType: businessDetails?.type,
          phone: businessDetails?.phone,
          address: businessDetails?.address
        } : undefined,
        isEmailVerified: false
      };

      console.log('Creating user with data:', userData);

      const user = new User(userData);
      await user.save();
      try {
        const verificationToken = await sendVerificationEmail(user._id, user.email, user.firstName);
        res.status(201).json({
          message: 'Registration successful. Please check your email for verification.',
          userId: user._id,
          verificationToken 
        });
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        res.status(201).json({
          message: 'Registration successful but failed to send verification email. Please try logging in to resend the verification email.',
          userId: user._id
        });
      }

    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }
);


router.post('/login',
  loginLimiter,
  validateLogin,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      const validation = await validatePassword(user, password);
      if (!validation.isValid) {
        return res.status(401).json({
          code: validation.code,
          message: validation.message
        });
      }

      // Check if email is verified
      if (!user.isEmailVerified) {
        try {
          await sendVerificationEmail(user._id, user.email, user.firstName);
          return res.status(403).json({
            code: 'EMAIL_NOT_VERIFIED',
            message: 'Please verify your email address. A new verification link has been sent.'
          });
        } catch (emailError) {
          console.error('Error sending verification email:', emailError);
          return res.status(403).json({
            code: 'EMAIL_NOT_VERIFIED',
            message: emailError.message.includes('Please wait') 
              ? emailError.message 
              : 'Email not verified. Please contact support.'
          });
        }
      }

      const token = generateToken(user._id);
      
      // Set CORS headers explicitly for this response
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Credentials', true);
      
      res.json({ 
        token, 
        user: formatUserData(user)
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  }
);

// Google OAuth Routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      const { token, user } = handleGoogleAuthResponse(req.user);
      res.redirect(
        `${process.env.CLIENT_URL}/?token=${token}&user=${user}&success=true`
      );
    } catch (error) {
      console.error('Google auth error:', error);
      res.redirect(`${process.env.CLIENT_URL}/?error=Authentication failed`);
    }
  }
);

export default router;