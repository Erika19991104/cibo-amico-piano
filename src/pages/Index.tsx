import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/ProfileForm";
import { FoodSearch } from "@/components/FoodSearch";
import MealPlan from "@/components/MealPlan"; // import senza parentesi
import { User, Calculator, Search, UtensilsCrossed } from "lucide-react";

import { recipes } from "../data/recipes";

const Index = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);

  const handleGenerateMealPlan = () => {
    console.log("Funzione handleGenerateMealPlan chiamata");
    alert("Funzione handleGenerateMealPlan chiamata");

    if (!userProfile) {
      console.log("Nessun profilo utente presente");
      return;
    }

    const totalCalories = userProfile.calorieTarget || 2000;

    const mealDistribution: Record<string, number> = {
      Colazione: 0.25,
      Pranzo: 0.35,
      Cena: 0.3,
      Spuntino: 0.1,
    };

    // Se recipes è un oggetto, usa Object.values, altrimenti usa direttamente recipes
    const recipesArray = Array.isArray(recipes) ? recipes : Object.values(recipes);

    const mealPlan = Object.entries(mealDistribution).map(([meal, percent]) => {
      const targetCalories = totalCalories * percent;

      // Filtra ricette in base a mealTime o category
      const mealRecipes = recipesArray.filter((r) => {
        if (r.mealTime) {
          return r.mealTime.toLowerCase() === meal.toLowerCase();
        } else if (r.mealTime && Array.isArray(r.mealTime)) {
          return r.mealTime.some((cat) => cat.toLowerCase() === meal.toLowerCase());
        }
        return false;
      });

      console.log(`Ricette per ${meal}:`, mealRecipes);

      let accCalories = 0;
      const selectedRecipes = [];

      for (const recipe of mealRecipes) {
        if (accCalories >= targetCalories) break;

        const calories = recipe.calories || 0;
        // Calcolo porzione per non superare le calorie target
        const portion = Math.min(1, (targetCalories - accCalories) / (calories || 1));

        accCalories += portion * calories;

        selectedRecipes.push({ recipe, portion });
      }

      return { categoria: meal, ricette: selectedRecipes };
    });

    setMealPlan(mealPlan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            🥗 Bilanciamo
            <UtensilsCrossed className="text-green-600" />
          </h1>
          <p className="text-xl text-gray-600">Generatore Piano Alimentare Personalizzato</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              Profilo
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search size={16} />
              Ricerca Alimenti
            </TabsTrigger>
            <TabsTrigger value="calculate" className="flex items-center gap-2">
              <Calculator size={16} />
              Calcola Piano
            </TabsTrigger>
            <TabsTrigger value="plan" className="flex items-center gap-2">
              <UtensilsCrossed size={16} />
              Piano Alimentare
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="text-blue-600" />
                  Profilo Utente e Obiettivi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm onProfileSave={setUserProfile} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="text-green-600" />
                  Cerca Alimenti nel Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FoodSearch />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculate">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="text-purple-600" />
                  Genera Piano Alimentare
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userProfile ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Profilo Attuale:</h3>
                      <p>Sesso: {userProfile.sesso}, Età: {userProfile.eta} anni</p>
                      <p>Altezza: {userProfile.altezza} cm, Peso: {userProfile.peso} kg</p>
                      <p>Attività: {userProfile.attivita}</p>
                    </div>
                    <Button onClick={handleGenerateMealPlan} className="w-full" size="lg">
                      Genera Piano Alimentare Personalizzato
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <User size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Completa prima il tuo profilo nella sezione "Profilo"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plan">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="text-orange-600" />
                  Il Tuo Piano Alimentare
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mealPlan ? (
                  <MealPlan mealPlan={mealPlan} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calculator size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Genera prima il tuo piano alimentare nella sezione "Calcola Piano"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
