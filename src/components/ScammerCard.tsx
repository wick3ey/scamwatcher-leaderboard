import { ArrowUp, AlertCircle, User, Twitter, Shield, ExternalLink, GavelIcon, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ScammerCardProps {
  name: string;
  twitterHandle: string;
  scamDescription: string;
  votes: number;
  onVote: () => void;
  rank?: number;
  amountStolenUSD: number;
  amountStolenSOL: number;
  lawsuitSignatures: number;
  targetSignatures: number;
}

const ScammerCard = ({ 
  name, 
  twitterHandle, 
  scamDescription, 
  votes, 
  onVote, 
  rank,
  amountStolenUSD,
  amountStolenSOL,
  lawsuitSignatures,
  targetSignatures
}: ScammerCardProps) => {
  const signatureProgress = (lawsuitSignatures / targetSignatures) * 100;

  return (
    <Card className="glass-card transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader className="relative">
        {rank && (
          <div className="absolute -left-2 -top-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold animate-fade-in">
            #{rank}
          </div>
        )}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary/50 p-2 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold mb-1">{name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                <a 
                  href={`https://twitter.com/${twitterHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  @{twitterHandle}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </CardDescription>
            </div>
          </div>
          <AlertCircle className="text-primary h-6 w-6 animate-pulse" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-secondary/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-semibold">Scam Warning</span>
          </div>
          <p className="text-muted-foreground">{scamDescription}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Wallet className="h-4 w-4" />
              <span>Amount Stolen</span>
            </div>
            <div className="font-bold">
              {amountStolenSOL.toFixed(2)} SOL
            </div>
            <div className="text-sm text-muted-foreground">
              (${amountStolenUSD.toLocaleString()})
            </div>
          </div>

          <div className="bg-secondary/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <GavelIcon className="h-4 w-4" />
              <span>Lawsuit Progress</span>
            </div>
            <Progress value={signatureProgress} className="h-2 mb-1" />
            <div className="text-sm text-muted-foreground">
              {lawsuitSignatures} / {targetSignatures} signatures
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <div className="bg-secondary/50 px-3 py-1 rounded-full text-sm">
            {votes.toLocaleString()} votes
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={onVote} 
            variant="secondary" 
            size="sm"
            className="transition-all duration-300 hover:bg-primary hover:text-white"
          >
            <ArrowUp className="mr-2 h-4 w-4" />
            Vote Up
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="transition-all duration-300 hover:bg-primary hover:text-white"
          >
            <GavelIcon className="mr-2 h-4 w-4" />
            Sign Lawsuit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ScammerCard;