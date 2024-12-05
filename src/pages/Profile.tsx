import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheckCircle, faCog } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from 'react';
import { useUser } from '../hooks/useUser';
import { Toast } from '../components/Toast';
import { api } from '../config/api';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  phone: string;
  address: string;
  userType: 'user' | 'business';
  createdAt: string;
  businessDetails?: {
    businessName?: string;
    businessType?: string;
    phone?: string;
    address?: string;
  };
  isEmailVerified: boolean;
}

export function Profile() {
  const { updateUser } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('error');

  useEffect(() => {
    const abortController = new AbortController();

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setToastMessage('Please login to view your profile');
          setToastType('error');
          setShowToast(true);
          setLoading(false);
          return;
        }

        const response = await api.fetch('/api/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToastMessage('Session expired. Please login again.');
            setToastType('error');
            setShowToast(true);
            return;
          }
          throw new Error(data.message || 'Failed to fetch profile');
        }

        setUser(data);
        setEditedUser(data);
        updateUser(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('Profile fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setToastMessage('Failed to load profile');
        setToastType('error');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      abortController.abort();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !editedUser) return;

      const response = await api.fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedUser)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setUser(updatedData);
      setIsEditing(false);
    } catch (err: unknown) {
      console.error('Profile update error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to update profile'
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!editedUser) return;
    
    setEditedUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Image = reader.result as string;
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await api.fetch('/api/profile/avatar', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ avatar: base64Image })
        });

        if (!response.ok) {
          throw new Error('Failed to update avatar');
        }

        const updatedData = await response.json();
        setUser(prev => prev ? { ...prev, avatar: base64Image } : null);
        setEditedUser(prev => prev ? { ...prev, avatar: base64Image } : null);
        updateUser({ ...updatedData, avatar: base64Image });
      };
    } catch (err: unknown) {
      console.error('Avatar update error:', err);
      setToastMessage('Failed to update avatar');
      setToastType('error');
      setShowToast(true);
    }
  };

  if (loading) {
    return <div className="container py-5 mt-16">Loading...</div>;
  }

  if (!localStorage.getItem('token')) {
    return <div className="container py-5 mt-16">Please login to view your profile.</div>;
  }

  if (error) {
    return <div className="container py-5 mt-16">Error: {error}</div>;
  }

  if (!user) {
    return <div className="container py-5 mt-16">Loading profile...</div>;
  }

  return (
    <>
      <div className="container py-5 mt-16">
        <div className="glass-card">
          <div className="p-8 text-center">
            <div className="relative inline-block">
              <img
                src={user.avatar 
                  ? (user.avatar.startsWith('http') 
                    ? user.avatar // Google photo URL
                    : `data:image/jpeg;base64,${user.avatar}`) // Base64 image
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName)}+${encodeURIComponent(user.lastName)}&background=random`
                }
                alt="Profile"
                className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-lg cursor-pointer"
                onClick={handleImageClick}
              />
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <button 
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors"
                onClick={handleImageClick}
              >
                <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold mt-4">{`${user.firstName} ${user.lastName}`}</h2>
            <p className="text-gray-600 dark:text-gray-300">@{user.firstName.toLowerCase()}{user.lastName.toLowerCase()}</p>
            
            <div className="flex justify-center gap-4 mt-6">
              {isEditing ? (
                <button 
                  onClick={handleSaveProfile}
                  className="btn-gradient text-white flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Save Changes
                </button>
              ) : (
                <button 
                  onClick={handleEditProfile}
                  className="btn-gradient text-white flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit Profile
                </button>
              )}
              <button className="btn-outline flex items-center gap-2">
                <FontAwesomeIcon icon={faCog} />
                Settings
              </button>
            </div>

            <div className="mt-8">
              <div className="glass-card mx-auto max-w-xs p-4">
                <h3 className="font-semibold mb-1">Member Since</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="mt-8 max-w-2xl mx-auto">
              <h4 className="text-lg font-semibold mb-4 text-left">Personal Information</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 glass-card">
                  <span className="text-gray-600 dark:text-gray-300">Email</span>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editedUser?.email || ''}
                        onChange={handleInputChange}
                        className="border rounded px-2 py-1 bg-white"
                      />
                    ) : (
                      <>
                        <span>{user.email}</span>
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 glass-card">
                  <span className="text-gray-600 dark:text-gray-300">Phone</span>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedUser?.phone || ''}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 bg-white"
                    />
                  ) : (
                    <span>{user.phone || 'Not provided'}</span>
                  )}
                </div>
                <div className="flex justify-between items-center p-3 glass-card">
                  <span className="text-gray-600 dark:text-gray-300">Location</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={editedUser?.address || ''}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 bg-white"
                    />
                  ) : (
                    <span>{user.address || 'Not provided'}</span>
                  )}
                </div>
                <div className="flex justify-between items-center p-3 glass-card">
                  <span className="text-gray-600 dark:text-gray-300">Account Type</span>
                  <span className="capitalize">{user.userType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}