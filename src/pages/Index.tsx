import { useState, useEffect } from "react";
import ScammerCard from "@/components/ScammerCard";
import NominateScammer from "@/components/NominateScammer";
import { AlertTriangle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [scammers, setScammers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center px-2 md:px-4 py-2 border-b border-border/5">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/a03e5c74-86a0-4321-8579-27e4caf444c8.png" 
              alt="RugBuster Logo" 
              className="w-12 h-12 md:w-16 md:h-16"
            />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#D946EF] text-transparent bg-clip-text">
              RugBuster.
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about">
              <Button variant="outline" size={isMobile ? "sm" : "default"} className="flex items-center gap-2">
                <Info className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden md:inline">About Us</span>
              </Button>
            </Link>
            <UserMenu />
          </div>
        </div>
        
        <div className="px-2 md:px-4 py-6">
          <Alert className="max-w-2xl mx-auto mb-8 bg-primary/10 border-primary/20">
            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <AlertDescription className="text-base md:text-lg">
              RugBuster is dedicated to pursuing legal action against high-profile scammers in the Web3 space. 
              Our mission is to hold KOLs, influencers, and celebrities accountable when they betray their communities through fraudulent activities.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {isMobile && (
              <div className="mb-6">
                <NominateScammer />
              </div>
            )}
            
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold">Top Scammers</h2>
                <div className="text-sm text-muted-foreground">
                  Sorted by most votes
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
                  ))
                ) : scammers.length > 0 ? (
                  scammers.map((scammer, index) => (
                    <div 
                      key={scammer.id} 
                      className="animate-fade-in" 
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
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
                  <div className="text-center text-muted-foreground py-8 md:py-12">
                    No scammers on the leaderboard yet. Check the pending nominations!
                  </div>
                )}
              </div>
            </div>
            
            {!isMobile && (
              <div className="lg:col-span-1">
                <NominateScammer />
              </div>
            )}
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Index;