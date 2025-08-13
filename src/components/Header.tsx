import React, { useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { IWILLogo } from './ui/iwil-logo';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, AvatarFallback } from './ui/avatar';

interface HeaderProps {
  onMenuClick: () => void;
  activeTab: string;
}

const tabTitles: { [key: string]: string } = {
  dashboard: 'Dashboard',
  reports: 'Report Management',
  clients: 'Client Management',
  templates: 'Report Templates',
  calendar: 'Calendar',
  analytics: 'Analytics',
  compliance: 'HIPAA Compliance',
  settings: 'Settings',
};

export const Header: React.FC<HeaderProps> = ({ onMenuClick, activeTab }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center space-x-2 min-w-0 flex-1">
        <IWILLogo size={28} className="sm:w-8 sm:h-8 flex-shrink-0" />
        <span className="font-bold text-base sm:text-lg iwil-gradient-text truncate">
          {tabTitles[activeTab] || 'IWIL Protocol'}
        </span>
      </div>
      
      <div className="flex items-center space-x-2 flex-shrink-0">
        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
          >
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-3 sm:py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 sm:py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>

        <Button onClick={onMenuClick} variant="ghost" size="icon" className="h-10 w-10 sm:h-9 sm:w-9 touch-manipulation">
          <Menu className="h-6 w-6 sm:h-5 sm:w-5 text-gray-700" />
        </Button>
      </div>
    </header>
  );
};
