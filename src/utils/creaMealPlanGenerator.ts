
import { CREA_PORTIONS, CREA_DAILY_PORTIONS, CREAFood } from "@/data/creaPortion";
import { recipes } from "@/data/recipes";

export interface CREAMealPlan {
  settimana: number;
  giorni: CREADayPlan[];
}

export interface CREADayPlan {
  giorno: string;
  data: string;
  pasti: {
    colazione: CREAMeal;
    break_mattina: CREAMeal;
    pranzo: CREAMeal;
    break_pomeriggio: CREAMeal;
    cena: CREAMeal;
    extra: CREAMeal;
  };
  totaliGiornalieri: {
    kcal: number;
    proteine: number;
    carboidrati: number;
    grassi: number;
  };
}

export interface CREAMeal {
  nome: string;
  ricetta?: string;
  alimenti: CREAFoodItem[];
  totali: {
    kcal: number;
    proteine: number;
    carboidrati: number;
    grassi: number;
  };
}

export interface CREAFoodItem {
  nome: string;
  quantita_g: number;
  quantita_unita: string;
  kcal: number;
  proteine: number;
  carboidrati: number;
  grassi: number;
  isPezzo: boolean;
}

const GIORNI_SETTIMANA = ["LUNEDÌ", "MARTEDÌ", "MERCOLEDÌ", "GIOVEDÌ", "VENERDÌ", "SABATO", "DOMENICA"];

// Ricette CREA organizzate per pasto
const RICETTE_CREA = {
  colazione: ["Porridge avena e banana", "Latte, caffè e biscotti"],
  pranzo: ["Pasta al pomodoro", "Risotto ai funghi", "Insalata di riso light", "Pasta e fagioli light", "Zuppa di lenticchie", "Insalata di quinoa e ceci", "Pasta integrale con zucchine e ricotta", "Riso integrale con lenticchie e spinaci"],
  cena: ["Pollo arrosto con verdure", "Salmone grigliato", "Insalata proteica", "Omelette alle verdure", "Mozzarella in carrozza light", "Scaloppina light", "Filetto di trota al forno", "Polpette di lenticchie", "Frittata al forno con zucchine", "Burger di fagioli", "Merluzzo in umido con patate"],
  spuntino: ["Toast integrale con hummus e avocado", "Crackers"]
};

