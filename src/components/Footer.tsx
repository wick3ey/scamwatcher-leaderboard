import { Twitter, Mail } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="mt-12 pb-6">
      <div className="flex justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-primary/20"
          asChild
        >
          <a
            href="https://twitter.com/scamwatcher"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-primary/20"
          asChild
        >
          <a
            href="mailto:contact@scamwatcher.com"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </footer>
  );
};

export default Footer;