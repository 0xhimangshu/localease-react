import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash, faStore, faUser } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useLocalStorage } from 'react-use';
import Confetti from 'react-confetti';
import { cn } from '../lib/utils';
import { Toast } from '../components/Toast';
import { API_URL } from '../utils/network';
import { api } from '../config/api';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessCategory: string;
  businessDescription: string;
  businessHours: {
    [key: string]: { open: string; close: string };
  };
  pricing: {
    basePrice: string;
    currency: string;
    priceRange: string;
  };
  services: string[];
  businessWebsite: string;
  yearsInBusiness: string;
  numberOfEmployees: string;
  acceptedPaymentMethods: string[];
  password: string;
  confirmPassword: string;
};

export function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'user' | 'business'>('user');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultFormData: FormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    businessCategory: '',
    businessDescription: '',
    businessHours: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' }
    },
    pricing: {
      basePrice: '',
      currency: 'INR',
      priceRange: ''
    },
    services: [''],
    businessWebsite: '',
    yearsInBusiness: '',
    numberOfEmployees: '',
    acceptedPaymentMethods: [],
    password: '',
    confirmPassword: ''
  };

  const [formData, setFormData] = useLocalStorage<FormData>('signupForm', defaultFormData);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: formData
  });

  useHotkeys('alt+s', () => handleSubmit(onSubmit)());
  useHotkeys('alt+t', () => setActiveTab(prev => prev === 'user' ? 'business' : 'user'));

  const pageTransition = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 }
  };

  const businessCategories = [
    'Automotive',
    'Beauty & Spa',
    'Construction',
    'Education',
    'Entertainment',
    'Financial Services',
    'Food & Restaurant',
    'Healthcare',
    'Home Services',
    'Legal Services',
    'Pet Services',
    'Real Estate',
    'Retail',
    'Technology',
    'Other'
  ];

  const paymentMethods = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'PayPal',
    'Mobile Payment',
    'Cryptocurrency'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    console.log(name, value);
    
      const [, day, field] = name.split('.');
      setFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          businessHours: {
            ...prev.businessHours,
            [day]: {
              ...prev.businessHours[day as keyof typeof prev.businessHours],
              [field]: value
            }
          }
        };
      });
  };

  // const handlePaymentMethodChange = (method: string) => {
  //   setFormData((prev) => {
  //     if (!prev) return prev;
  //     return {
  //       ...prev,
  //       acceptedPaymentMethods: prev.acceptedPaymentMethods.includes(method)
  //         ? prev.acceptedPaymentMethods.filter(m => m !== method)
  //         : [...prev.acceptedPaymentMethods, method]
  //     };
  //   });
  // };

  const handleServiceChange = (index: number, value: string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const updatedServices = [...prev.services];
      updatedServices[index] = value;
      return {
        ...prev,
        services: updatedServices
      };
    });
  };

  const addService = () => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        services: [...prev.services, '']
      };
    });
  };

  const removeService = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        services: prev.services.filter((_, i) => i !== index)
      };
    });
  };

  const handleGoogleSignUp = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await api.fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: activeTab === 'user' ? data.email : data.businessEmail,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          address: data.address,
          userType: activeTab,
          businessDetails: activeTab === 'business' ? {
            name: data.businessName,
            email: data.businessEmail,
            phone: data.businessPhone,
            address: data.businessAddress,
            category: data.businessCategory,
            description: data.businessDescription,
            businessHours: data.businessHours,
            pricing: data.pricing,
            services: data.services.filter(Boolean),
            website: data.businessWebsite,
            yearsInBusiness: data.yearsInBusiness,
            numberOfEmployees: data.numberOfEmployees,
            acceptedPaymentMethods: data.acceptedPaymentMethods
          } : undefined
        })
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      setShowConfetti(true);
      setToastMessage('Registration successful! Please check your email for verification.');
      setShowToast(true);
      
      setTimeout(() => {
        navigate('/', { 
          replace: true,
          state: { 
            showVerifyEmail: true,
            userEmail: activeTab === 'user' ? data.email : data.businessEmail
          }
        });
      }, 3000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setToastMessage(error instanceof Error ? error.message : 'Registration failed. Please try again.');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-light py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <div className="glass-card w-full max-w-[95%] md:max-w-4xl p-4 sm:p-6 md:p-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Create your account</h2>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">Join LocalEase today</p>
        </div>

        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8">
          <button
            className={cn(
              "flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-full text-sm sm:text-base font-medium transition-all flex items-center justify-center gap-1 sm:gap-2",
              activeTab === 'user' ? 'btn-gradient text-white' : 'btn-outline'
            )}
            onClick={() => setActiveTab('user')}
          >
            <FontAwesomeIcon icon={faUser} />
            <span className="hidden xs:inline">Customer</span>
          </button>
          <button
            className={cn(
              "flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-full text-sm sm:text-base font-medium transition-all flex items-center justify-center gap-1 sm:gap-2",
              activeTab === 'business' ? 'btn-gradient text-white' : 'btn-outline'
            )}
            onClick={() => setActiveTab('business')}
          >
            <FontAwesomeIcon icon={faStore} />
            <span className="hidden xs:inline">Business</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {activeTab === 'user' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email*</label>
  
                <input
                  {...register('email')}
                  className={cn(
                    "mt-1 block w-full px-3 py-2 text-sm sm:text-base rounded-full",
                    errors.email ? "border-red-500" : "border-gray-300"
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
                <input
                  {...register('phone')}
                  type="tel"
                  name="phone"
               
                  // onChange={}
                  required
                  className="mt-1 block w-full px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name*</label>
                <input
                  {...register('firstName')}
                  type="text"
                  name="firstName"
                
                  // onChange={}
                  required
                  className="mt-1 block w-full px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name*</label>
                <input
                  {...register('lastName')}
                  type="text"
                  name="lastName"
                  // onChange={}
                  required
                  className="mt-1 block w-full px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address*</label>
                <input
                  {...register('address')}
                  type="text"
                  name="address"
                  // onChange={}
                  required
                  className="mt-1 block w-full px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Business Name*</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData?.businessName}
                  // onChange={}
                  required
                  className="mt-1 block w-full px-3 py-2 text-sm sm:text-base rounded-full bg-gray-300 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Business Category*</label>
                <select
                  name="businessCategory"
                  value={formData?.businessCategory}
                  // onChange={}
                  required
                  className="mt-1 block w-full px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                >
                  <option value="">Select a category</option>
                  {businessCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Years in Business*</label>
                <input
                  type="number"
                  name="yearsInBusiness"
                  value={formData?.yearsInBusiness}
                  // onChange={}
                  required
                  min="0"
                  className="mt-1 block w-full px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Business Email*</label>
                <input
                  type="email"
                  name="businessEmail"
                  value={formData?.businessEmail}
                  // onChange={}
                  required
                  className="mt-1 block w-full px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Business Phone*</label>
                <input
                  type="tel"
                  name="businessPhone"
                  value={formData?.businessPhone}
                  // onChange={}
                  required
                  className="mt-1 block w-full px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Business Description*</label>
                <textarea
                  name="businessDescription"
                  value={formData?.businessDescription}
                  // onChange={}
                  required
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 rounded-lg bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                  placeholder="Describe your business, specialties, and unique value proposition..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Business Address*</label>
                <input
                  type="text"
                  name="businessAddress"
                  value={formData?.businessAddress}
                  // onChange={}
                  required
                  className="mt-1 block w-full px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Business Website</label>
                <input
                  type="url"
                  name="businessWebsite"
                  value={formData?.businessWebsite}
                  // onChange={}
                  className="mt-1 block w-full px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                  placeholder="https://"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Employees</label>
                <input
                  type="number"
                  name="numberOfEmployees"
                  value={formData?.numberOfEmployees}
                  // onChange={}
                  min="1"
                  className="mt-1 block w-full px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-4">Business Hours*</label>
                <div className="grid gap-4 text-sm sm:text-base">
                  {Object.keys(formData?.businessHours || {}).map((day) => (
                    <div key={day} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="capitalize font-semibold text-base w-24 text-gray-800 dark:text-gray-200">{day}</div>
                      <div className="flex flex-1 items-center gap-6">
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Opens at:</label>
                          <input
                            {...register(`businessHours.${day}.open`)}
                            type="time"
                            name={`businessHours.${day}.open`}
                            value={formData?.businessHours?.[day as keyof typeof formData.businessHours]?.open}
                            onChange={handleChange}
                            className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Closes at:</label>
                          <input
                            {...register(`businessHours.${day}.close`)}
                            type="time" 
                            name={`businessHours.${day}.close`}
                            value={formData?.businessHours?.[day as keyof typeof formData.businessHours]?.close}
                            onChange={handleChange}
                            className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered*</label>
                {formData?.services.map((_, index) => ( // _ is the service
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      {...register(`services.${index}`)}
                      onChange={(e) => handleServiceChange(index, e.target.value)}
                      placeholder="Enter a service"
                      className="flex-1 px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="px-3 py-2 rounded-full bg-red-500 text-white"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addService}
                  className="mt-2 px-4 py-2 rounded-full bg-primary text-white"
                >
                  Add Service
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Base Price ($)*</label>
                <input
                  type="number"
                  name="pricing.basePrice"
                  value={formData?.pricing?.basePrice}
                  // onChange={}
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price Range*</label>
                <select
                  name="pricing.priceRange"
                  value={formData?.pricing?.priceRange}
                  // onChange={}
                  required
                  className="mt-1 block w-full px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                >
                  <option value="">Select price range</option>
                  <option value="$">$ (Budget)</option>
                  <option value="$$">$$ (Moderate)</option>
                  <option value="$$$">$$$ (Premium)</option>
                  <option value="$$$$">$$$$ (Luxury)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accepted Payment Methods* (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {paymentMethods.map(method => (
                    <label 
                      key={method} 
                      className={cn(
                        "flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors",
                        formData?.acceptedPaymentMethods?.includes(method)
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:border-primary/50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={formData?.acceptedPaymentMethods?.includes(method)}
                        // onChange={() => handlePaymentMethodChange(method)}
                        className="sr-only" // Hide the actual checkbox
                      />
                      <span className={cn(
                        "ml-2",
                        formData?.acceptedPaymentMethods?.includes(method)
                          ? "text-primary"
                          : "text-gray-700"
                      )}>
                        {method}
                      </span>
                    </label>
                  ))}
                </div>
                {formData?.acceptedPaymentMethods?.length === 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select at least one payment method
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Password*</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  // onChange={}
                  required
                  className="mt-1 block w-full px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password*</label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  // onChange={}
                  required
                  className="mt-1 block w-full px-3 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full btn-gradient text-white py-2 sm:py-3 text-sm sm:text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full py-2 px-4 rounded-full shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faGoogle} />
            Google
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              Sign in
            </Link>
          </p>
        </form>
      </div>

      {showConfetti && <Confetti />}
      
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <Toast
              message={toastMessage}
              onClose={() => setShowToast(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}