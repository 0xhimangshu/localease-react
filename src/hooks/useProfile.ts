import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(
    debounce(async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }, 300), // Debounce for 300ms
    []
  );

  useEffect(() => {
    fetchProfile();
    return () => {
      fetchProfile.cancel();
    };
  }, [fetchProfile]);

  return { profile, loading, error, refetchProfile: fetchProfile };
} 