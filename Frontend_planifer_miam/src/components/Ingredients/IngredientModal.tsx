import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { ingredientsAPI } from "../../services/api";
import type { Ingredient } from "../../types";
import toast from "react-hot-toast";

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient | null;
  onSaved: (ingredient: Ingredient) => void;
}

const IngredientModal: React.FC<IngredientModalProps> = ({
  isOpen,
  onClose,
  ingredient,
  onSaved,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (isOpen) {
      if (ingredient) {
        setValue("name_ingredient", ingredient.nameIngredient);
        setValue("unit", ingredient.unit);
      } else {
        reset({
          name_ingredient: "",
          unit: "",
        });
      }
    }
  }, [isOpen, ingredient, setValue, reset]);

  const onSubmit = async (data: any) => {
    try {
      const ingredientData = {
        name_ingredient: data.name_ingredient,
        unit: data.unit,
      };

      let savedIngredient: Ingredient;
      if (ingredient) {
        savedIngredient = await ingredientsAPI.update(ingredient.id, ingredientData);
      } else {
        savedIngredient = await ingredientsAPI.create(ingredientData);
      }

      onSaved(savedIngredient);
    } catch (error: any) {
      toast.error("Erreur lors de la sauvegarde");
    }
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {ingredient ? "Modifier l'ingrédient" : "Nouvel ingrédient"}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Nom de l'ingrédient *
                  </label>
                  <input
                    {...register("name_ingredient", {
                      required: "Le nom de l'ingrédient est requis",
                      minLength: {
                        value: 2,
                        message: "Le nom doit contenir au moins 2 caractères",
                      },
                    })}
                    type="text"
                    placeholder="Ex: Tomates, Oignons, Ail..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  {errors.name_ingredient?.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.name_ingredient.message)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Unité de mesure *
                  </label>
                  <select
                    {...register("unit", {
                      required: "L'unité de mesure est requise",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Choisir une unité</option>
                    <option value="kg">Kilogramme (kg)</option>
                    <option value="g">Gramme (g)</option>
                    <option value="L">Litre (L)</option>
                    <option value="ml">Millilitre (ml)</option>
                    <option value="pièce">Pièce</option>
                    <option value="gousse">Gousse</option>
                    <option value="branche">Branche</option>
                    <option value="feuille">Feuille</option>
                    <option value="cuillère à soupe">Cuillère à soupe</option>
                    <option value="cuillère à café">Cuillère à café</option>
                    <option value="tasse">Tasse</option>
                    <option value="verre">Verre</option>
                    <option value="boîte">Boîte</option>
                    <option value="sachet">Sachet</option>
                    <option value="tranche">Tranche</option>
                  </select>
                  {errors.unit?.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.unit.message)}
                    </p>
                  )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 <strong>Conseil:</strong> Choisissez l'unité la plus couramment utilisée pour cet ingrédient dans vos recettes.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
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
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:w-auto sm:text-sm"
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

export default IngredientModal;