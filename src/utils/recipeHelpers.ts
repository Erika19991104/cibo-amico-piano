
import { recipes } from "@/data/recipes";

type Recipe = (typeof recipes)[keyof typeof recipes];

// Raggruppa le ricette per categoria (es: colazione, pranzo, cena, spuntino)
export function groupRecipesByCategory(): Record<string, Recipe[]> {
  const map: Record<string, Recipe[]> = {};

  Object.values(recipes).forEach(recipe => {
    const mealTime = recipe.mealTime || "Altro";
    if (!map[mealTime]) map[mealTime] = [];
    map[mealTime].push(recipe);
  });

  return map;
}

// Percentuale di calorie da assegnare a ogni pasto secondo linee guida CREA
export const calorieDistribution: Record<string, number> = {
  colazione: 0.20,      // 20%
  spuntino_mattina: 0.05, // 5%
  pranzo: 0.40,         // 40%
  spuntino_pomeriggio: 0.05, // 5%
  cena: 0.30            // 30%
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
      caloriesSum += 250; // Valore stimato se mancano le calorie
    }
  }

  return mealPlan;
}
