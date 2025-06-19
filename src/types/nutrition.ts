
export interface FoodItem {
  categoria: string;
  Energia: number;
  Proteine: number;
  Lipidi: number;
  Carboidrati: number;
}

export interface Recipe {
  ingredienti: { [key: string]: string };
}

export interface MacroNutrients {
  carboidrati: number;
  proteine: number;
  grassi: number;
}

export interface MealData {
  ricetta: string | null;
  ingredienti_ricetta: { [key: string]: string };
  ingredienti_extra: [string, number][];
  kcal_tot: number;
  macro_tot: MacroNutrients;
}

export interface DailyMenu {
  [mealName: string]: MealData;
}

export interface FoodDatabase {
  [foodName: string]: FoodItem;
}

export interface RecipeDatabase {
  [recipeName: string]: Recipe;
}
