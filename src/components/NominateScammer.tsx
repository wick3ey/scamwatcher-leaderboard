import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, Send, DollarSign, Wallet } from "lucide-react";

const NominateScammer = () => {
  const [name, setName] = useState("");
  const [twitter, setTwitter] = useState("");
  const [description, setDescription] = useState("");
  const [amountUSD, setAmountUSD] = useState("");
  const [amountSOL, setAmountSOL] = useState("");
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
    setAmountUSD("");
    setAmountSOL("");
  };

  // Helper function to calculate SOL amount based on USD input
  const handleUSDChange = (value: string) => {
    setAmountUSD(value);
    // Assuming 1 SOL = $100 (this should be dynamic in production)
    const solAmount = parseFloat(value) / 100;
    setAmountSOL(solAmount.toFixed(2));
  };

  // Helper function to calculate USD amount based on SOL input
  const handleSOLChange = (value: string) => {
    setAmountSOL(value);
    // Assuming 1 SOL = $100 (this should be dynamic in production)
    const usdAmount = parseFloat(value) * 100;
    setAmountUSD(usdAmount.toFixed(2));
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/20 p-2 rounded-full">
          <AlertTriangle className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Nominate a Scammer</h2>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Scammer's name"
          className="bg-secondary/30"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Twitter Handle</label>
        <Input
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          placeholder="@handle"
          className="bg-secondary/30"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount Stolen (USD)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={amountUSD}
              onChange={(e) => handleUSDChange(e.target.value)}
              placeholder="0.00"
              className="bg-secondary/30 pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Amount in SOL</label>
          <div className="relative">
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={amountSOL}
              onChange={(e) => handleSOLChange(e.target.value)}
              placeholder="0.00"
              className="bg-secondary/30 pl-9"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Scam Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the scam in detail..."
          required
          className="min-h-[100px] bg-secondary/30"
        />
      </div>

      <Button type="submit" className="w-full group">
        <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        Submit Nomination
      </Button>
    </form>
  );
};

export default NominateScammer;