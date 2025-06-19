
export const calculateBMR = (sesso: string, peso: number, altezza: number, eta: number): number => {
  if (sesso === "Uomo") {
    return 10 * peso + 6.25 * altezza - 5 * eta + 5;
  } else {
    return 10 * peso + 6.25 * altezza - 5 * eta - 161;
  }
};

export const calculateTDEE = (bmr: number, attivita: string): number => {
  const factors = {
    "Sedentario": 1.2,
    "Leggero": 1.375,
    "Moderato": 1.55,
    "Intenso": 1.725,
    "Molto intenso": 1.9
  };
  return bmr * factors[attivita as keyof typeof factors];
};

export const calculateMacrosTarget = (tdee: number) => {
  return {
    carboidrati: (tdee * 0.50) / 4,
    proteine: (tdee * 0.20) / 4,
    grassi: (tdee * 0.30) / 9
  };
};

export const distributeMeals = (tdee: number) => {
  return {
    "Colazione": Math.round(tdee * 0.20),
    "Spuntino mattina": Math.round(tdee * 0.10),
    "Pranzo": Math.round(tdee * 0.35),
    "Spuntino pomeriggio": Math.round(tdee * 0.10),
    "Cena": Math.round(tdee * 0.25)
  };
};

export const macrosPerMeal = (totalMacros: any) => {
  const percentages = {
    "Colazione": { carboidrati: 0.25, proteine: 0.20, grassi: 0.20 },
    "Spuntino mattina": { carboidrati: 0.10, proteine: 0.10, grassi: 0.10 },
    "Pranzo": { carboidrati: 0.30, proteine: 0.35, grassi: 0.35 },
    "Spuntino pomeriggio": { carboidrati: 0.10, proteine: 0.10, grassi: 0.10 },
    "Cena": { carboidrati: 0.25, proteine: 0.25, grassi: 0.25 }
  };

  const mealMacros: any = {};
  for (const [meal, perc] of Object.entries(percentages)) {
    mealMacros[meal] = {
      carboidrati: totalMacros.carboidrati * perc.carboidrati,
      proteine: totalMacros.proteine * perc.proteine,
      grassi: totalMacros.grassi * perc.grassi
    };
  }
  return mealMacros;
};

export const calculateRecipeValues = (recipe: any, foodDb: any) => {
  const results = { Energia: 0, Proteine: 0, Grassi: 0, Carboidrati: 0 };
  
  for (const [ingredient, quantity] of Object.entries(recipe.ingredienti)) {
    const cleanName = ingredient.split(" (")[0].trim().toLowerCase();
    const q = parseFloat(quantity as string);

    // Ricerca diretta nel database
    const foundFood = Object.entries(foodDb).find(([name]) => 
      name.toLowerCase().includes(cleanName) || cleanName.includes(name.toLowerCase())
    );

    if (foundFood) {
      const [, values] = foundFood;
      results.Energia += values.Energia * q / 100;
      results.Proteine += values.Proteine * q / 100;
      results.Grassi += values.Lipidi * q / 100;
      results.Carboidrati += values.Carboidrati * q / 100;
    }
  }
  
  return results;
};

export const generateDailyMenu = (foodDb: any, recipes: any, mealKcal: any, totalMacros: any) => {
  const menu: any = {};
  const mealMacros = macrosPerMeal(totalMacros);
  
  // Inizializza tutti i pasti
  for (const [meal, kcal] of Object.entries(mealKcal)) {
    menu[meal] = {
      ricetta: null,
      ingredienti_ricetta: {},
      ingredienti_extra: [],
      kcal_tot: 0,
      macro_tot: { carboidrati: 0, proteine: 0, grassi: 0 }
    };
  }

  // Aggiungi ricette a pranzo e cena
  const mealsWithRecipes = ["Pranzo", "Cena"];
  for (const meal of mealsWithRecipes) {
    const recipeNames = Object.keys(recipes);
    const randomRecipe = recipeNames[Math.floor(Math.random() * recipeNames.length)];
    
    menu[meal].ricetta = randomRecipe;
    menu[meal].ingredienti_ricetta = recipes[randomRecipe].ingredienti;
    
    const values = calculateRecipeValues(recipes[randomRecipe], foodDb);
    menu[meal].kcal_tot += values.Energia;
    menu[meal].macro_tot.carboidrati += values.Carboidrati;
    menu[meal].macro_tot.proteine += values.Proteine;
    menu[meal].macro_tot.grassi += values.Grassi;
  }

  // Aggiungi ingredienti extra per bilanciare i macros
  for (const [meal, data] of Object.entries(menu)) {
    const targetMacros = mealMacros[meal];
    const remainingMacros = {
      carboidrati: Math.max(targetMacros.carboidrati - data.macro_tot.carboidrati, 0),
      proteine: Math.max(targetMacros.proteine - data.macro_tot.proteine, 0),
      grassi: Math.max(targetMacros.grassi - data.macro_tot.grassi, 0)
    };

    const foodEntries = Object.entries(foodDb);
    const shuffledFoods = foodEntries.sort(() => Math.random() - 0.5);
    
    for (const [foodName, values] of shuffledFoods) {
      if (data.kcal_tot >= mealKcal[meal] * 1.1) break;
      
      let quantity = 0;
      
      // Calcola quantità basata sui macros mancanti
      if (remainingMacros.proteine > 0 && values.Proteine > 0) {
        quantity = (remainingMacros.proteine / values.Proteine) * 100;
      }
      
      if (quantity >= 20 && quantity <= 200) {
        const additionalKcal = values.Energia * quantity / 100;
        
        if (data.kcal_tot + additionalKcal <= mealKcal[meal] * 1.1) {
          data.ingredienti_extra.push([foodName, Math.round(quantity * 10) / 10]);
          data.kcal_tot += additionalKcal;
          data.macro_tot.proteine += values.Proteine * quantity / 100;
          data.macro_tot.carboidrati += values.Carboidrati * quantity / 100;
          data.macro_tot.grassi += values.Lipidi * quantity / 100;
          
          // Aggiorna macros rimanenti
          remainingMacros.proteine = Math.max(remainingMacros.proteine - values.Proteine * quantity / 100, 0);
          remainingMacros.carboidrati = Math.max(remainingMacros.carboidrati - values.Carboidrati * quantity / 100, 0);
          remainingMacros.grassi = Math.max(remainingMacros.grassi - values.Lipidi * quantity / 100, 0);
        }
      }
      
      if (Object.values(remainingMacros).every(x => x <= 0)) break;
    }
  }

  return menu;
};
