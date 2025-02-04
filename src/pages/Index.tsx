import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScammerCard from "@/components/ScammerCard";
import NominateScammer from "@/components/NominateScammer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNominateDialog, setShowNominateDialog] = useState(false);

  const { data: scammers } = useQuery(["scammers"], async () => {
    const { data } = await supabase.from("scammers").select("*");
    return data;
  });

  const filteredScammers = scammers?.filter(scammer =>
    scammer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
            Crypto Rug Pull Registry
          </h1>
          
          <Alert className="mb-8 glass-card border-primary/20">
            <Info className="h-5 w-5 text-primary" />
            <AlertDescription className="text-lg">
              RugBuster. is dedicated to pursuing legal action against high-profile individuals involved in cryptocurrency scams. 
              Our primary mission is to hold Key Opinion Leaders (KOLs), celebrities, and influencers accountable for their 
              fraudulent activities in the crypto space. By gathering evidence and community support, we work with law firms 
              to build cases against these perpetrators, protecting investors and maintaining integrity in Web3.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <Input
              type="text"
              placeholder="Search by name or Twitter handle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Button 
              onClick={() => setShowNominateDialog(true)}
              className="button-glow"
            >
              Nominate a Scammer
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScammers?.map(scammer => (
            <ScammerCard key={scammer.id} scammer={scammer} />
          ))}
        </div>
      </div>

      <NominateScammer
        open={showNominateDialog}
        onOpenChange={setShowNominateDialog}
      />
    </div>
  );
};

export default Index;
