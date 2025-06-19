
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { calculateBMR, calculateTDEE, calculateMacrosTarget, distributeMeals, generateDailyMenu } from "@/utils/nutritionUtils";
import { foodDatabase } from "@/data/foodDatabase";
import { recipes } from "@/data/recipes";
import { UtensilsCrossed, Target, TrendingUp } from "lucide-react";

interface MealPlanProps {
  userProfile: any;
}

export const MealPlan = ({ userProfile }: MealPlanProps) => {
  const [menuData, setMenuData] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);

  useEffect(() => {
    if (userProfile) {
      // Calcoli nutrizionali
      const bmr = calculateBMR(userProfile.sesso, userProfile.peso, userProfile.altezza, userProfile.eta);
      const tdee = calculateTDEE(bmr, userProfile.attivita);
      const macrosTarget = calculateMacrosTarget(tdee);
      const mealDistribution = distributeMeals(tdee);
      
      // Genera menù
      const menu = generateDailyMenu(foodDatabase, recipes, mealDistribution, macrosTarget);
      
      setNutritionData({
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        macrosTarget,
        mealDistribution
      });
      setMenuData(menu);
    }
  }, [userProfile]);

  if (!nutritionData || !menuData) {
    return <div>Caricamento piano alimentare...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Riepilogo nutrizionale */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-blue-600" />
            Fabbisogno Giornaliero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{nutritionData.bmr}</div>
              <div className="text-sm text-gray-600">BMR (kcal)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{nutritionData.tdee}</div>
              <div className="text-sm text-gray-600">TDEE (kcal)</div>
            </div>
            <div className="text-center">
              <TrendingUp className="mx-auto text-green-600 mb-2" size={24} />
              <div className="text-sm text-gray-600">Fabbisogno Totale</div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">
                {Math.round(nutritionData.macrosTarget.carboidrati)}g
              </div>
              <div className="text-xs text-gray-600">Carboidrati</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {Math.round(nutritionData.macrosTarget.proteine)}g
              </div>
              <div className="text-xs text-gray-600">Proteine</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-600">
                {Math.round(nutritionData.macrosTarget.grassi)}g
              </div>
              <div className="text-xs text-gray-600">Grassi</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pasti giornalieri */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <UtensilsCrossed className="text-orange-600" />
          Piano Alimentare Giornaliero
        </h2>
        
        {Object.entries(menuData).map(([mealName, mealData]: [string, any]) => (
          <Card key={mealName} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  🍽️ {mealName}
                </span>
                <Badge variant="outline">
                  {Math.round(mealData.kcal_tot)} kcal
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Ricetta principale */}
              {mealData.ricetta && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">
                    🍳 Ricetta: {mealData.ricetta}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {Object.entries(mealData.ingredienti_ricetta).map(([ingredient, quantity]: [string, any]) => (
                      <div key={ingredient} className="flex justify-between">
                        <span>{ingredient}</span>
                        <span className="font-medium">{quantity}g</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredienti extra */}
              {mealData.ingredienti_extra?.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">🥕 Ingredienti aggiuntivi:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {mealData.ingredienti_extra.map(([ingredient, quantity]: [string, number], index: number) => (
                      <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>{ingredient}</span>
                        <span className="font-medium">{quantity}g</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Macronutrienti del pasto */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Macronutrienti</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-red-600 font-bold">
                      {Math.round(mealData.macro_tot.carboidrati)}g
                    </div>
                    <div className="text-xs">Carboidrati</div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-bold">
                      {Math.round(mealData.macro_tot.proteine)}g
                    </div>
                    <div className="text-xs">Proteine</div>
                  </div>
                  <div>
                    <div className="text-yellow-600 font-bold">
                      {Math.round(mealData.macro_tot.grassi)}g
                    </div>
                    <div className="text-xs">Grassi</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
