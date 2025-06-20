
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CREAMealPlan } from "@/utils/creaMealPlanGenerator";

interface CREAMealPlanTableProps {
  piano: CREAMealPlan[];
  targetNutrizionale: {
    kcal_giornaliere: number;
    proteine_g: number;
    carboidrati_g: number;
    grassi_g: number;
  };
}

export const CREAMealPlanTable = ({ piano, targetNutrizionale }: CREAMealPlanTableProps) => {
  if (!piano || piano.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Nessun piano nutrizionale CREA disponibile</p>
      </div>
    );
  }

  const calcolaScostamento = (valore: number, target: number): string => {
    const percentuale = Math.abs(((valore - target) / target) * 100);
    if (percentuale <= 5) return "text-green-600";
    if (percentuale <= 15) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-8">
      {/* Header con target nutrizionale */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-blue-600">
            🥗 Piano Nutrizionale CREA - Target Giornaliero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Calorie</p>
              <p className="text-xl font-bold">{targetNutrizionale.kcal_giornaliere} kcal</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Proteine</p>
              <p className="text-xl font-bold">{targetNutrizionale.proteine_g}g</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Carboidrati</p>
              <p className="text-xl font-bold">{targetNutrizionale.carboidrati_g}g</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Grassi</p>
              <p className="text-xl font-bold">{targetNutrizionale.grassi_g}g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Piano settimanale */}
      {piano.map((settimana, weekIndex) => (
        <div key={weekIndex} className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-blue-600 bg-blue-50 p-4 rounded-lg">
            SETTIMANA {settimana.settimana}
          </h2>
          
          {settimana.giorni.map((giorno, dayIndex) => (
            <Card key={dayIndex} className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-center bg-green-50 p-3 rounded font-bold">
                  {giorno.giorno}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Tabella per ogni pasto */}
                  {Object.entries(giorno.pasti).map(([nomePasto, pasto]) => {
                    if (pasto.alimenti.length === 0) return null;

                    return (
                      <div key={nomePasto} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-gray-800 uppercase bg-gray-100 px-3 py-1 rounded">
                            {nomePasto.replace('_', ' ')}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {pasto.totali.kcal} kcal
                            </span>
                          </div>
                        </div>
                        
                        <Table className="border">
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="font-bold">Alimento</TableHead>
                              <TableHead className="text-center font-bold">pz</TableHead>
                              <TableHead className="text-center font-bold">g</TableHead>
                              <TableHead className="text-center font-bold">Kcal</TableHead>
                              <TableHead className="text-center font-bold">Proteine/g</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pasto.alimenti.map((alimento, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{alimento.nome}</TableCell>
                                <TableCell className="text-center">
                                  {alimento.isPezzo ? alimento.quantita_unita : "-"}
                                </TableCell>
                                <TableCell className="text-center">
                                  {alimento.isPezzo ? "-" : alimento.quantita_g}
                                </TableCell>
                                <TableCell className="text-center font-medium">
                                  {alimento.kcal}
                                </TableCell>
                                <TableCell className="text-center font-medium">
                                  {alimento.proteine}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    );
                  })}
                  
                  {/* Riepilogo giornaliero */}
                  <div className="bg-blue-50 p-4 rounded-lg mt-6 border-2 border-blue-200">
                    <h4 className="font-bold text-lg mb-3 text-center">📊 RIEPILOGO GIORNALIERO</h4>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Calorie Totali</p>
                        <p className={`text-xl font-bold ${calcolaScostamento(giorno.totaliGiornalieri.kcal, targetNutrizionale.kcal_giornaliere)}`}>
                          {giorno.totaliGiornalieri.kcal} kcal
                        </p>
                        <p className="text-xs text-gray-500">
                          Target: {targetNutrizionale.kcal_giornaliere}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Proteine</p>
                        <p className={`text-xl font-bold ${calcolaScostamento(giorno.totaliGiornalieri.proteine, targetNutrizionale.proteine_g)}`}>
                          {giorno.totaliGiornalieri.proteine}g
                        </p>
                        <p className="text-xs text-gray-500">
                          Target: {targetNutrizionale.proteine_g}g
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Carboidrati</p>
                        <p className={`text-xl font-bold ${calcolaScostamento(giorno.totaliGiornalieri.carboidrati, targetNutrizionale.carboidrati_g)}`}>
                          {giorno.totaliGiornalieri.carboidrati}g
                        </p>
                        <p className="text-xs text-gray-500">
                          Target: {targetNutrizionale.carboidrati_g}g
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Grassi</p>
                        <p className={`text-xl font-bold ${calcolaScostamento(giorno.totaliGiornalieri.grassi, targetNutrizionale.grassi_g)}`}>
                          {giorno.totaliGiornalieri.grassi}g
                        </p>
                        <p className="text-xs text-gray-500">
                          Target: {targetNutrizionale.grassi_g}g
                        </p>
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
