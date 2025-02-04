import { useState, useEffect } from "react";
import ScammerCard from "@/components/ScammerCard";
import NominateScammer from "@/components/NominateScammer";
import { Award, AlertTriangle, Users, DollarSign, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [scammers, setScammers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScammers();
  }, []);

  const fetchScammers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('nominations')
        .select('*')
        .eq('status', 'approved')
        .order('votes', { ascending: false });

      if (error) throw error;

      console.log("Fetched scammers:", data);
      setScammers(data || []);
    } catch (error: any) {
      console.error("Error fetching scammers:", error);
      setError("Could not fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('nominations')
        .select('votes')
        .eq('id', id)
        .single();

      if (error) throw error;

      const { error: updateError } = await supabase
        .from('nominations')
        .update({ votes: (data?.votes || 0) + 1 })
        .eq('id', id);

      if (updateError) throw updateError;

      // Update local state
      const updatedScammers = scammers.map(scammer => 
        scammer.id === id 
          ? { ...scammer, votes: (scammer.votes || 0) + 1 }
          : scammer
      );
      
      setScammers(updatedScammers);
    } catch (error) {
      console.error("Error updating votes:", error);
    }
  };

  const stats = {
    totalVotes: scammers.reduce((acc, curr) => acc + (curr.votes || 0), 0),
    totalScammers: scammers.length,
    totalStolenUSD: scammers.reduce((acc, curr) => acc + (curr.amount_stolen_usd || 0), 0),
    totalStolenSOL: scammers.reduce((acc, curr) => acc + (curr.amount_stolen_sol || 0), 0)
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link to="/about">
            <Button variant="outline" className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About Us
            </Button>
          </Link>
          <UserMenu />
        </div>
        
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
            Crypto Rug Pull Registry
          </h1>
          
          <Alert className="max-w-2xl mx-auto mb-8 bg-primary/10 border-primary/20">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="text-lg">
              RugBuster is dedicated to pursuing legal action against high-profile scammers in the Web3 space. 
              Our mission is to hold KOLs, influencers, and celebrities accountable when they betray their communities through fraudulent activities.
            </AlertDescription>
          </Alert>
          
          <Link 
            to="/nominations" 
            className="glass-card hover-scale inline-flex items-center gap-2 px-6 py-3 text-lg font-semibold text-primary"
          >
            View Pending Nominations
            <span className="text-2xl">→</span>
          </Link>
        </header>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Top Scammers</h2>
              <div className="text-sm text-muted-foreground">
                Sorted by most votes
              </div>
            </div>

            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[200px] w-full" />
                </div>
              ))
            ) : scammers.length > 0 ? (
              scammers.map((scammer, index) => (
                <div key={scammer.id} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <ScammerCard
                    {...scammer}
                    twitterHandle={scammer.twitter_handle}
                    scamDescription={scammer.scam_description}
                    amountStolenUSD={scammer.amount_stolen_usd}
                    lawsuitSignatures={scammer.lawsuit_signatures}
                    targetSignatures={scammer.target_signatures}
                    rank={index + 1}
                    onVote={() => handleVote(scammer.id)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-12">
                No scammers on the leaderboard yet. Check the pending nominations!
              </div>
            )}
          </div>
          
          <div className="md:col-span-1">
            <NominateScammer />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Index;