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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  User,
  Trash2,
  Pin,
  Image as ImageIcon,
  Shield,
  Twitter,
  ExternalLink,
  DollarSign,
  GavelIcon
} from "lucide-react";

const AdminDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scammers, setScammers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scammerToDelete, setScammerToDelete] = useState<string | null>(null);

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
          title: "Access Denied",
          description: "You do not have permission to access this page.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      loadScammers();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    }
  };

  const loadScammers = async () => {
    try {
      const { data, error } = await supabase
        .from('nominations')
        .select('*')
        .order('votes', { ascending: false });

      if (error) throw error;
      setScammers(data || []);
    } catch (error: any) {
      console.error("Error loading scammers:", error);
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
      console.error("Error deleting scammer:", error);
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
          last_modified_by: session?.user?.id
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: currentPinned ? "Unpinned scammer" : "Pinned scammer",
      });

      loadScammers();
    } catch (error: any) {
      console.error("Error updating pin status:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (id: string, imageUrl: string) => {
    try {
      const { error } = await supabase
        .from('nominations')
        .update({ 
          image_url: imageUrl,
          last_modified_at: new Date().toISOString(),
          last_modified_by: session?.user?.id
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image updated successfully",
      });

      loadScammers();
    } catch (error: any) {
      console.error("Error updating image:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
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
                Complete overview of all scammers in the system
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Twitter</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount Stolen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Lawsuit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scammers.map((scammer) => (
                  <TableRow key={scammer.id} className="relative">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {scammer.image_url ? (
                          <img 
                            src={scammer.image_url} 
                            alt={scammer.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <ImageUpload onUploadComplete={(url) => handleImageUpload(scammer.id, url)} />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{scammer.name}</TableCell>
                    <TableCell>
                      <a 
                        href={`https://twitter.com/${scammer.twitter_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Twitter className="h-4 w-4" />
                        @{scammer.twitter_handle}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {scammer.scam_description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-primary" />
                        {scammer.amount_stolen_usd.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={scammer.votes >= 500 ? "destructive" : "secondary"}>
                        {scammer.votes >= 500 ? "Confirmed" : "Potential"}
                      </Badge>
                    </TableCell>
                    <TableCell>{scammer.votes}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <GavelIcon className="h-4 w-4" />
                        {scammer.lawsuit_signatures}/{scammer.target_signatures}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
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
          </div>
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
    </div>
  );
};

export default AdminDashboard;