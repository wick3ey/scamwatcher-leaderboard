import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ScammerCard from "@/components/ScammerCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Nominations = () => {
  const [pendingNominations, setPendingNominations] = useState([]);
  const { toast } = useToast();

  // Fetch pending nominations
  const fetchPendingNominations = async () => {
    try {
      const { data, error } = await supabase
        .from('nominations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingNominations(data || []);
    } catch (error) {
      console.error("Error fetching nominations:", error);
      toast({
        title: "Error",
        description: "Could not load pending nominations",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPendingNominations();

    // Subscribe to real-time changes
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
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchPendingNominations(); // Refresh the list when changes occur
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

        <div className="grid gap-6">
          {pendingNominations.map((nomination) => (
            <ScammerCard
              key={nomination.id}
              {...nomination}
              onVote={() => handleVote(nomination.id)}
            />
          ))}
          
          {pendingNominations.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              No pending nominations at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nominations;