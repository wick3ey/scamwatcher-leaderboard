import { useState, useEffect } from "react";
import ScammerCard from "@/components/ScammerCard";
import NominateScammer from "@/components/NominateScammer";
import { Award, AlertTriangle, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";

const Index = () => {
  const [scammers, setScammers] = useState([]);

  useEffect(() => {
    // Load leaderboard data from localStorage
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    setScammers(leaderboardData);
  }, []);

  const handleVote = (id: number) => {
    const updatedScammers = scammers.map(scammer => 
      scammer.id === id 
        ? { ...scammer, votes: scammer.votes + 1 }
        : scammer
    );
    
    // Update localStorage and state
    localStorage.setItem('leaderboard', JSON.stringify(updatedScammers));
    setScammers(updatedScammers);
  };

  const stats = {
    totalVotes: scammers.reduce((acc, curr) => acc + curr.votes, 0),
    totalScammers: scammers.length,
    totalStolenUSD: scammers.reduce((acc, curr) => acc + curr.amountStolenUSD, 0),
    totalStolenSOL: scammers.reduce((acc, curr) => acc + (curr.amountStolenSOL || 0), 0)
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <UserMenu />
        </div>
        
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
              
              {scammers.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                  No scammers on the leaderboard yet. Check the pending nominations!
                </div>
              )}
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