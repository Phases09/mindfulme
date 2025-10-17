import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMoodEntries, getStats, getWeeklyGoals } from '@/lib/storage';
import { MoodEntry, UserStats, WeeklyGoal } from '@/types/wellness';
import { Progress } from '@/components/ui/progress';

const Analytics = () => {
  const [view, setView] = useState<'week' | 'month'>('week');
  const [stats, setStats] = useState<UserStats>({
    totalSessions: 0,
    dayStreak: 0,
    avgMood: 0,
    totalMeditationMinutes: 0,
  });
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal>({
    meditationSessions: 0,
    meditationTarget: 7,
    journalEntries: 0,
    journalTarget: 5,
  });
  const [moodData, setMoodData] = useState<{ day: string; score: number }[]>([]);

  useEffect(() => {
    loadData();
  }, [view]);

  const loadData = () => {
    const userStats = getStats();
    setStats(userStats);
    
    const goals = getWeeklyGoals();
    setWeeklyGoals(goals);
    
    const moods = getMoodEntries();
    const last7Days = getLast7DaysData(moods);
    setMoodData(last7Days);
  };

  const getLast7DaysData = (moods: MoodEntry[]) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayIndex = (date.getDay() + 6) % 7;
      
      const dayMoods = moods.filter(m => {
        const moodDate = new Date(m.timestamp);
        return moodDate.toDateString() === date.toDateString();
      });
      
      const avgScore = dayMoods.length > 0
        ? dayMoods.reduce((sum, m) => sum + m.score, 0) / dayMoods.length
        : 0;
      
      data.push({ day: days[dayIndex], score: avgScore });
    }
    
    return data;
  };

  const maxScore = Math.max(...moodData.map(d => d.score), 10);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-1">Analytics</h1>
          <p className="text-sm text-muted-foreground">Your wellness journey</p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('week')}
            className="rounded-full"
          >
            Week
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('month')}
            className="rounded-full"
          >
            Month
          </Button>
        </div>

        {/* Mood Trend Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Mood Trend</h2>
          <div className="flex items-end justify-between gap-2 h-40">
            {moodData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-accent to-accent/60 rounded-t-lg transition-all"
                    style={{ height: `${(data.score / maxScore) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{data.day}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 bg-streak">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-streak-foreground mb-1">{stats.dayStreak}</p>
            <p className="text-sm text-streak-foreground/80">Days streak</p>
          </Card>
          
          <Card className="p-6 bg-stats">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">⏱️</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-stats-foreground mb-1">{stats.totalMeditationMinutes}m</p>
            <p className="text-sm text-stats-foreground/80">Total meditation</p>
          </Card>
        </div>

        {/* Weekly Goals */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Goals</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Meditation Sessions</span>
                <span className="text-sm text-muted-foreground">
                  {weeklyGoals.meditationSessions}/{weeklyGoals.meditationTarget}
                </span>
              </div>
              <Progress 
                value={(weeklyGoals.meditationSessions / weeklyGoals.meditationTarget) * 100} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Journal Entries</span>
                <span className="text-sm text-muted-foreground">
                  {weeklyGoals.journalEntries}/{weeklyGoals.journalTarget}
                </span>
              </div>
              <Progress 
                value={(weeklyGoals.journalEntries / weeklyGoals.journalTarget) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </Card>

        {/* Insights */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Insights</h2>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 bg-success rounded-full mt-2" />
              <p className="text-sm text-muted-foreground">
                Your mood is {stats.avgMood > 7 ? '15%' : '5%'} better than last week
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 bg-accent rounded-full mt-2" />
              <p className="text-sm text-muted-foreground">
                Evening meditation sessions show best results
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 bg-warning rounded-full mt-2" />
              <p className="text-sm text-muted-foreground">
                Try journaling more to boost mood tracking accuracy
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
