import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { stockAPI, ingredientsAPI } from '../../services/api';
import type { StockItem, Ingredient } from '../../types';
import toast from 'react-hot-toast';

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItem: StockItem | null;
  onSaved: (item: StockItem) => void;
}

const StockModal: React.FC<StockModalProps> = ({
  isOpen,
  onClose,
  stockItem,
  onSaved,
}) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (isOpen) {
      fetchIngredients();
      if (stockItem) {
        setValue('ingredient_id', stockItem.ingredient_id);
        setValue('quantity', stockItem.quantity);
        setValue('unit', stockItem.unit);
        setValue('expirationDate', stockItem.expirationDate.split('T')[0]);
      } else {
        reset({
          ingredient_id: '',
          quantity: '',
          unit: '',
          expirationDate: '',
        });
      }
    }
  }, [isOpen, stockItem, setValue, reset]);

  const fetchIngredients = async () => {
    try {
      const data = await ingredientsAPI.getAll();
      setIngredients(data);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des ingrédients');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const stockData = {
        ingredient_id: parseInt(data.ingredient_id),
        quantity: parseFloat(data.quantity),
        unit: data.unit,
        expirationDate: data.expirationDate,
      };

      let savedItem: StockItem;
      if (stockItem) {
        savedItem = await stockAPI.update(stockItem.id, stockData);
      } else {
        savedItem = await stockAPI.create(stockData);
      }

      onSaved(savedItem);
    } catch (error: any) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {stockItem ? 'Modifier l\'article' : 'Ajouter au stock'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingrédient *
                  </label>
                  <select
                    {...register('ingredient_id', { required: 'Ingrédient requis' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Choisir un ingrédient</option>
                    {ingredients.map((ingredient) => (
                      <option key={ingredient.id} value={ingredient.id}>
                        {ingredient.name_ingredient}
                      </option>
                    ))}
                  </select>
                  {errors.ingredient_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.ingredient_id.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité *
                    </label>
                    <input
                      {...register('quantity', { 
                        required: 'Quantité requise',
                        min: { value: 0.1, message: 'La quantité doit être positive' }
                      })}
                      type="number"
                      step="0.1"
                      min="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unité *
                    </label>
                    <input
                      {...register('unit', { required: 'Unité requise' })}
                      type="text"
                      placeholder="kg, g, L, ml..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    {errors.unit && (
                      <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de péremption *
                  </label>
                  <input
                    {...register('expirationDate', { required: 'Date de péremption requise' })}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  {errors.expirationDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.expirationDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:w-auto sm:text-sm"
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

export default StockModal;