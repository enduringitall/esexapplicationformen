import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import backgroundImage from "@/assets/background.jpg";

const Application = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    discordUsername: "",
    discordId: "",
    fullName: "",
    age: "",
    size: "",
    race: "",
    raceOther: "",
    hairType: "",
    hairTypeOther: "",
    reason: "",
    height: "",
    weight: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.discordUsername || !formData.discordId || !formData.fullName || 
        !formData.age || !formData.size || !formData.race || !formData.hairType ||
        !formData.reason || !formData.height || !formData.weight) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const finalRace = formData.race === "other" ? formData.raceOther : formData.race;
      const finalHairType = formData.hairType === "other" ? formData.hairTypeOther : formData.hairType;

      const { error } = await supabase.from("applications").insert({
        discord_username: formData.discordUsername,
        discord_id: formData.discordId,
        name: formData.fullName,
        age: parseInt(formData.age),
        size: formData.size,
        race: finalRace,
        hair_type: finalHairType,
        why_esex: formData.reason,
        height: formData.height,
        weight: formData.weight,
      });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Your application has been submitted successfully. You'll receive a DM on Discord if accepted.",
      });

      // Reset form
      setFormData({
        discordUsername: "",
        discordId: "",
        fullName: "",
        age: "",
        size: "",
        race: "",
        raceOther: "",
        hairType: "",
        hairTypeOther: "",
        reason: "",
        height: "",
        weight: "",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div>
          <h1 className="text-4xl font-bold esex-gradient">ESEX</h1>
          <p className="text-sm text-muted-foreground">APPLICATION PORTAL</p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 esex-gradient font-semibold"
            onClick={() => window.location.reload()}
          >
            Apply
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 esex-gradient font-semibold"
            onClick={() => navigate("/admin")}
          >
            Admin
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-6 py-8">
        <Card className="w-full max-w-2xl form-container">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-primary mb-2 esex-gradient">Application Form</h1>
              <p className="text-muted-foreground">Complete your application below</p>
            </div>

            {/* Warning Notice */}
            <div className="warning-box rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
              <div className="text-sm text-white">
                <p className="font-semibold mb-1">Just a heads up!</p>
                <p>If you don't whimper, DO NOT fill out this form because you are literally useless. I also check forms every day, so wait patiently. I will DM you on Discord if you've been accepted or not.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="discordUsername" className="text-white">Discord Username:</Label>
                  <Input
                    id="discordUsername"
                    value={formData.discordUsername}
                    onChange={(e) => handleInputChange("discordUsername", e.target.value)}
                    className="bg-input border-border text-white placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discordId" className="text-white">Discord ID:</Label>
                  <Input
                    id="discordId"
                    value={formData.discordId}
                    onChange={(e) => handleInputChange("discordId", e.target.value)}
                    className="bg-input border-border text-white placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">Your Name:</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="bg-input border-border text-white placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-white">How old are you?</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="bg-input border-border text-white placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size" className="text-white">How big is it?</Label>
                <Select value={formData.size} onValueChange={(value) => handleInputChange("size", value)}>
                  <SelectTrigger className="bg-input border-border text-white">
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="below-1">Below 1 inch</SelectItem>
                    <SelectItem value="2-inches">2 inches</SelectItem>
                    <SelectItem value="3-inches">3 inches</SelectItem>
                    <SelectItem value="4-inches">4 inches</SelectItem>
                    <SelectItem value="5-inches">5 inches</SelectItem>
                    <SelectItem value="6-inches">6 inches</SelectItem>
                    <SelectItem value="7-inches">7 inches</SelectItem>
                    <SelectItem value="8-plus">8+ inches</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="race" className="text-white">Race:</Label>
                <Select value={formData.race} onValueChange={(value) => handleInputChange("race", value)}>
                  <SelectTrigger className="bg-input border-border text-white">
                    <SelectValue placeholder="Select your race" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="hispanic">Hispanic</SelectItem>
                    <SelectItem value="lightskin">Lightskin</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="asian">Asian</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {formData.race === "other" && (
                  <Input
                    placeholder="Please specify..."
                    value={formData.raceOther}
                    onChange={(e) => handleInputChange("raceOther", e.target.value)}
                    className="bg-input border-border text-white placeholder:text-muted-foreground mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hairType" className="text-white">Hair Type:</Label>
                <Select value={formData.hairType} onValueChange={(value) => handleInputChange("hairType", value)}>
                  <SelectTrigger className="bg-input border-border text-white">
                    <SelectValue placeholder="Select your hair type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="curly">Curly</SelectItem>
                    <SelectItem value="straight">Straight</SelectItem>
                    <SelectItem value="dreads">Dreads</SelectItem>
                    <SelectItem value="afro">Afro</SelectItem>
                    <SelectItem value="twist">Twist</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {formData.hairType === "other" && (
                  <Input
                    placeholder="Please specify..."
                    value={formData.hairTypeOther}
                    onChange={(e) => handleInputChange("hairTypeOther", e.target.value)}
                    className="bg-input border-border text-white placeholder:text-muted-foreground mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-white">Why do you want to have esex with me?</Label>
                <Textarea
                  id="reason"
                  placeholder="Tell me why..."
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  className="bg-input border-border text-white placeholder:text-muted-foreground min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-white">How tall are you?</Label>
                  <Input
                    id="height"
                    placeholder="e.g., 5'8&quot; or 173cm"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    className="bg-input border-border text-white placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-white">What's your weight?</Label>
                  <Input
                    id="weight"
                    placeholder="e.g., 150 lbs or 68kg"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    className="bg-input border-border text-white placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-button-primary hover:bg-button-primary-hover text-white font-semibold py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Application;