import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { User } from "lucide-react";

interface ProfileFormProps {
  onProfileSave: (profile: any) => void;
}

export const ProfileForm = ({ onProfileSave }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    sesso: "",
    eta: 30,
    altezza: 170,
    peso: 70,
    attivita: "",
    obiettivo: "",
    dieta: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sesso || !formData.attivita || !formData.obiettivo) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive"
      });
      return;
    }

    onProfileSave(formData);
    toast({
      title: "Profilo salvato!",
      description: "I tuoi dati sono stati salvati con successo"
    });
  };

  const handleDietaChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dieta: checked 
        ? [...prev.dieta, value]
        : prev.dieta.filter(item => item !== value)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="sesso">Sesso *</Label>
            <Select value={formData.sesso} onValueChange={(value) => setFormData(prev => ({...prev, sesso: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona sesso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Donna">Donna</SelectItem>
                <SelectItem value="Uomo">Uomo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="eta">Età</Label>
            <Input
              type="number"
              min={18}
              max={80}
              value={formData.eta}
              onChange={(e) => setFormData(prev => ({...prev, eta: parseInt(e.target.value)}))}
            />
          </div>

          <div>
            <Label htmlFor="altezza">Altezza (cm)</Label>
            <Input
              type="number"
              min={140}
              max={220}
              value={formData.altezza}
              onChange={(e) => setFormData(prev => ({...prev, altezza: parseInt(e.target.value)}))}
            />
          </div>

          <div>
            <Label htmlFor="peso">Peso (kg)</Label>
            <Input
              type="number"
              min={40}
              max={200}
              step={0.1}
              value={formData.peso}
              onChange={(e) => setFormData(prev => ({...prev, peso: parseFloat(e.target.value)}))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="attivita">Attività fisica *</Label>
            <Select value={formData.attivita} onValueChange={(value) => setFormData(prev => ({...prev, attivita: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona livello attività" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sedentario">Sedentario</SelectItem>
                <SelectItem value="Leggero">Leggero</SelectItem>
                <SelectItem value="Moderato">Moderato</SelectItem>
                <SelectItem value="Intenso">Intenso</SelectItem>
                <SelectItem value="Molto intenso">Molto intenso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="obiettivo">Obiettivo *</Label>
            <Select value={formData.obiettivo} onValueChange={(value) => setFormData(prev => ({...prev, obiettivo: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona obiettivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dimagrimento">Dimagrimento</SelectItem>
                <SelectItem value="Mantenimento">Mantenimento</SelectItem>
                <SelectItem value="Aumento Massa">Aumento Massa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Preferenze/Esclusioni alimentari</Label>
            <div className="space-y-2 mt-2">
              {["Vegetariano", "Vegano", "Senza glutine", "Senza lattosio", "No carne rossa"].map((opzione) => (
                <div key={opzione} className="flex items-center space-x-2">
                  <Checkbox
                    id={opzione}
                    checked={formData.dieta.includes(opzione)}
                    onCheckedChange={(checked) => handleDietaChange(opzione, checked as boolean)}
                  />
                  <Label htmlFor={opzione}>{opzione}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg">
        <User className="mr-2" size={16} />
        Salva Profilo
      </Button>
    </form>
  );
};
