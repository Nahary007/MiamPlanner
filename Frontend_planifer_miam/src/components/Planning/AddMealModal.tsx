import React, { useEffect, useState } from "react";
import { X, Search, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { recipesAPI, plannedMealsAPI } from "../../services/api";
import type { Recipe, PlannedMeal } from "../../types";
import toast from "react-hot-toast";

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner";
  onMealAdded: (meal: PlannedMeal) => void;
}

const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  date,
  mealType,
  onMealAdded,
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddRecipe, setShowAddRecipe] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const mealTypeLabels = {
    breakfast: "Petit-déjeuner",
    lunch: "Déjeuner",
    dinner: "Dîner",
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecipes();
    }
  }, [isOpen]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipesAPI.getAll(1, searchQuery);
      setRecipes(data.data);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des recettes");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExistingRecipe = async (recipeId: number) => {
    try {
      console.log('Adding existing recipe:', recipeId, 'for date:', date, 'mealType:', mealType);
      const meal = await plannedMealsAPI.create({
        recipeId: recipeId,
        date,
        mealType,
      });
      console.log('Meal created successfully:', meal);
      onMealAdded(meal);
      onClose();
    } catch (error: any) {
      console.error('Error adding meal:', error);
      toast.error("Erreur lors de l'ajout du repas");
    }
  };

  const handleCreateAndAddRecipe = async (data: any) => {
    try {
      console.log('Creating new recipe and adding meal:', data);
      // Create recipe first
      const recipe = await recipesAPI.create({
        name_recipe: data.name_recipe,
        description: data.description,
        instructions: data.instructions,
        servings: parseInt(data.servings),
        ingredients: [], // For now, we'll add ingredients separately
      });

      console.log('Recipe created:', recipe);
      
      // Then add it to the meal plan
      const meal = await plannedMealsAPI.create({
        recipeId: recipe.id,
        date,
        mealType,
      });

      console.log('Meal added to plan:', meal);
      onMealAdded(meal);
      reset();
      setShowAddRecipe(false);
      onClose();
    } catch (error: any) {
      console.error('Error creating recipe and adding meal:', error);
      toast.error("Erreur lors de la création de la recette");
    }
  };

  const handleSearch = () => {
    fetchRecipes();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Ajouter un repas - {mealTypeLabels[mealType]}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {!showAddRecipe ? (
              <div>
                {/* Search */}
                <div className="mb-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Rechercher une recette..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Recipe List */}
                <div className="max-h-64 overflow-y-auto mb-4">
                  {loading ? (
                    <div className="text-center py-4">Chargement...</div>
                  ) : recipes.length > 0 ? (
                    <div className="space-y-2">
                      {recipes.map((recipe) => (
                        <div
                          key={recipe.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {recipe.name_recipe}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {recipe.servings} portions
                            </p>
                          </div>
                          <button
                            onClick={() => handleAddExistingRecipe(recipe.id)}
                            className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition-colors"
                          >
                            Ajouter
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Aucune recette trouvée
                    </div>
                  )}
                </div>

                {/* Add Recipe Button */}
                <button
                  onClick={() => setShowAddRecipe(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une nouvelle recette
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(handleCreateAndAddRecipe)}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de la recette
                    </label>
                    <input
                      {...register("name_recipe", { required: true })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructions
                    </label>
                    <textarea
                      {...register("instructions", { required: true })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de portions
                    </label>
                    <input
                      {...register("servings", { required: true, min: 1 })}
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddRecipe(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? "Création..." : "Créer et ajouter"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMealModal;
