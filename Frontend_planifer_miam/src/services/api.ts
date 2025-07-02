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

const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
    throw new Error(error.message || 'Une erreur est survenue');
  }
  return response.json();
};

// Auth API
export const authAPI = {
  login: async (data: LoginForm): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  register: async (data: RegisterForm): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  logout: async (): Promise<void> => {
    // Just clear local storage for now
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getProfile: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getRecentMeals: async (): Promise<PlannedMeal[]> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/recent-meals`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getExpiringItems: async (): Promise<StockItem[]> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/expiring-items`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Recipes API
export const recipesAPI = {
  getAll: async (page = 1, search = ''): Promise<{ data: Recipe[]; total: number }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
    });
    
    const response = await fetch(`${API_BASE_URL}/recipes?${params}`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    
    // For now, return the data directly since the backend doesn't implement pagination yet
    return { data, total: data.length };
  },
  
  getById: async (id: number): Promise<Recipe> => {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  
  create: async (data: RecipeForm): Promise<Recipe> => {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  update: async (id: number, data: Partial<RecipeForm>): Promise<Recipe> => {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
      throw new Error(error.message || 'Une erreur est survenue');
    }
  },
};

// Ingredients API
export const ingredientsAPI = {
  getAll: async (): Promise<Ingredient[]> => {
    // Mock data for now since ingredients endpoint doesn't exist yet
    return [
      { id: 1, name_ingredient: 'Tomates', unit: 'kg' },
      { id: 2, name_ingredient: 'Oignons', unit: 'kg' },
      { id: 3, name_ingredient: 'Ail', unit: 'gousses' },
      { id: 4, name_ingredient: 'Pâtes', unit: 'g' },
      { id: 5, name_ingredient: 'Riz', unit: 'g' },
      { id: 6, name_ingredient: 'Poulet', unit: 'kg' },
      { id: 7, name_ingredient: 'Bœuf', unit: 'kg' },
      { id: 8, name_ingredient: 'Carottes', unit: 'kg' },
      { id: 9, name_ingredient: 'Pommes de terre', unit: 'kg' },
      { id: 10, name_ingredient: 'Lait', unit: 'L' },
    ];
  },
  
  search: async (query: string): Promise<Ingredient[]> => {
    const allIngredients = await ingredientsAPI.getAll();
    return allIngredients.filter(ing => 
      ing.name_ingredient.toLowerCase().includes(query.toLowerCase())
    );
  },
};

// Stock API
export const stockAPI = {
  getAll: async (): Promise<StockItem[]> => {
    const response = await fetch(`${API_BASE_URL}/stock`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  
  create: async (data: StockForm): Promise<StockItem> => {
    const response = await fetch(`${API_BASE_URL}/stock`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  update: async (id: number, data: Partial<StockForm>): Promise<StockItem> => {
    const response = await fetch(`${API_BASE_URL}/stock/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/stock/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
      throw new Error(error.message || 'Une erreur est survenue');
    }
  },
  
  getExpiring: async (days = 3): Promise<StockItem[]> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/expiring-items`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Planned Meals API
export const plannedMealsAPI = {
  getWeek: async (startDate: string): Promise<PlannedMeal[]> => {
    const response = await fetch(`${API_BASE_URL}/planned-meals`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  
  create: async (data: PlannedMealForm): Promise<PlannedMeal> => {
    const response = await fetch(`${API_BASE_URL}/planned-meals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        recipe_id: data.recipe_id,
        planned_date: data.date,
        meal_type: data.mealType,
      }),
    });
    return handleResponse(response);
  },
  
  update: async (id: number, data: Partial<PlannedMealForm>): Promise<PlannedMeal> => {
    const response = await fetch(`${API_BASE_URL}/planned-meals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        recipe_id: data.recipe_id,
        planned_date: data.date,
        meal_type: data.mealType,
      }),
    });
    return handleResponse(response);
  },
  
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/planned-meals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
      throw new Error(error.message || 'Une erreur est survenue');
    }
  },
};

// Shopping List API
export const shoppingListAPI = {
  generate: async (startDate: string): Promise<ShoppingListItem[]> => {
    // Mock implementation for now
    return [];
  },
  
  download: async (startDate: string): Promise<Blob> => {
    // Mock implementation for now
    const content = `Liste de courses - Semaine du ${startDate}\n\nArticles à acheter:\n- Exemple d'article\n- Autre article`;
    return new Blob([content], { type: 'text/plain' });
  },
};