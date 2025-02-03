import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScammerEditForm } from "@/components/admin/ScammerEditForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Trash2, 
  Edit2,
  Settings,
  Save,
  Plus,
  Minus,
  Shield,
  AlertTriangle,
  Loader2
} from "lucide-react";
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

const AdminDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [nominations, setNominations] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scammerToDelete, setScammerToDelete] = useState<string | null>(null);
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

      if (adminError || !adminData || session.user.email !== 'snowden728@gmail.com') {
        toast({
          title: "Åtkomst nekad",
          description: "Du har inte behörighet att komma åt denna sida.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
      loadData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('nominations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        toast({
          title: "Fel vid laddning av data",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setNominations(data || []);
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Fel",
        description: "Kunde inte ladda nomineringar",
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

      await loadData();
      toast({
        title: "Borttagen",
        description: "Scammern har tagits bort från systemet.",
      });
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setScammerToDelete(null);
    }
  };

  const handleSave = async (updatedScammer: any) => {
    try {
      const { error } = await supabase
        .from('nominations')
        .update({
          name: updatedScammer.name,
          twitter_handle: updatedScammer.twitterHandle,
          scam_description: updatedScammer.scamDescription,
          amount_stolen_usd: updatedScammer.amountStolenUSD,
          token_name: updatedScammer.tokenName,
          votes: updatedScammer.votes,
          lawsuit_signatures: updatedScammer.lawsuitSignatures,
          target_signatures: updatedScammer.targetSignatures
        })
        .eq('id', updatedScammer.id);

      if (error) throw error;

      setEditingId(null);
      await loadData();
      toast({
        title: "Ändringar sparade",
        description: "Informationen har uppdaterats.",
      });
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Admin Dashboard
              </CardTitle>
              <CardDescription>
                Säker admin-kontroll - Endast behöriga administratörer har tillgång till dessa kontroller.
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={loadData}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Settings className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hantera Scammers</CardTitle>
          <CardDescription>
            Här kan du se och hantera alla registrerade scammers i systemet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
              <p>{error}</p>
            </div>
          ) : nominations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
              <p>Inga scammers hittades i databasen.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Namn</TableHead>
                    <TableHead>Twitter</TableHead>
                    <TableHead>Belopp (USD)</TableHead>
                    <TableHead>Röster</TableHead>
                    <TableHead>Signaturer</TableHead>
                    <TableHead className="text-right">Åtgärder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nominations.map((scammer) => (
                    <TableRow key={scammer.id}>
                      <TableCell className="font-medium">{scammer.name}</TableCell>
                      <TableCell>@{scammer.twitter_handle}</TableCell>
                      <TableCell>${scammer.amount_stolen_usd.toLocaleString()}</TableCell>
                      <TableCell>{scammer.votes}</TableCell>
                      <TableCell>
                        {scammer.lawsuit_signatures} / {scammer.target_signatures}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingId(scammer.id)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(scammer.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {editingId && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Redigera Scammer</CardTitle>
            <CardDescription>
              Uppdatera information om scammern här.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScammerEditForm
              scammer={nominations.find(s => s.id === editingId)}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
            />
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Är du säker?</AlertDialogTitle>
            <AlertDialogDescription>
              Denna åtgärd kan inte ångras. Detta kommer permanent ta bort scammern
              och all tillhörande data från databasen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Ta bort
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;