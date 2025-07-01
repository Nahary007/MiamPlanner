import React, { useEffect, useState } from "react";
import {
  Download,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { shoppingListAPI } from "../services/api";
import type { ShoppingListItem } from "../types";
import toast from "react-hot-toast";

const ShoppingList: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShoppingList();
  }, [currentWeek]);

  const fetchShoppingList = async () => {
    try {
      setLoading(true);
      const data = await shoppingListAPI.generate(
        format(currentWeek, "yyyy-MM-dd"),
      );
      setShoppingList(data);
    } catch (error: any) {
      toast.error("Erreur lors de la génération de la liste");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await shoppingListAPI.download(
        format(currentWeek, "yyyy-MM-dd"),
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `liste-courses-${format(currentWeek, "yyyy-MM-dd")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Liste téléchargée");
    } catch (error: any) {
      toast.error("Erreur lors du téléchargement");
    }
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek((prev) => addDays(prev, direction === "next" ? 7 : -7));
  };

  const totalItems = shoppingList.length;
  const totalNeeded = shoppingList.reduce(
    (sum, item) => sum + item.neededQuantity,
    0,
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
          Liste de courses
        </h1>

        <div className="flex items-center justify-between space-x-2">
          <button
            onClick={() => navigateWeek("prev")}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <span className="text-sm md:text-lg font-medium text-gray-900 text-center px-2">
            {format(currentWeek, "dd MMM", { locale: fr })} -{" "}
            {format(addDays(currentWeek, 6), "dd MMM yyyy", { locale: fr })}
          </span>

          <button
            onClick={() => navigateWeek("next")}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 md:h-8 md:w-8 text-emerald-600 mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="text-sm md:text-lg font-semibold text-gray-900 truncate">
                Articles à acheter
              </h3>
              <p className="text-xl md:text-2xl font-bold text-emerald-600">
                {totalItems}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <Download className="h-6 w-6 md:h-8 md:w-8 text-blue-600 mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="text-sm md:text-lg font-semibold text-gray-900 truncate">
                Actions
              </h3>
              <button
                onClick={handleDownload}
                disabled={totalItems === 0}
                className="mt-2 flex items-center px-2 md:px-3 py-1 bg-blue-600 text-white text-xs md:text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Télécharger PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg shadow-sm p-4 md:p-6 text-white sm:col-span-2 lg:col-span-1">
          <h3 className="text-base md:text-lg font-semibold mb-2">💡 Astuce</h3>
          <p className="text-xs md:text-sm text-emerald-100">
            Cette liste est basée sur vos repas planifiés et votre stock actuel
          </p>
        </div>
      </div>

      {/* Shopping List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      ) : shoppingList.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Articles nécessaires pour la semaine
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Basé sur vos repas planifiés, déduit de votre stock actuel
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {shoppingList.map((item, index) => (
              <div
                key={index}
                className="px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:bg-gray-50 transition-colors gap-2 sm:gap-0"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {item.ingredient.name_ingredient}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <span>
                      Nécessaire: {item.totalQuantity} {item.unit}
                    </span>
                    {item.neededQuantity !== item.totalQuantity && (
                      <span className="block sm:inline sm:ml-2 text-emerald-600">
                        (Manque: {item.neededQuantity} {item.unit})
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-base md:text-lg font-semibold text-gray-900">
                    {item.neededQuantity} {item.unit}
                  </div>
                  <div className="text-xs text-gray-500">à acheter</div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 md:px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <span className="text-sm text-gray-600">
                {totalItems} article{totalItems > 1 ? "s" : ""} au total
              </span>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center px-3 md:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm md:text-base"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Télécharger la liste</span>
                <span className="sm:hidden">Télécharger</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun article nécessaire
          </h3>
          <p className="text-gray-600 mb-4">
            Votre stock couvre tous les repas planifiés pour cette semaine !
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/planning"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Planifier des repas
            </a>
            <a
              href="/stock"
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Voir le stock
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
