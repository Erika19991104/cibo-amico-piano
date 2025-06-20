import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/ProfileForm";
import { FoodSearch } from "@/components/FoodSearch";
import MealPlan from "@/components/MealPlan";
import { User, Calculator, Search, UtensilsCrossed } from "lucide-react";
import { generaPianoAvanzato, calculateBMR, calculateTDEE, calculateMacrosTarget } from "@/utils/nutritionUtils";
import { foodDatabase } from "@/data/foodDatabase";

const foodArray = Object.values(foodDatabase);

interface UserProfile {
  sesso: "M" | "F";
  peso: number;
  altezza: number;
  eta: number;
  attivita: string;
}

type RecipePortion = {
  recipe: {
    id: string;
    name: string;
    Energia: number;
    proteine: number;
    carboidrati: number;
    grassi: number;
    ingredienti?: object;
  };
  portion: number;
};

type Meal = {
  categoria: string;
  ricette: RecipePortion[];
};

const Index = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mealPlan, setMealPlan] = useState<Meal[] | null>(null);
  const [summary, setSummary] = useState<{
    bmr: number;
    tdee: number;
    targetMacros: { carboidrati: number; proteine: number; grassi: number };
  } | null>(null);

  const handleGenerateMealPlan = () => {
    if (!userProfile) {
      console.log("Nessun profilo utente presente");
      return;
    }

    const bmr = calculateBMR(userProfile.sesso, userProfile.peso, userProfile.altezza, userProfile.eta);
    const tdee = calculateTDEE(bmr, userProfile.attivita);
    const macros = calculateMacrosTarget(tdee);

    setSummary({ bmr: Math.round(bmr), tdee: Math.round(tdee), targetMacros: macros });

    const rawPlan = generaPianoAvanzato(macros, foodArray);

    const colazioneFoods = rawPlan.slice(0, 3);
    const pranzoFoods = rawPlan.slice(3, 6);
    const cenaFoods = rawPlan.slice(6, 9);

    function foodToRecipePortion(food: typeof rawPlan[0]): RecipePortion {
      return {
        recipe: {
          id: String(food.indice ?? "0"),
          name: food.descrizione ?? "Sconosciuto",
          Energia: food.Energia ?? 0,
          proteine: food.Proteine ?? 0,
          carboidrati: food.Carboidrati_totali ?? 0,
          grassi: food.Lipidi_totali ?? 0,
          ingredienti: {},
        },
        portion: 1,
      };
    }

    const mealPlanFormatted: Meal[] = [
      {
        categoria: "Colazione",
        ricette: colazioneFoods.map(foodToRecipePortion),
      },
      {
        categoria: "Pranzo",
        ricette: pranzoFoods.map(foodToRecipePortion),
      },
      {
        categoria: "Cena",
        ricette: cenaFoods.map(foodToRecipePortion),
      },
    ];

    setMealPlan(mealPlanFormatted);
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
                {mealPlan && summary ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Fabbisogno Giornaliero</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <p className="text-sm text-gray-500">BMR (kcal)</p>
                          <p className="text-lg font-medium">{summary.bmr}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <p className="text-sm text-gray-500">TDEE (kcal)</p>
                          <p className="text-lg font-medium">{summary.tdee}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <p className="text-sm text-gray-500">Carboidrati (g)</p>
                          <p className="text-lg font-medium">{Math.round(summary.targetMacros.carboidrati)}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <p className="text-sm text-gray-500">Proteine (g)</p>
                          <p className="text-lg font-medium">{Math.round(summary.targetMacros.proteine)}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <p className="text-sm text-gray-500">Grassi (g)</p>
                          <p className="text-lg font-medium">{Math.round(summary.targetMacros.grassi)}</p>
                        </div>
                      </div>
                    </div>
                    <MealPlan mealPlan={mealPlan} />
                  </div>
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
