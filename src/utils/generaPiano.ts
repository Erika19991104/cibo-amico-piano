import recipes from "@/data/recipes";

interface UserProfile {
  sesso: string;
  eta: number;
  altezza: number;
  peso: number;
  attivita: string;
  obiettivo?: string;
}

interface Meal {
  categoria: string;
  ricette: Array<{ recipe: any; porzione: number }>;
}

export function generaPiano(profile: UserProfile): Meal[] {
  // Calcola fabbisogno calorico stimato (semplice BMR * attività)
  const fabbisogno = calcolaFabbisogno(profile);

  // Filtra le ricette per categoria (usiamo la proprietà 'category' o simile)
  const colazioni = recipes.filter(r => r.category.includes("Colazione"));
  const pranzi = recipes.filter(r => r.category.includes("Pranzo"));
  const cene = recipes.filter(r => r.category.includes("Cena"));
  const spuntini = recipes.filter(r => r.category.includes("Spuntino"));

  // Per ora scegliamo la prima ricetta di ogni categoria con porzione 1
  const piano: Meal[] = [
    { categoria: "Colazione", ricette: colazioni.length ? [{ recipe: colazioni[0], porzione: 1 }] : [] },
    { categoria: "Pranzo", ricette: pranzi.length ? [{ recipe: pranzi[0], porzione: 1 }] : [] },
    { categoria: "Cena", ricette: cene.length ? [{ recipe: cene[0], porzione: 1 }] : [] },
    { categoria: "Spuntino", ricette: spuntini.length ? [{ recipe: spuntini[0], porzione: 1 }] : [] },
  ];

  return piano;
}

function calcolaFabbisogno(profile: UserProfile): number {
  let bmr = 0;
  if (profile.sesso.toLowerCase() === "donna") {
    bmr = 655 + 9.6 * profile.peso + 1.8 * profile.altezza - 4.7 * profile.eta;
  } else {
    bmr = 66 + 13.7 * profile.peso + 5 * profile.altezza - 6.8 * profile.eta;
  }
  const activityFactor = {
    sedentario: 1.2,
    leggero: 1.375,
    moderato: 1.55,
    intenso: 1.725,
    "molto intenso": 1.9,
  }[profile.attivita.toLowerCase()] || 1.2;
  return Math.round(bmr * activityFactor);
}
