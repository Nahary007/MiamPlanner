import React, { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, Package } from "lucide-react";
import { ingredientsAPI } from "../services/api";
import type { Ingredient } from "../types";
import toast from "react-hot-toast";
import IngredientModal from "../components/Ingredients/IngredientModal";

const Ingredients: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const data = await ingredientsAPI.getAll();
      setIngredients(data);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des ingrédients");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchIngredients();
    } else {
      fetchIngredients();
    }
  };

  const searchIngredients = async () => {
    try {
      setLoading(true);
      const data = await ingredientsAPI.search(searchQuery);
      setIngredients(data);
    } catch (error: any) {
      toast.error("Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = () => {
    setEditingIngredient(null);
    setIsModalOpen(true);
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsModalOpen(true);
  };

  const handleDeleteIngredient = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet ingrédient ?")) {
      return;
    }

    try {
      await ingredientsAPI.delete(id);
      setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
      toast.success("Ingrédient supprimé");
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleIngredientSaved = (ingredient: Ingredient) => {
    if (editingIngredient) {
      setIngredients((prev) => prev.map((i) => (i.id === ingredient.id ? ingredient : i)));
      toast.success("Ingrédient modifié");
    } else {
      setIngredients((prev) => [ingredient, ...prev]);
      toast.success("Ingrédient créé");
    }
    setIsModalOpen(false);
  };

  const filteredIngredients = ingredients.filter(
    ingredient =>
      ingredient.nameIngredient &&
      ingredient.nameIngredient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          Gestion des ingrédients
        </h1>
        <button
          onClick={handleAddIngredient}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel ingrédient
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher un ingrédient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 sm:px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
          >
            <Search className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Rechercher</span>
          </button>
        </div>
      </form>

      {/* Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 mb-6">
        <div className="flex items-center">
          <Package className="h-6 w-6 md:h-8 md:w-8 text-emerald-600 dark:text-emerald-400 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Total des ingrédients
            </h3>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {filteredIngredients.length}
            </p>
          </div>
        </div>
      </div>

      {/* Ingredients List */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="animate-pulse p-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredIngredients.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Liste des ingrédients
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {filteredIngredients.length} ingrédient{filteredIngredients.length > 1 ? "s" : ""} trouvé{filteredIngredients.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredIngredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors gap-3 sm:gap-0"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white text-base md:text-lg">
                    {ingredient.nameIngredient}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Unité: <span className="font-medium">{ingredient.unit}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleEditIngredient(ingredient)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteIngredient(ingredient.id)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchQuery ? "Aucun ingrédient trouvé" : "Aucun ingrédient"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {searchQuery
              ? "Essayez une recherche différente ou ajoutez un nouvel ingrédient"
              : "Commencez par ajouter votre premier ingrédient"}
          </p>
          <button
            onClick={handleAddIngredient}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un ingrédient
          </button>
        </div>
      )}

      {/* Ingredient Modal */}
      <IngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ingredient={editingIngredient}
        onSaved={handleIngredientSaved}
      />
    </div>
  );
};

export default Ingredients;