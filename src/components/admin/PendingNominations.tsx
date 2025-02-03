import { useEffect, useState } from "react";
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
import { Check, X, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PendingNominations() {
  const [nominations, setNominations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPendingNominations();
  }, []);

  const loadPendingNominations = async () => {
    try {
      console.log("Loading pending nominations...");
      const { data: adminCheck } = await supabase
        .from('admin_users')
        .select('*')
        .maybeSingle();

      if (!adminCheck) {
        console.error("User is not an admin");
        toast({
          title: "Access Denied",
          description: "You do not have permission to view pending nominations",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('nominations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching nominations:", error);
        throw error;
      }
      
      console.log("Loaded nominations:", data);
      setNominations(data || []);
    } catch (error: any) {
      console.error("Error in loadPendingNominations:", error);
      toast({
        title: "Error",
        description: "Could not load pending nominations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('nominations')
        .update({ 
          status,
          last_modified_at: new Date().toISOString(),
          last_modified_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Nomination ${status}`,
      });

      // Refresh the nominations list
      loadPendingNominations();
    } catch (error: any) {
      console.error("Error updating status:", error);
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

  if (nominations.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-muted-foreground">No pending nominations found.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Nominations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Twitter</TableHead>
              <TableHead>Amount Stolen</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nominations.map((nomination) => (
              <TableRow key={nomination.id}>
                <TableCell className="font-medium">{nomination.name}</TableCell>
                <TableCell>@{nomination.twitter_handle}</TableCell>
                <TableCell>${nomination.amount_stolen_usd.toLocaleString()}</TableCell>
                <TableCell className="max-w-md truncate">
                  {nomination.scam_description}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(nomination.id, 'approved')}
                      className="text-green-500 hover:text-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(nomination.id, 'rejected')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}