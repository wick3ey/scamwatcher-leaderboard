import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const NominateScammer = () => {
  const [name, setName] = useState("");
  const [twitter, setTwitter] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Nomination submitted",
      description: "Thank you for helping keep the Web3 community safe!",
    });
    setName("");
    setTwitter("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Nominate a Scammer</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Scammer's name"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Twitter Handle</label>
        <Input
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          placeholder="@handle"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Scam Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the scam in detail..."
          required
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" className="w-full">
        Submit Nomination
      </Button>
    </form>
  );
};

export default NominateScammer;