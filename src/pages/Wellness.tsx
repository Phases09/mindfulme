import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Play, Brain, Wind, Moon, Sun, Leaf, Check } from 'lucide-react';
import { wellnessExercises } from '@/data/exercises';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CategoryFilter = 'all' | 'meditation' | 'breathing' | 'sleep';

const Wellness = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [isExercising, setIsExercising] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const startExercise = (exerciseId: string, duration: number) => {
    setSelectedExercise(exerciseId);
    setIsExercising(true);
    setTimeRemaining(duration * 60);

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          completeExercise(exerciseId, duration);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeExercise = async (exerciseId: string, duration: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to track activities.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("wellness_activities")
      .insert({
        user_id: user.id,
        exercise_id: exerciseId,
        duration: duration,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save activity.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Completed!",
        description: "Great job! Your progress has been saved.",
      });
    }

    setIsExercising(false);
    setSelectedExercise(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'meditation', label: 'Meditation' },
    { id: 'breathing', label: 'Breathing' },
    { id: 'sleep', label: 'Sleep' },
  ];

  const filteredExercises = wellnessExercises.filter(exercise => {
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredExercise = wellnessExercises[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'brain': return Brain;
      case 'wind': return Wind;
      case 'moon': return Moon;
      case 'sun': return Sun;
      case 'leaf': return Leaf;
      default: return Brain;
    }
  };

  const handleStartExercise = (exerciseId: string, duration: number) => {
    startExercise(exerciseId, duration);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Wellness</h1>
            <p className="text-sm text-muted-foreground">Activities for your mind</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-2xl"
          />
        </div>

        {/* Featured Exercise */}
        <Card className="bg-gradient-to-br from-wellness to-success p-6 text-primary-foreground overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{featuredExercise.title}</h3>
                <p className="text-sm opacity-90 mb-1">{featuredExercise.description}</p>
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full"
                onClick={() => handleStartExercise(featuredExercise.id, featuredExercise.duration)}
              >
                <Play className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-90">{featuredExercise.duration} min</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
        </Card>

        {/* Categories */}
        <div>
          <h2 className="text-sm font-semibold mb-3">Categories</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(({ id, label }) => (
              <Button
                key={id}
                variant={selectedCategory === id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(id as CategoryFilter)}
                className="rounded-full whitespace-nowrap"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <div className="space-y-3">
          {filteredExercises.map((exercise) => {
            const Icon = getIcon(exercise.icon);
            return (
              <Card key={exercise.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{exercise.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exercise.duration} min • {exercise.description}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full flex-shrink-0"
                    onClick={() => handleStartExercise(exercise.id, exercise.duration)}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={isExercising} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Exercise in Progress</DialogTitle>
            <DialogDescription>
              Keep going! You're doing great.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="text-6xl font-bold text-primary">
              {formatTime(timeRemaining)}
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{
                  width: `${((wellnessExercises.find(e => e.id === selectedExercise)?.duration || 0) * 60 - timeRemaining) / ((wellnessExercises.find(e => e.id === selectedExercise)?.duration || 0) * 60) * 100}%`,
                }}
              />
            </div>
            {timeRemaining === 0 && (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-5 h-5" />
                <span className="font-semibold">Complete!</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wellness;
