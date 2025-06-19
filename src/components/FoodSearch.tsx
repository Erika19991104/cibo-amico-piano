
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { searchFoodFuzzy } from "@/utils/foodUtils";
import { foodDatabase } from "@/data/foodDatabase";

export const FoodSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      const searchResults = searchFoodFuzzy(searchQuery, foodDatabase);
      setResults(searchResults.slice(0, 5));
    } else {
      setResults([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Inserisci il nome dell'alimento (anche incompleto o errato)..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Risultati simili:</h3>
          {results.map((result, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  {result.name}
                  <Badge variant="secondary">
                    Similarità: {result.score}%
                  </Badge>
                </CardTitle>
                <Badge variant="outline" className="w-fit">
                  {result.food.categoria}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <div className="font-semibold text-red-700">Energia</div>
                    <div className="text-lg">{result.food.Energia}</div>
                    <div className="text-xs text-gray-500">kcal/100g</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="font-semibold text-blue-700">Proteine</div>
                    <div className="text-lg">{result.food.Proteine}</div>
                    <div className="text-xs text-gray-500">g/100g</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="font-semibold text-green-700">Carboidrati</div>
                    <div className="text-lg">{result.food.Carboidrati}</div>
                    <div className="text-xs text-gray-500">g/100g</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <div className="font-semibold text-yellow-700">Grassi</div>
                    <div className="text-lg">{result.food.Lipidi}</div>
                    <div className="text-xs text-gray-500">g/100g</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nessun alimento trovato per "{query}"</p>
        </div>
      )}
    </div>
  );
};
