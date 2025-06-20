
export interface FoodItem {
  indice?: number;               // opzionale, può servire come ID
  categoria: string;
  descrizione?: string;
  allergeni?: string;
  peso_porzione?: number;
  unita_misura?: string;

  Energia?: number;
  Proteine?: number;
  Lipidi_totali?: number;
  Grassi_saturi?: number;
  Grassi_monoinsaturi?: number;
  Grassi_polinsaturi?: number;
  Acidi_grassi_trans?: number;
  Carboidrati_totali?: number;
  Zuccheri_semplici?: number;
  Amido?: number;
  Fibre?: number;
  Acqua?: number;

  Vitamina_A?: number;
  Vitamina_C?: number;
  Vitamina_D?: number;
  Vitamina_E?: number;
  Vitamina_B1?: number;
  Vitamina_B2?: number;
  Vitamina_B3?: number;
  Vitamina_B6?: number;
  Vitamina_B9?: number;
  Vitamina_B12?: number;
  Vitamina_K?: number;

  Calcio?: number;
  Ferro?: number;
  Magnesio?: number;
  Potassio?: number;
  Sodio?: number;
  Zinco?: number;
  Colesterolo?: number;
  Alcool?: number;
}

export interface Recipe {
  ingredienti: { [key: string]: string };
  mealTime: string;
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
