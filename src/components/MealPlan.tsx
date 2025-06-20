import { useEffect, useState } from "react";

export default function MealPlan({ mealPlan }: { mealPlan: any[] }) {
  console.log("mealPlan dati:", mealPlan);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (mealPlan.length > 0) {
      setSelectedCategory(mealPlan[0].categoria);
    }
  }, [mealPlan]);

  return (
    <div>
      {/* Pulsanti per selezionare la categoria */}
      <div className="flex gap-3 mb-6">
        {mealPlan.map(({ categoria }, idx) => (
          <button
            key={categoria + idx}
            onClick={() => setSelectedCategory(categoria)}
            className={`btn ${selectedCategory === categoria ? "btn-primary" : "btn-outline"}`}
          >
            {categoria}
          </button>
        ))}
      </div>

      {/* Contenuto della categoria selezionata */}
      {mealPlan
        .filter(({ categoria }) => categoria === selectedCategory)
        .map(({ categoria, ricette }) => (
          <div key={categoria + "_content"}>
            <h2 className="mb-4 text-lg font-semibold">{categoria}</h2>
            {ricette.map(({ recipe, portion }, index) => (
              <div
                key={`${recipe.id}-${index}`}  // Chiave unica usando id + index
                className="bg-muted p-3 rounded-lg space-y-2"
              >
                <h3 className="font-bold">{recipe.name}</h3>
                <p>
                  Porzione: {portion} – {recipe.Energia} kcal
                </p>
                <p>
                  Macro: {recipe.Carboidrati_totali || 0}g carbo, {recipe.Proteine || 0}g pro,{" "}
                  {recipe.Lipidi_totali || 0}g fat
                </p>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
