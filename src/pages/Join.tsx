import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

const Join = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    contactAddress: "",
    nextOfKin: "",
    businessName: "",
    businessType: "",
    whyJoin: "",
    membershipPlan: "starter" as "starter" | "pro",
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.membershipPlan) {
      toast({
        title: "Please select a membership plan",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("join_applications").insert({
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        email: formData.email,
        contact_address: formData.contactAddress,
        next_of_kin: formData.nextOfKin,
        business_name: formData.businessName,
        business_type: formData.businessType,
        why_join: formData.whyJoin,
        membership_plan: formData.membershipPlan,
      });

      if (error) throw error;

      setStep(3);
      toast({
        title: "Application submitted successfully!",
        description: "Please send your payment proof to complete the process.",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-background py-20 px-4 flex items-center justify-center">
        <Card className="max-w-2xl w-full p-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary mb-4">
            One More Step!
          </h2>
          <p className="text-foreground/80 mb-6">
            Please send the following to complete your application:
          </p>
          <div className="bg-secondary/20 p-6 rounded-lg mb-6 text-left">
            <ul className="space-y-2 text-foreground/80">
              <li>• Your photo</li>
              <li>• Payment evidence/receipt</li>
            </ul>
          </div>
          <div className="bg-primary/5 p-6 rounded-lg mb-8">
            <p className="text-sm text-foreground/60 mb-2">Send via WhatsApp to:</p>
            <a
              href="https://wa.me/2349127545291"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold text-primary hover:underline"
            >
              +234 912 754 5291
            </a>
          </div>
          <p className="text-sm text-foreground/60 mb-6">
            <strong>Important:</strong> Your application may be rejected if incomplete or requirements are not met.
          </p>
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="w-full"
          >
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    const planDetails = {
      starter: {
        price: "₦2,900",
        name: "Starter",
        benefits: [
          "Basic membership in ZAMWE",
          "Access to community resources",
          "Newsletter and updates",
          "Network with fellow entrepreneurs",
        ],
      },
      pro: {
        price: "₦5,900",
        name: "Pro",
        benefits: [
          "All Starter benefits",
          "High-rank official membership",
          "Invitation to official meetings",
          "Priority access to workshops",
          "Featured member spotlight",
          "Mentorship opportunities",
          "Exclusive networking events",
        ],
      },
    };

    const selected = planDetails[formData.membershipPlan];

    return (
      <div className="min-h-screen bg-background py-20 px-4">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <h1 className="text-4xl font-serif font-bold text-primary mb-8 text-center">
            Payment Information
          </h1>
          <Card className="p-8 mb-6">
            <div className="text-center mb-6">
              <div className="text-sm text-foreground/60 mb-2">Selected Plan</div>
              <div className="text-3xl font-bold text-primary mb-1">{selected.name}</div>
              <div className="text-4xl font-bold text-foreground mb-4">{selected.price}</div>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <ul className="text-left space-y-2 text-sm">
                  {selected.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4 text-center">Bank Transfer Details</h3>
              <div className="bg-primary/5 p-4 rounded-lg space-y-2 text-center">
                <div>
                  <div className="text-sm text-foreground/60">Account Number</div>
                  <div className="text-2xl font-bold text-primary">1229986982</div>
                </div>
                <div>
                  <div className="text-sm text-foreground/60">Account Name</div>
                  <div className="font-semibold">Zamfara Women Entrepreneurs Association</div>
                </div>
                <div>
                  <div className="text-sm text-foreground/60">Bank</div>
                  <div className="font-semibold">Zenith Bank</div>
                </div>
                <div>
                  <div className="text-sm text-foreground/60">Amount</div>
                  <div className="text-xl font-bold text-primary">{selected.price}</div>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleConfirmPayment}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Processing..." : "I Have Sent the Money"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4 text-center">
          Join ZAMWE
        </h1>
        <p className="text-center text-foreground/80 mb-8">
          Become part of a community empowering women entrepreneurs across Zamfara
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  required
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contactAddress">Contact Address *</Label>
                <Textarea
                  id="contactAddress"
                  required
                  value={formData.contactAddress}
                  onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="nextOfKin">Next of Kin *</Label>
                <Input
                  id="nextOfKin"
                  required
                  value={formData.nextOfKin}
                  onChange={(e) => setFormData({ ...formData, nextOfKin: e.target.value })}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Business Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="businessType">Type of Business *</Label>
                <Input
                  id="businessType"
                  required
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="whyJoin">Why do you want to join ZAMWE? *</Label>
                <Textarea
                  id="whyJoin"
                  required
                  rows={4}
                  value={formData.whyJoin}
                  onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Choose Your Plan *</h2>
            <RadioGroup
              value={formData.membershipPlan}
              onValueChange={(value: "starter" | "pro") =>
                setFormData({ ...formData, membershipPlan: value })
              }
              className="space-y-4"
            >
              <Card className={`p-4 cursor-pointer transition-all ${
                formData.membershipPlan === "starter" ? "border-primary border-2" : ""
              }`}>
                <div className="flex items-start gap-4">
                  <RadioGroupItem value="starter" id="starter" className="mt-1" />
                  <Label htmlFor="starter" className="flex-1 cursor-pointer">
                    <div className="font-semibold text-lg">Starter - ₦2,900</div>
                    <p className="text-sm text-foreground/70 mt-1">
                      Join the ZAMWE organization with basic membership benefits
                    </p>
                  </Label>
                </div>
              </Card>

              <Card className={`p-4 cursor-pointer transition-all ${
                formData.membershipPlan === "pro" ? "border-primary border-2" : ""
              }`}>
                <div className="flex items-start gap-4">
                  <RadioGroupItem value="pro" id="pro" className="mt-1" />
                  <Label htmlFor="pro" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">Pro - ₦5,900</span>
                      <span className="text-xs bg-accent px-2 py-1 rounded">RECOMMENDED</span>
                    </div>
                    <p className="text-sm text-foreground/70 mt-1">
                      High-rank membership with official meeting invitations, priority access to all programs, mentorship opportunities, and exclusive networking events
                    </p>
                  </Label>
                </div>
              </Card>
            </RadioGroup>
          </Card>

          <Button type="submit" size="lg" className="w-full">
            Continue to Payment
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Join;
