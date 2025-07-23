import React, { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, ChefHat } from "lucide-react";
import { recipesAPI } from "../services/api";
import type { Recipe } from "../types";
import toast from "react-hot-toast";
import RecipeModal from "../components/Recipes/RecipeModal";

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const recipesPerPage = 12;

  useEffect(() => {
    fetchRecipes();
  }, [currentPage, searchQuery]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipesAPI.getAll(currentPage, searchQuery);
      setRecipes(data.data);
      setTotalRecipes(data.total);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des recettes");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRecipes();
  };

  const handleAddRecipe = () => {
    setEditingRecipe(null);
    setIsModalOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleDeleteRecipe = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette recette ?")) {
      return;
    }

    try {
      await recipesAPI.delete(id);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
      toast.success("Recette supprimée");
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleRecipeSaved = (recipe: Recipe) => {
    if (editingRecipe) {
      setRecipes((prev) => prev.map((r) => (r.id === recipe.id ? recipe : r)));
      toast.success("Recette modifiée");
    } else {
      setRecipes((prev) => [recipe, ...prev]);
      toast.success("Recette créée");
    }
    setIsModalOpen(false);
  };

  const totalPages = Math.ceil(totalRecipes / recipesPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          Mes recettes
        </h1>
        <button
          onClick={handleAddRecipe}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle recette
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher une recette..."
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

      {/* Recipes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={`loading-skeleton-${i}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : recipes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            {recipes.map((recipe) => (
              <div
                key={`recipe-${recipe.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                      {recipe.nameRecipe}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {recipe.servings} portion{recipe.servings > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={() => handleEditRecipe(recipe)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {recipe.description && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2 md:line-clamp-3">
                    {recipe.description}
                  </p>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <ChefHat className="h-4 w-4 mr-1" />
                    {recipe.ingredients?.length || 0} ingrédient
                    {(recipe.ingredients?.length || 0) > 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <nav className="flex flex-wrap justify-center gap-1 md:gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page, index) => (
                    <button
                      key={`pagination-page-${index}-${page}`}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 md:px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-emerald-600 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <ChefHat className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucune recette trouvée
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {searchQuery
              ? "Essayez une recherche différente"
              : "Commencez par ajouter votre première recette"}
          </p>
          <button
            onClick={handleAddRecipe}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une recette
          </button>
        </div>
      )}

      {/* Recipe Modal */}
      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipe={editingRecipe}
        onSaved={handleRecipeSaved}
      />
    </div>
  );
};

export default Recipes;