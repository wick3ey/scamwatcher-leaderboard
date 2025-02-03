import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { GavelIcon, Search } from "lucide-react";
import countries from "../data/countries";

interface SignLawsuitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scammerName: string;
}

export function SignLawsuitDialog({ open, onOpenChange, scammerName }: SignLawsuitDialogProps) {
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

  const [searchQuery, setSearchQuery] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);

  const { toast } = useToast();

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Lawsuit signature submitted",
      description: "Thank you for joining the lawsuit. We will contact you with further details.",
    });
    onOpenChange(false);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

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

          <Button type="submit" className="w-full">
            <GavelIcon className="mr-2 h-4 w-4" />
            Sign Lawsuit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}