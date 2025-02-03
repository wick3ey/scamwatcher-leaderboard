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
  Trash2, 
  Edit2,
  Settings,
  Save,
  Plus,
  Minus,
  Shield,
  AlertTriangle
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

  useEffect(() => {
    checkAdminAccess();
  }, [session]);

  const checkAdminAccess = async () => {
    if (!session?.user?.email) {
      navigate('/');
      return;
    }

    try {
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (error || !adminData || session.user.email !== 'snowden728@gmail.com') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
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
    try {
      const { data, error } = await supabase
        .from('nominations')
        .select('*')
        .order('votes', { ascending: false });

      if (error) {
        toast({
          title: "Error Loading Data",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setNominations(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load nominations",
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
        title: "Deleted Successfully",
        description: "The scammer has been removed from the system.",
      });
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
        title: "Changes Saved",
        description: "The information has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const adjustValue = async (id: string, field: string, increment: boolean, amount: number = 100) => {
    const scammer = nominations.find(n => n.id === id);
    if (!scammer) return;

    const newValue = increment 
      ? (scammer[field] || 0) + amount 
      : Math.max(0, (scammer[field] || 0) - amount);

    try {
      const { error } = await supabase
        .from('nominations')
        .update({ [field]: newValue })
        .eq('id', id);

      if (error) throw error;

      await loadData();
      toast({
        title: "Updated Successfully",
        description: `${field.replace('_', ' ')} has been ${increment ? 'increased' : 'decreased'} by ${amount}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!isAdmin || loading) {
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
                Secure admin controls - Only authorized administrators have access to these controls.
              </CardDescription>
            </div>
            <Settings className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Scammers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {nominations.map((scammer) => (
              <Card key={scammer.id} className="p-4 border-primary/10 hover:border-primary/20 transition-colors">
                {editingId === scammer.id ? (
                  <ScammerEditForm
                    scammer={{
                      id: scammer.id,
                      name: scammer.name,
                      twitterHandle: scammer.twitter_handle,
                      scamDescription: scammer.scam_description,
                      amountStolenUSD: scammer.amount_stolen_usd,
                      tokenName: scammer.token_name,
                      votes: scammer.votes,
                      lawsuitSignatures: scammer.lawsuit_signatures,
                      targetSignatures: scammer.target_signatures
                    }}
                    onSave={handleSave}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{scammer.name}</h3>
                        <p className="text-sm text-muted-foreground">@{scammer.twitter_handle}</p>
                      </div>
                      <div className="flex items-center gap-2">
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Votes: {scammer.votes}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => adjustValue(scammer.id, 'votes', true)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => adjustValue(scammer.id, 'votes', false)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Signatures: {scammer.lawsuit_signatures} / {scammer.target_signatures}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => adjustValue(scammer.id, 'lawsuit_signatures', true)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => adjustValue(scammer.id, 'lawsuit_signatures', false)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p><strong>Description:</strong> {scammer.scam_description}</p>
                      <p><strong>Amount Stolen:</strong> ${scammer.amount_stolen_usd.toLocaleString()}</p>
                      {scammer.token_name && (
                        <p><strong>Token:</strong> {scammer.token_name}</p>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}

            {nominations.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                <p>No scammers found in the database.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the scammer
              and all associated data from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;