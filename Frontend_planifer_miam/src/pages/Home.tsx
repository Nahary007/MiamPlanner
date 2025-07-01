import React from "react";
import { Link } from "react-router-dom";
import {
  ChefHat,
  Calendar,
  Package,
  ShoppingCart,
  TrendingDown,
  Users,
} from "lucide-react";

const Home: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: "Planification de repas",
      description: "Organisez vos repas de la semaine facilement",
    },
    {
      icon: Package,
      title: "Gestion du stock",
      description: "Suivez vos ingrédients et leurs dates de péremption",
    },
    {
      icon: ShoppingCart,
      title: "Liste de courses intelligente",
      description: "Génération automatique basée sur vos menus planifiés",
    },
    {
      icon: TrendingDown,
      title: "Réduction du gaspillage",
      description: "Optimisez vos achats et réduisez le gaspillage alimentaire",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                MiamPlanner
              </span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Planifiez vos repas,
            <span className="text-emerald-600"> réduisez le gaspillage</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto px-4">
            MiamPlanner vous aide à organiser vos repas de la semaine, gérer
            votre stock alimentaire et générer automatiquement vos listes de
            courses pour réduire le gaspillage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Link
              to="/register"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 md:px-8 py-3 rounded-lg text-base md:text-lg font-medium transition-colors shadow-lg"
            >
              Commencer gratuitement
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-gray-50 text-gray-900 px-6 md:px-8 py-3 rounded-lg text-base md:text-lg font-medium transition-colors border border-gray-300 shadow-lg"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une solution complète pour organiser vos repas et optimiser vos
              achats alimentaires.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-4 md:p-6 rounded-lg border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-lg mb-3 md:mb-4">
                    <Icon className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Rejoignez la communauté
            </h2>
            <p className="text-xl text-emerald-100">
              Des milliers d'utilisateurs nous font déjà confiance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                10k+
              </div>
              <div className="text-sm md:text-base text-emerald-100">
                Utilisateurs actifs
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                50k+
              </div>
              <div className="text-sm md:text-base text-emerald-100">
                Repas planifiés
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                30%
              </div>
              <div className="text-sm md:text-base text-emerald-100">
                Réduction du gaspillage moyen
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
            Rejoignez MiamPlanner aujourd'hui et transformez votre façon de
            cuisiner.
          </p>
          <Link
            to="/register"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 md:px-8 py-3 rounded-lg text-base md:text-lg font-medium transition-colors shadow-lg"
          >
            S'inscrire gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <ChefHat className="h-6 w-6 text-emerald-400" />
              <span className="ml-2 text-lg font-bold">MiamPlanner</span>
            </div>
            <div className="text-gray-400">
              © 2025 MiamPlanner. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
