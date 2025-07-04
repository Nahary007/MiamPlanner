import React, { useEffect, useState } from "react";
import { Calendar, Package, AlertTriangle, TrendingUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { dashboardAPI } from "../services/api";
import type { DashboardStats } from "../types";
import toast from "react-hot-toast";

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
        toast.error("Erreur lors du chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Repas planifiés",
      subtitle: "cette semaine",
      value: stats?.plannedMealsThisWeek || 0,
      icon: Calendar,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Ingrédients",
      subtitle: "en stock",
      value: stats?.stockItemsCount || 0,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Produits",
      subtitle: "bientôt périmés",
      value: stats?.expiringItemsCount || 0,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Objectif",
      subtitle: "zéro gaspillage",
      value: "100%",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bienvenue, {user?.nom} ! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Voici un aperçu de votre planification alimentaire
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-2 md:mb-0">
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                    {stat.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {stat.subtitle}
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mt-1 md:mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.bgColor} dark:bg-opacity-20 p-2 md:p-3 rounded-lg self-end md:self-auto`}
                >
                  <Icon className={`h-4 w-4 md:h-6 md:w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <a
            href="/planning"
            className="flex items-center p-3 md:p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
          >
            <Calendar className="h-6 w-6 md:h-8 md:w-8 text-emerald-600 dark:text-emerald-400 mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                Planifier mes repas
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 truncate">
                Organiser la semaine
              </p>
            </div>
          </a>

          <a
            href="/recipes"
            className="flex items-center p-3 md:p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Package className="h-6 w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                Ajouter une recette
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 truncate">
                Enrichir ma collection
              </p>
            </div>
          </a>

          <a
            href="/stock"
            className="flex items-center p-3 md:p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors sm:col-span-2 lg:col-span-1"
          >
            <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-orange-600 dark:text-orange-400 mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                Gérer mon stock
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 truncate">
                Éviter le gaspillage
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg shadow-sm p-4 md:p-6 text-white">
        <h2 className="text-lg md:text-xl font-semibold mb-2">
          💡 Conseil du jour
        </h2>
        <p className="text-emerald-100 mb-4 text-sm md:text-base">
          Planifiez vos repas en fonction des ingrédients qui arrivent bientôt à
          expiration pour r��duire le gaspillage alimentaire.
        </p>
        <a
          href="/planning"
          className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors text-sm md:text-base"
        >
          Commencer maintenant
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
