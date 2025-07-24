import type { 
  User, 
  Recipe, 
  Ingredient, 
  StockItem, 
  PlannedMeal, 
  LoginForm, 
  RegisterForm, 
  RecipeForm, 
  StockForm, 
  PlannedMealForm,
  DashboardStats,
  ShoppingListItem
} from '../types';
import axios from "axios";

// Ajoute le token JWT à chaque requête axios si présent
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock data for demo
const mockIngredients: Ingredient[] = [
  { id: 1, nameIngredient: 'Tomates', unit: 'kg' },
  { id: 2, nameIngredient: 'Oignons', unit: 'kg' },
  { id: 3, nameIngredient: 'Ail', unit: 'gousses' },
  { id: 4, nameIngredient: 'Pâtes', unit: 'g' },
  { id: 5, nameIngredient: 'Riz', unit: 'g' },
  { id: 6, nameIngredient: 'Poulet', unit: 'kg' },
  { id: 7, nameIngredient: 'Bœuf', unit: 'kg' },
  { id: 8, nameIngredient: 'Carottes', unit: 'kg' },
  { id: 9, nameIngredient: 'Pommes de terre', unit: 'kg' },
  { id: 10, nameIngredient: 'Lait', unit: 'L' },
];

let mockRecipes: Recipe[] = [
  {
    id: 1,
    nameRecipe: 'Spaghetti Bolognaise',
    description: 'Un classique italien avec une sauce riche en tomates et viande',
    instructions: '1. Faire revenir les oignons et l\'ail\n2. Ajouter la viande hachée\n3. Incorporer les tomates\n4. Laisser mijoter 30 minutes\n5. Servir avec les pâtes',
    servings: 4,
    ingredientQuantities: [
      { id: 1, quantity: 400, ingredient: mockIngredients[3] },
      { id: 2, quantity: 0.5, ingredient: mockIngredients[6] },
      { id: 3, quantity: 0.3, ingredient: mockIngredients[0] },
      { id: 4, quantity: 0.1, ingredient: mockIngredients[1] },
    ]
  },
  {
    id: 2,
    nameRecipe: 'Riz au poulet',
    description: 'Plat complet avec du riz parfumé et du poulet tendre',
    instructions: '1. Faire dorer le poulet\n2. Ajouter le riz et les légumes\n3. Verser le bouillon\n4. Cuire 20 minutes',
    servings: 3,
    ingredientQuantities: [
      { id: 5, quantity: 300, ingredient: mockIngredients[4] },
      { id: 6, quantity: 0.4, ingredient: mockIngredients[5] },
      { id: 7, quantity: 0.2, ingredient: mockIngredients[7] },
    ]
  }
];

let mockStockItems: StockItem[] = [
  {
    id: 1,
    user_id: 1,
    ingredient_id: 1,
    ingredient: mockIngredients[0],
    quantity: 1.5,
    unit: 'kg',
    expirationDate: '2025-01-20T00:00:00Z'
  },
  {
    id: 2,
    user_id: 1,
    ingredient_id: 4,
    ingredient: mockIngredients[3],
    quantity: 500,
    unit: 'g',
    expirationDate: '2025-02-15T00:00:00Z'
  },
  {
    id: 3,
    user_id: 1,
    ingredient_id: 10,
    ingredient: mockIngredients[9],
    quantity: 1,
    unit: 'L',
    expirationDate: '2025-01-18T00:00:00Z'
  }
];

