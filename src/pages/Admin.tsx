import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import backgroundImage from "@/assets/background.jpg";

interface Application {
  id: string;
  discord_username: string;
  discord_id: string;
  name: string;
  age: number;
  size: string;
  race: string;
  hair_type: string;
  why_esex: string;
  height: string;
  weight: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in (simple session storage check)
    const adminSession = sessionStorage.getItem("adminLoggedIn");
    if (adminSession === "true") {
      setIsLoggedIn(true);
      loadApplications();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);

    try {
      // Simple client-side verification for demo purposes
      if (username === "condemnable" && password === "esexwarrior123") {

        setIsLoggedIn(true);
        sessionStorage.setItem("adminLoggedIn", "true");
        toast({
          title: "Login Successful",
          description: "Welcome to the admin portal.",
        });
        loadApplications();
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLogging(false);
    }
  };

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setApplications(data || []);
    } catch (error) {
      console.error("Error loading applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("adminLoggedIn");
    setApplications([]);
    setUsername("");
    setPassword("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!isLoggedIn) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-6">
          <div>
            <h1 className="text-4xl font-bold esex-gradient">ESEX</h1>
            <p className="text-sm text-muted-foreground">APPLICATION PORTAL</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 esex-gradient font-semibold"
              onClick={() => navigate("/")}
            >
              Apply
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 esex-gradient font-semibold"
            >
              Admin
            </Button>
          </div>
        </header>

        <Card className="w-full max-w-md form-container">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold esex-gradient mb-2">Admin Access</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username:</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-input border-border text-white placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password:</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border text-white placeholder:text-muted-foreground"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-button-primary hover:bg-button-primary-hover text-white font-semibold py-3"
                disabled={isLogging}
              >
                {isLogging ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm">
        <div>
          <h1 className="text-4xl font-bold esex-gradient">ESEX</h1>
          <p className="text-sm text-muted-foreground">ADMIN PORTAL</p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 esex-gradient font-semibold"
            onClick={() => navigate("/")}
          >
            Apply
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 esex-gradient font-semibold"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Applications</h2>
          <Button 
            onClick={loadApplications}
            disabled={isLoading}
            className="bg-button-primary hover:bg-button-primary-hover"
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="grid gap-6">
          {applications.length === 0 ? (
            <Card className="form-container">
              <CardContent className="p-8 text-center">
                <p className="text-white text-lg">No applications found.</p>
              </CardContent>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app.id} className="form-container">
                <CardHeader>
                <CardTitle className="text-white flex justify-between items-center">
                  <span>{app.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(app.created_at)}
                  </span>
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                    <div>
                      <strong>Discord:</strong> {app.discord_username} ({app.discord_id})
                    </div>
                    <div>
                      <strong>Age:</strong> {app.age}
                    </div>
                    <div>
                      <strong>Size:</strong> {app.size}
                    </div>
                    <div>
                      <strong>Race:</strong> {app.race}
                    </div>
                    <div>
                      <strong>Hair Type:</strong> {app.hair_type}
                    </div>
                    <div>
                      <strong>Height:</strong> {app.height}
                    </div>
                    <div>
                      <strong>Weight:</strong> {app.weight}
                    </div>
                  </div>
                  <div className="text-white">
                    <strong>Why esex:</strong>
                    <p className="mt-2 p-3 bg-black/30 rounded-lg">{app.why_esex}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;