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
import { useState, useEffect } from "react";
import { SignLawsuitDialog } from "./SignLawsuitDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ScammerCardProps {
  id: string;
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
  image_url?: string;
}

const ScammerCard = ({ 
  id,
  name, 
  twitterHandle, 
  scamDescription, 
  votes, 
  onVote, 
  rank,
  amountStolenUSD,
  lawsuitSignatures,
  targetSignatures,
  tokenName,
  image_url
}: ScammerCardProps) => {
  const [showLawsuitDialog, setShowLawsuitDialog] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [hasSignedLawsuit, setHasSignedLawsuit] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { session, signIn } = useAuth();
  const { toast } = useToast();
  const signatureProgress = (lawsuitSignatures / targetSignatures) * 100;

  useEffect(() => {
    const checkUserActions = async () => {
      if (!session?.user) return;

      // Check if user has already voted or signed
      const { data: userActions } = await supabase
        .from('user_actions')
        .select('action_type')
        .eq('user_id', session.user.id)
        .eq('scammer_id', parseInt(id));

      if (userActions) {
        setHasVoted(userActions.some(action => action.action_type === 'vote'));
        setHasSignedLawsuit(userActions.some(action => action.action_type === 'lawsuit'));
      }

      // Check if user is admin
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      setIsAdmin(!!adminData);
    };

    checkUserActions();
  }, [session, id]);

  const handleAction = async (action: 'vote' | 'lawsuit') => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to " + (action === 'vote' ? 'vote' : 'sign the lawsuit'),
      });
      await signIn();
      return;
    }

    if (action === 'vote' && hasVoted && !isAdmin) {
      toast({
        title: "Already voted",
        description: "You have already voted for this scammer",
      });
      return;
    }

    if (action === 'lawsuit' && hasSignedLawsuit && !isAdmin) {
      toast({
        title: "Already signed",
        description: "You have already signed the lawsuit for this scammer",
      });
      return;
    }

    try {
      // Record user action
      if (!isAdmin) {
        const { error: actionError } = await supabase
          .from('user_actions')
          .insert({
            user_id: session.user.id,
            scammer_id: parseInt(id),
            action_type: action
          });

        if (actionError) throw actionError;
      }

      if (action === 'vote') {
        // Update vote count
        const { error: updateError } = await supabase
          .from('nominations')
          .update({ votes: votes + 1 })
          .eq('id', id);

        if (updateError) throw updateError;

        setHasVoted(true);
        onVote();
        toast({
          title: "Vote recorded",
          description: "Thank you for voting!",
        });
      } else {
        setShowLawsuitDialog(true);
      }
    } catch (error: any) {
      console.error(`Error recording ${action}:`, error);
      toast({
        title: "Error",
        description: `Failed to record ${action}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="glass-card transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <CardHeader className="relative">
          {rank && (
            <div className="absolute -left-2 -top-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold animate-fade-in">
              #{rank}
            </div>
          )}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage src={image_url || undefined} alt={name} />
                <AvatarFallback>
                  <User className="h-6 w-6 text-primary" />
                </AvatarFallback>
              </Avatar>
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
            <div className="flex items-center gap-2">
              <Badge variant={votes >= 500 ? "destructive" : "secondary"}>
                {votes >= 500 ? "Confirmed Scammer" : "Potential Scammer"}
              </Badge>
              <AlertCircle className="text-primary h-6 w-6 animate-pulse" />
            </div>
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

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                <span>Amount Stolen</span>
              </div>
              <div className="font-bold">
                ${amountStolenUSD.toLocaleString()}
              </div>
            </div>

            {tokenName && (
              <div className="bg-secondary/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Coins className="h-4 w-4" />
                  <span>Token</span>
                </div>
                <div className="font-bold">
                  {tokenName}
                </div>
              </div>
            )}

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
              onClick={() => handleAction('vote')} 
              variant={hasVoted && !isAdmin ? "secondary" : "default"}
              size="sm"
              className={`transition-all duration-300 ${
                hasVoted && !isAdmin ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-white'
              }`}
              disabled={hasVoted && !isAdmin}
            >
              <ArrowUp className="mr-2 h-4 w-4" />
              {hasVoted && !isAdmin ? 'Voted' : 'Vote Up'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`transition-all duration-300 ${
                hasSignedLawsuit && !isAdmin ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-white'
              }`}
              onClick={() => handleAction('lawsuit')}
              disabled={hasSignedLawsuit && !isAdmin}
            >
              <GavelIcon className="mr-2 h-4 w-4" />
              {hasSignedLawsuit && !isAdmin ? 'Signed' : 'Sign Lawsuit'}
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