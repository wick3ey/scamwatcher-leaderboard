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
  onSubmit?: () => Promise<void>;
}

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [legalConsent, setLegalConsent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);
  const { session, signIn } = useAuth();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string, countryCode: string) => {
    // Remove any non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Basic length check (most phone numbers are between 8 and 15 digits)
    if (cleanNumber.length < 8 || cleanNumber.length > 15) {
      return false;
    }

    // Country-specific validation could be added here
    return true;
  };

  const validateWalletAddress = (address: string) => {
    // Solana address validation (base58, 32-44 characters)
    const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    
    // Ethereum address validation (0x followed by 40 hex characters)
    const ethRegex = /^0x[a-fA-F0-9]{40}$/;
    
    // Solana token address ending with PUMP
    const solanaPumpRegex = /^[1-9A-HJ-NP-Za-km-z]+PUMP$/;

    return solanaRegex.test(address) || ethRegex.test(address) || solanaPumpRegex.test(address);
  };

  const validateAmount = (amount: string) => {
    // Check if it's a valid number and greater than 0
    const numAmount = Number(amount);
    return !isNaN(numAmount) && numAmount > 0;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.country) {
      newErrors.country = "Country is required";
    }

    // Email validation
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!validatePhoneNumber(formData.phoneNumber, formData.phoneCode)) {
      newErrors.phoneNumber = "Please enter a valid phone number for your country";
    }

    // Wallet address validation
    if (!validateWalletAddress(formData.walletAddress)) {
      newErrors.walletAddress = "Please enter a valid Solana or Ethereum wallet address";
    }

    // Amount validation
    if (!validateAmount(formData.amountLost)) {
      newErrors.amountLost = "Please enter a valid amount greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
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
                className={`bg-secondary/30 ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={handleChange("lastName")}
                required
                className={`bg-secondary/30 ${errors.lastName ? 'border-red-500' : ''}`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
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
              className={`bg-secondary/30 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <div className="relative">
              <Input
                value={formData.country}
                onClick={() => setShowCountryList(true)}
                readOnly
                placeholder="Select your country"
                className={`bg-secondary/30 cursor-pointer ${errors.country ? 'border-red-500' : ''}`}
              />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country}</p>
              )}
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
                          if (errors.country) {
                            setErrors(prev => ({ ...prev, country: "" }));
                          }
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
                className={`flex-1 bg-secondary/30 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                placeholder="Phone number"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input
              id="wallet"
              value={formData.walletAddress}
              onChange={handleChange("walletAddress")}
              required
              className={`bg-secondary/30 ${errors.walletAddress ? 'border-red-500' : ''}`}
              placeholder="Solana or Ethereum wallet address"
            />
            {errors.walletAddress && (
              <p className="text-sm text-red-500">{errors.walletAddress}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount Lost (USD)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amountLost}
              onChange={handleChange("amountLost")}
              required
              className={`bg-secondary/30 ${errors.amountLost ? 'border-red-500' : ''}`}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            {errors.amountLost && (
              <p className="text-sm text-red-500">{errors.amountLost}</p>
            )}
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