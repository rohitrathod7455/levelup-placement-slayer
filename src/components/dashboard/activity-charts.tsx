'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { weeklyActivity } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Tooltip as ShadTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';

const WeeklyActivityChart = () => {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Weekly Activity</CardTitle>
        <CardDescription>XP Gained per Day</CardDescription>
      </CardHeader>
      <CardContent className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyActivity}>
             <defs>
                <linearGradient id="bar-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
            <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={value => `${value}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Bar dataKey="xp" fill="url(#bar-fill)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ProgressHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState<Array<{date: string, count: number}>>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const data = Array.from({ length: 365 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 365 + i);
      return {
          date: date.toISOString().slice(0, 10),
          count: Math.floor(Math.random() * 150),
      };
    });
    setHeatmapData(data);
  }, []);

  const getDotColor = (count: number) => {
    if (count === 0) return 'bg-muted/20';
    if (count < 20) return 'bg-primary/20';
    if (count < 50) return 'bg-primary/40';
    if (count < 100) return 'bg-primary/70';
    return 'bg-primary';
  };
  
  if (!isClient) {
    return (
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Yearly Progress</CardTitle>
          <CardDescription>Visual representation of your grind.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 lg:grid-cols-20 xl:grid-cols-26 gap-1 animate-pulse">
            {Array.from({ length: 365 }).map((_, i) => (
              <div key={i} className="h-3 w-3 rounded-sm bg-muted/20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Yearly Progress</CardTitle>
        <CardDescription>Visual representation of your grind.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 lg:grid-cols-20 xl:grid-cols-26 gap-1">
            {heatmapData.map(day => (
              <ShadTooltip key={day.date}>
                <TooltipTrigger asChild>
                  <div className={cn('h-3 w-3 rounded-sm', getDotColor(day.count))} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{day.count} XP on {day.date}</p>
                </TooltipContent>
              </ShadTooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export const ActivityCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <WeeklyActivityChart />
      <ProgressHeatmap />
    </div>
  );
};
