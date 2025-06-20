import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/ProfileForm";
import { FoodSearch } from "@/components/FoodSearch";
import WeeklyPlanView from "@/components/WeeklyPlanView";
import { User, Calculator, Search, UtensilsCrossed, Calendar } from "lucide-react";
import { calcolaTargetNutrizionale, generaPianoTreSettimane, WeeklyPlan } from "@/utils/mealPlanGenerator";

interface UserProfile {
  sesso: "M" | "F";
  peso: number;
  altezza: number;
  eta: number;
  attivita: string;
  obiettivo: string;
  dieta: string[];
}

const Index = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [pianoSettimanale, setPianoSettimanale] = useState<WeeklyPlan[] | null>(null);
  const [targetNutrizionale, setTargetNutrizionale] = useState<any>(null);

  const handleGenerateWeeklyPlan = () => {
    if (!userProfile) {
      console.log("Nessun profilo utente presente");
      return;
    }

    console.log("Generazione piano nutrizionale per:", userProfile);

    // Calcola il target nutrizionale secondo le linee guida CREA
    const target = calcolaTargetNutrizionale(
      userProfile.sesso,
      userProfile.eta,
      userProfile.peso,
      userProfile.altezza,
      userProfile.attivita,
      userProfile.obiettivo
    );

    console.log("Target nutrizionale calcolato:", target);
    setTargetNutrizionale(target);

    // Genera il piano di 3 settimane
    const piano = generaPianoTreSettimane(target);
    console.log("Piano di 3 settimane generato:", piano);
    setPianoSettimanale(piano);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            🥗 Bilanciamo
            <UtensilsCrossed className="text-green-600" />
          </h1>
          <p className="text-xl text-gray-600">Piano Nutrizionale Personalizzato - 3 Settimane</p>
          <p className="text-sm text-gray-500 mt-2">Basato sulle Linee Guida CREA per una sana alimentazione</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
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
              Calcola Fabbisogno
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Calendar size={16} />
              Genera Piano
            </TabsTrigger>
            <TabsTrigger value="plan" className="flex items-center gap-2">
              <UtensilsCrossed size={16} />
              Piano 3 Settimane
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="text-blue-600" />
                  Profilo Utente e Obiettivi Nutrizionali
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
                  Calcolo Fabbisogno Nutrizionale
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userProfile ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Profilo Attuale:</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><span className="font-medium">Sesso:</span> {userProfile.sesso === "M" ? "Uomo" : "Donna"}</p>
                        <p><span className="font-medium">Età:</span> {userProfile.eta} anni</p>
                        <p><span className="font-medium">Altezza:</span> {userProfile.altezza} cm</p>
                        <p><span className="font-medium">Peso:</span> {userProfile.peso} kg</p>
                        <p><span className="font-medium">Attività:</span> {userProfile.attivita}</p>
                        <p><span className="font-medium">Obiettivo:</span> {userProfile.obiettivo}</p>
                      </div>
                      {userProfile.dieta.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium text-sm">Preferenze alimentari:</p>
                          <p className="text-sm text-gray-600">{userProfile.dieta.join(", ")}</p>
                        </div>
                      )}
                    </div>
                    
                    {targetNutrizionale && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Fabbisogno Nutrizionale Calcolato:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Calorie/giorno</p>
                            <p className="text-xl font-bold text-blue-600">{targetNutrizionale.kcal_giornaliere}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Carboidrati</p>
                            <p className="text-xl font-bold text-green-600">{targetNutrizionale.carboidrati_g}g</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Proteine</p>
                            <p className="text-xl font-bold text-orange-600">{targetNutrizionale.proteine_g}g</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Grassi</p>
                            <p className="text-xl font-bold text-yellow-600">{targetNutrizionale.grassi_g}g</p>
                          </div>
                        </div>
                      </div>
                    )}
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

          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="text-indigo-600" />
                  Genera Piano Nutrizionale 3 Settimane
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userProfile ? (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Caratteristiche del Piano:</h3>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• 21 giorni di piani alimentari personalizzati</li>
                        <li>• Distribuzione calorica secondo linee guida CREA</li>
                        <li>• Varietà giornaliera e stagionalità degli alimenti</li>
                        <li>• Bilanciamento nutrizionale ottimale</li>
                        <li>• Ricette modulari e combinazioni sensate</li>
                      </ul>
                    </div>
                    
                    <Button 
                      onClick={handleGenerateWeeklyPlan} 
                      className="w-full" 
                      size="lg"
                      disabled={!userProfile}
                    >
                      <Calendar className="mr-2" size={16} />
                      Genera Piano di 3 Settimane
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
                  Il Tuo Piano Nutrizionale - 3 Settimane
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pianoSettimanale && targetNutrizionale ? (
                  <WeeklyPlanView 
                    piano={pianoSettimanale} 
                    targetNutrizionale={targetNutrizionale}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Genera prima il tuo piano nutrizionale nella sezione "Genera Piano"</p>
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