export function generaCREAPiano3Settimane(
  targetKcal: number,
  targetProteine: number,
  targetCarboidrati: number,
  targetGrassi: number
): CREAMealPlan[] {
  const piano: CREAMealPlan[] = [];
  const dataInizio = new Date();

  // Calcola fattori di scaling per adattare le porzioni al fabbisogno
  const fattoreScaling = targetKcal / 2000; // 2000 kcal come base CREA standard

  for (let settimana = 1; settimana <= 3; settimana++) {
    const giorni: CREADayPlan[] = [];

    for (let giorno = 0; giorno < 7; giorno++) {
      const dataCorrente = new Date(dataInizio);
      dataCorrente.setDate(dataInizio.getDate() + ((settimana - 1) * 7) + giorno);
      
      const pianGiornaliero = generaGiornoCREA(
        GIORNI_SETTIMANA[giorno],
        dataCorrente.toISOString().split('T')[0],
        targetKcal,
        targetProteine,
        targetCarboidrati,
        targetGrassi,
        fattoreScaling,
        settimana,
        giorno
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

function generaGiornoCREA(
  nomeGiorno: string,
  data: string,
  targetKcal: number,
  targetProteine: number,
  targetCarboidrati: number,
  targetGrassi: number,
  fattoreScaling: number,
  settimana: number,
  indiceGiorno: number
): CREADayPlan {
  // Distribuzione calorica per pasto secondo CREA
  const distribuzioneKcal = {
    colazione: 0.20, // 20%
    break_mattina: 0.05, // 5%
    pranzo: 0.40, // 40%
    break_pomeriggio: 0.05, // 5%
    cena: 0.30, // 30%
    extra: 0.00 // Solo oli e integrazioni
  };

  const pasti = {
    colazione: generaColazione(targetKcal * distribuzioneKcal.colazione, fattoreScaling, settimana, indiceGiorno),
    break_mattina: generaBreakMattina(targetKcal * distribuzioneKcal.break_mattina, fattoreScaling, settimana, indiceGiorno),
    pranzo: generaPranzo(targetKcal * distribuzioneKcal.pranzo, fattoreScaling, settimana, indiceGiorno),
    break_pomeriggio: generaBreakPomeriggio(targetKcal * distribuzioneKcal.break_pomeriggio, fattoreScaling, settimana, indiceGiorno),
    cena: generaCena(targetKcal * distribuzioneKcal.cena, fattoreScaling, settimana, indiceGiorno),
    extra: generaExtra(fattoreScaling)
  };

  // Calcola totali giornalieri
  const totaliGiornalieri = calcolaTotaliGiornalieri(pasti);

  return {
    giorno: nomeGiorno,
    data,
    pasti,
    totaliGiornalieri
  };
}

function generaColazione(targetKcal: number, fattoreScaling: number, settimana: number, giorno: number): CREAMeal {
  const alimenti: CREAFoodItem[] = [];
  
  // Scegli ricetta rotante per varietà
  const ricetteDisponibili = RICETTE_CREA.colazione;
  const ricettaIndex = (settimana + giorno) % ricetteDisponibili.length;
  const ricettaScelta = ricetteDisponibili[ricettaIndex];
  
  if (recipes[ricettaScelta]) {
    // Usa ingredienti dalla ricetta
    const ricetta = recipes[ricettaScelta];
    Object.entries(ricetta.ingredienti).forEach(([nomeIngrediente, quantitaStr]) => {
      const creaFood = trovaCiboPerNome(nomeIngrediente);
      if (creaFood) {
        const quantitaScalata = Math.round(parseInt(quantitaStr) * fattoreScaling);
        const item = convertToFoodItemScalato(creaFood, quantitaScalata);
        alimenti.push(item);
      }
    });
  } else {
    // Fallback colazione standard
    const latte = trovaCibo("Latte parzialmente scremato");
    if (latte) alimenti.push(convertToFoodItemScalato(latte, Math.round(125 * fattoreScaling)));
    
    const caffe = trovaCibo("Caffè");
    if (caffe) alimenti.push(convertToFoodItem(caffe));
    
    const fette = trovaCibo("Fette biscottate");
    if (fette) alimenti.push(convertToFoodItemScalato(fette, Math.round(24 * fattoreScaling)));
    
    const marmellata = trovaCibo("Marmellata");
    if (marmellata) alimenti.push(convertToFoodItemScalato(marmellata, Math.round(20 * fattoreScaling)));
  }

  return {
    nome: "COLAZIONE",
    ricetta: ricettaScelta,
    alimenti,
    totali: calcolaTotaliPasto(alimenti)
  };
}

function generaBreakMattina(targetKcal: number, fattoreScaling: number, settimana: number, giorno: number): CREAMeal {
  const alimenti: CREAFoodItem[] = [];
  
  // Rotazione frutta stagionale
  const frutti = ["Mela", "Arancia", "Banana", "Albicocche"];
  const fruttaIndex = (settimana + giorno) % frutti.length;
  const fruttaScelta = frutti[fruttaIndex];
  
  const frutta = trovaCibo(fruttaScelta);
  if (frutta) {
    const quantitaScalata = Math.round(frutta.porzione_g * fattoreScaling);
    alimenti.push(convertToFoodItemScalato(frutta, quantitaScalata));
  }

  return {
    nome: "BREAK MATTUTINO",
    alimenti,
    totali: calcolaTotaliPasto(alimenti)
  };
}

function generaPranzo(targetKcal: number, fattoreScaling: number, settimana: number, giorno: number): CREAMeal {
  const alimenti: CREAFoodItem[] = [];
  
  // Scegli ricetta rotante
  const ricetteDisponibili = RICETTE_CREA.pranzo;
  const ricettaIndex = (settimana + giorno) % ricetteDisponibili.length;
  const ricettaScelta = ricetteDisponibili[ricettaIndex];
  
  if (recipes[ricettaScelta]) {
    const ricetta = recipes[ricettaScelta];
    Object.entries(ricetta.ingredienti).forEach(([nomeIngrediente, quantitaStr]) => {
      const creaFood = trovaCiboPerNome(nomeIngrediente);
      if (creaFood) {
        const quantitaScalata = Math.round(parseInt(quantitaStr) * fattoreScaling);
        const item = convertToFoodItemScalato(creaFood, quantitaScalata);
        alimenti.push(item);
      }
    });
  } else {
    // Fallback pranzo standard
    const cereali = ["Pasta (cruda)", "Riso (crudo)"];
    const cerealeIndex = (settimana + giorno) % cereali.length;
    const cereale = trovaCibo(cereali[cerealeIndex]);
    if (cereale) alimenti.push(convertToFoodItemScalato(cereale, Math.round(80 * fattoreScaling)));
    
    const verdure = ["Fagiolini", "Spinaci cotti", "Carote", "Pomodori"];
    const verduraIndex = (settimana + giorno + 1) % verdure.length;
    const verdura = trovaCibo(verdure[verduraIndex]);
    if (verdura) alimenti.push(convertToFoodItem(verdura));
  }

  // Aggiungi sempre olio per il pranzo
  const olio = trovaCibo("Olio extravergine di oliva");
  if (olio) {
    const olioItem = convertToFoodItemScalato(olio, Math.round(10 * fattoreScaling));
    alimenti.push(olioItem);
  }

  return {
    nome: "PRANZO",
    ricetta: ricettaScelta,
    alimenti,
    totali: calcolaTotaliPasto(alimenti)
  };
}

function generaBreakPomeriggio(targetKcal: number, fattoreScaling: number, settimana: number, giorno: number): CREAMeal {
  const alimenti: CREAFoodItem[] = [];
  
  // Alternanza: frutta o yogurt
  if (giorno % 2 === 0) {
    const yogurt = trovaCibo("Yogurt greco 0%");
    if (yogurt) {
      const quantitaScalata = Math.round(100 * fattoreScaling);
      alimenti.push(convertToFoodItemScalato(yogurt, quantitaScalata));
    }
  } else {
    const frutti = ["Banana", "Albicocche", "Anguria"];
    const fruttaIndex = giorno % frutti.length;
    const frutta = trovaCibo(frutti[fruttaIndex]);
    if (frutta) alimenti.push(convertToFoodItem(frutta));
  }

  return {
    nome: "BREAK POMERIDIANO",
    alimenti,
    totali: calcolaTotaliPasto(alimenti)
  };
}

function generaCena(targetKcal: number, fattoreScaling: number, settimana: number, giorno: number): CREAMeal {
  const alimenti: CREAFoodItem[] = [];
  
  // Scegli ricetta rotante
  const ricetteDisponibili = RICETTE_CREA.cena;
  const ricettaIndex = (settimana + giorno) % ricetteDisponibili.length;
  const ricettaScelta = ricetteDisponibili[ricettaIndex];
  
  if (recipes[ricettaScelta]) {
    const ricetta = recipes[ricettaScelta];
    Object.entries(ricetta.ingredienti).forEach(([nomeIngrediente, quantitaStr]) => {
      const creaFood = trovaCiboPerNome(nomeIngrediente);
      if (creaFood) {
        const quantitaScalata = Math.round(parseInt(quantitaStr) * fattoreScaling);
        const item = convertToFoodItemScalato(creaFood, quantitaScalata);
        alimenti.push(item);
      }
    });
  } else {
    // Fallback cena standard
    const proteine = ["Pollo (petto)", "Pesce (merluzzo)", "Carne rossa (bistecca)"];
    const proteinaIndex = (settimana + giorno) % proteine.length;
    const proteina = trovaCibo(proteine[proteinaIndex]);
    if (proteina) alimenti.push(convertToFoodItem(proteina));
    
    const verdure = ["Spinaci cotti", "Insalata cruda", "Carote"];
    const verduraIndex = (settimana + giorno + 2) % verdure.length;
    const verdura = trovaCibo(verdure[verduraIndex]);
    if (verdura) alimenti.push(convertToFoodItem(verdura));
  }

  return {
    nome: "CENA",
    ricetta: ricettaScelta,
    alimenti,
    totali: calcolaTotaliPasto(alimenti)
  };
}

function generaExtra(fattoreScaling: number): CREAMeal {
  const alimenti: CREAFoodItem[] = [];
  
  // Pane extra
  const pane = trovaCibo("Pane");
  if (pane) {
    const quantitaScalata = Math.round(50 * fattoreScaling);
    alimenti.push(convertToFoodItemScalato(pane, quantitaScalata));
  }
  
  // Olio EVO aggiuntivo
  const olio = trovaCibo("Olio extravergine di oliva");
  if (olio) {
    const quantitaScalata = Math.round(10 * fattoreScaling);
    alimenti.push(convertToFoodItemScalato(olio, quantitaScalata));
  }

  return {
    nome: "EXTRA",
    alimenti,
    totali: calcolaTotaliPasto(alimenti)
  };
}

function trovaCibo(nome: string): CREAFood | undefined {
  return CREA_PORTIONS.find(food => food.nome === nome);
}

function trovaCiboPerNome(nomeRicerca: string): CREAFood | undefined {
  // Mappatura ingredienti ricette -> alimenti CREA
  const mappature: { [key: string]: string } = {
    "Latte scremato": "Latte parzialmente scremato",
    "Latte parzialmente scremato": "Latte parzialmente scremato",
    "Pane integrale": "Pane",
    "Pasta integrale": "Pasta (cruda)",
    "Pasta di semola": "Pasta (cruda)",
    "Riso basmati": "Riso (crudo)",
    "Riso": "Riso (crudo)",
    "Pomodori maturi": "Pomodori",
    "Pomodorini": "Pomodori",
    "Petto di pollo": "Pollo (petto)",
    "Cosce di pollo senza pelle": "Pollo (petto)",
    "Filetto di salmone": "Pesce (merluzzo)",
    "Filetto di trota": "Pesce (merluzzo)",
    "Filetto di merluzzo": "Pesce (merluzzo)",
    "Vitello a bocconcini": "Carne rossa (bistecca)",
    "Fettine di pollo o vitello": "Pollo (petto)",
    "Uova": "Uova",
    "Uovo": "Uova",
    "Uovo intero": "Uova",
    "Zucchine": "Carote",
    "Broccoli": "Spinaci cotti",
    "Spinaci": "Spinaci cotti",
    "Carote": "Carote",
    "Carota": "Carote",
    "Insalata": "Insalata cruda",
    "Banana": "Banana",
    "Fiocchi d'avena": "Cornflakes",
    "Biscotti": "Fette biscottate",
    "Miele": "Marmellata",
    "Yogurt greco magro": "Yogurt greco 0%",
    "Ricotta light": "Formaggio stagionato",
    "Parmigiano": "Formaggio stagionato",
    "Parmigiano reggiano": "Formaggio stagionato",
    "Tonno al naturale": "Pesce (merluzzo)",
    "Tonno in scatola": "Pesce (merluzzo)",
    "Lenticchie lessate": "Legumi cotti (lenticchie)",
    "Lenticchie": "Legumi cotti (lenticchie)",
    "Ceci lessati": "Legumi cotti (lenticchie)",
    "Fagioli cannellini": "Legumi cotti (lenticchie)",
    "Fagioli borlotti lessati": "Legumi cotti (lenticchie)",
    "Quinoa": "Riso (crudo)"
  };

  const nomeMapping = mappature[nomeRicerca] || nomeRicerca;
  return CREA_PORTIONS.find(food => food.nome === nomeMapping);
}

function convertToFoodItem(creaFood: CREAFood): CREAFoodItem {
  return {
    nome: creaFood.nome,
    quantita_g: creaFood.porzione_g,
    quantita_unita: creaFood.porzione_unita,
    kcal: creaFood.kcal_per_porzione,
    proteine: creaFood.proteine_per_porzione,
    carboidrati: creaFood.carboidrati_per_porzione,
    grassi: creaFood.grassi_per_porzione,
    isPezzo: creaFood.porzione_unita.includes("pz") || 
             creaFood.porzione_unita.includes("uovo") || 
             creaFood.porzione_unita.includes("tazza") ||
             creaFood.porzione_unita.includes("frutto") ||
             creaFood.porzione_unita.includes("cucchiaio")
  };
}

function convertToFoodItemScalato(creaFood: CREAFood, nuovaQuantita: number): CREAFoodItem {
  const fattore = nuovaQuantita / creaFood.porzione_g;
  
  return {
    nome: creaFood.nome,
    quantita_g: nuovaQuantita,
    quantita_unita: creaFood.porzione_unita,
    kcal: Math.round(creaFood.kcal_per_porzione * fattore * 10) / 10,
    proteine: Math.round(creaFood.proteine_per_porzione * fattore * 10) / 10,
    carboidrati: Math.round(creaFood.carboidrati_per_porzione * fattore * 10) / 10,
    grassi: Math.round(creaFood.grassi_per_porzione * fattore * 10) / 10,
    isPezzo: creaFood.porzione_unita.includes("pz") || 
             creaFood.porzione_unita.includes("uovo") || 
             creaFood.porzione_unita.includes("tazza") ||
             creaFood.porzione_unita.includes("frutto") ||
             creaFood.porzione_unita.includes("cucchiaio")
  };
}

function calcolaTotaliPasto(alimenti: CREAFoodItem[]) {
  return {
    kcal: Math.round(alimenti.reduce((sum, item) => sum + item.kcal, 0) * 10) / 10,
    proteine: Math.round(alimenti.reduce((sum, item) => sum + item.proteine, 0) * 10) / 10,
    carboidrati: Math.round(alimenti.reduce((sum, item) => sum + item.carboidrati, 0) * 10) / 10,
    grassi: Math.round(alimenti.reduce((sum, item) => sum + item.grassi, 0) * 10) / 10
  };
}

function calcolaTotaliGiornalieri(pasti: any) {
  const totali = {
    kcal: 0,
    proteine: 0,
    carboidrati: 0,
    grassi: 0
  };

  Object.values(pasti).forEach((pasto: any) => {
    totali.kcal += pasto.totali.kcal;
    totali.proteine += pasto.totali.proteine;
    totali.carboidrati += pasto.totali.carboidrati;
    totali.grassi += pasto.totali.grassi;
  });

  return {
    kcal: Math.round(totali.kcal),
    proteine: Math.round(totali.proteine * 10) / 10,
    carboidrati: Math.round(totali.carboidrati * 10) / 10,
    grassi: Math.round(totali.grassi * 10) / 10
  };
}
