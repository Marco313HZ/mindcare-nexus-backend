
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LoginDialog } from './auth/LoginDialog';
import { SignupDialog } from './auth/SignupDialog';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">MindCare Center</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleProfileClick}
                      className="flex items-center space-x-2 hover:bg-gray-100"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profile_picture} alt={user.full_name} />
                        <AvatarFallback className="text-sm">
                          {user.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-700">{user.full_name}</p>
                        <p className="text-xs text-blue-600">{user.role}</p>
                      </div>
                    </Button>
                  </div>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Button onClick={() => setShowLogin(true)} variant="outline">
                    Login
                  </Button>
                  <Button onClick={() => setShowSignup(true)}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Services</a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-blue-600">About</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Contact</a>
              
              {user ? (
                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center space-x-3 px-3 py-2 w-full text-left hover:bg-gray-50"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profile_picture} alt={user.full_name} />
                      <AvatarFallback>
                        {user.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-700">{user.full_name}</p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 mt-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <Button 
                    onClick={() => { setShowLogin(true); setIsMenuOpen(false); }} 
                    variant="outline" 
                    className="w-full"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => { setShowSignup(true); setIsMenuOpen(false); }} 
                    className="w-full"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
      <SignupDialog open={showSignup} onOpenChange={setShowSignup} />
    </>
  );
};
