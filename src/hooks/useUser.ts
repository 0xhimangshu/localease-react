import { useState, useEffect } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  userType: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initial load
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Listen for updates
    const handleUserUpdate = (event: CustomEvent<User>) => {
      setUser(event.detail);
    };

    window.addEventListener('userUpdate', handleUserUpdate as EventListener);
    return () => {
      window.removeEventListener('userUpdate', handleUserUpdate as EventListener);
    };
  }, []);

  const updateUser = (newUserData: Partial<User>) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...newUserData };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    window.dispatchEvent(new CustomEvent('userUpdate', { detail: updatedUser }));
  };

  return { user, updateUser };
}; 