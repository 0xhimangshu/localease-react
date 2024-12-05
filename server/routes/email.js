import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { transporter } from '../helpers/mail.js';

const router = express.Router();

router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    user.isEmailVerified = true;
    await user.save();

    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Email verified successfully',
      token: authToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar || '',
        userType: user.userType,
        phone: user.phone || '',
        address: user.address || ''
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid verification token' });
    }
    res.status(500).json({ message: 'Error verifying email', error: error.message });
  }
});

// Add a test route
router.get('/test', async (req, res) => {
  try {
    await transporter.verify();
    res.json({ message: 'Email service is working' });
  } catch (error) {
    console.error('Email service error:', error);
    res.status(500).json({ 
      message: 'Email service is not working', 
      error: error.message 
    });
  }
});

export default router;
