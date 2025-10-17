import { useState, useEffect } from 'react';
import { Brain, PenLine, FileText, Wind } from 'lucide-react';
import { Card } from '@/components/ui/card';
import MoodSelector from '@/components/MoodSelector';
import { saveMoodEntry, saveActivity, getStats, getActivities, getUserName } from '@/lib/storage';
import { MoodType, Activity } from '@/types/wellness';
import { toast } from '@/hooks/use-toast';

const Home = () => {
  const [userName, setUserName] = useState('User');
  const [stats, setStats] = useState({ moodScore: 0, meditationMinutes: 0 });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setUserName(getUserName());
    loadStats();
    loadRecentActivities();
  }, []);

  const loadStats = () => {
    const userStats = getStats();
    setStats({
      moodScore: userStats.avgMood,
      meditationMinutes: userStats.totalMeditationMinutes,
    });
  };

  const loadRecentActivities = () => {
    const activities = getActivities();
    setRecentActivities(activities.slice(-2).reverse());
  };

  const handleMoodSelect = (mood: MoodType, score: number) => {
    saveMoodEntry({
      id: Date.now().toString(),
      mood,
      score,
      timestamp: new Date(),
    });
    loadStats();
    toast({
      title: 'Mood tracked!',
      description: `You're feeling ${mood} today`,
    });
  };

  const handleQuickAction = (type: 'meditation' | 'journal') => {
    const activity: Activity = {
      id: Date.now().toString(),
      type,
      title: type === 'meditation' ? '5 min Meditation' : 'Journal Entry',
      duration: type === 'meditation' ? 5 : undefined,
      timestamp: new Date(),
      completed: true,
    };
    
    saveActivity(activity);
    loadStats();
    loadRecentActivities();
    
    toast({
      title: 'Activity started!',
      description: `${type === 'meditation' ? 'Meditation session' : 'Journaling'} in progress`,
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'journal':
        return FileText;
      case 'breathing':
        return Wind;
      default:
        return Brain;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    return 'Yesterday';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-wellness p-6 rounded-3xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Hello, {userName}</h1>
            </div>
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🔔</span>
            </button>
          </div>

          {/* Quick Mood Check */}
          <div>
            <p className="text-sm text-primary-foreground mb-3">Quick mood check</p>
            <MoodSelector onMoodSelect={handleMoodSelect} />
          </div>
        </div>

        {/* Today's Summary */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Today's Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 bg-accent/10 rounded-2xl">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">💜</span>
              </div>
              <p className="text-2xl font-bold">{stats.moodScore.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Mood Score</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-success/10 rounded-2xl">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">🧘</span>
              </div>
              <p className="text-2xl font-bold">{stats.meditationMinutes}m</p>
              <p className="text-sm text-muted-foreground">Meditation</p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleQuickAction('meditation')}
              className="bg-meditation text-meditation-foreground p-6 rounded-2xl text-left transition-transform hover:scale-105 active:scale-95"
            >
              <Brain className="w-8 h-8 mb-3" />
              <p className="font-semibold mb-1">Meditation</p>
              <p className="text-sm opacity-90">5 min session</p>
            </button>
            <button
              onClick={() => handleQuickAction('journal')}
              className="bg-journal text-journal-foreground p-6 rounded-2xl text-left transition-transform hover:scale-105 active:scale-95"
            >
              <PenLine className="w-8 h-8 mb-3" />
              <p className="font-semibold mb-1">Journal</p>
              <p className="text-sm opacity-90">Write thoughts</p>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No activities yet. Start your wellness journey!
              </p>
            ) : (
              recentActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
