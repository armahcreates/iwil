import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FileSpreadsheet, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Settings, 
  Heart,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { IWILLogo } from './ui/iwil-logo-svg';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'reports', path: '/reports', label: 'Reports', icon: FileText, badge: '3' },
  { id: 'clients', path: '/clients', label: 'Clients', icon: Users },
  { id: 'templates', path: '/templates', label: 'Templates', icon: FileSpreadsheet },
  { id: 'calendar', path: '/calendar', label: 'Calendar', icon: CalendarIcon },
  { id: 'analytics', path: '/analytics', label: 'Analytics', icon: BarChart3 },
  // HIPAA Compliance removed from navigation menu
  { id: 'settings', path: '/settings', label: 'Settings', icon: Settings }
];

const SidebarContent: React.FC<SidebarProps> = ({ setIsOpen }) => {
  const location = useLocation();
  const activeTab = location.pathname.split('/')[1] || 'dashboard';

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <div className="glass-strong border-r border-white/20 w-64 sm:w-72 lg:w-64 min-h-screen flex flex-col shadow-2xl">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="relative flex-shrink-0">
              <IWILLogo size={36} className="sm:w-10 sm:h-10" />
              <div className="absolute -inset-1 iwil-gradient rounded-full opacity-20 blur-sm"></div>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-black iwil-gradient-text tracking-tight truncate">I.W.I.L.</h1>
              <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase truncate">Protocol System</p>
            </div>
          </div>
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon" className="lg:hidden hover:bg-white/10 rounded-full h-10 w-10 touch-manipulation flex-shrink-0">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="h-px iwil-gradient opacity-30 rounded-full"></div>
      </div>
      
      <nav className="flex-1 space-y-2 mt-4 sm:mt-6 px-3 sm:px-4 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.id === activeTab || (item.id === 'dashboard' && location.pathname === '/');
          
          return (
            <motion.div 
              key={item.id} 
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link to={item.path} onClick={handleLinkClick}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start space-x-3 h-12 sm:h-12 transition-all duration-300 rounded-xl relative overflow-hidden group touch-manipulation ${
                    isActive 
                      ? 'text-white shadow-lg transform' 
                      : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 iwil-gradient"
                      layoutId="activeBackground"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center space-x-3 w-full min-w-0">
                    <div className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                      isActive ? 'bg-white/20' : 'group-hover:bg-slate-50'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <span className="font-semibold text-sm truncate flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant={isActive ? "secondary" : "destructive"} 
                        className={`text-xs transition-colors flex-shrink-0 ${
                          isActive ? 'bg-white/20 text-white border-white/30' : ''
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Button>
              </Link>
            </motion.div>
          );
        })}
      </nav>
      
      <div className="mt-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        <motion.div 
          className="p-3 sm:p-4 bg-gradient-to-br from-blue-50/80 to-green-50/80 rounded-xl sm:rounded-2xl border border-blue-100/50 backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1.5 iwil-gradient-success rounded-lg flex-shrink-0">
              <Heart size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-blue-700 truncate">Wellness Focus</span>
          </div>
          <p className="text-xs text-blue-600/90 leading-relaxed font-medium">
            Empowering holistic health through personalized protocols.
          </p>
        </motion.div>

        <motion.div 
          className="p-3 sm:p-4 bg-white/60 rounded-xl sm:rounded-2xl border border-white/40 backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">System Status</span>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-xs text-emerald-600 font-bold">Operational</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = (props) => {
  return (
    <>
      <div className="hidden lg:block flex-shrink-0">
        <SidebarContent {...props} />
      </div>
      <AnimatePresence>
        {props.isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => props.setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full z-50 lg:hidden"
            >
              <SidebarContent {...props} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