let mockPlannedMeals: PlannedMeal[] = [
  {
    id: 1,
    user_id: 1,
    recipe_id: 1,
    recipe: mockRecipes[0],
    date: '2025-01-20',
    mealType: 'dinner'
  },
  {
    id: 2,
    user_id: 1,
    recipe_id: 2,
    recipe: mockRecipes[1],
    date: '2025-01-21',
    mealType: 'lunch'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const authAPI = {
  login: async (data: LoginForm): Promise<{ user: User; token: string }> => {
    await delay(1000);
    return {
      user: { id: 1, nom: 'Jean Dupont', email: data.email },
      token: 'demo-token'
    };
  },
  
  register: async (data: RegisterForm): Promise<{ user: User; token: string }> => {
    await delay(1000);
    return {
      user: { id: 1, nom: data.nom, email: data.email },
      token: 'demo-token'
    };
  },
  
  logout: async (): Promise<void> => {
    await delay(500);
  },
  
  getProfile: async (): Promise<User> => {
    await delay(500);
    return { id: 1, nom: 'Jean Dupont', email: 'jean.dupont@example.com' };
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    await delay(800);
    return {
      plannedMealsThisWeek: mockPlannedMeals.length,
      stockItemsCount: mockStockItems.length,
      expiringItemsCount: 1
    };
  },
};

// Recipes API
export const recipesAPI = {
  getAll: async (page = 1, search = ''): Promise<{ data: Recipe[]; total: number }> => {
    const params: any = {};
    if (search) params.search = search;
    // Ajoute la pagination si ton backend la gère
    const res = await axios.get('http://localhost:8000/api/recipes', { params });
    return { data: res.data, total: res.data.length };
  },

  getById: async (id: number): Promise<Recipe> => {
    const res = await axios.get(`http://localhost:8000/api/recipes/${id}`);
    return res.data;
  },

  create: async (data: RecipeForm): Promise<Recipe> => {
    const res = await axios.post('http://localhost:8000/api/recipes', data);
    return res.data;
  },

  update: async (id: number, data: Partial<RecipeForm>): Promise<Recipe> => {
    const res = await axios.put(`http://localhost:8000/api/recipes/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`http://localhost:8000/api/recipes/${id}`);
  },
};

// Ingredients API
export const ingredientsAPI = {
  getAll: async (): Promise<Ingredient[]> => {
    const res = await axios.get('http://localhost:8000/api/ingredients');
    return res.data;
  },

  search: async (query: string): Promise<Ingredient[]> => {
    const res = await axios.get('http://localhost:8000/api/ingredients', { params: { search: query } });
    return res.data;
  },

  create: async (data: { name_ingredient: string; unit: string }): Promise<Ingredient> => {
    const res = await axios.post('http://localhost:8000/api/ingredients', data);
    return res.data;
  },

  update: async (id: number, data: { name_ingredient: string; unit: string }): Promise<Ingredient> => {
    const res = await axios.put(`http://localhost:8000/api/ingredients/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`http://localhost:8000/api/ingredients/${id}`);
  },
};

// Stock API
export const stockAPI = {
  getAll: async (): Promise<StockItem[]> => {
    const res = await axios.get('http://localhost:8000/api/stock');
    return res.data;
  },

  create: async (data: StockForm): Promise<StockItem> => {
    const res = await axios.post('http://localhost:8000/api/stock', data);
    return res.data;
  },

  update: async (id: number, data: Partial<StockForm>): Promise<StockItem> => {
    const res = await axios.put(`http://localhost:8000/api/stock/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`http://localhost:8000/api/stock/${id}`);
  },

  getExpiring: async (days = 3): Promise<StockItem[]> => {
    const res = await axios.get('http://localhost:8000/api/stock/expiring', { params: { days } });
    return res.data;
  },
};

// Planned Meals API
export const plannedMealsAPI = {
  getAll: async (): Promise<PlannedMeal[]> => {
    const res = await axios.get('http://localhost:8000/api/planned_meals');
    return res.data;
  },

  getWeek: async (weekStart: string): Promise<PlannedMeal[]> => {
    const res = await axios.get('http://localhost:8000/api/planned_meals/week', { params: { start: weekStart } });
    return res.data;
  },

  create: async (data: { recipeId: number; date: string; mealType: string }): Promise<PlannedMeal> => {
    const res = await axios.post('http://localhost:8000/api/planned_meals/create', data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`http://localhost:8000/api/planned_meals/delete/${id}`);
  },
};

// Shopping List API
// Shopping List API
export const shoppingListAPI = {
  generate: async (startDate: string): Promise<ShoppingListItem[]> => {
    const res = await axios.get('http://localhost:8000/api/shopping-list/generate', {
      params: { startDate }
    });
    return res.data;
  },

  download: async (startDate: string): Promise<Blob> => {
    const res = await axios.get('http://localhost:8000/api/shopping-list/download', {
      params: { startDate },
      responseType: 'blob',
    });
    return res.data;
  },
};
