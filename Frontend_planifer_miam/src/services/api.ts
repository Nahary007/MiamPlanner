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

// Mock data for demo
const mockIngredients: Ingredient[] = [
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

let mockRecipes: Recipe[] = [
  {
    id: 1,
    name_recipe: 'Spaghetti Bolognaise',
    description: 'Un classique italien avec une sauce riche en tomates et viande',
    instructions: '1. Faire revenir les oignons et l\'ail\n2. Ajouter la viande hachée\n3. Incorporer les tomates\n4. Laisser mijoter 30 minutes\n5. Servir avec les pâtes',
    servings: 4,
    ingredients: [
      { id: 1, quantity: 400, ingredient: mockIngredients[3] },
      { id: 2, quantity: 0.5, ingredient: mockIngredients[6] },
      { id: 3, quantity: 0.3, ingredient: mockIngredients[0] },
      { id: 4, quantity: 0.1, ingredient: mockIngredients[1] },
    ]
  },
  {
    id: 2,
    name_recipe: 'Riz au poulet',
    description: 'Plat complet avec du riz parfumé et du poulet tendre',
    instructions: '1. Faire dorer le poulet\n2. Ajouter le riz et les légumes\n3. Verser le bouillon\n4. Cuire 20 minutes',
    servings: 3,
    ingredients: [
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
    await delay(600);
    let filtered = mockRecipes;
    if (search) {
      filtered = mockRecipes.filter(recipe => 
        recipe.name_recipe.toLowerCase().includes(search.toLowerCase())
      );
    }
    return { data: filtered, total: filtered.length };
  },
  
  getById: async (id: number): Promise<Recipe> => {
    await delay(400);
    const recipe = mockRecipes.find(r => r.id === id);
    if (!recipe) throw new Error('Recipe not found');
    return recipe;
  },
  
  create: async (data: RecipeForm): Promise<Recipe> => {
    await delay(800);
    const newRecipe: Recipe = {
      id: Math.max(...mockRecipes.map(r => r.id)) + 1,
      name_recipe: data.name_recipe,
      description: data.description,
      instructions: data.instructions,
      servings: data.servings,
      ingredients: data.ingredients.map((ing, index) => ({
        id: index + 1,
        quantity: ing.quantity,
        ingredient: mockIngredients.find(i => i.id === ing.ingredient_id)!
      }))
    };
    mockRecipes.push(newRecipe);
    return newRecipe;
  },
  
  update: async (id: number, data: Partial<RecipeForm>): Promise<Recipe> => {
    await delay(800);
    const index = mockRecipes.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Recipe not found');
    
    const updatedRecipe = {
      ...mockRecipes[index],
      ...data,
      ingredients: data.ingredients?.map((ing, idx) => ({
        id: idx + 1,
        quantity: ing.quantity,
        ingredient: mockIngredients.find(i => i.id === ing.ingredient_id)!
      })) || mockRecipes[index].ingredients
    };
    
    mockRecipes[index] = updatedRecipe;
    return updatedRecipe;
  },
  
  delete: async (id: number): Promise<void> => {
    await delay(500);
    mockRecipes = mockRecipes.filter(r => r.id !== id);
  },
};

// Ingredients API
export const ingredientsAPI = {
  getAll: async (): Promise<Ingredient[]> => {
    await delay(400);
    return mockIngredients;
  },
  
  search: async (query: string): Promise<Ingredient[]> => {
    await delay(300);
    return mockIngredients.filter(ing => 
      ing.name_ingredient.toLowerCase().includes(query.toLowerCase())
    );
  },
};

// Stock API
export const stockAPI = {
  getAll: async (): Promise<StockItem[]> => {
    await delay(600);
    return mockStockItems;
  },
  
  create: async (data: StockForm): Promise<StockItem> => {
    await delay(800);
    const newItem: StockItem = {
      id: Math.max(...mockStockItems.map(s => s.id)) + 1,
      user_id: 1,
      ingredient_id: data.ingredient_id,
      ingredient: mockIngredients.find(i => i.id === data.ingredient_id)!,
      quantity: data.quantity,
      unit: data.unit,
      expirationDate: data.expirationDate
    };
    mockStockItems.push(newItem);
    return newItem;
  },
  
  update: async (id: number, data: Partial<StockForm>): Promise<StockItem> => {
    await delay(800);
    const index = mockStockItems.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Stock item not found');
    
    const updatedItem = {
      ...mockStockItems[index],
      ...data,
      ingredient: data.ingredient_id ? 
        mockIngredients.find(i => i.id === data.ingredient_id)! : 
        mockStockItems[index].ingredient
    };
    
    mockStockItems[index] = updatedItem;
    return updatedItem;
  },
  
  delete: async (id: number): Promise<void> => {
    await delay(500);
    mockStockItems = mockStockItems.filter(s => s.id !== id);
  },
  
  getExpiring: async (days = 3): Promise<StockItem[]> => {
    await delay(400);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    
    return mockStockItems.filter(item => 
      new Date(item.expirationDate) <= cutoffDate
    );
  },
};

// Planned Meals API
export const plannedMealsAPI = {
  getWeek: async (startDate: string): Promise<PlannedMeal[]> => {
    await delay(600);
    return mockPlannedMeals;
  },
  
  create: async (data: PlannedMealForm): Promise<PlannedMeal> => {
    await delay(800);
    const recipe = mockRecipes.find(r => r.id === data.recipe_id);
    if (!recipe) throw new Error('Recipe not found');
    
    const newMeal: PlannedMeal = {
      id: Math.max(...mockPlannedMeals.map(m => m.id)) + 1,
      user_id: 1,
      recipe_id: data.recipe_id,
      recipe,
      date: data.date,
      mealType: data.mealType
    };
    mockPlannedMeals.push(newMeal);
    return newMeal;
  },
  
  update: async (id: number, data: Partial<PlannedMealForm>): Promise<PlannedMeal> => {
    await delay(800);
    const index = mockPlannedMeals.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Planned meal not found');
    
    const updatedMeal = {
      ...mockPlannedMeals[index],
      ...data,
      recipe: data.recipe_id ? 
        mockRecipes.find(r => r.id === data.recipe_id)! : 
        mockPlannedMeals[index].recipe
    };
    
    mockPlannedMeals[index] = updatedMeal;
    return updatedMeal;
  },
  
  delete: async (id: number): Promise<void> => {
    await delay(500);
    mockPlannedMeals = mockPlannedMeals.filter(m => m.id !== id);
  },
};

// Shopping List API
export const shoppingListAPI = {
  generate: async (startDate: string): Promise<ShoppingListItem[]> => {
    await delay(800);
    
    // Calculate needed ingredients from planned meals
    const neededIngredients = new Map<number, { ingredient: Ingredient; totalQuantity: number; unit: string }>();
    
    mockPlannedMeals.forEach(meal => {
      meal.recipe.ingredients?.forEach(ing => {
        const key = ing.ingredient.id;
        if (neededIngredients.has(key)) {
          const existing = neededIngredients.get(key)!;
          existing.totalQuantity += ing.quantity;
        } else {
          neededIngredients.set(key, {
            ingredient: ing.ingredient,
            totalQuantity: ing.quantity,
            unit: ing.ingredient.unit
          });
        }
      });
    });
    
    // Calculate what's needed after subtracting stock
    const shoppingList: ShoppingListItem[] = [];
    
    neededIngredients.forEach((needed, ingredientId) => {
      const stockItem = mockStockItems.find(s => s.ingredient_id === ingredientId);
      const availableQuantity = stockItem ? stockItem.quantity : 0;
      const neededQuantity = Math.max(0, needed.totalQuantity - availableQuantity);
      
      if (neededQuantity > 0) {
        shoppingList.push({
          ingredient: needed.ingredient,
          totalQuantity: needed.totalQuantity,
          unit: needed.unit,
          neededQuantity
        });
      }
    });
    
    return shoppingList;
  },
  
  download: async (startDate: string): Promise<Blob> => {
    await delay(1000);
    // Create a simple text file for demo
    const content = `Liste de courses - Semaine du ${startDate}\n\nArticles à acheter:\n- Exemple d'article\n- Autre article`;
    return new Blob([content], { type: 'text/plain' });
  },
};