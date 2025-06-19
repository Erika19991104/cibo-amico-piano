import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecipePortion {
  recipe: {
    id: string;
    name: string;
    calories?: number;
  };
  portion: number; // frazione della porzione (es. 0.6 = 60%)
}

interface Meal {
  categoria: string;
  ricette: RecipePortion[];
}

interface MealPlanProps {
  mealPlan: Meal[];
}

const MealPlan: React.FC<MealPlanProps> = ({ mealPlan }) => {
  return (
    <div className="space-y-6">
      {mealPlan.map(({ categoria, ricette }) => (
        <Card key={categoria}>
          <CardHeader>
            <CardTitle>{categoria}</CardTitle>
          </CardHeader>
          <CardContent>
            {ricette.length > 0 ? (
              <ul>
                {ricette.map(({ recipe, portion }) => (
                  <li key={recipe.id}>
                    {recipe.name} — Porzione: {(portion * 100).toFixed(0)}%{" "}
                    {recipe.calories
                      ? `(${(portion * recipe.calories).toFixed(0)} kcal)`
                      : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nessuna ricetta disponibile per {categoria.toLowerCase()}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MealPlan;
