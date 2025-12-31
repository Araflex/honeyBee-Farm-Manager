
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, ClipboardList, Bug, Menu, X, User as UserIcon, Users, LogOut, Globe, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

// Fix: Made children optional to prevent TypeScript error when using nested JSX elements.
const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { pathname } = useLocation();
  const { currentUser, logout } = useApp();
  const { t, language, setLanguage } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  if (!currentUser) return <>{children}</>;

  const navItems = [
    { label: t('nav.assistant'), path: '/assistant', icon: <Bug size={20} /> },
    { label: t('nav.dashboard'), path: '/', icon: <LayoutDashboard size={20} /> },
    { label: t('nav.apiaries'), path: '/apiaries', icon: <Map size={20} /> },
    { label: t('nav.logs'), path: '/logs', icon: <ClipboardList size={20} /> },
  ];

  if (currentUser.role === 'admin') {
      navItems.push({ label: t('nav.users'), path: '/users', icon: <Users size={20} /> });
      navItems.push({ label: t('nav.audit'), path: '/audit', icon: <ShieldCheck size={20} /> });
  }

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-amber-900/50 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-amber-400">
          <span className="text-2xl">🐝</span> ApiaryMaster
        </div>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden text-amber-200 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive ? 'bg-amber-900 text-white shadow-md' : 'text-amber-200/80 hover:bg-amber-900/50 hover:text-white'}`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-amber-900/50 space-y-4">
          <div className="flex bg-amber-900/40 rounded-lg p-1">
             <button 
                onClick={() => setLanguage('en')}
                className={`flex-1 text-xs font-bold py-1 rounded transition-colors ${language === 'en' ? 'bg-amber-700 text-white shadow' : 'text-amber-200 hover:text-white'}`}
             >
                EN
             </button>
             <button 
                onClick={() => setLanguage('es')}
                className={`flex-1 text-xs font-bold py-1 rounded transition-colors ${language === 'es' ? 'bg-amber-700 text-white shadow' : 'text-amber-200 hover:text-white'}`}
             >
                ES
             </button>
          </div>

          <Link to="/profile" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-900/30 transition-colors group">
              <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center font-bold text-white shrink-0 group-hover:bg-amber-600 transition-colors">
                  {currentUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden flex-1">
                  <div className="text-sm font-medium text-white truncate">{currentUser.name}</div>
                  <div className="text-xs text-amber-400 uppercase truncate">{currentUser.role}</div>
              </div>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-amber-200/60 hover:text-white hover:bg-red-900/30 px-4 py-2 rounded-lg transition-all text-sm"
          >
              <LogOut size={16} /> {t('nav.logout')}
          </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-amber-950 text-amber-50 transform transition-transform duration-300 md:hidden flex flex-col shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-amber-950 text-amber-50 shadow-xl z-10">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden bg-amber-950 text-amber-50 p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
             <div className="flex items-center gap-3">
                 <button onClick={() => setIsSidebarOpen(true)} className="text-amber-50 hover:bg-amber-900 p-1 rounded">
                     <Menu size={24} />
                 </button>
                 <span className="font-bold text-lg">ApiaryMaster</span>
             </div>
             <Link to="/profile" className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center font-bold text-xs text-white">
                {currentUser.name.charAt(0)}
             </Link>
        </div>
        
        <div className="max-w-7xl mx-auto w-full">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
