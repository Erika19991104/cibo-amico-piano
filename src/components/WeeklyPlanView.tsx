
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { WeeklyPlan } from "@/utils/mealPlanGenerator";
import { Calendar, Utensils, BarChart3 } from "lucide-react";

interface WeeklyPlanViewProps {
  piano: WeeklyPlan[];
  targetNutrizionale: {
    kcal_giornaliere: number;
    proteine_g: number;
    carboidrati_g: number;
    grassi_g: number;
  };
}

export default function WeeklyPlanView({ piano, targetNutrizionale }: WeeklyPlanViewProps) {
  const [settimanaSelezionata, setSettimanaSelezionata] = useState(0);

  const giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

  const calcolaScostamento = (valore: number, target: number): string => {
    const percentuale = ((valore - target) / target) * 100;
    if (Math.abs(percentuale) <= 5) return "text-green-600";
    if (Math.abs(percentuale) <= 15) return "text-yellow-600";
    return "text-red-600";
  };

  if (!piano || piano.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Nessun piano nutrizionale disponibile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con target nutrizionale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="text-blue-600" />
            Target Nutrizionale Giornaliero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Calorie</p>
              <p className="text-lg font-bold">{targetNutrizionale.kcal_giornaliere} kcal</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Carboidrati</p>
              <p className="text-lg font-bold">{targetNutrizionale.carboidrati_g}g</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Proteine</p>
              <p className="text-lg font-bold">{targetNutrizionale.proteine_g}g</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Grassi</p>
              <p className="text-lg font-bold">{targetNutrizionale.grassi_g}g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selezione settimana */}
      <Tabs value={settimanaSelezionata.toString()} onValueChange={(value) => setSettimanaSelezionata(parseInt(value))}>
        <TabsList className="grid w-full grid-cols-3">
          {piano.map((settimana, index) => (
            <TabsTrigger key={index} value={index.toString()}>
              Settimana {settimana.settimana}
            </TabsTrigger>
          ))}
        </TabsList>

        {piano.map((settimana, weekIndex) => (
          <TabsContent key={weekIndex} value={weekIndex.toString()}>
            <div className="grid gap-4">
              {settimana.giorni.map((giorno, dayIndex) => (
                <Card key={dayIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Calendar size={20} />
                        {giorni[dayIndex]} - {new Date(giorno.data).toLocaleDateString('it-IT')}
                      </span>
                      <div className="flex gap-2 text-sm">
                        <Badge variant="outline" className={calcolaScostamento(giorno.totaleGiornaliero.kcal, targetNutrizionale.kcal_giornaliere)}>
                          {giorno.totaleGiornaliero.kcal} kcal
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {Object.entries(giorno.pasti).map(([nomePasto, pasto]) => (
                        <div key={nomePasto} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold flex items-center gap-2 capitalize">
                              <Utensils size={16} />
                              {nomePasto.replace('_', ' ')}
                            </h4>
                            <span className="text-sm text-gray-600">
                              {Math.round(pasto.kcal_tot)} kcal
                            </span>
                          </div>
                          
                          {pasto.ricetta ? (
                            <div>
                              <p className="font-medium text-blue-600 mb-1">{pasto.ricetta}</p>
                              <div className="text-sm text-gray-600">
                                <p>Ingredienti: {Object.keys(pasto.ingredienti_ricetta).join(', ')}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600">
                              <p>Alimenti: {pasto.ingredienti_extra.map(([nome]: [string, number]) => nome).join(', ')}</p>
                            </div>
                          )}
                          
                          {pasto.macro_tot && (
                            <div className="flex gap-3 mt-2 text-xs">
                              <span className="text-green-600">C: {Math.round(pasto.macro_tot.carboidrati)}g</span>
                              <span className="text-orange-600">P: {Math.round(pasto.macro_tot.proteine)}g</span>
                              <span className="text-yellow-600">G: {Math.round(pasto.macro_tot.grassi)}g</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Riepilogo giornaliero */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold mb-2">Riepilogo Giornaliero</h5>
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600">Calorie</p>
                          <p className={`font-bold ${calcolaScostamento(giorno.totaleGiornaliero.kcal, targetNutrizionale.kcal_giornaliere)}`}>
                            {giorno.totaleGiornaliero.kcal}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Carbo</p>
                          <p className={`font-bold ${calcolaScostamento(giorno.totaleGiornaliero.macro.carboidrati, targetNutrizionale.carboidrati_g)}`}>
                            {giorno.totaleGiornaliero.macro.carboidrati}g
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Prot</p>
                          <p className={`font-bold ${calcolaScostamento(giorno.totaleGiornaliero.macro.proteine, targetNutrizionale.proteine_g)}`}>
                            {giorno.totaleGiornaliero.macro.proteine}g
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Grassi</p>
                          <p className={`font-bold ${calcolaScostamento(giorno.totaleGiornaliero.macro.grassi, targetNutrizionale.grassi_g)}`}>
                            {giorno.totaleGiornaliero.macro.grassi}g
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
