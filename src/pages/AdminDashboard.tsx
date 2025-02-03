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
import { Shield, Settings } from "lucide-react";
import { PendingNominations } from "@/components/admin/PendingNominations";
import { TopScammers } from "@/components/admin/TopScammers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

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

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
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
                Secure admin control panel - Only authorized administrators have access to these controls.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending Nominations</TabsTrigger>
          <TabsTrigger value="top">Top Scammers</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <PendingNominations />
        </TabsContent>
        <TabsContent value="top">
          <TopScammers />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;