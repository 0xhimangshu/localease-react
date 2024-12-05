import { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import { faBolt, faRocket, faLightbulb, faSignInAlt, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token && !!user);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    navigate('/', { replace: true });
    window.location.reload();
  };

  const navLinks = [
    { href: '/services', label: 'Services', icon: faRocket },
    { href: '#about', label: 'About', icon: faLightbulb },
  ];

  return (
    <nav className="rounded-b-[10px] container fixed top-0 left-0 right-0 bg-white shadow-md z-[50]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <FontAwesomeIcon icon={faBolt} className="h-6 w-6 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">LocalEase</span>
            </a>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map(({ href, label, icon }) => (
              <a
                key={href}
                href={href}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              >
                <FontAwesomeIcon icon={icon} className="h-4 w-4" />
                {label}
              </a>
            ))}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="ml-8 inline-flex items-center pl-2 pr-4 py-2 text-[19px] font-medium rounded-full text-white bg-blue-700 hover:bg-blue-900 transition-colors gap-2"
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar.startsWith('http') 
                        ? user.avatar 
                        : user.avatar.startsWith('data:') 
                          ? user.avatar 
                          : `data:image/jpeg;base64,${user.avatar}`
                      }
                      alt={`${user.firstName}'s profile`}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || '')}+${encodeURIComponent(user?.lastName || '')}&background=random`}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                  <span>{user?.firstName || 'Profile'}</span>
                </button>
                {showProfileMenu && (
                  <div ref={profileMenuRef} className="absolute right-0 mt-2 w-48 rounded-[10px] shadow-lg glass-card z-[60]">
                    <div className="py-1">
                      <a
                        href="/profile"
                        className=" px-4 py-2 text-sm text-gray-300 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2 rounded-[10px] m-2 "
                      >
                        <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                        Profile
                      </a>
                      <button 
                        onClick={handleLogout}
                        className=" text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2 rounded-[10px] m-2 w-[91%]"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="ml-8 inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-blue-700 hover:bg-blue-900 transition-colors gap-2"
              >
                <FontAwesomeIcon icon={faSignInAlt} className="h-4 w-4" />
                Login
              </a>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div 
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-[55] ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          ref={menuRef}
          className={`glass-card absolute right-4 left-4 top-20 p-4 transition-transform duration-300 z-[60] ${
            isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="space-y-3">
            {navLinks.map(({ href, label, icon }) => (
              <a
                key={href}
                href={href}
                className=" px-4 py-3 rounded-full text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all hover:pl-6 flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={icon} className="h-5 w-5" />
                {label}
              </a>
            ))}
            {isLoggedIn ? (
              <>
                <a
                  href="/profile"
                  className=" px-4 py-3 rounded-full text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all hover:pl-6 flex items-center gap-3"
                  onClick={() => setIsOpen(false)}
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar.startsWith('http') 
                        ? user.avatar 
                        : user.avatar.startsWith('data:') 
                          ? user.avatar 
                          : `data:image/jpeg;base64,${user.avatar}`
                      }
                      alt={`${user.firstName}'s profile`}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || '')}+${encodeURIComponent(user?.lastName || '')}&background=random`}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                  Profile
                </a>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className=" w-full px-4 py-3 rounded-full text-base font-medium btn-gradient text-white flex items-center gap-3"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <a
                href="/login"
                className=" px-4 py-3 rounded-full text-base font-medium btn-gradient text-white flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={faSignInAlt} className="h-5 w-5" />
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};