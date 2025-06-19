import recipes from "@/data/recipes";

type Recipe = typeof recipes[number];

export function groupRecipesByCategory() {
  const map: Record<string, Recipe[]> = {};

  recipes.forEach(recipe => {
    recipe.categories.forEach(cat => {
      if (!map[cat]) map[cat] = [];
      map[cat].push(recipe);
    });
  });

  return map;
}
