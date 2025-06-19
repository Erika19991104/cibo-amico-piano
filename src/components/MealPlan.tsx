import React from "react";

interface UserProfile {
  sesso: string;
  eta: number;
  altezza: number;
  peso: number;
  attivita: string;
  obiettivo: string;
  dieta: string[];
}

interface MealPlanProps {
  userProfile: UserProfile;
}

export const MealPlan = ({ userProfile }: MealPlanProps) => {
  const generateSimplePlan = () => {
    if (!userProfile) return null;

    const { sesso, obiettivo, dieta } = userProfile;

    let breakfast = "Pane integrale con marmellata";
    let lunch = "Riso con pollo e verdure";
    let dinner = "Insalata mista con uova";

    if (dieta.includes("Vegetariano") || dieta.includes("Vegano")) {
      lunch = "Pasta al pomodoro con tofu";
      dinner = "Zuppa di legumi con verdure";
    }

    if (obiettivo.toLowerCase() === "dimagrimento") {
      breakfast = "Yogurt greco con frutta fresca";
      lunch = "Insalata con tonno e avocado";
      dinner = "Zucchine ripiene di quinoa";
    }

    return (
      <div>
        <h3>Piano alimentare per {sesso}, obiettivo: {obiettivo}</h3>
        <ul>
          <li><strong>Colazione:</strong> {breakfast}</li>
          <li><strong>Pranzo:</strong> {lunch}</li>
          <li><strong>Cena:</strong> {dinner}</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="meal-plan p-4 border rounded">
      {generateSimplePlan()}
    </div>
  );
};
