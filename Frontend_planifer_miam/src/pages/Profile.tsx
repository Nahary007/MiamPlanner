import React from "react";
import { User, Lock, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const newPassword = watch("newPassword");

  const handlePasswordChange = async (data: any) => {
    try {
      // Here you would call an API to change the password
      // await authAPI.changePassword(data);
      toast.success("Mot de passe modifié avec succès");
    } catch (error: any) {
      toast.error("Erreur lors du changement de mot de passe");
    }
  };

  const handleLogout = async () => {
    if (!confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      return;
    }

    try {
      await logout();
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">
        Mon profil
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* User Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
          <div className="flex items-center mb-4 md:mb-6">
            <div className="h-10 w-10 md:h-12 md:w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
              <User className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                Informations personnelles
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 truncate">
                Vos données de compte
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Nom complet
              </label>
              <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                {user?.nom}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Adresse email
              </label>
              <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                {user?.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Rôles
              </label>
              <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                {user?.roles?.join(", ") || "Utilisateur"}
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
          <div className="flex items-center mb-4 md:mb-6">
            <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-100 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
              <Lock className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
                Changer le mot de passe
              </h2>
              <p className="text-sm md:text-base text-gray-600 truncate">
                Mettre à jour votre mot de passe
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(handlePasswordChange)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe actuel
              </label>
              <input
                {...register("currentPassword", {
                  required: "Mot de passe actuel requis",
                })}
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <input
                {...register("newPassword", {
                  required: "Nouveau mot de passe requis",
                  minLength: {
                    value: 6,
                    message:
                      "Le mot de passe doit contenir au moins 6 caractères",
                  },
                })}
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le nouveau mot de passe
              </label>
              <input
                {...register("confirmPassword", {
                  required: "Confirmation requise",
                  validate: (value) =>
                    value === newPassword ||
                    "Les mots de passe ne correspondent pas",
                })}
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? "Modification..." : "Changer le mot de passe"}
            </button>
          </form>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm border border-red-200 p-4 md:p-6">
        <div className="flex items-center mb-4 md:mb-6">
          <div className="h-10 w-10 md:h-12 md:w-12 bg-red-100 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
            <LogOut className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
              Zone de danger
            </h2>
            <p className="text-sm md:text-base text-gray-600 truncate">
              Actions irréversibles
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 bg-red-50 rounded-lg gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-red-800">Se déconnecter</h3>
            <p className="text-sm text-red-600">
              Vous serez redirigé vers la page d'accueil
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center px-3 md:px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm md:text-base"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
