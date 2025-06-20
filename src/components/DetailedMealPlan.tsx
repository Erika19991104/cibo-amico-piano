
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { WeeklyPlan } from "@/utils/mealPlanGenerator";

interface DetailedMealPlanProps {
  piano: WeeklyPlan[];
  targetNutrizionale: {
    kcal_giornaliere: number;
    proteine_g: number;
    carboidrati_g: number;
    grassi_g: number;
  };
}

const GIORNI_SETTIMANA = ["LUNEDÌ", "MARTEDÌ", "MERCOLEDÌ", "GIOVEDÌ", "VENERDÌ", "SABATO", "DOMENICA"];

const PASTI_ORDINE = [
  { key: "colazione", nome: "COLAZIONE" },
  { key: "spuntino_mattina", nome: "BREAK MATTUTINO" },
  { key: "pranzo", nome: "PRANZO" },
  { key: "spuntino_pomeriggio", nome: "BREAK POMERIDIANO" },
  { key: "cena", nome: "CENA" }
];

export const DetailedMealPlan = ({ piano, targetNutrizionale }: DetailedMealPlanProps) => {
  if (!piano || piano.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Nessun piano nutrizionale disponibile</p>
      </div>
    );
  }

  const renderIngrediente = (nome: string, quantita: number, unita: string = "g") => {
    // Calcolo valori nutrizionali stimati (da migliorare con database reale)
    const kcalPer100g = getKcalPer100g(nome);
    const proteinePer100g = getProteinePer100g(nome);
    
    const kcalTotali = (kcalPer100g * quantita) / 100;
    const proteineTotali = (proteinePer100g * quantita) / 100;

    return {
      nome,
      quantita,
      unita,
      kcal: Math.round(kcalTotali * 10) / 10,
      proteine: Math.round(proteineTotali * 10) / 10
    };
  };

  const renderPasto = (pasto: any, nomePasto: string) => {
    const ingredienti: any[] = [];

    // Aggiungi ingredienti dalla ricetta
    if (pasto.ingredienti_ricetta && Object.keys(pasto.ingredienti_ricetta).length > 0) {
      Object.entries(pasto.ingredienti_ricetta).forEach(([nome, quantitaStr]) => {
        const quantita = parseInt(quantitaStr as string) || 100;
        ingredienti.push(renderIngrediente(nome, quantita));
      });
    }

    // Aggiungi ingredienti extra
    if (pasto.ingredienti_extra && pasto.ingredienti_extra.length > 0) {
      pasto.ingredienti_extra.forEach(([nome, quantita]: [string, number]) => {
        ingredienti.push(renderIngrediente(nome, quantita));
      });
    }

    // Se non ci sono ingredienti, aggiungi un pasto base
    if (ingredienti.length === 0) {
      const pastiBase = getPastoBase(nomePasto);
      ingredienti.push(...pastiBase);
    }

    return ingredienti;
  };

  return (
    <div className="space-y-8">
      {piano.map((settimana, weekIndex) => (
        <div key={weekIndex} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            SETTIMANA {settimana.settimana}
          </h2>
          
          {settimana.giorni.map((giorno, dayIndex) => (
            <Card key={dayIndex} className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-center bg-blue-50 p-3 rounded">
                  SETTIMANA {settimana.settimana} - {GIORNI_SETTIMANA[dayIndex]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {PASTI_ORDINE.map(({ key, nome }) => {
                    const pasto = giorno.pasti[key];
                    if (!pasto) return null;

                    const ingredienti = renderPasto(pasto, nome);
                    const totalePastoKcal = ingredienti.reduce((sum, ing) => sum + ing.kcal, 0);
                    const totalePastoProteine = ingredienti.reduce((sum, ing) => sum + ing.proteine, 0);

                    return (
                      <div key={key} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">{nome}</h3>
                          <div className="flex gap-2">
                            <Badge variant="outline">
                              {Math.round(totalePastoKcal)} kcal
                            </Badge>
                            <Badge variant="outline">
                              {Math.round(totalePastoProteine * 10) / 10}g proteine
                            </Badge>
                          </div>
                        </div>
                        
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Alimento</TableHead>
                              <TableHead className="text-center">pz</TableHead>
                              <TableHead className="text-center">g</TableHead>
                              <TableHead className="text-center">kcal</TableHead>
                              <TableHead className="text-center">Proteine/g</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ingredienti.map((ingrediente, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{ingrediente.nome}</TableCell>
                                <TableCell className="text-center">
                                  {isPezzo(ingrediente.nome) ? "1" : "-"}
                                </TableCell>
                                <TableCell className="text-center">
                                  {isPezzo(ingrediente.nome) ? "-" : ingrediente.quantita}
                                </TableCell>
                                <TableCell className="text-center">{ingrediente.kcal}</TableCell>
                                <TableCell className="text-center">{ingrediente.proteine}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    );
                  })}
                  
                  {/* Riepilogo giornaliero */}
                  <div className="bg-blue-50 p-4 rounded-lg mt-6">
                    <h4 className="font-semibold mb-2">Riepilogo Giornaliero</h4>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-gray-600">Calorie Totali</p>
                        <p className="font-bold text-lg">{giorno.totaleGiornaliero.kcal} kcal</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Carboidrati</p>
                        <p className="font-bold text-lg">{giorno.totaleGiornaliero.macro.carboidrati}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Proteine</p>
                        <p className="font-bold text-lg">{giorno.totaleGiornaliero.macro.proteine}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Grassi</p>
                        <p className="font-bold text-lg">{giorno.totaleGiornaliero.macro.grassi}g</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
};

// Funzioni helper per valori nutrizionali stimati
function getKcalPer100g(alimento: string): number {
  const valori: { [key: string]: number } = {
    "Latte parzialmente scremato": 46,
    "Caffè": 0,
    "Fette biscottate": 394,
    "Marmellata": 227,
    "Mela": 44,
    "Pasta": 131,
    "Pomodoro": 18,
    "Olio extravergine di oliva": 884,
    "Pane": 265,
    "Riso": 130,
    "Pollo": 165,
    "Pesce": 80,
    "Verdure": 25,
    "Frutta": 50
  };
  
  return valori[alimento] || 50;
}

function getProteinePer100g(alimento: string): number {
  const valori: { [key: string]: number } = {
    "Latte parzialmente scremato": 3.5,
    "Caffè": 0,
    "Fette biscottate": 11.3,
    "Marmellata": 0.4,
    "Mela": 0.2,
    "Pasta": 5,
    "Pomodoro": 0.9,
    "Olio extravergine di oliva": 0,
    "Pane": 8.1,
    "Riso": 2.8,
    "Pollo": 31,
    "Pesce": 18,
    "Verdure": 2,
    "Frutta": 0.5
  };
  
  return valori[alimento] || 2;
}

function isPezzo(alimento: string): boolean {
  const alimentiAPezzo = ["Caffè", "Mela", "Banana", "Arancia", "Uovo"];
  return alimentiAPezzo.some(item => alimento.toLowerCase().includes(item.toLowerCase()));
}

function getPastoBase(nomePasto: string) {
  switch (nomePasto) {
    case "COLAZIONE":
      return [
        { nome: "Latte parzialmente scremato", quantita: 125, unita: "g", kcal: 57.5, proteine: 4.375 },
        { nome: "Caffè", quantita: 1, unita: "pz", kcal: 0, proteine: 0 },
        { nome: "Fette biscottate", quantita: 24, unita: "g", kcal: 94.6, proteine: 3.4 },
        { nome: "Marmellata", quantita: 20, unita: "g", kcal: 45.4, proteine: 0.1 }
      ];
    case "BREAK MATTUTINO":
      return [
        { nome: "Mela", quantita: 150, unita: "g", kcal: 66.0, proteine: 0.3 }
      ];
    case "PRANZO":
      return [
        { nome: "Pasta", quantita: 80, unita: "g", kcal: 104.8, proteine: 4.0 },
        { nome: "Pomodoro", quantita: 100, unita: "g", kcal: 18, proteine: 0.9 },
        { nome: "Olio extravergine di oliva", quantita: 10, unita: "g", kcal: 88.4, proteine: 0 }
      ];
    case "BREAK POMERIDIANO":
      return [
        { nome: "Frutta di stagione", quantita: 150, unita: "g", kcal: 75, proteine: 0.7 }
      ];
    case "CENA":
      return [
        { nome: "Pollo", quantita: 100, unita: "g", kcal: 165, proteine: 31 },
        { nome: "Verdure", quantita: 200, unita: "g", kcal: 50, proteine: 4 },
        { nome: "Pane", quantita: 50, unita: "g", kcal: 132.5, proteine: 4.05 }
      ];
    default:
      return [];
  }
}
