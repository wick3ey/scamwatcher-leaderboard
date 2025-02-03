import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Trash2, Edit2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const AdminDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [nominations, setNominations] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);

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

  const loadData = () => {
    // Load data from localStorage for now
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    const nominationsData = JSON.parse(localStorage.getItem('pendingNominations') || '[]');
    setLeaderboard(leaderboardData);
    setNominations(nominationsData);
  };

  const handleDelete = (id: number, type: 'leaderboard' | 'nomination') => {
    if (type === 'leaderboard') {
      const updatedLeaderboard = leaderboard.filter(item => item.id !== id);
      localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
      setLeaderboard(updatedLeaderboard);
    } else {
      const updatedNominations = nominations.filter(item => item.id !== id);
      localStorage.setItem('pendingNominations', JSON.stringify(updatedNominations));
      setNominations(updatedNominations);
    }
    toast({
      title: "Item deleted",
      description: "The item has been successfully deleted.",
    });
  };

  const handleVoteChange = (id: number, increment: boolean, type: 'leaderboard' | 'nomination') => {
    const array = type === 'leaderboard' ? leaderboard : nominations;
    const updatedArray = array.map(item => {
      if (item.id === id) {
        return {
          ...item,
          votes: increment ? item.votes + 100 : Math.max(0, item.votes - 100)
        };
      }
      return item;
    });

    if (type === 'leaderboard') {
      localStorage.setItem('leaderboard', JSON.stringify(updatedArray));
      setLeaderboard(updatedArray);
    } else {
      localStorage.setItem('pendingNominations', JSON.stringify(updatedArray));
      setNominations(updatedArray);
    }

    toast({
      title: "Votes updated",
      description: `Votes ${increment ? 'increased' : 'decreased'} by 100.`,
    });
  };

  const handleLawsuitChange = (id: number, increment: boolean) => {
    const updatedLeaderboard = leaderboard.map(item => {
      if (item.id === id) {
        return {
          ...item,
          lawsuitSignatures: increment 
            ? item.lawsuitSignatures + 100 
            : Math.max(0, item.lawsuitSignatures - 100)
        };
      }
      return item;
    });

    localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
    setLeaderboard(updatedLeaderboard);
    toast({
      title: "Signatures updated",
      description: `Signatures ${increment ? 'increased' : 'decreased'} by 100.`,
    });
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>
            Manage scammer entries and nominations. Only authorized administrators have access to these controls.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Twitter</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead>Signatures</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>@{item.twitterHandle}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.votes}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleVoteChange(item.id, true, 'leaderboard')}
                      >
                        <ArrowUpCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleVoteChange(item.id, false, 'leaderboard')}
                      >
                        <ArrowDownCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.lawsuitSignatures}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleLawsuitChange(item.id, true)}
                      >
                        <ArrowUpCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleLawsuitChange(item.id, false)}
                      >
                        <ArrowDownCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(item.id, 'leaderboard')}
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

      <Card>
        <CardHeader>
          <CardTitle>Nominations Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Twitter</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nominations.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>@{item.twitterHandle}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.votes}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleVoteChange(item.id, true, 'nomination')}
                      >
                        <ArrowUpCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleVoteChange(item.id, false, 'nomination')}
                      >
                        <ArrowDownCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(item.id, 'nomination')}
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
    </div>
  );
};

export default AdminDashboard;