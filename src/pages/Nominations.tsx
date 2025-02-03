import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

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
            <Card key={nomination.id} className="glass-card hover-scale">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{nomination.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">@{nomination.twitterHandle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Amount Stolen</p>
                    <p className="text-lg font-bold">${nomination.amountStolenUSD.toLocaleString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {nomination.scamDescription}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Votes Progress
                      </span>
                      <span className="text-primary">{nomination.votes}/500</span>
                    </div>
                    <Progress value={(nomination.votes / 500) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Lawsuit Signatures
                      </span>
                      <span className="text-primary">
                        {nomination.lawsuitSignatures}/{nomination.targetSignatures}
                      </span>
                    </div>
                    <Progress 
                      value={(nomination.lawsuitSignatures / nomination.targetSignatures) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
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