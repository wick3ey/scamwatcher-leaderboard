import { useState } from "react";
import ScammerCard from "@/components/ScammerCard";
import NominateScammer from "@/components/NominateScammer";

// Mockdata för demonstration
const initialScammers = [
  {
    id: 1,
    name: "Alex Crypto Guru",
    twitterHandle: "cryptoguru_alex",
    scamDescription: "Created fake NFT project 'Moon Apes' and disappeared with 500 ETH",
    votes: 1337,
  },
  {
    id: 2,
    name: "Sarah DeFi Queen",
    twitterHandle: "defi_sarah",
    scamDescription: "Promoted rugpull token 'SafeMoon2.0' to 50k followers",
    votes: 892,
  },
  {
    id: 3,
    name: "Crypto Wolf",
    twitterHandle: "wolf_trades",
    scamDescription: "Ran fake cryptocurrency giveaway scam, stolen amount: 245 BTC",
    votes: 654,
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

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
            Web3 Scammer Leaderboard
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A community-driven initiative to identify and track Web3 scammers. 
            Help protect others by voting and nominating known scammers.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Top Scammers</h2>
            <div className="space-y-6">
              {scammers
                .sort((a, b) => b.votes - a.votes)
                .map((scammer) => (
                  <ScammerCard
                    key={scammer.id}
                    {...scammer}
                    onVote={() => handleVote(scammer.id)}
                  />
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