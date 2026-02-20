'use client';
import { ActivityCharts } from "@/components/dashboard/activity-charts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { initialPlayerData, personalBests } from "@/lib/data";
import { Flame } from "lucide-react";

export default function StreaksPage() {
  const currentStreak = initialPlayerData.streak;
  const longestStreak = personalBests.find(b => b.title === 'Longest Streak')?.value || '0 days';

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold font-headline tracking-tighter">Streaks & Consistency</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="text-center h-full flex flex-col justify-center bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-muted-foreground">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4">
                <Flame className="h-16 w-16 text-orange-400 animate-fire-flicker" />
                <span className="text-7xl font-bold font-headline text-orange-300 glowing-text-primary">{currentStreak}</span>
              </div>
              <p className="text-muted-foreground mt-2">days</p>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
           <Card className="bg-card/50 border-border/50 h-full">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Longest Streak</CardTitle>
              <CardDescription>Your personal best for consistency.</CardDescription>
            </CardHeader>
            <CardContent className="text-center flex flex-col items-center justify-center h-full pb-6">
                 <span className="text-6xl font-bold font-headline text-primary glowing-text-primary">{longestStreak.split(' ')[0]}</span>
                 <p className="text-muted-foreground">days</p>
            </CardContent>
          </Card>
        </div>
      </div>
       <ActivityCharts />
    </div>
  );
}
