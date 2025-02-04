import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Send, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const NominateScammer = () => {
  const [name, setName] = useState("");
  const [twitter, setTwitter] = useState("");
  const [description, setDescription] = useState("");
  const [amountUSD, setAmountUSD] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in with Google to nominate a scammer",
      });
      await signIn();
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('nominations')
        .insert({
          name,
          twitter_handle: twitter.replace('@', ''),
          scam_description: description,
          amount_stolen_usd: parseFloat(amountUSD),
          token_name: tokenName,
          nominated_by: session.user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Nomination Submitted",
        description: "Thank you for helping keep the Web3 community safe!",
      });

      // Reset form
      setName("");
      setTwitter("");
      setDescription("");
      setAmountUSD("");
      setTokenName("");
    } catch (error: any) {
      console.error("Error submitting nomination:", error);
      toast({
        title: "Error",
        description: "Could not submit nomination. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

      <div className="space-y-2">
        <label className="text-sm font-medium">Token Name</label>
        <Input
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
          placeholder="ticker"
          className="bg-secondary/30"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Amount Stolen (USD)</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            value={amountUSD}
            onChange={(e) => setAmountUSD(e.target.value)}
            placeholder="0.00"
            className="bg-secondary/30 pl-9"
            required
          />
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

      <Button type="submit" className="w-full group" disabled={isSubmitting}>
        <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        {isSubmitting ? "Submitting..." : "Submit Nomination"}
      </Button>
    </form>
  );
};

export default NominateScammer;
