import { useState, useEffect } from "react";
import ScammerCard from "@/components/ScammerCard";
import NominateScammer from "@/components/NominateScammer";
import { AlertTriangle, Info, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { Nomination } from "@/types/nomination";

const Index = () => {
  const [scammers, setScammers] = useState<Nomination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchScammers();

    // Set up real-time subscription for updates
    const channel = supabase
      .channel('public:nominations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nominations',
        },
        () => {
          fetchScammers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
      setError(error.message || "Could not fetch data. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load scammers. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (id: string, numeric_id: number) => {
    if (isUpdating || !user) {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to vote.",
          variant: "destructive",
        });
      }
      return;
    }

    try {
      setIsUpdating(true);

      // First check if user has already voted
      const { data: existingVote, error: checkError } = await supabase
        .from('user_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('scammer_id', numeric_id)
        .eq('action_type', 'vote')
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw checkError;
      }

      if (existingVote) {
        toast({
          title: "Already Voted",
          description: "You have already voted for this nomination.",
          variant: "default",
        });
        return;
      }

      // If no existing vote, proceed with inserting the vote
      const { error: actionError } = await supabase
        .from('user_actions')
        .insert({
          scammer_id: numeric_id,
          action_type: 'vote',
          user_id: user.id
        });

      if (actionError) {
        throw actionError;
      }

      // Update the vote count
      const { data: currentData, error: fetchError } = await supabase
        .from('nominations')
        .select('votes')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const { error: updateError } = await supabase
        .from('nominations')
        .update({ votes: (currentData?.votes || 0) + 1 })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setScammers(prev => 
        prev.map(scammer => 
          scammer.id === id 
            ? { ...scammer, votes: (scammer.votes || 0) + 1 }
            : scammer
        )
      );

      toast({
        title: "Success",
        description: "Your vote has been recorded!",
      });
    } catch (error: any) {
      console.error("Error updating votes:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to record vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <Button 
            variant="outline" 
            onClick={fetchScammers}
            className="mt-4"
          >
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center border-b border-border/5 p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <img 
              src="/lovable-uploads/a03e5c74-86a0-4321-8579-27e4caf444c8.png" 
              alt="RugBuster Logo" 
              className="w-12 h-12 md:w-16 md:h-16"
            />
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#D946EF] text-transparent bg-clip-text">
              RugBuster.
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/about">
              <Button variant="outline" size={isMobile ? "sm" : "default"}>
                About Us
              </Button>
            </Link>
            <UserMenu />
          </div>
        </div>
        
        <div className="px-2 md:px-4 py-6">
          <div className="flex justify-center mb-8">
            <Link to="/nominations?status=pending">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white font-bold text-base md:text-xl px-6 md:px-12 py-6 md:py-8 rounded-xl shadow-xl transform transition-all hover:-translate-y-1 hover:shadow-2xl border-2 border-white/10 w-full md:w-auto"
                disabled={isLoading || isUpdating}
              >
                VIEW PENDING NOMINATIONS
              </Button>
            </Link>
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">
            Crypto Rug Pull Registry
          </h2>

          <Alert className="max-w-2xl mx-auto mb-8 bg-primary/10 border-primary/20">
            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <AlertDescription className="text-sm md:text-base lg:text-lg">
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
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold">Top Scammers</h2>
                <div className="text-xs md:text-sm text-muted-foreground">
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
                        numeric_id={scammer.numeric_id}
                        twitterHandle={scammer.twitter_handle}
                        scamDescription={scammer.scam_description}
                        amountStolenUSD={scammer.amount_stolen_usd}
                        lawsuitSignatures={scammer.lawsuit_signatures}
                        targetSignatures={scammer.target_signatures}
                        rank={index + 1}
                        onVote={() => handleVote(scammer.id, scammer.numeric_id)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8 md:py-12">
                    No scammers on the leaderboard yet. Check the pending nominations!
                  </div>
                )}

                {isUpdating && (
                  <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Processing vote...</span>
                    </div>
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