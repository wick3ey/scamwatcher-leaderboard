import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  ArrowUp, 
  ArrowDown, 
  Pin, 
  Trash2, 
  Edit2,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function TopScammers() {
  const [scammers, setScammers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scammerToDelete, setScammerToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const loadScammers = async () => {
    try {
      const { data, error } = await supabase
        .from('nominations')
        .select('*')
        .eq('status', 'approved')
        .order('is_pinned', { ascending: false })
        .order('votes', { ascending: false });

      if (error) throw error;
      setScammers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not load scammers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setScammerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!scammerToDelete) return;

    try {
      const { error } = await supabase
        .from('nominations')
        .delete()
        .eq('id', scammerToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scammer deleted successfully",
      });

      loadScammers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setScammerToDelete(null);
    }
  };

  const handlePin = async (id: string, currentPinned: boolean) => {
    try {
      const { error } = await supabase
        .from('nominations')
        .update({ 
          is_pinned: !currentPinned,
          last_modified_at: new Date().toISOString(),
          last_modified_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: currentPinned ? "Unpinned from top" : "Pinned to top",
      });

      loadScammers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleVoteChange = async (id: string, increment: boolean) => {
    try {
      const scammer = scammers.find(s => s.id === id);
      const newVotes = increment ? (scammer.votes + 1) : Math.max(0, scammer.votes - 1);

      const { error } = await supabase
        .from('nominations')
        .update({ 
          votes: newVotes,
          last_modified_at: new Date().toISOString(),
          last_modified_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Votes ${increment ? 'increased' : 'decreased'}`,
      });

      loadScammers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (scammers.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-muted-foreground">No approved scammers found.</p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Top Scammers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Twitter</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead>Amount Stolen</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scammers.map((scammer, index) => (
                <TableRow key={scammer.id}>
                  <TableCell>#{index + 1}</TableCell>
                  <TableCell className="font-medium">{scammer.name}</TableCell>
                  <TableCell>@{scammer.twitter_handle}</TableCell>
                  <TableCell>{scammer.votes}</TableCell>
                  <TableCell>${scammer.amount_stolen_usd.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVoteChange(scammer.id, true)}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVoteChange(scammer.id, false)}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePin(scammer.id, scammer.is_pinned)}
                        className={scammer.is_pinned ? "text-primary" : ""}
                      >
                        <Pin className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(scammer.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              scammer and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}