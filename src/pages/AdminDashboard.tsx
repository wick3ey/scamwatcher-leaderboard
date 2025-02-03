import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  ArrowUpCircle, 
  ArrowDownCircle,
  Settings,
  Save,
  Plus,
  Minus
} from "lucide-react";

const AdminDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [nominations, setNominations] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
    loadData();
  }, [session]);

  const checkAdminStatus = async () => {
    if (!session?.user) {
      navigate('/');
      return;
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', session.user.email)
      .single();

    if (!adminData) {
      navigate('/');
      return;
    }

    setIsAdmin(true);
  };

  const loadData = async () => {
    const { data, error } = await supabase
      .from('nominations')
      .select('*')
      .order('votes', { ascending: false });

    if (error) {
      toast({
        title: "Fel vid laddning av data",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setNominations(data || []);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('nominations')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Fel vid borttagning",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    await loadData();
    toast({
      title: "Borttagen",
      description: "Scammern har tagits bort från systemet.",
    });
  };

  const handleSave = async (updatedScammer: any) => {
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

    if (error) {
      toast({
        title: "Fel vid uppdatering",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setEditingId(null);
    await loadData();
    toast({
      title: "Uppdaterad",
      description: "Informationen har sparats.",
    });
  };

  const adjustSignatures = async (id: string, increment: boolean, amount: number = 100) => {
    const scammer = nominations.find(n => n.id === id);
    if (!scammer) return;

    const newSignatures = increment 
      ? scammer.lawsuit_signatures + amount 
      : Math.max(0, scammer.lawsuit_signatures - amount);

    const { error } = await supabase
      .from('nominations')
      .update({ lawsuit_signatures: newSignatures })
      .eq('id', id);

    if (error) {
      toast({
        title: "Fel vid uppdatering",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    await loadData();
    toast({
      title: "Signaturer uppdaterade",
      description: `Antalet signaturer har ${increment ? 'ökats' : 'minskats'} med ${amount}.`,
    });
  };

  const adjustVotes = async (id: string, increment: boolean, amount: number = 100) => {
    const scammer = nominations.find(n => n.id === id);
    if (!scammer) return;

    const newVotes = increment 
      ? scammer.votes + amount 
      : Math.max(0, scammer.votes - amount);

    const { error } = await supabase
      .from('nominations')
      .update({ votes: newVotes })
      .eq('id', id);

    if (error) {
      toast({
        title: "Fel vid uppdatering",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    await loadData();
    toast({
      title: "Röster uppdaterade",
      description: `Antalet röster har ${increment ? 'ökats' : 'minskats'} med ${amount}.`,
    });
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>
                Hantera scammers, signaturer och röster. Endast auktoriserade administratörer har tillgång till dessa kontroller.
              </CardDescription>
            </div>
            <Settings className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hantera Scammers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {nominations.map((scammer) => (
              <Card key={scammer.id} className="p-4">
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Röster: {scammer.votes}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => adjustVotes(scammer.id, true)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => adjustVotes(scammer.id, false)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Signaturer: {scammer.lawsuit_signatures} / {scammer.target_signatures}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => adjustSignatures(scammer.id, true)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => adjustSignatures(scammer.id, false)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p><strong>Beskrivning:</strong> {scammer.scam_description}</p>
                      <p><strong>Stulen summa:</strong> ${scammer.amount_stolen_usd.toLocaleString()}</p>
                      {scammer.token_name && (
                        <p><strong>Token:</strong> {scammer.token_name}</p>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;