import React from "react";
import recipes from "@/data/recipes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MealPlanProps {
  userProfile: {
    // inserisci i campi di userProfile che ti servono per il piano, es:
    sesso: string;
    eta: number;
    altezza: number;
    peso: number;
    attivita: string;
  };
}

const MealPlan: React.FC<MealPlanProps> = ({ userProfile }) => {
  // Funzione per ottenere ricette per un pasto specifico
  const getRecipesForMeal = (mealCategory: string) => {
    return recipes.filter(({ mealTime }) => {
      if (!mealTime) return false;
      const mealTimes = mealTime.toLowerCase().split("/");
      return mealTimes.includes(mealCategory.toLowerCase());
    });
  };

  // Esempio: prendi ricette per i pasti classici
  const colazioneRecipes = getRecipesForMeal("colazione");
  const pranzoRecipes = getRecipesForMeal("pranzo");
  const cenaRecipes = getRecipesForMeal("cena");
  const spuntinoRecipes = getRecipesForMeal("spuntino");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Colazione</CardTitle>
        </CardHeader>
        <CardContent>
          {colazioneRecipes.length > 0 ? (
            <ul>
              {colazioneRecipes.map((r) => (
                <li key={r.id}>{r.name}</li>
              ))}
            </ul>
          ) : (
            <p>Nessuna ricetta per la colazione</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pranzo</CardTitle>
        </CardHeader>
        <CardContent>
          {pranzoRecipes.length > 0 ? (
            <ul>
              {pranzoRecipes.map((r) => (
                <li key={r.id}>{r.name}</li>
              ))}
            </ul>
          ) : (
            <p>Nessuna ricetta per il pranzo</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cena</CardTitle>
        </CardHeader>
        <CardContent>
          {cenaRecipes.length > 0 ? (
            <ul>
              {cenaRecipes.map((r) => (
                <li key={r.id}>{r.name}</li>
              ))}
            </ul>
          ) : (
            <p>Nessuna ricetta per la cena</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spuntino</CardTitle>
        </CardHeader>
        <CardContent>
          {spuntinoRecipes.length > 0 ? (
            <ul>
              {spuntinoRecipes.map((r) => (
                <li key={r.id}>{r.name}</li>
              ))}
            </ul>
          ) : (
            <p>Nessuno spuntino previsto</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MealPlan;
