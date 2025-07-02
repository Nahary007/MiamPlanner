import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  ChefHat, 
  Package, 
  ShoppingCart, 
  User,
  LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<{ nom: string } | null>(null);
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  // Récupérer les infos de l'utilisateur depuis le localStorage ou le token JWT
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // Essayer de décoder le token JWT pour récupérer les infos utilisateur
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            if (payload.username) {
              setUser({ nom: payload.username });
              return;
            }
          }

          // Si le décodage du token échoue, essayer l'API
          const response = await fetch('http://localhost:8000/api/user/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Si l'API échoue, utiliser les données du localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              setUser({ nom: 'Utilisateur' });
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du user:', error);
          // Fallback: utiliser les données du localStorage ou un nom par défaut
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            setUser({ nom: 'Utilisateur' });
          }
        }
      }
    };

    fetchUser();
  }, [token]);

  const navItems = [
    { path: '/dashboard', label: 'Accueil', icon: Home },
    { path: '/planning', label: 'Planning', icon: Calendar },
    { path: '/recipes', label: 'Recettes', icon: ChefHat },
    { path: '/stock', label: 'Stock', icon: Package },
    { path: '/shopping-list', label: 'Courses', icon: ShoppingCart },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Déconnexion réussie');
    navigate('/');
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
                    <p className="text-sm font-medium text-gray-700">{user?.nom || 'Utilisateur'}</p>
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

      {/* Mobile Top Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <ChefHat className="h-8 w-8 text-emerald-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">MiamPlanner</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <User className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">{user?.nom || 'Utilisateur'}</span>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
          <div className="grid grid-cols-6 h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                    isActive
                      ? 'text-emerald-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}

            {/* Profile/Logout */}
            <Link
              to="/profile"
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                location.pathname === '/profile'
                  ? 'text-emerald-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">Profil</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;