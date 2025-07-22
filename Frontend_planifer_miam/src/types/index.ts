// API Types
export interface User {
  id: number;
  nom: string;
  email: string;
  roles?: string[];
}

export interface Recipe {
  id: number;
  name_recipe: string;
  description: string;
  instructions: string;
  servings: number;
  ingredients?: IngredientQuantity[];
}

export interface Ingredient {
  id: number;
  nameIngredient: string;
  unit: string;
}

export interface IngredientQuantity {
  id?: number;
  quantity: number;
  ingredient: Ingredient;
}

export interface StockItem {
  id: number;
  user_id: number;
  ingredient_id: number;
  ingredient: Ingredient;
  quantity: number;
  unit: string;
  expirationDate: string;
}

export interface PlannedMeal {
  id: number;
  user_id: number;
  recipe_id: number;
  recipe: Recipe;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  nom: string;
  email: string;
  password: string;
}

export interface RecipeForm {
  name_recipe: string;
  description: string;
  instructions: string;
  servings: number;
  ingredients: Array<{
    ingredient_id: number;
    quantity: number;
  }>;
}

export interface StockForm {
  ingredient_id: number;
  quantity: number;
  unit: string;
  expirationDate: string;
}

export interface PlannedMealForm {
  recipe_id: number;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

// UI Types
export interface DashboardStats {
  plannedMealsThisWeek: number;
  stockItemsCount: number;
  expiringItemsCount: number;
}

export interface ShoppingListItem {
  ingredient: Ingredient;
  totalQuantity: number;
  unit: string;
  neededQuantity: number;
}