
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import PublicFooter from './PublicFooter';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) {
    // El dashboard ahora gestiona su propio layout interno (Sidebar, Header)
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main key={pathname} className="flex-1 pt-24 animate-in fade-in duration-700 flex flex-col">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
};

export default Layout;
