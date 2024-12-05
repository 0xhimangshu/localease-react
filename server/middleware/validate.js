import { validateEmail } from '../helpers/emailValidator.js';

// Validate registration data
const validateRegistration = (req, res, next) => {
  const { email, password, firstName, lastName, phone, userType } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Enhanced email validation
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return res.status(400).json({ message: emailValidation.message });
  }

  // Password validation (minimum 6 characters)
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // Phone validation (optional)
  if (phone) {
    const phoneRegex = /^[\d\s+-]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        message: 'Invalid phone number format. Please use numbers, spaces, + or - only' 
      });
    }
  }

  // Business validation
  if (userType === 'business') {
    const { businessDetails } = req.body;
    if (!businessDetails?.name) {
      return res.status(400).json({ message: 'Business name is required' });
    }
  }

  next();
};

// Validate login data
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  next();
};

export { validateRegistration, validateLogin }; 