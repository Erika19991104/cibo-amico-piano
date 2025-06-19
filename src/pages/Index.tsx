import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/ProfileForm";
import { FoodSearch } from "@/components/FoodSearch";
import { MealPlan } from "@/components/MealPlan";
import { User, Calculator, Search, UtensilsCrossed } from "lucide-react";
import { generaPiano } from "@/utils/generaPiano";

import { generateMealPlan } from "@/utils/recipeHelpers";

const Index = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);

  // Funzione per calcolare fabbisogno calorico da userProfile (da adattare)
  function calculateCalorieNeeds(profile) {
    // Esempio semplice: userProfile deve avere calorieNeeds o calcolalo qui
    return profile?.calorieNeeds || 2000;
  }

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
                    <Button
                      onClick={() => {
                        const calorieNeeds = calculateCalorieNeeds(userProfile);
                        const plan = generateMealPlan(calorieNeeds);
                        setMealPlan(plan);
                      }}
                      className="w-full"
                      size="lg"
                    >
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
