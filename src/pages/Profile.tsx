import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Bell, Shield, HelpCircle, Info, Trophy, LogOut } from 'lucide-react';
import { getStats, getAchievements, getMemberSince } from '@/lib/storage';
import { UserStats } from '@/types/wellness';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const [userName, setUserName] = useState('User');
  const [memberSince, setMemberSince] = useState('');
  const [stats, setStats] = useState<UserStats>({
    totalSessions: 0,
    dayStreak: 0,
    avgMood: 0,
    totalMeditationMinutes: 0,
  });
  const [achievements, setAchievements] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      
      if (profile?.full_name) {
        setUserName(profile.full_name);
      }
    }

    const since = getMemberSince();
    const date = new Date(since);
    setMemberSince(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
    
    const userStats = getStats();
    setStats(userStats);
    
    const userAchievements = getAchievements();
    setAchievements(userAchievements);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  const settingsItems = [
    { icon: Bell, label: 'Notifications', action: () => {} },
    { icon: Shield, label: 'Privacy', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
    { icon: Info, label: 'About', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center pt-6">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-accent to-meditation rounded-full flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">{userName}</h1>
          <p className="text-sm text-muted-foreground">Member since {memberSince}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold mb-1">{stats.totalSessions}</p>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold mb-1">{stats.dayStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold mb-1">{stats.avgMood.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Avg Mood</p>
          </Card>
        </div>

        {/* Recent Achievements */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Achievements</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-xl">
              <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">7-Day Streak</p>
                <p className="text-sm text-muted-foreground">Completed daily check-ins</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-meditation/10 rounded-xl">
              <div className="w-10 h-10 bg-meditation/20 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-meditation" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Mindful Master</p>
                <p className="text-sm text-muted-foreground">50 meditation sessions</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <div className="space-y-1">
            {settingsItems.map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-destructive/10 transition-colors text-destructive"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
