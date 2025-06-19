import recipes from "@/data/recipes";

interface UserProfile {
  sesso: string;
  eta: number;
  altezza: number;
  peso: number;
  attivita: string;
  obiettivo: string;
}

interface Meal {
  categoria: string;
  ricette: Array<{ recipe: any; porzione: number }>;
}

export function generaPiano(profile: UserProfile): Meal[] {
  // Calcola fabbisogno calorico stimato in base al profilo (usando formule o valori fissi)
  const fabbisogno = calcolaFabbisogno(profile);

  // Filtra o suddividi le ricette per categoria (colazione, pranzo, cena, spuntino)
  const colazioni = recipes.filter(r => r.category.includes("Colazione"));
  const pranzi = recipes.filter(r => r.category.includes("Pranzo"));
  const cene = recipes.filter(r => r.category.includes("Cena"));
  const spuntini = recipes.filter(r => r.category.includes("Spuntino"));

  // Per esempio: scegli una ricetta per ogni pasto
  const piano: Meal[] = [
    { categoria: "Colazione", ricette: [{ recipe: colazioni[0], porzione: 1 }] },
    { categoria: "Pranzo", ricette: [{ recipe: pranzi[0], porzione: 1 }] },
    { categoria: "Cena", ricette: [{ recipe: cene[0], porzione: 1 }] },
    { categoria: "Spuntino", ricette: [{ recipe: spuntini[0], porzione: 1 }] },
  ];

  // TODO: bilanciare le porzioni per avvicinarsi al fabbisogno calorico e macronutrienti

  return piano;
}

function calcolaFabbisogno(profile: UserProfile): number {
  // Semplice formula BMR * fattore attività (da migliorare)
  let bmr = 0;
  if (profile.sesso === "Donna") {
    bmr = 655 + 9.6 * profile.peso + 1.8 * profile.altezza - 4.7 * profile.eta;
  } else {
    bmr = 66 + 13.7 * profile.peso + 5 * profile.altezza - 6.8 * profile.eta;
  }
  const activityFactor = {
    Sedentario: 1.2,
    Leggero: 1.375,
    Moderato: 1.55,
    Intenso: 1.725,
    "Molto intenso": 1.9,
  }[profile.attivita] || 1.2;
  return Math.round(bmr * activityFactor);
}
