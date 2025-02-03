import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScammerEditFormProps {
  scammer: {
    id: string;
    name: string;
    twitterHandle: string;
    scamDescription: string;
    amountStolenUSD: number;
    tokenName?: string;
    votes: number;
    lawsuitSignatures: number;
    targetSignatures: number;
  };
  onSave: (updatedScammer: any) => void;
  onCancel: () => void;
}

export function ScammerEditForm({ scammer, onSave, onCancel }: ScammerEditFormProps) {
  const [formData, setFormData] = useState(scammer);
  const { toast } = useToast();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast({
      title: "Ändringar sparade",
      description: "Scammer-informationen har uppdaterats.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Namn</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleChange("name")}
          className="bg-secondary/30"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="twitterHandle">Twitter Handle</Label>
        <Input
          id="twitterHandle"
          value={formData.twitterHandle}
          onChange={handleChange("twitterHandle")}
          className="bg-secondary/30"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scamDescription">Beskrivning av bedrägeriet</Label>
        <Textarea
          id="scamDescription"
          value={formData.scamDescription}
          onChange={handleChange("scamDescription")}
          className="bg-secondary/30"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amountStolenUSD">Stulen summa (USD)</Label>
          <Input
            id="amountStolenUSD"
            type="number"
            value={formData.amountStolenUSD}
            onChange={handleChange("amountStolenUSD")}
            className="bg-secondary/30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tokenName">Token Namn (valfritt)</Label>
          <Input
            id="tokenName"
            value={formData.tokenName || ""}
            onChange={handleChange("tokenName")}
            className="bg-secondary/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="votes">Röster</Label>
          <Input
            id="votes"
            type="number"
            value={formData.votes}
            onChange={handleChange("votes")}
            className="bg-secondary/30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lawsuitSignatures">Signaturer</Label>
          <Input
            id="lawsuitSignatures"
            type="number"
            value={formData.lawsuitSignatures}
            onChange={handleChange("lawsuitSignatures")}
            className="bg-secondary/30"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Avbryt
        </Button>
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Spara ändringar
        </Button>
      </div>
    </form>
  );
}