import { ArrowUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScammerCardProps {
  name: string;
  twitterHandle: string;
  scamDescription: string;
  votes: number;
  onVote: () => void;
}

const ScammerCard = ({ name, twitterHandle, scamDescription, votes, onVote }: ScammerCardProps) => {
  return (
    <div className="glass-card p-6 hover-scale">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-1">{name}</h3>
          <a 
            href={`https://twitter.com/${twitterHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @{twitterHandle}
          </a>
        </div>
        <AlertCircle className="text-primary h-6 w-6" />
      </div>
      
      <p className="mt-4 text-muted-foreground">{scamDescription}</p>
      
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {votes} votes
        </span>
        <Button onClick={onVote} variant="secondary" size="sm">
          <ArrowUp className="mr-2 h-4 w-4" />
          Vote Up
        </Button>
      </div>
    </div>
  );
};

export default ScammerCard;