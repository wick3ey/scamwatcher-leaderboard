import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChevronUp, ChevronDown, Plus, List } from "lucide-react";

interface NominationControlsProps {
  nomination: {
    id: string;
    votes: number;
    lawsuit_signatures: number;
    image_url: string | null;
  };
  onUpdate: () => void;
}

export function NominationControls({ nomination, onUpdate }: NominationControlsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateCount = async (
    field: "votes" | "lawsuit_signatures",
    increment: boolean,
    amount: number = 1
  ) => {
    try {
      setIsUpdating(true);
      const currentValue = nomination[field] || 0;
      const newValue = increment ? currentValue + amount : Math.max(0, currentValue - amount);

      const { error } = await supabase
        .from("nominations")
        .update({ [field]: newValue })
        .eq("id", nomination.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${field.replace("_", " ")} updated successfully`,
      });

      onUpdate();
    } catch (error: any) {
      console.error("Error updating count:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = (url: string) => {
    supabase
      .from("nominations")
      .update({ image_url: url })
      .eq("id", nomination.id)
      .then(({ error }) => {
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Profile image updated successfully",
          });
          onUpdate();
        }
      });
  };

  const viewPendingNominations = () => {
    window.location.href = "/nominations?status=pending";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateCount("votes", true)}
          disabled={isUpdating}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateCount("votes", true, 100)}
          disabled={isUpdating}
          className="bg-primary/10"
        >
          <Plus className="h-4 w-4 mr-1" />
          100
        </Button>
        <span className="min-w-[3ch] text-center">{nomination.votes || 0}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateCount("votes", false)}
          disabled={isUpdating}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateCount("lawsuit_signatures", true)}
          disabled={isUpdating}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateCount("lawsuit_signatures", true, 100)}
          disabled={isUpdating}
          className="bg-primary/10"
        >
          <Plus className="h-4 w-4 mr-1" />
          100
        </Button>
        <span className="min-w-[3ch] text-center">
          {nomination.lawsuit_signatures || 0}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateCount("lawsuit_signatures", false)}
          disabled={isUpdating}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={viewPendingNominations}
        className="ml-2"
      >
        <List className="h-4 w-4 mr-2" />
        View Pending
      </Button>

      <ImageUpload onUploadComplete={handleImageUpload} />
    </div>
  );
}