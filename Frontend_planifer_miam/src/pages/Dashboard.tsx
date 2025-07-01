import React, { useEffect, useState } from 'react';
import { Calendar, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI } from '../services/api';
import type { DashboardStats } from '../types';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStats();
        setStats(data);
      } catch (error: any) {
        toast.error('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Repas planifiés',
      subtitle: 'cette semaine',
      value: stats?.plannedMealsThisWeek || 0,
      icon: Calendar,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Ingrédients',
      subtitle: 'en stock',
      value: stats?.stockItemsCount || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Produits',
      subtitle: 'bientôt périmés',
      value: stats?.expiringItemsCount || 0,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Objectif',
      subtitle: 'zéro gaspillage',
      value: '100%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenue, {user?.nom} ! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Voici un aperçu de votre planification alimentaire
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/planning"
            className="flex items-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <Calendar className="h-8 w-8 text-emerald-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Planifier mes repas</h3>
              <p className="text-sm text-gray-600">Organiser la semaine</p>
            </div>
          </a>
          
          <a
            href="/recipes"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Ajouter une recette</h3>
              <p className="text-sm text-gray-600">Enrichir ma collection</p>
            </div>
          </a>
          
          <a
            href="/stock"
            className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Gérer mon stock</h3>
              <p className="text-sm text-gray-600">Éviter le gaspillage</p>
            </div>
          </a>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">💡 Conseil du jour</h2>
        <p className="text-emerald-100 mb-4">
          Planifiez vos repas en fonction des ingrédients qui arrivent bientôt à expiration 
          pour réduire le gaspillage alimentaire.
        </p>
        <a
          href="/planning"
          className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
        >
          Commencer maintenant
        </a>
      </div>
    </div>
  );
};

export default Dashboard;