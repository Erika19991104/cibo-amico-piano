export interface FoodItem {
    nome_alimento: string;
    Carboidrati: number; // in grammi
    Proteine: number;    // in grammi
    Lipidi: number;      // in grammi
    Energia: number;     // in kcal
  }
  
  interface Macros {
    carboidrati: number;
    proteine: number;
    grassi: number;
  }
  
  /**
   * Calcola un punteggio per ogni alimento in base a quanto aiuta a colmare il gap macros.
   * @param food Alimento con macros
   * @param gaps Gap macros da colmare
   * @returns punteggio numerico
   */
  export function scoreFoodItem(food: FoodItem, gaps: Macros): number {
    // Pesi per valorizzare l'importanza di ogni macro (es: proteine più importanti)
    const weightCarbo = 1;
    const weightProteine = 1.5;
    const weightGrassi = 1;
  
    // Calcola la quantità di macro che l'alimento può contribuire senza eccedere il gap
    const contributionCarbo = Math.min(food.Carboidrati, gaps.carboidrati);
    const contributionProteine = Math.min(food.Proteine, gaps.proteine);
    const contributionGrassi = Math.min(food.Lipidi, gaps.grassi);
  
    // Punteggio finale sommando contributi ponderati
    const score =
      contributionCarbo * weightCarbo +
      contributionProteine * weightProteine +
      contributionGrassi * weightGrassi;
  
    return score;
  }
  
  /**
   * Genera un piano alimentare bilanciato per soddisfare il target macros.
   * @param targetMacros Obiettivo macros (carboidrati, proteine, grassi) in grammi
   * @param foodDatabase Array di alimenti disponibili
   * @param maxIter Numero massimo di iterazioni per cercare gli alimenti
   * @returns Array di alimenti selezionati per il piano
   */
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
  
      // Se gap trascurabili, esci dal ciclo
      if (gaps.carboidrati < 5 && gaps.proteine < 5 && gaps.grassi < 5) {
        break;
      }
  
      // Calcola il punteggio di ogni alimento rispetto ai gap
      const scoredFoods = foodDatabase.map(food => ({
        food,
        score: scoreFoodItem(food, gaps),
      }));
  
      // Seleziona l'alimento con punteggio massimo
      const bestFood = scoredFoods.reduce((max, item) =>
        item.score > max.score ? item : max
      , scoredFoods[0]);
  
      if (bestFood.score === 0) {
        // Nessun alimento utile trovato, termina
        break;
      }
  
      // Aggiungi alimento al piano
      piano.push(bestFood.food);
  
      // Aggiorna macro attuali sommando i valori dell'alimento
      macroAttuali.carboidrati += bestFood.food.Carboidrati;
      macroAttuali.proteine += bestFood.food.Proteine;
      macroAttuali.grassi += bestFood.food.Lipidi;
    }
  
    return piano;
  }
  