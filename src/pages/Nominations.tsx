import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ScammerCard from "@/components/ScammerCard";
import { useToast } from "@/components/ui/use-toast";

const Nominations = () => {
  const [pendingNominations, setPendingNominations] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load nominations from localStorage
    const nominations = JSON.parse(localStorage.getItem('pendingNominations') || '[]');
    setPendingNominations(nominations);
  }, []);

  const handleVote = (id: number) => {
    const updatedNominations = pendingNominations.map(nomination => {
      if (nomination.id === id) {
        const newVotes = nomination.votes + 1;
        
        // Check if nomination should move to leaderboard
        if (newVotes >= 500) {
          // Get existing leaderboard entries
          const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
          
          // Add to leaderboard
          localStorage.setItem('leaderboard', JSON.stringify([...leaderboard, {...nomination, votes: newVotes}]));
          
          toast({
            title: "Nomination Promoted!",
            description: `${nomination.name} has reached 500 votes and has been moved to the leaderboard.`,
          });
          
          // Remove from pending nominations
          return null;
        }
        
        return { ...nomination, votes: newVotes };
      }
      return nomination;
    }).filter(Boolean); // Remove null entries

    // Update localStorage and state
    localStorage.setItem('pendingNominations', JSON.stringify(updatedNominations));
    setPendingNominations(updatedNominations);
  };

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