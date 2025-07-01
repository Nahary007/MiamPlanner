import React from 'react';
import Navigation from './Navigation';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="lg:pl-64">
        <main className="pt-16 lg:pt-0 pb-20 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;