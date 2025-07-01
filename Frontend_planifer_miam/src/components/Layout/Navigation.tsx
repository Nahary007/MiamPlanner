import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  ChefHat, 
  Package, 
  ShoppingCart, 
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Accueil', icon: Home },
    { path: '/planning', label: 'Planning', icon: Calendar },
    { path: '/recipes', label: 'Recettes', icon: ChefHat },
    { path: '/stock', label: 'Stock', icon: Package },
    { path: '/shopping-list', label: 'Courses', icon: ShoppingCart },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto bg-white border-r border-gray-200">
          <div className="flex h-16 flex-shrink-0 items-center px-4 border-b border-gray-200">
            <ChefHat className="h-8 w-8 text-emerald-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">MiamPlanner</span>
          </div>
          
          <div className="mt-8 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            
            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <div className="group block">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-emerald-600" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-700">{user?.nom}</p>
                    <Link 
                      to="/profile" 
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Voir le profil
                    </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Se déconnecter"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile menu button */}
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <ChefHat className="h-8 w-8 text-emerald-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">MiamPlanner</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 px-2 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon
                          className={`mr-4 flex-shrink-0 h-6 w-6 ${
                            isActive ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center w-full">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-base font-medium text-gray-700">{user?.nom}</p>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Voir le profil
                    </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Se déconnecter"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation;