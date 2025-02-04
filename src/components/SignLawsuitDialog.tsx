import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GavelIcon, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import countries from "../data/countries";

interface SignLawsuitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scammerName: string;
  onSubmit?: () => Promise<void>; // Make onSubmit optional
}

// ... keep existing code (form data state and handlers)

export function SignLawsuitDialog({ open, onOpenChange, scammerName, onSubmit }: SignLawsuitDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    phoneCode: "",
    phoneNumber: "",
    walletAddress: "",
    amountLost: "",
  });
  const [legalConsent, setLegalConsent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);
  const { session, signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in with Google to sign the lawsuit",
      });
      await signIn();
      return;
    }

    if (!legalConsent) {
      toast({
        title: "Legal consent required",
        description: "Please read and accept the legal terms before proceeding",
        variant: "destructive",
      });
      return;
    }

    if (onSubmit) {
      await onSubmit();
    }

    toast({
      title: "Lawsuit signature submitted",
      description: "Thank you for joining the lawsuit. Our legal team will contact you with further details.",
    });
    onOpenChange(false);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GavelIcon className="h-5 w-5 text-primary" />
            Sign Lawsuit Against {scammerName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={handleChange("firstName")}
                required
                className="bg-secondary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={handleChange("lastName")}
                required
                className="bg-secondary/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              required
              className="bg-secondary/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <div className="relative">
              <Input
                value={formData.country}
                onClick={() => setShowCountryList(true)}
                readOnly
                placeholder="Select your country"
                className="bg-secondary/30 cursor-pointer"
              />
              {showCountryList && (
                <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Search countries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-secondary/30"
                      autoFocus
                    />
                  </div>
                  <ScrollArea className="h-[200px]">
                    {filteredCountries.map((country) => (
                      <div
                        key={country.code}
                        className="flex items-center space-x-2 p-2 hover:bg-secondary/30 cursor-pointer"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            country: country.name,
                            phoneCode: country.phoneCode
                          }));
                          setShowCountryList(false);
                          setSearchQuery("");
                        }}
                      >
                        <span className="w-8 text-xl">{country.flag}</span>
                        <span>{country.name}</span>
                        <span className="text-muted-foreground ml-auto">
                          {country.phoneCode}
                        </span>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex gap-2">
              <Input
                value={formData.phoneCode}
                readOnly
                className="w-[100px] bg-secondary/30"
                placeholder="+1"
              />
              <Input
                id="phone"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange("phoneNumber")}
                required
                className="flex-1 bg-secondary/30"
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input
              id="wallet"
              value={formData.walletAddress}
              onChange={handleChange("walletAddress")}
              required
              className="bg-secondary/30"
              placeholder="Solana wallet address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount Lost (USD)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amountLost}
              onChange={handleChange("amountLost")}
              required
              className="bg-secondary/30"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-4 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="legal-consent"
                checked={legalConsent}
                onCheckedChange={(checked) => setLegalConsent(checked as boolean)}
                className="mt-1"
              />
              <div className="space-y-1">
                <label
                  htmlFor="legal-consent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Legal Consent
                </label>
                <p className="text-sm text-muted-foreground">
                  I understand and agree that by submitting this form:
                  <br />• My information will be shared with our partnered law firm
                  <br />• I may be contacted regarding the lawsuit
                  <br />• All provided information is accurate and true
                  <br />• I consent to participate in legal proceedings if necessary
                </p>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            <GavelIcon className="mr-2 h-4 w-4" />
            Sign Lawsuit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
