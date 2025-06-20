
export interface CREAFood {
  categoria: string;
  nome: string;
  porzione_g: number;
  porzione_unita: string;
  kcal_per_porzione: number;
  proteine_per_porzione: number;
  carboidrati_per_porzione: number;
  grassi_per_porzione: number;
  note?: string;
}

export const CREA_PORTIONS: CREAFood[] = [
  // Cereali e derivati
  {
    categoria: "cereali",
    nome: "Pane",
    porzione_g: 50,
    porzione_unita: "g",
    kcal_per_porzione: 135,
    proteine_per_porzione: 4.5,
    carboidrati_per_porzione: 25,
    grassi_per_porzione: 1.5
  },
  {
    categoria: "cereali",
    nome: "Pasta (cruda)",
    porzione_g: 80,
    porzione_unita: "g",
    kcal_per_porzione: 272,
    proteine_per_porzione: 9,
    carboidrati_per_porzione: 55,
    grassi_per_porzione: 1
  },
  {
    categoria: "cereali",
    nome: "Riso (crudo)",
    porzione_g: 80,
    porzione_unita: "g",
    kcal_per_porzione: 280,
    proteine_per_porzione: 6.7,
    carboidrati_per_porzione: 62,
    grassi_per_porzione: 0.8
  },
  {
    categoria: "cereali",
    nome: "Fette biscottate",
    porzione_g: 24,
    porzione_unita: "3 pz",
    kcal_per_porzione: 95,
    proteine_per_porzione: 3.4,
    carboidrati_per_porzione: 18,
    grassi_per_porzione: 1.2
  },
  {
    categoria: "cereali",
    nome: "Cornflakes",
    porzione_g: 30,
    porzione_unita: "g",
    kcal_per_porzione: 112,
    proteine_per_porzione: 2.5,
    carboidrati_per_porzione: 25,
    grassi_per_porzione: 0.3
  },
  
  // Frutta
  {
    categoria: "frutta",
    nome: "Mela",
    porzione_g: 150,
    porzione_unita: "1 frutto medio",
    kcal_per_porzione: 66,
    proteine_per_porzione: 0.3,
    carboidrati_per_porzione: 16,
    grassi_per_porzione: 0.2
  },
  {
    categoria: "frutta",
    nome: "Arancia",
    porzione_g: 150,
    porzione_unita: "1 frutto medio",
    kcal_per_porzione: 60,
    proteine_per_porzione: 1.2,
    carboidrati_per_porzione: 14,
    grassi_per_porzione: 0.2
  },
  {
    categoria: "frutta",
    nome: "Banana",
    porzione_g: 120,
    porzione_unita: "1 frutto medio",
    kcal_per_porzione: 105,
    proteine_per_porzione: 1.3,
    carboidrati_per_porzione: 25,
    grassi_per_porzione: 0.3
  },
  {
    categoria: "frutta",
    nome: "Albicocche",
    porzione_g: 150,
    porzione_unita: "3-4 frutti",
    kcal_per_porzione: 72,
    proteine_per_porzione: 2.1,
    carboidrati_per_porzione: 16,
    grassi_per_porzione: 0.4
  },
  {
    categoria: "frutta",
    nome: "Anguria",
    porzione_g: 300,
    porzione_unita: "1 fetta",
    kcal_per_porzione: 48,
    proteine_per_porzione: 1.2,
    carboidrati_per_porzione: 11,
    grassi_per_porzione: 0.3
  },
  
  // Verdura
  {
    categoria: "verdura",
    nome: "Insalata cruda",
    porzione_g: 80,
    porzione_unita: "g",
    kcal_per_porzione: 15,
    proteine_per_porzione: 1,
    carboidrati_per_porzione: 2.5,
    grassi_per_porzione: 0.1
  },
  {
    categoria: "verdura",
    nome: "Spinaci cotti",
    porzione_g: 200,
    porzione_unita: "g",
    kcal_per_porzione: 30,
    proteine_per_porzione: 5.6,
    carboidrati_per_porzione: 3,
    grassi_per_porzione: 0.4
  },
  {
    categoria: "verdura",
    nome: "Fagiolini",
    porzione_g: 200,
    porzione_unita: "g",
    kcal_per_porzione: 48,
    proteine_per_porzione: 4.2,
    carboidrati_per_porzione: 8,
    grassi_per_porzione: 0.4
  },
  {
    categoria: "verdura",
    nome: "Pomodori",
    porzione_g: 150,
    porzione_unita: "g",
    kcal_per_porzione: 27,
    proteine_per_porzione: 1,
    carboidrati_per_porzione: 5,
    grassi_per_porzione: 0.3
  },
  {
    categoria: "verdura",
    nome: "Carote",
    porzione_g: 200,
    porzione_unita: "g",
    kcal_per_porzione: 70,
    proteine_per_porzione: 1.8,
    carboidrati_per_porzione: 14,
    grassi_per_porzione: 0.4
  },
  
  // Latte e derivati
  {
    categoria: "latte",
    nome: "Latte parzialmente scremato",
    porzione_g: 125,
    porzione_unita: "ml",
    kcal_per_porzione: 57,
    proteine_per_porzione: 4.3,
    carboidrati_per_porzione: 6,
    grassi_per_porzione: 1.6
  },
  {
    categoria: "latte",
    nome: "Yogurt greco 0%",
    porzione_g: 125,
    porzione_unita: "g",
    kcal_per_porzione: 64,
    proteine_per_porzione: 11.3,
    carboidrati_per_porzione: 5,
    grassi_per_porzione: 0.1
  },
  {
    categoria: "latte",
    nome: "Formaggio stagionato",
    porzione_g: 40,
    porzione_unita: "g",
    kcal_per_porzione: 160,
    proteine_per_porzione: 11,
    carboidrati_per_porzione: 0.5,
    grassi_per_porzione: 12
  },
  
  // Carne, pesce, uova e legumi
  {
    categoria: "proteine",
    nome: "Carne rossa (bistecca)",
    porzione_g: 150,
    porzione_unita: "g",
    kcal_per_porzione: 235,
    proteine_per_porzione: 32,
    carboidrati_per_porzione: 0,
    grassi_per_porzione: 11
  },
  {
    categoria: "proteine",
    nome: "Pollo (petto)",
    porzione_g: 100,
    porzione_unita: "g",
    kcal_per_porzione: 120,
    proteine_per_porzione: 22,
    carboidrati_per_porzione: 0,
    grassi_per_porzione: 3
  },
  {
    categoria: "proteine",
    nome: "Pesce (merluzzo)",
    porzione_g: 150,
    porzione_unita: "g",
    kcal_per_porzione: 120,
    proteine_per_porzione: 30,
    carboidrati_per_porzione: 0,
    grassi_per_porzione: 0.8
  },
  {
    categoria: "proteine",
    nome: "Legumi cotti (lenticchie)",
    porzione_g: 150,
    porzione_unita: "g",
    kcal_per_porzione: 120,
    proteine_per_porzione: 9,
    carboidrati_per_porzione: 17,
    grassi_per_porzione: 0.5
  },
  {
    categoria: "proteine",
    nome: "Uova",
    porzione_g: 60,
    porzione_unita: "1 uovo",
    kcal_per_porzione: 80,
    proteine_per_porzione: 6.8,
    carboidrati_per_porzione: 0.5,
    grassi_per_porzione: 5.5
  },
  
  // Grassi
  {
    categoria: "grassi",
    nome: "Olio extravergine di oliva",
    porzione_g: 10,
    porzione_unita: "1 cucchiaio",
    kcal_per_porzione: 90,
    proteine_per_porzione: 0,
    carboidrati_per_porzione: 0,
    grassi_per_porzione: 10
  },
  
  // Altri
  {
    categoria: "altro",
    nome: "Marmellata",
    porzione_g: 20,
    porzione_unita: "g",
    kcal_per_porzione: 50,
    proteine_per_porzione: 0.1,
    carboidrati_per_porzione: 12,
    grassi_per_porzione: 0.1
  },
  {
    categoria: "altro",
    nome: "Caffè",
    porzione_g: 0,
    porzione_unita: "1 tazza",
    kcal_per_porzione: 0,
    proteine_per_porzione: 0,
    carboidrati_per_porzione: 0,
    grassi_per_porzione: 0
  }
];

// Distribuzione raccomandata CREA
export const CREA_DAILY_PORTIONS = {
  cereali: 4, // 4 porzioni al giorno
  frutta: 3, // 3 porzioni al giorno
  verdura: 2, // 2 porzioni al giorno (più insalate)
  latte: 2, // 2 porzioni al giorno
  proteine: 2, // 2 porzioni al giorno (carne/pesce + legumi/uova)
  grassi: 2, // 2 cucchiai olio EVO al giorno
};
