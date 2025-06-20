
import { FoodItem, Recipe, DailyMenu, MacroNutrients } from "@/types/nutrition";
import { recipes } from "@/data/recipes";
import { foodDatabase } from "@/data/foodDatabase";

export interface WeeklyPlan {
  settimana: number;
  giorni: DayPlan[];
}

export interface DayPlan {
  giorno: number;
  data: string;
  pasti: DailyMenu;
  totaleGiornaliero: {
    kcal: number;
    macro: MacroNutrients;
  };
}

export interface NutritionalTarget {
  kcal_giornaliere: number;
  proteine_g: number;
  carboidrati_g: number;
  grassi_g: number;
  distribuzione_pasti: {
    colazione: number;
    spuntino_mattina: number;
    pranzo: number;
    spuntino_pomeriggio: number;
    cena: number;
  };
}

// Distribuzione calorica raccomandata dalle linee guida CREA
const DISTRIBUZIONE_CALORICA_STANDARD = {
  colazione: 0.20,      // 20%
  spuntino_mattina: 0.05, // 5%
  pranzo: 0.40,         // 40%
  spuntino_pomeriggio: 0.05, // 5%
  cena: 0.30            // 30%
};

// Categorie di alimenti per stagionalità
const ALIMENTI_STAGIONALI = {
  primavera: ["Spinaci", "Carote", "Broccoli", "Pomodori maturi"],
  estate: ["Pomodori maturi", "Broccoli", "Spinaci"],
  autunno: ["Carote", "Spinaci", "Broccoli"],
  inverno: ["Carote", "Spinaci", "Broccoli"]
};

// Varietà settimanale - evita ripetizioni eccessive
const FREQUENZA_MAX_SETTIMANALE = {
  "Pasta al pomodoro": 2,
  "Risotto ai funghi": 1,
  "Pollo arrosto con verdure": 2,
  "Salmone grigliato": 2,
  "Insalata proteica": 2,
  "Omelette alle verdure": 1,
  "Quinoa con verdure": 1
};

export function calcolaTargetNutrizionale(
  sesso: "M" | "F",
  eta: number,
  peso: number,
  altezza: number,
  attivita: string,
  obiettivo: string = "mantenimento"
): NutritionalTarget {
  // Calcolo BMR (Metabolismo Basale) - Equazioni di Harris-Benedict riviste
  let bmr: number;
  if (sesso === "M") {
    bmr = 88.362 + (13.397 * peso) + (4.799 * altezza) - (5.677 * eta);
  } else {
    bmr = 447.593 + (9.247 * peso) + (3.098 * altezza) - (4.330 * eta);
  }

  // Fattori di attività fisica secondo linee guida CREA
  const fattoriAttivita = {
    "Sedentario": 1.2,
    "Leggero": 1.375,
    "Moderato": 1.55,
    "Intenso": 1.725,
    "Molto intenso": 1.9
  };

  const fattore = fattoriAttivita[attivita as keyof typeof fattoriAttivita] || 1.2;
  let tdee = bmr * fattore;

  // Adattamento per obiettivo
  switch (obiettivo.toLowerCase()) {
    case "dimagrimento":
      tdee *= 0.85; // Deficit del 15%
      break;
    case "aumento massa":
      tdee *= 1.15; // Surplus del 15%
      break;
    default: // mantenimento
      break;
  }

  // Distribuzione macronutrienti secondo linee guida italiane
  const proteine_g = peso * (sesso === "M" ? 1.2 : 1.0); // 1.0-1.2g per kg
  const grassi_g = (tdee * 0.25) / 9; // 25% delle calorie
  const carboidrati_g = (tdee - (proteine_g * 4) - (grassi_g * 9)) / 4; // Resto in carboidrati

  return {
    kcal_giornaliere: Math.round(tdee),
    proteine_g: Math.round(proteine_g),
    carboidrati_g: Math.round(carboidrati_g),
    grassi_g: Math.round(grassi_g),
    distribuzione_pasti: DISTRIBUZIONE_CALORICA_STANDARD
  };
}

export function generaPianoTreSettimane(target: NutritionalTarget): WeeklyPlan[] {
  const piano: WeeklyPlan[] = [];
  const dataInizio = new Date();

  for (let settimana = 1; settimana <= 3; settimana++) {
    const giorni: DayPlan[] = [];

    for (let giorno = 1; giorno <= 7; giorno++) {
      const dataCorrente = new Date(dataInizio);
      dataCorrente.setDate(dataInizio.getDate() + ((settimana - 1) * 7) + (giorno - 1));
      
      const pianGiornaliero = generaPianoGiornaliero(
        target,
        settimana,
        giorno,
        dataCorrente
      );

      giorni.push(pianGiornaliero);
    }

    piano.push({
      settimana,
      giorni
    });
  }

  return piano;
}

