import { ArrowUp, AlertCircle, User, Twitter, Shield, ExternalLink, GavelIcon, DollarSign, Coins } from "lucide-react";
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
import { useState } from "react";
import { SignLawsuitDialog } from "./SignLawsuitDialog";

interface ScammerCardProps {
  name: string;
  twitterHandle: string;
  scamDescription: string;
  votes: number;
  onVote: () => void;
  rank?: number;
  amountStolenUSD: number;
  lawsuitSignatures: number;
  targetSignatures: number;
  tokenName?: string;
}

const ScammerCard = ({ 
  name, 
  twitterHandle, 
  scamDescription, 
  votes, 
  onVote, 
  rank,
  amountStolenUSD,
  lawsuitSignatures,
  targetSignatures,
  tokenName
}: ScammerCardProps) => {
  const [showLawsuitDialog, setShowLawsuitDialog] = useState(false);
  const signatureProgress = (lawsuitSignatures / targetSignatures) * 100;

  return (
    <>
      <Card className="glass-card group animate-fade-in hover:translate-y-[-4px]">
        <CardHeader className="relative">
          {rank && (
            <div className="absolute -left-2 -top-2 bg-gradient-to-r from-[#9b87f5] to-[#D946EF] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse-glow">
              #{rank}
            </div>
          )}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#9b87f5]/20 to-[#D946EF]/20 p-2 rounded-full">
                <User className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold mb-1 gradient-text">{name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-[#9b87f5]" />
                  <a 
                    href={`https://twitter.com/${twitterHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9b87f5] hover:text-[#D946EF] transition-colors flex items-center gap-1"
                  >
                    @{twitterHandle}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </CardDescription>
              </div>
            </div>
            <AlertCircle className="text-[#F97316] h-6 w-6 animate-pulse" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-white/5 p-4 rounded-lg backdrop-blur-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-[#9b87f5]" />
              <span className="font-semibold text-[#D946EF]">Scam Warning</span>
            </div>
            <p className="text-gray-300">{scamDescription}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 p-3 rounded-lg backdrop-blur-lg border border-white/10 hover:border-[#9b87f5]/50 transition-colors">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                <DollarSign className="h-4 w-4 text-[#9b87f5]" />
                <span>Amount Stolen</span>
              </div>
              <div className="font-bold text-[#D946EF]">
                ${amountStolenUSD.toLocaleString()}
              </div>
            </div>

            {tokenName && (
              <div className="bg-white/5 p-3 rounded-lg backdrop-blur-lg border border-white/10 hover:border-[#9b87f5]/50 transition-colors">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <Coins className="h-4 w-4 text-[#9b87f5]" />
                  <span>Token</span>
                </div>
                <div className="font-bold text-[#D946EF]">
                  {tokenName}
                </div>
              </div>
            )}

            <div className="bg-white/5 p-3 rounded-lg backdrop-blur-lg border border-white/10 hover:border-[#9b87f5]/50 transition-colors">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                <GavelIcon className="h-4 w-4 text-[#9b87f5]" />
                <span>Lawsuit Progress</span>
              </div>
              <Progress value={signatureProgress} className="h-2 mb-1 bg-white/10" />
              <div className="text-sm text-gray-400">
                {lawsuitSignatures} / {targetSignatures} signatures
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/5 px-3 py-1 rounded-full text-sm border border-white/10">
              {votes.toLocaleString()} votes
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={onVote} 
              variant="secondary" 
              size="sm"
              className="bg-gradient-to-r from-[#9b87f5] to-[#D946EF] text-white hover:opacity-90 transition-opacity"
            >
              <ArrowUp className="mr-2 h-4 w-4" />
              Vote Up
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white transition-all"
              onClick={() => setShowLawsuitDialog(true)}
            >
              <GavelIcon className="mr-2 h-4 w-4" />
              Sign Lawsuit
            </Button>
          </div>
        </CardFooter>
      </Card>

      <SignLawsuitDialog
        open={showLawsuitDialog}
        onOpenChange={setShowLawsuitDialog}
        scammerName={name}
      />
    </>
  );
};

export default ScammerCard;