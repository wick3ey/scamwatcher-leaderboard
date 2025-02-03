import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function UserMenu() {
  const { session, signIn, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user) return;

      const { data: adminData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      setIsAdmin(!!adminData);
    };

    checkAdminStatus();
  }, [session]);

  if (!session) {
    return (
      <Button variant="outline" onClick={() => signIn()}>
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <User className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin">Admin Dashboard</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => signOut()}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}