function generaPianoGiornaliero(
  target: NutritionalTarget,
  settimana: number,
  giorno: number,
  data: Date
): DayPlan {
  const pasti: DailyMenu = {};
  const stagione = getStagione(data);
  
  // Genera ogni pasto secondo la distribuzione calorica
  Object.entries(target.distribuzione_pasti).forEach(([nomePasto, percentuale]) => {
    const kcalPasto = target.kcal_giornaliere * percentuale;
    const macroTargetPasto = {
      carboidrati: target.carboidrati_g * percentuale,
      proteine: target.proteine_g * percentuale,
      grassi: target.grassi_g * percentuale
    };

    pasti[nomePasto] = generaPasto(
      nomePasto,
      kcalPasto,
      macroTargetPasto,
      stagione,
      settimana,
      giorno
    );
  });

  // Calcola totali giornalieri
  const totaleGiornaliero = calcolaTotaliGiornalieri(pasti);

  return {
    giorno,
    data: data.toISOString().split('T')[0],
    pasti,
    totaleGiornaliero
  };
}

function generaPasto(
  tipoPasto: string,
  kcalTarget: number,
  macroTarget: MacroNutrients,
  stagione: string,
  settimana: number,
  giorno: number
): any {
  // Logica semplificata per generare un pasto bilanciato
  const ricetteDisponibili = Object.entries(recipes).filter(([nome, ricetta]) => {
    return ricetta.mealTime.toLowerCase() === tipoPasto.toLowerCase() ||
           (tipoPasto === "colazione" && ricetta.mealTime === "Colazione") ||
           (tipoPasto === "pranzo" && ricetta.mealTime === "Pranzo") ||
           (tipoPasto === "cena" && ricetta.mealTime === "Cena") ||
           (tipoPasto.includes("spuntino") && ricetta.mealTime === "Spuntino");
  });

  // Se non ci sono ricette specifiche, usa alimenti base
  if (ricetteDisponibili.length === 0) {
    return generaPastoConAlimenti(kcalTarget, macroTarget, stagione);
  }

  // Seleziona ricetta con variazione settimanale
  const indiceRicetta = (settimana + giorno) % ricetteDisponibili.length;
  const [nomeRicetta, ricetta] = ricetteDisponibili[indiceRicetta];

  return {
    ricetta: nomeRicetta,
    ingredienti_ricetta: ricetta.ingredienti,
    ingredienti_extra: [],
    kcal_tot: kcalTarget,
    macro_tot: macroTarget
  };
}

function generaPastoConAlimenti(
  kcalTarget: number,
  macroTarget: MacroNutrients,
  stagione: string
): any {
  // Selezione alimenti stagionali
  const alimentiStagionali = ALIMENTI_STAGIONALI[stagione as keyof typeof ALIMENTI_STAGIONALI] || 
                            ALIMENTI_STAGIONALI.primavera;
  
  const alimentiDisponibili = Object.entries(foodDatabase).filter(([nome]) => 
    alimentiStagionali.includes(nome)
  );

  // Selezione casuale per varietà
  const alimentiSelezionati = alimentiDisponibili.slice(0, 3);

  return {
    ricetta: null,
    ingredienti_ricetta: {},
    ingredienti_extra: alimentiSelezionati.map(([nome]) => [nome, 100]), // 100g standard
    kcal_tot: kcalTarget,
    macro_tot: macroTarget
  };
}

function getStagione(data: Date): string {
  const mese = data.getMonth() + 1; // getMonth() restituisce 0-11
  if (mese >= 3 && mese <= 5) return "primavera";
  if (mese >= 6 && mese <= 8) return "estate";
  if (mese >= 9 && mese <= 11) return "autunno";
  return "inverno";
}

function calcolaTotaliGiornalieri(pasti: DailyMenu): { kcal: number; macro: MacroNutrients } {
  let kcalTotali = 0;
  let carboidratiTotali = 0;
  let proteineTotali = 0;
  let grassiTotali = 0;

  Object.values(pasti).forEach(pasto => {
    kcalTotali += pasto.kcal_tot || 0;
    carboidratiTotali += pasto.macro_tot?.carboidrati || 0;
    proteineTotali += pasto.macro_tot?.proteine || 0;
    grassiTotali += pasto.macro_tot?.grassi || 0;
  });

  return {
    kcal: Math.round(kcalTotali),
    macro: {
      carboidrati: Math.round(carboidratiTotali),
      proteine: Math.round(proteineTotali),
      grassi: Math.round(grassiTotali)
    }
  };
}
