'use client';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Stats } from '@/lib/data';

type StatsRadarChartProps = {
  stats: Stats;
};

export const StatsRadarChart = ({ stats }: StatsRadarChartProps) => {
  const data = Object.entries(stats).map(([name, value]) => ({
    subject: name.charAt(0).toUpperCase() + name.slice(1),
    value: value,
  }));

  return (
    <Card className="bg-card/50 border-accent/20 shadow-lg shadow-accent/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl glowing-text-accent">Player Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <defs>
                <linearGradient id="radar-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <PolarGrid stroke="hsl(var(--border) / 0.5)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
              <Radar name="Stats" dataKey="value" stroke="hsl(var(--accent))" fill="url(#radar-fill)" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
