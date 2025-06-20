
import { CREA_PORTIONS, CREA_DAILY_PORTIONS, CREAFood } from "@/data/creaPortion";

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

// Schemi di rotazione per varietà settimanale
const ROTAZIONI = {
  cereali_colazione: ["Fette biscottate", "Cornflakes", "Pane"],
  frutta_colazione: ["Marmellata"],
  frutta_break_mattina: ["Mela", "Arancia", "Banana"],
  cereali_pranzo: ["Pasta (cruda)", "Riso (crudo)", "Pasta (cruda)"],
  proteine_pranzo: ["Legumi cotti (lenticchie)", "Formaggio stagionato", "Uova"],
  verdure_pranzo: ["Fagiolini", "Spinaci cotti", "Carote", "Pomodori"],
  frutta_break_pomeriggio: ["Banana", "Albicocche", "Mela"],
  proteine_cena: ["Pollo (petto)", "Pesce (merluzzo)", "Carne rossa (bistecca)"],
  verdure_cena: ["Spinaci cotti", "Insalata cruda", "Fagiolini", "Carote"],
  frutta_cena: ["Anguria", "Albicocche", "Mela"]
};

export function generaCREAPiano3Settimane(
  targetKcal: number,
  targetProteine: number,
  targetCarboidrati: number,
  targetGrassi: number
): CREAMealPlan[] {
  const piano: CREAMealPlan[] = [];
  const dataInizio = new Date();

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
  settimana: number,
  indiceGiorno: number
): CREADayPlan {
  // Distribuzione calorica per pasto (CREA)
  const distribuzioneKcal = {
    colazione: 0.20, // 20%
    break_mattina: 0.05, // 5%
    pranzo: 0.40, // 40%
    break_pomeriggio: 0.05, // 5%
    cena: 0.30, // 30%
    extra: 0.00 // Solo olio e pane extra
  };

  const pasti = {
    colazione: generaColazione(targetKcal * distribuzioneKcal.colazione, settimana, indiceGiorno),
    break_mattina: generaBreakMattina(targetKcal * distribuzioneKcal.break_mattina, settimana, indiceGiorno),
    pranzo: generaPranzo(targetKcal * distribuzioneKcal.pranzo, settimana, indiceGiorno),
    break_pomeriggio: generaBreakPomeriggio(targetKcal * distribuzioneKcal.break_pomeriggio, settimana, indiceGiorno),
    cena: generaCena(targetKcal * distribuzioneKcal.cena, settimana, indiceGiorno),
    extra: generaExtra()
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

function generaColazione(targetKcal: number, settimana: number, giorno: number): CREAMeal {
  const alimenti: CREAFoodItem[] = [];
  
  // Base: latte
  const latte = trovaCibo("Latte parzialmente scremato");
  if (latte) alimenti.push(convertToFoodItem(latte));
  
  // Caffè
  const caffe = trovaCibo("Caffè");
  if (caffe) alimenti.push(convertToFoodItem(caffe));
  
  // Cereale rotante
  const cerealeIndex = (settimana + giorno) % ROTAZIONI.cereali_colazione.length;
  const nomeCereale = ROTAZIONI.cereali_colazione[cerealeIndex];
  const cereale = trovaCibo(nomeCereale);
  if (cereale) alimenti.push(convertToFoodItem(cereale));
  
  // Marmellata
  const marmellata = trovaCibo("Marmellata");
  if (marmellata) alimenti.push(convertToFoodItem(marmellata));

  return {
    nome: "COLAZIONE",
    alimenti,
    totali: calcolaTotaliPasto(alimenti)
  };
}

function generaBreakMattina(targetKcal: number, settimana: number, giorno: number): CREAMeal {
  const alimenti: CREAFoodItem[] = [];
  
  // Frutta rotante
  const fruttaIndex = (settimana + giorno) % ROTAZIONI.frutta_break_mattina.length;
  const nomeFrutta = ROTAZIONI.frutta_break_mattina[fruttaIndex];
  const frutta = trovaCibo(nomeFrutta);
  if (frutta) alimenti.push(convertToFoodItem(frutta));

  return {
    nome: "BREAK MATTUTINO",
    alimenti,
    totali: calcolaTotaliPasto(alimenti)
  };
}

function generaPranzo(targetKcal: number, settimana: number, giorno: number): CREAMeal {
  const alimenti: CREAFoodItem[] = [];
  
  // Cereale primo piatto
  const cerealeIndex = (settimana + giorno) % ROTAZIONI.cereali_pranzo.length;
  const nomeCereale = ROTAZIONI.cereali_pranzo[cerealeIndex];
  const cereale = trovaCibo(nomeCereale);
  if (cereale) alimenti.push(convertToFoodItem(cereale));
  
  // Verdura
  const verduraIndex = (settimana + giorno) % ROTAZIONI.verdure_pranzo.length;
  const nomeVerdura = ROTAZIONI.verdure_pranzo[verduraIndex];
  const verdura = trovaCibo(nomeVerdura);
  if (verdura) alimenti.push(convertToFoodItem(verdura));
  
  // Frutta
  if (giorno % 2 === 0) { // Frutta a pranzo giorni alterni
    const fruttaIndex = giorno % ROTAZIONI.frutta_break_pomeriggio.length;
    const nomeFrutta = ROTAZIONI.frutta_break_pomeriggio[fruttaIndex];
    const frutta = trovaCibo(nomeFrutta);
    if (frutta) alimenti.push(convertToFoodItem(frutta));
  }

  return {
    nome: "PRANZO",
    alimenti,
    totali: calcolaTotaliPasto(alimenti)
  };
}

function generaBreakPomeriggio(targetKcal: number, settimana: number, giorno: number): CREAMeal {
  const alimenti: CREAFoodItem[] = [];
  
  // Alternanza: frutta o yogurt
  if (giorno % 2 === 0) {
    // Yogurt + frutta piccola
    const yogurt = trovaCibo("Yogurt greco 0%");
    if (yogurt) {
      const yogurtItem = convertToFoodItem(yogurt);
      yogurtItem.quantita_g = 100; // Porzione ridotta
      yogurtItem.kcal = 51;
      yogurtItem.proteine = 9;
      alimenti.push(yogurtItem);
    }
    
    const mela = trovaCibo("Mela");
    if (mela) {
      const melaItem = convertToFoodItem(mela);
      melaItem.quantita_g = 50; // Mela piccola
      melaItem.kcal = 22;
      melaItem.proteine = 0.1;
      alimenti.push(melaItem);
    }
  } else {
    // Solo frutta
    const fruttaIndex = (settimana + giorno) % ROTAZIONI.frutta_break_pomeriggio.length;
    const nomeFrutta = ROTAZIONI.frutta_break_pomeriggio[fruttaIndex];
    const frutta = trovaCibo(nomeFrutta);
    if (frutta) alimenti.push(convertToFoodItem(frutta));
  }

  return {
    nome: "BREAK POMERIDIANO",
    alimenti,
    totali: calcolaTotaliPasto(alimenti)
  };
}

function generaCena(targetKcal: number, settimana: number, giorno: number): CREAMeal {
  const alimenti: CREAFoodItem[] = [];
  
  // Proteina principale rotante
  const proteinaIndex = (settimana + giorno) % ROTAZIONI.proteine_cena.length;
  const nomeProteina = ROTAZIONI.proteine_cena[proteinaIndex];
  const proteina = trovaCibo(nomeProteina);
  if (proteina) alimenti.push(convertToFoodItem(proteina));
  
  // Verdura
  const verduraIndex = (settimana + giorno + 1) % ROTAZIONI.verdure_cena.length;
  const nomeVerdura = ROTAZIONI.verdure_cena[verduraIndex];
  const verdura = trovaCibo(nomeVerdura);
  if (verdura) alimenti.push(convertToFoodItem(verdura));
  
  // Frutta
  const fruttaIndex = (settimana + giorno) % ROTAZIONI.frutta_cena.length;
  const nomeFrutta = ROTAZIONI.frutta_cena[fruttaIndex];
  const frutta = trovaCibo(nomeFrutta);
  if (frutta) alimenti.push(convertToFoodItem(frutta));

  return {
    nome: "CENA",
    alimenti,
    totali: calcolaTotaliPasto(alimenti)
  };
}

function generaExtra(): CREAMeal {
  const alimenti: CREAFoodItem[] = [];
  
  // Olio EVO giornaliero (2 cucchiai = 20g)
  const olio = trovaCibo("Olio extravergine di oliva");
  if (olio) {
    const olioItem = convertToFoodItem(olio);
    olioItem.quantita_g = 20; // 2 cucchiai
    olioItem.quantita_unita = "2 cucchiai";
    olioItem.kcal = 180;
    olioItem.grassi = 20;
    alimenti.push(olioItem);
  }
  
  // Pane extra
  const pane = trovaCibo("Pane");
  if (pane) {
    const paneItem = convertToFoodItem(pane);
    paneItem.quantita_g = 70; // Porzione aggiuntiva
    paneItem.kcal = 189;
    paneItem.proteine = 6.3;
    paneItem.carboidrati = 35;
    alimenti.push(paneItem);
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
             creaFood.porzione_unita.includes("frutto")
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
