import { Twitter, Mail, Send } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="mt-12 pb-6">
      <div className="glass-card p-8 flex flex-col items-center gap-6">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
          Follow us on social media
        </h3>
        
        <div className="flex justify-center gap-6">
          <Button
            variant="ghost"
            size="lg"
            className="rounded-full hover:bg-primary/20 p-3 transition-all duration-300 cursor-not-allowed opacity-50"
            disabled
          >
            <Twitter className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="rounded-full hover:bg-primary/20 p-3 transition-all duration-300 cursor-not-allowed opacity-50"
            disabled
          >
            <Send className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="rounded-full hover:bg-primary/20 p-3 transition-all duration-300 cursor-not-allowed opacity-50"
            disabled
          >
            <Mail className="h-8 w-8" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mt-4">
          <p>© {new Date().getFullYear()} RugBuster. All rights reserved.</p>
          <p className="mt-1">Protecting Web3 investors from rug pulls</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;