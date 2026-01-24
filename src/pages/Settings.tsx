import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, MapPin, Briefcase, User, Shield, Moon, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/useAuth";

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState([24]);
  const [preferredRegion, setPreferredRegion] = useState("all");
  const [preferredLevel, setPreferredLevel] = useState("all");
  const [salaryRange, setSalaryRange] = useState([20000, 80000]);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("en");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        {/* Account Section */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <User className="w-4 h-4 text-primary" />
              Account
            </div>
          </div>
          <div className="p-4 space-y-4">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Signed in</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Not signed in</p>
                  <p className="text-sm text-muted-foreground">Sign in to save preferences</p>
                </div>
                <Button size="sm" onClick={() => navigate("/")}>
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Bell className="w-4 h-4 text-primary" />
              Notifications
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Get notified about new jobs</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Alerts</p>
                <p className="text-sm text-muted-foreground">Weekly job digest</p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
          </div>
        </section>

        {/* Job Preferences Section */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Briefcase className="w-4 h-4 text-primary" />
              Job Preferences
            </div>
          </div>
          <div className="p-4 space-y-5">
            <div>
              <label className="block font-medium text-foreground mb-2">Preferred Region</label>
              <Select value={preferredRegion} onValueChange={setPreferredRegion}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All of Wales</SelectItem>
                  <SelectItem value="north">North Wales</SelectItem>
                  <SelectItem value="mid">Mid Wales</SelectItem>
                  <SelectItem value="south">South Wales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block font-medium text-foreground mb-2">Entry Level Preference</label>
              <Select value={preferredLevel} onValueChange={setPreferredLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="easy">Easy Entry (No experience)</SelectItem>
                  <SelectItem value="moderate">Moderate (Some experience)</SelectItem>
                  <SelectItem value="difficult">Competitive (Experienced)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block font-medium text-foreground mb-2">
                Salary Range: £{salaryRange[0].toLocaleString()} - £{salaryRange[1].toLocaleString()}
              </label>
              <div className="pt-2">
                <Slider
                  value={salaryRange}
                  onValueChange={setSalaryRange}
                  min={15000}
                  max={150000}
                  step={5000}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>£15k</span>
                <span>£150k+</span>
              </div>
            </div>
          </div>
        </section>

        {/* Auto-Refresh Section */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Zap className="w-4 h-4 text-primary" />
              Auto-Refresh Jobs
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Auto-Refresh</p>
                <p className="text-sm text-muted-foreground">Automatically fetch new jobs</p>
              </div>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
            {autoRefresh && (
              <div>
                <label className="block font-medium text-foreground mb-2">
                  Refresh Every: {refreshInterval[0]} hours
                </label>
                <Slider
                  value={refreshInterval}
                  onValueChange={setRefreshInterval}
                  min={1}
                  max={48}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 hour</span>
                  <span>48 hours</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Map Settings */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              Map Settings
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Show City Labels</p>
                <p className="text-sm text-muted-foreground">Display city names on map</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Animate Markers</p>
                <p className="text-sm text-muted-foreground">Show glowing effects</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Show Job Count Badges</p>
                <p className="text-sm text-muted-foreground">Display count on hover</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Moon className="w-4 h-4 text-primary" />
              Appearance
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Use dark theme</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <div>
              <label className="block font-medium text-foreground mb-2">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="cy">Cymraeg (Welsh)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Shield className="w-4 h-4 text-primary" />
              Privacy & Security
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Analytics</p>
                <p className="text-sm text-muted-foreground">Help improve the app</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Location Access</p>
                <p className="text-sm text-muted-foreground">Show jobs near you</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </section>

        {/* App Info */}
        <section className="text-center text-sm text-muted-foreground py-4">
          <p>PathwayWales v1.0.0</p>
          <p className="mt-1">Made with ❤️ for Wales</p>
        </section>
      </main>
    </div>
  );
};

export default Settings;
