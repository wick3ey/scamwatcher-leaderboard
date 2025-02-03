import { useState } from "react";
import ScammerCard from "@/components/ScammerCard";
import NominateScammer from "@/components/NominateScammer";
import { Award, AlertTriangle, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

// Mockdata för demonstration
const initialScammers = [
  {
    id: 1,
    name: "Alex Crypto Guru",
    twitterHandle: "cryptoguru_alex",
    scamDescription: "Created fake NFT project 'Moon Apes' and disappeared with 500 ETH. Multiple victims reported losing significant investments.",
    votes: 1337,
    amountStolenUSD: 2500000,
    amountStolenSOL: 25000,
    lawsuitSignatures: 892,
    targetSignatures: 1000
  },
  {
    id: 2,
    name: "Sarah DeFi Queen",
    twitterHandle: "defi_sarah",
    scamDescription: "Promoted rugpull token 'SafeMoon2.0' to 50k followers. Project collapsed after reaching $2M market cap.",
    votes: 892,
    amountStolenUSD: 1800000,
    amountStolenSOL: 18000,
    lawsuitSignatures: 654,
    targetSignatures: 1000
  },
  {
    id: 3,
    name: "Crypto Wolf",
    twitterHandle: "wolf_trades",
    scamDescription: "Ran fake cryptocurrency giveaway scam, stolen amount: 245 BTC. Multiple fake Twitter accounts used.",
    votes: 654,
    amountStolenUSD: 1200000,
    amountStolenSOL: 12000,
    lawsuitSignatures: 445,
    targetSignatures: 1000
  },
];

const Index = () => {
  const [scammers, setScammers] = useState(initialScammers);

  const handleVote = (id: number) => {
    setScammers(scammers.map(scammer => 
      scammer.id === id 
        ? { ...scammer, votes: scammer.votes + 1 }
        : scammer
    ));
  };

  const stats = {
    totalVotes: scammers.reduce((acc, curr) => acc + curr.votes, 0),
    totalScammers: scammers.length,
    totalStolenUSD: scammers.reduce((acc, curr) => acc + curr.amountStolenUSD, 0),
    totalStolenSOL: scammers.reduce((acc, curr) => acc + curr.amountStolenSOL, 0)
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
            Web3 Scammer Leaderboard
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A community-driven initiative to identify and track Web3 scammers. 
            Help protect others by voting and nominating known scammers.
          </p>
          <Link 
            to="/nominations" 
            className="inline-block mt-4 text-primary hover:text-primary/80 transition-colors"
          >
            View Pending Nominations →
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-fade-in">
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Votes</p>
              <p className="text-2xl font-bold">{stats.totalVotes.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Known Scammers</p>
              <p className="text-2xl font-bold">{stats.totalScammers}</p>
            </div>
          </div>
          
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Stolen (USD)</p>
              <p className="text-2xl font-bold">${stats.totalStolenUSD.toLocaleString()}</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total SOL Lost</p>
              <p className="text-2xl font-bold">{stats.totalStolenSOL.toLocaleString()} SOL</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Top Scammers</h2>
              <div className="text-sm text-muted-foreground">
                Sorted by most votes
              </div>
            </div>
            <div className="space-y-6">
              {scammers
                .sort((a, b) => b.votes - a.votes)
                .map((scammer, index) => (
                  <div key={scammer.id} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                    <ScammerCard
                      {...scammer}
                      rank={index + 1}
                      onVote={() => handleVote(scammer.id)}
                    />
                  </div>
                ))}
            </div>
          </div>
          
          <div className="md:col-span-1">
            <NominateScammer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
