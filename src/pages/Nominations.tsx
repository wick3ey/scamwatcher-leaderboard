import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import ScammerCard from "@/components/ScammerCard";

// Mock data for demonstration
const pendingNominations = [
  {
    id: 4,
    name: "DeFi Trader Pro",
    twitterHandle: "defitraderpro",
    scamDescription: "Promised 1000% returns through fake DeFi platform. Collected investments and disappeared.",
    votes: 234,
    amountStolenUSD: 750000,
    lawsuitSignatures: 156,
    targetSignatures: 1000
  },
  {
    id: 5,
    name: "NFT Marketplace Scammer",
    twitterHandle: "nft_marketplace",
    scamDescription: "Created fake NFT marketplace with artificially inflated prices. Exit scammed with user funds.",
    votes: 378,
    amountStolenUSD: 450000,
    lawsuitSignatures: 289,
    targetSignatures: 1000
  }
];

const Nominations = () => {
  const handleVote = (id: number) => {
    // In a real app, this would make an API call to update the vote count
    console.log(`Voted for scammer with ID: ${id}`);
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
        </header>

        <div className="grid gap-6">
          {pendingNominations.map((nomination) => (
            <ScammerCard
              key={nomination.id}
              name={nomination.name}
              twitterHandle={nomination.twitterHandle}
              scamDescription={nomination.scamDescription}
              votes={nomination.votes}
              onVote={() => handleVote(nomination.id)}
              amountStolenUSD={nomination.amountStolenUSD}
              lawsuitSignatures={nomination.lawsuitSignatures}
              targetSignatures={nomination.targetSignatures}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Nominations;