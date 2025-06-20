export interface FoodItem {
  indice?: number; // opzionale, può servire come ID
  categoria: string;
  descrizione?: string;
  allergeni?: string;
  peso_porzione?: number;
  unita_misura?: string;

  Energia?: number;
  Proteine?: number;
  Lipidi_totali?: number;
  Grassi_saturi?: number;
  Grassi_monoinsaturi?: number;
  Grassi_polinsaturi?: number;
  Acidi_grassi_trans?: number;
  Carboidrati_totali?: number;
  Zuccheri_semplici?: number;
  Amido?: number;
  Fibre?: number;
  Acqua?: number;

  Vitamina_A?: number;
  Vitamina_C?: number;
  Vitamina_D?: number;
  Vitamina_E?: number;
  Vitamina_B1?: number;
  Vitamina_B2?: number;
  Vitamina_B3?: number;
  Vitamina_B6?: number;
  Vitamina_B9?: number;
  Vitamina_B12?: number;
  Vitamina_K?: number;

  Calcio?: number;
  Ferro?: number;
  Magnesio?: number;
  Potassio?: number;
  Sodio?: number;
  Zinco?: number;
  Colesterolo?: number;
  Alcool?: number;
}

export interface Macros {
  carboidrati: number;
  proteine: number;
  grassi: number;
}

export type Sesso = "M" | "F";

export function calculateBMR(sesso: Sesso, peso: number, altezza: number, eta: number): number {
  if (sesso === "M") {
    return 88.362 + 13.397 * peso + 4.799 * altezza - 5.677 * eta;
  } else {
    return 447.593 + 9.247 * peso + 3.098 * altezza - 4.330 * eta;
  }
}

export function calculateTDEE(bmr: number, livelloAttivita: string): number {
  const fattori: Record<string, number> = {
    sedentario: 1.2,
    leggero: 1.375,
    moderato: 1.55,
    intenso: 1.725,
    molto_intenso: 1.9,
  };

  const fattore = fattori[livelloAttivita.toLowerCase()] ?? 1.2;

  return bmr * fattore;
}

export function calculateMacrosTarget(tdee: number): Macros {
  return {
    carboidrati: (tdee * 0.5) / 4,
    proteine: (tdee * 0.2) / 4,
    grassi: (tdee * 0.3) / 9,
  };
}

export function scoreFoodItem(food: FoodItem, gaps: Macros): number {
  const weightCarbo = 1;
  const weightProteine = 1.5;
  const weightGrassi = 1;

  // Usa i valori, o 0 se undefined
  const carbo = food.Carboidrati_totali ?? 0;
  const proteine = food.Proteine ?? 0;
  const lipidi = food.Lipidi_totali ?? 0;

  const score =
    Math.min(carbo, gaps.carboidrati) * weightCarbo +
    Math.min(proteine, gaps.proteine) * weightProteine +
    Math.min(lipidi, gaps.grassi) * weightGrassi;

  return score;
}

export function generaPianoAvanzato(
  targetMacros: Macros,
  foodDatabase: FoodItem[],
  maxIter: number = 50
): FoodItem[] {
  let piano: FoodItem[] = [];
  let macroAttuali: Macros = { carboidrati: 0, proteine: 0, grassi: 0 };

  for (let i = 0; i < maxIter; i++) {
    const gaps: Macros = {
      carboidrati: Math.max(0, targetMacros.carboidrati - macroAttuali.carboidrati),
      proteine: Math.max(0, targetMacros.proteine - macroAttuali.proteine),
      grassi: Math.max(0, targetMacros.grassi - macroAttuali.grassi),
    };

    // Se siamo molto vicini (meno di 5g per macro), fermati
    if (gaps.carboidrati < 5 && gaps.proteine < 5 && gaps.grassi < 5) break;

    const scoredFoods = foodDatabase.map(food => ({
      food,
      score: scoreFoodItem(food, gaps),
    }));

    // Se non ci sono alimenti validi (tutti score 0), esci
    const bestFood = scoredFoods.reduce((max, item) => (item.score > max.score ? item : max), scoredFoods[0]);

    if (bestFood.score === 0) break;

    piano.push(bestFood.food);

    macroAttuali.carboidrati += bestFood.food.Carboidrati_totali ?? 0;
    macroAttuali.proteine += bestFood.food.Proteine ?? 0;
    macroAttuali.grassi += bestFood.food.Lipidi_totali ?? 0;
  }

  return piano;
}
