import { Twitter, Mail, Github, Linkedin } from "lucide-react";
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
            className="rounded-full hover:bg-primary/20 p-3 transition-all duration-300"
            asChild
          >
            <a
              href="https://twitter.com/scamwatcher"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="group"
            >
              <Twitter className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
            </a>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="rounded-full hover:bg-primary/20 p-3 transition-all duration-300"
            asChild
          >
            <a
              href="https://github.com/scamwatcher"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Github"
              className="group"
            >
              <Github className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
            </a>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="rounded-full hover:bg-primary/20 p-3 transition-all duration-300"
            asChild
          >
            <a
              href="https://linkedin.com/company/scamwatcher"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="group"
            >
              <Linkedin className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
            </a>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="rounded-full hover:bg-primary/20 p-3 transition-all duration-300"
            asChild
          >
            <a
              href="mailto:contact@scamwatcher.com"
              aria-label="Email"
              className="group"
            >
              <Mail className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
            </a>
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