'use client';

import { dailyPersonalizedFireQuote } from '@/ai/flows/daily-personalized-fire-quote';
import { performanceInsightAndSuggestions } from '@/ai/flows/performance-insight-and-suggestions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { achievements, personalBests, Player } from '@/lib/data';
import { ArrowUp, Flame, Star, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';

const iconMap: { [key: string]: React.ElementType } = { ArrowUp, Flame, Star };

const PersonalBestsCard = () => (
  <Card className="bg-card/50 border-border/50">
    <CardHeader>
      <CardTitle className="font-headline text-xl">Personal Bests</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {personalBests.map(best => {
        const Icon = iconMap[best.icon];
        return (
          <div key={best.title} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="w-4 h-4" />
              <span>{best.title}</span>
            </div>
            <span className="font-bold text-foreground">{best.value}</span>
          </div>
        );
      })}
    </CardContent>
  </Card>
);

const AchievementsCard = () => (
  <Card className="bg-card/50 border-border/50">
    <CardHeader>
      <CardTitle className="font-headline text-xl">Achievements</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-2 gap-4">
      {achievements.map(ach => (
        <div key={ach.id} className="flex flex-col items-center text-center gap-2 p-2 rounded-md bg-muted/30">
          <span className="text-3xl">{ach.icon}</span>
          <span className="text-xs font-bold">{ach.title}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

const FireQuoteCard = ({ player }: { player: Player }) => {
    const [quote, setQuote] = useState({ quote: "The weak beg for results. The strong build them.", author: "The System" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getQuote() {
            try {
                const res = await dailyPersonalizedFireQuote({
                    playerName: player.name,
                    level: player.level,
                    rank: player.rank,
                    xpGainedToday: 150, // Mock data
                    currentStreakDays: player.streak,
                });
                setQuote(res);
            } catch (e) {
                console.error("Failed to generate fire quote:", e);
            } finally {
                setLoading(false);
            }
        }
        getQuote();
    }, [player]);

    return (
        <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 text-center">
            <CardContent className="p-6">
                {loading ? (
                    <div className="h-20 animate-pulse bg-muted/50 rounded-md"></div>
                ) : (
                    <>
                        <p className="text-lg font-semibold font-headline animate-fire-flicker text-primary-foreground">"{quote.quote}"</p>
                        <p className="text-sm text-muted-foreground mt-2">- {quote.author}</p>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

const AIInsightsCard = ({ player }: { player: Player }) => {
    const [insights, setInsights] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const getInsights = async () => {
        setLoading(true);
        setInsights(null);
        try {
            const res = await performanceInsightAndSuggestions({
                currentStats: player.stats,
                dailyPerformanceHistory: [], // Mock data
                currentLevel: player.level,
                currentRank: player.rank
            });
            setInsights(res);
        } catch (e) {
            console.error("Failed to get insights", e);
        } finally {
            setLoading(false);
        }
    }
    
    return (
      <Dialog>
        <Card className="bg-card/50 border-border/50">
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Zap className="w-5 h-5 text-accent"/> AI Insights</CardTitle>
                <CardDescription>Get personalized feedback on your performance.</CardDescription>
            </CardHeader>
            <CardFooter>
                 <DialogTrigger asChild>
                    <Button onClick={getInsights} disabled={loading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        {loading ? 'Analyzing...' : 'Analyze Performance'}
                    </Button>
                </DialogTrigger>
            </CardFooter>
        </Card>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Performance Analysis</DialogTitle>
                {insights && !loading && (
                    <DialogDescription>Readiness Score: <span className="text-primary font-bold">{insights.placementReadinessScore}%</span></DialogDescription>
                )}
            </DialogHeader>

            {loading && (
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
            )}

            {!loading && insights && (
                 <div className="space-y-4 text-sm">
                    <div>
                        <h3 className="font-bold">Summary:</h3>
                        <p className="text-muted-foreground">{insights.analysisSummary}</p>
                    </div>
                     <div>
                        <h3 className="font-bold">Focus Areas:</h3>
                        <ul className="list-disc list-inside text-muted-foreground">
                            {insights.focusAreas.map((area:string) => <li key={area}>{area}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold">Recovery Missions:</h3>
                        <ul className="list-disc list-inside text-muted-foreground">
                            {insights.suggestedRecoveryMissions.map((mission:string) => <li key={mission}>{mission}</li>)}
                        </ul>
                    </div>
                 </div>
            )}
        </DialogContent>
      </Dialog>
    )
}

export const InfoCards = ({ player }: { player: Player }) => {
  return (
    <div className="space-y-6">
      <FireQuoteCard player={player}/>
      <AIInsightsCard player={player} />
      <PersonalBestsCard />
      <AchievementsCard />
    </div>
  );
};
