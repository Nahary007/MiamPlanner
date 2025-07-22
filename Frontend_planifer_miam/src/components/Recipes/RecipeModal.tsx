import React, { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { recipesAPI, ingredientsAPI } from "../../services/api";
import type { Recipe, Ingredient } from "../../types";
import toast from "react-hot-toast";

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  onSaved: (recipe: Recipe) => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  onClose,
  recipe,
  onSaved,
}) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name_recipe: "",
      description: "",
      instructions: "",
      servings: 1,
      ingredients: [{ ingredient_id: "", quantity: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  useEffect(() => {
    if (isOpen) {
      fetchIngredients();
      if (recipe) {
        setValue("name_recipe", recipe.name_recipe);
        setValue("description", recipe.description);
        setValue("instructions", recipe.instructions);
        setValue("servings", recipe.servings);

        if (recipe.ingredients && recipe.ingredients.length > 0) {
          const recipeIngredients = recipe.ingredients.map((ing) => ({
            ingredient_id: ing.ingredient.id.toString(),
            quantity: ing.quantity.toString(),
          }));
          setValue("ingredients", recipeIngredients);
        }
      } else {
        reset({
          name_recipe: "",
          description: "",
          instructions: "",
          servings: 1,
          ingredients: [{ ingredient_id: "", quantity: "" }],
        });
      }
    }
  }, [isOpen, recipe, setValue, reset]);

  const fetchIngredients = async () => {
    try {
      const data = await ingredientsAPI.getAll();
      setIngredients(data);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des ingrédients");
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const recipeData = {
        name_recipe: data.name_recipe,
        description: data.description,
        instructions: data.instructions,
        servings: parseInt(data.servings),
        ingredients: data.ingredients
          .filter((ing: any) => ing.ingredient_id && ing.quantity)
          .map((ing: any) => ({
            ingredient_id: parseInt(ing.ingredient_id),
            quantity: parseFloat(ing.quantity),
          })),
      };

      let savedRecipe: Recipe;
      if (recipe) {
        savedRecipe = await recipesAPI.update(recipe.id, recipeData);
      } else {
        savedRecipe = await recipesAPI.create(recipeData);
      }

      onSaved(savedRecipe);
    } catch (error: any) {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const filteredIngredients = ingredients.filter(
    ingredient =>
      (ingredient.name_ingredient ?? "").toLowerCase().includes(ingredientSearch.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {recipe ? "Modifier la recette" : "Nouvelle recette"}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de la recette *
                    </label>
                    <input
                      {...register("name_recipe", { required: "Nom requis" })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    {errors.name_recipe && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name_recipe.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Portions *
                    </label>
                    <input
                      {...register("servings", {
                        required: "Nombre de portions requis",
                        min: 1,
                      })}
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    {errors.servings && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.servings.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Description de la recette..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions *
                  </label>
                  <textarea
                    {...register("instructions", {
                      required: "Instructions requises",
                    })}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Étapes de préparation..."
                  />
                  {errors.instructions && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.instructions.message}
                    </p>
                  )}
                </div>

                {/* Ingredients */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Ingrédients
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        append({ ingredient_id: "", quantity: "" })
                      }
                      className="flex items-center px-3 py-1 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Ajouter
                    </button>
                  </div>

                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex space-x-2">
                        <div className="flex-1">
                          <select
                            {...register(`ingredients.${index}.ingredient_id`)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                          >
                            <option value="">Choisir un ingrédient</option>
                            {filteredIngredients.map((ingredient) => (
                              <option key={ingredient.id} value={ingredient.id}>
                                {ingredient.name_ingredient} ({ingredient.unit})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-24">
                          <input
                            {...register(`ingredients.${index}.quantity`)}
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="Qté"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-2 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
