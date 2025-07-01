import React, { useEffect, useState } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { plannedMealsAPI, recipesAPI } from '../services/api';
import type { PlannedMeal, Recipe } from '../types';
import toast from 'react-hot-toast';
import AddMealModal from '../components/Planning/AddMealModal';

const Planning: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');

  const mealTypes = [
    { key: 'breakfast', label: 'Petit-déjeuner' },
    { key: 'lunch', label: 'Déjeuner' },
    { key: 'dinner', label: 'Dîner' },
  ] as const;

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  useEffect(() => {
    fetchPlannedMeals();
  }, [currentWeek]);

  const fetchPlannedMeals = async () => {
    try {
      setLoading(true);
      const data = await plannedMealsAPI.getWeek(format(currentWeek, 'yyyy-MM-dd'));
      setPlannedMeals(data);
    } catch (error: any) {
      toast.error('Erreur lors du chargement du planning');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = (day: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setIsAddModalOpen(true);
  };

  const handleMealAdded = (meal: PlannedMeal) => {
    setPlannedMeals(prev => [...prev, meal]);
    setIsAddModalOpen(false);
    toast.success('Repas ajouté avec succès');
  };

  const handleDeleteMeal = async (mealId: number) => {
    try {
      await plannedMealsAPI.delete(mealId);
      setPlannedMeals(prev => prev.filter(meal => meal.id !== mealId));
      toast.success('Repas supprimé');
    } catch (error: any) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getMealForDayAndType = (day: Date, mealType: string) => {
    return plannedMeals.find(meal => 
      isSameDay(new Date(meal.date), day) && meal.mealType === mealType
    );
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-7 gap-4">
            {[...Array(21)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
          Planificateur de repas
        </h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <span className="text-lg font-medium text-gray-900 min-w-[200px] text-center">
            {format(currentWeek, 'dd MMMM', { locale: fr })} - {format(addDays(currentWeek, 6), 'dd MMMM yyyy', { locale: fr })}
          </span>
          
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="p-4 text-center border-r border-gray-200 last:border-r-0">
              <div className="text-sm font-medium text-gray-900">
                {format(day, 'EEEE', { locale: fr })}
              </div>
              <div className="text-lg font-bold text-gray-700 mt-1">
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Meals Grid */}
        {mealTypes.map((mealType) => (
          <div key={mealType.key} className="border-b border-gray-200 last:border-b-0">
            <div className="grid grid-cols-7">
              {weekDays.map((day) => {
                const meal = getMealForDayAndType(day, mealType.key);
                const dayString = format(day, 'yyyy-MM-dd');
                
                return (
                  <div key={`${dayString}-${mealType.key}`} className="min-h-[120px] p-3 border-r border-gray-200 last:border-r-0">
                    <div className="text-xs font-medium text-gray-500 mb-2">
                      {mealType.label}
                    </div>
                    
                    {meal ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 group relative">
                        <div className="text-sm font-medium text-emerald-900 mb-1">
                          {meal.recipe.name_recipe}
                        </div>
                        <div className="text-xs text-emerald-700">
                          {meal.recipe.servings} portions
                        </div>
                        <button
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddMeal(dayString, mealType.key)}
                        className="w-full h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add Meal Modal */}
      <AddMealModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        date={selectedDay}
        mealType={selectedMealType}
        onMealAdded={handleMealAdded}
      />
    </div>
  );
};

export default Planning;