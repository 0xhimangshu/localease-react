// Common disposable email domains
const disposableDomains = [
  'tempmail.com',
  'temp-mail.org', 
  'guerrillamail.com',
  'sharklasers.com',
  'mailinator.com',
  'yopmail.com',
  'throwawaymail.com',
  'tempinbox.com',
  'fakeinbox.com',
  'temp-mail.ru',
  '10minutemail.com',
  'minutemail.com',
  'tempmail.net',
  'emailondeck.com',
  'tempr.email',
  'dispostable.com',
  'maildrop.cc',
  'mailnesia.com',
  'tempmailaddress.com',
  'tempmail2.com',
  'example.com',
  'test.com',
  'email.com',
  'domain.com',
  'localhost.com'
];

// Common test/fake email patterns
const testPatterns = [
  /^test/i,          // test@...
  /test\d*/i,        // test123@...
  /^demo/i,          // demo@...
  /^sample/i,        // sample@...
  /^example/i,       // example@...
  /^fake/i,          // fake@...
  /^dummy/i,         // dummy@...
  /^temp/i,          // temp@...
  /^mock/i,          // mock@...
  /^user\d*@/i,      // user@ or user123@...
  /^admin/i,         // admin@...
  /^guest/i,         // guest@...
  /^info/i,          // info@...
  /^spam/i,          // spam@...
  /^disposable/i,    // disposable@...
  /^noreply/i,       // noreply@...
  /^[a-z]{1,3}\d{3,}@/i,  // abc123456@...
  /^test.*test/i,    // test.test@...
  /^no\.{0,1}reply/i // no.reply@ or noreply@
];

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Invalid email format'
    };
  }

  const [localPart, domain] = email.split('@');
  const domainLower = domain.toLowerCase();

  if (disposableDomains.includes(domainLower)) {
    return {
      isValid: false,
      message: 'Please use a valid email address. Temporary or disposable email addresses are not allowed.'
    };
  }

  for (const pattern of testPatterns) {
    if (pattern.test(localPart)) {
      return {
        isValid: false,
        message: 'Please use your real email address'
      };
    }
  }

  if (/\d{4,}/.test(localPart)) {
    return {
      isValid: false,
      message: 'Please use a valid email address'
    };
  }

  if (localPart.length < 3) {
    return {
      isValid: false,
      message: 'Email address is too short'
    };
  }

  if (/(.)\1{4,}/.test(localPart)) {
    return {
      isValid: false,
      message: 'Please use a valid email address'
    };
  }

  return {
    isValid: true,
    message: 'Valid email'
  };
}

export { validateEmail }; 