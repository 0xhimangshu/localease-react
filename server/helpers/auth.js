import jwt from 'jsonwebtoken';

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
}

function formatUserData(user) {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar || '',
    userType: user.userType,
    phone: user.phone || '',
    address: user.address || ''
  };
}

function handleGoogleAuthResponse(user) {
  const token = generateToken(user._id);
  const userData = formatUserData(user);
  
  return {
    token: encodeURIComponent(token),
    user: encodeURIComponent(JSON.stringify(userData))
  };
}

async function validatePassword(user, password) {
  if (!user || !password) {
    return {
      isValid: false,
      code: 'ACCOUNT_NOT_FOUND',
      message: 'Account not found.'
    };
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    return {
      isValid: false,
      code: 'INVALID_PASSWORD', 
      message: 'Invalid password'
    };
  }

  return { isValid: true };
}

export {
  generateToken,
  formatUserData,
  handleGoogleAuthResponse,
  validatePassword
}; 