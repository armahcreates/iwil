import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const activeTab = location.pathname.split('/')[1] || 'dashboard';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/20 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(148_163_184_/_0.15)_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <Sidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col relative">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          activeTab={activeTab}
        />
        <main className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
