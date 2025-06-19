import recipes from "@/data/recipes";

type Recipe = typeof recipes[number];

// Raggruppa le ricette per categoria (es: colazione, pranzo, cena, spuntino)
export function groupRecipesByCategory(): Record<string, Recipe[]> {
  const map: Record<string, Recipe[]> = {};

  recipes.forEach(recipe => {
    recipe.categories.forEach(cat => {
      if (!map[cat]) map[cat] = [];
      map[cat].push(recipe);
    });
  });

  return map;
}

// Percentuale di calorie da assegnare a ogni pasto
export const calorieDistribution: Record<string, number> = {
  colazione: 0.25,
  spuntino: 0.1,
  pranzo: 0.35,
  cena: 0.3,
};

// Genera il piano alimentare scegliendo ricette in base al fabbisogno calorico
export function generateMealPlan(calorieNeeds: number): Record<string, Recipe[]> {
  const recipesByCategory = groupRecipesByCategory();
  const mealPlan: Record<string, Recipe[]> = {};

  for (const [meal, perc] of Object.entries(calorieDistribution)) {
    const targetCalories = calorieNeeds * perc;
    let caloriesSum = 0;
    mealPlan[meal] = [];

    const categoryRecipes = recipesByCategory[meal] || [];

    for (const recipe of categoryRecipes) {
      if (caloriesSum >= targetCalories) break;
      mealPlan[meal].push(recipe);
      caloriesSum += recipe.calories || 0;
    }
  }

  return mealPlan;
}
