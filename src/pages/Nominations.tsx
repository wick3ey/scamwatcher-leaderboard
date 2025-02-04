import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ScammerCard from "@/components/ScammerCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Nomination {
  id: string;
  numeric_id: number;
  name: string;
  twitter_handle: string;
  scam_description: string;
  votes: number;
  amount_stolen_usd: number;
  lawsuit_signatures: number;
  target_signatures: number;
  token_name?: string;
  created_at: string;
}

const Nominations = () => {
  const [pendingNominations, setPendingNominations] = useState<Nomination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPendingNominations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('nominations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setPendingNominations(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load nominations';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingNominations();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nominations',
          filter: 'status=eq.pending'
        },
        () => {
          fetchPendingNominations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleVote = async (nominationId: string) => {
    try {
      // Get current votes
      const { data: nomination } = await supabase
        .from('nominations')
        .select('votes')
        .eq('id', nominationId)
        .single();

      const newVotes = (nomination?.votes || 0) + 1;

      // Update votes
      const { error: updateError } = await supabase
        .from('nominations')
        .update({ votes: newVotes })
        .eq('id', nominationId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Your vote has been recorded",
      });
    } catch (error) {
      console.error("Error updating votes:", error);
      toast({
        title: "Error",
        description: "Could not record vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Nominations</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={fetchPendingNominations}
            className="text-primary hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
            Pending Nominations
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            These scammers need 500 votes to appear on the main leaderboard. Help expose them by voting!
          </p>
          <Link 
            to="/" 
            className="inline-block mt-4 text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to Leaderboard
          </Link>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingNominations.length > 0 ? (
              pendingNominations.map((nomination) => (
                <ScammerCard
                  key={nomination.id}
                  id={nomination.id}
                  numeric_id={nomination.numeric_id}
                  name={nomination.name}
                  twitterHandle={nomination.twitter_handle}
                  scamDescription={nomination.scam_description}
                  votes={nomination.votes}
                  amountStolenUSD={nomination.amount_stolen_usd}
                  lawsuitSignatures={nomination.lawsuit_signatures}
                  targetSignatures={nomination.target_signatures}
                  tokenName={nomination.token_name}
                  onVote={() => handleVote(nomination.id)}
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-12 bg-secondary/10 rounded-lg">
                <p className="text-lg mb-2">No pending nominations at the moment.</p>
                <p className="text-sm">Be the first to nominate a scammer!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Nominations;