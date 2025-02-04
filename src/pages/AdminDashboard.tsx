import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, User, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Nomination = {
  id: string;
  name: string;
  twitter_handle: string;
  amount_stolen_usd: number;
  status: string;
  created_at: string;
  scam_description: string;
};

const AdminDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, [session]);

  const checkAdminAccess = async () => {
    if (!session?.user?.email) {
      navigate('/');
      return;
    }

    try {
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (adminError || !adminData) {
        toast({
          title: "Åtkomst nekad",
          description: "Du har inte behörighet att komma åt denna sida.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      loadNominations();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    }
  };

  const loadNominations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('nominations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Inga nomineringar hittades');
      }
      
      console.log('Loaded nominations:', data); // Debug log
      setNominations(data);
    } catch (error: any) {
      console.error('Error loading nominations:', error);
      setError(error.message);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte ladda nomineringar: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('nominations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Framgång",
        description: "Nominering raderad",
      });

      loadNominations();
    } catch (error: any) {
      toast({
        title: "Fel",
        description: "Kunde inte radera nominering: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('nominations')
        .update({ status: newStatus, last_modified_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Framgång",
        description: `Status uppdaterad till ${newStatus}`,
      });

      loadNominations();
    } catch (error: any) {
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera status: " + error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-6 w-6" />
              Ett fel uppstod
            </CardTitle>
            <CardDescription className="text-red-600">
              {error}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            Admin Panel
          </CardTitle>
          <CardDescription>
            Hantera alla nomineringar ({nominations.length} totalt)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Namn</TableHead>
                <TableHead>Twitter</TableHead>
                <TableHead>Belopp Stulet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nominations.map((nomination) => (
                <TableRow key={nomination.id}>
                  <TableCell className="font-medium">{nomination.name}</TableCell>
                  <TableCell>@{nomination.twitter_handle}</TableCell>
                  <TableCell>${nomination.amount_stolen_usd.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        nomination.status === 'approved' ? 'success' :
                        nomination.status === 'rejected' ? 'destructive' :
                        'default'
                      }
                    >
                      {nomination.status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(nomination.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(nomination.id, 'approved')}
                      className="text-green-500 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(nomination.id, 'rejected')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(nomination.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {nominations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Inga nomineringar hittades
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;