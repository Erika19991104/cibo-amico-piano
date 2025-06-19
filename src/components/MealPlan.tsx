import React, { useEffect, useState } from "react";
import { Recipe } from "@/types/recipe";
import recipes from "@/data/recipes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MealPlanProps {
  userProfile: {
    eta: number;
    sesso: string;
    altezza: number;
    peso: number;
    attivita: string;
    calorieGiornaliere?: number;
  };
}

interface DailyMeal {
  category: string;
  recipes: Recipe[];
  totalCalories: number;
}

const categories = ["colazione", "spuntino", "pranzo", "cena"];

const MealPlan: React.FC<MealPlanProps> = ({ userProfile }) => {
  const [dailyMeals, setDailyMeals] = useState<DailyMeal[]>([]);

  // Funzione per stimare fabbisogno calorico (esempio semplice)
  const calculateCalorieNeeds = () => {
    // Qui puoi mettere il calcolo reale dal profilo
    return userProfile.calorieGiornaliere || 2000;
  };

  // Funzione per filtrare ricette per categoria
  const getRecipesByCategory = (category: string) => {
    return recipes.filter((r) =>
      r.categories?.some((cat) => cat.toLowerCase() === category.toLowerCase())
    );
  };

  // Distribuisci calorie approssimate per pasto
  const calorieDistribution = {
    colazione: 0.25,
    spuntino: 0.10,
    pranzo: 0.35,
    cena: 0.30,
  };

  useEffect(() => {
    const totalCalories = calculateCalorieNeeds();
    const meals: DailyMeal[] = categories.map((cat) => {
      const catCalories = totalCalories * (calorieDistribution as any)[cat];
      // Prendi ricette per categoria e cerca quella più vicina alle calorie
      const catRecipes = getRecipesByCategory(cat);

      // Se non ci sono ricette in quella categoria, lascia vuoto
      if (catRecipes.length === 0)
        return { category: cat, recipes: [], totalCalories: 0 };

      // Trova ricetta più vicina alle calorie desiderate (esempio semplice)
      let selectedRecipe = catRecipes[0];
      let minDiff = Math.abs((selectedRecipe.calories || 0) - catCalories);

      for (const r of catRecipes) {
        const diff = Math.abs((r.calories || 0) - catCalories);
        if (diff < minDiff) {
          minDiff = diff;
          selectedRecipe = r;
        }
      }

      return {
        category: cat,
        recipes: [selectedRecipe],
        totalCalories: selectedRecipe.calories || 0,
      };
    });

    setDailyMeals(meals);
  }, [userProfile]);

  return (
    <div className="space-y-6">
      {dailyMeals.map((meal) => (
        <Card key={meal.category}>
          <CardHeader>
            <CardTitle className="capitalize">{meal.category}</CardTitle>
          </CardHeader>
          <CardContent>
            {meal.recipes.length > 0 ? (
              meal.recipes.map((recipe) => (
                <div key={recipe.id} className="mb-4">
                  <h3 className="font-semibold">{recipe.name}</h3>
                  <p>Calorie: {recipe.calories ?? "N/D"}</p>
                  <p>Categoria: {recipe.categories?.join(", ")}</p>
                  {/* Aggiungi qui altri dettagli se vuoi */}
                </div>
              ))
            ) : (
              <p>Nessuna ricetta per questa categoria</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MealPlan;
