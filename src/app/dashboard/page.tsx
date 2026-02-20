'use client';

import { useState } from 'react';
import {
  initialPlayerData,
  mainQuests,
  sideQuests,
  emergencyQuest,
  levelUpFormula,
  ranks,
  Player,
  Quest,
  weeklyActivity as initialWeeklyActivityData,
} from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { QuestBoard } from '@/components/dashboard/quest-board';
import { StatsRadarChart } from '@/components/dashboard/stats-radar-chart';
import { ActivityCharts } from '@/components/dashboard/activity-charts';
import { InfoCards } from '@/components/dashboard/info-cards';
import { Header } from '@/components/dashboard/header';

export default function DashboardPage() {
  const [player, setPlayer] = useState<Player>(initialPlayerData);
  const [quests, setQuests] = useState({
    main: mainQuests,
    side: sideQuests,
    emergency: emergencyQuest,
  });
  const [weeklyActivity, setWeeklyActivity] = useState(
    initialWeeklyActivityData.map(d => ({ ...d, xp: 0 })),
  );
  const { toast } = useToast();

  const handleQuestCompletion = (questId: string, questType: keyof typeof quests) => {
    const questToComplete =
      questType === 'emergency'
        ? quests.emergency
        : quests[questType].find(q => q.id === questId);

    if (questToComplete && !questToComplete.completed) {
      setQuests(prevQuests => {
        if (questType === 'emergency') {
          return {
            ...prevQuests,
            emergency: { ...prevQuests.emergency, completed: true },
          };
        }
        return {
          ...prevQuests,
          [questType]: prevQuests[questType].map(q =>
            q.id === questId ? { ...q, completed: true } : q,
          ),
        };
      });

      const {
        xp: prevXp,
        level: prevLevel,
        rank: prevRank,
        stats: prevStats,
        streak: prevStreak,
      } = player;

      const newXp = prevXp + questToComplete.xp;
      const newStats = {
        ...prevStats,
        [questToComplete.stat]: prevStats[questToComplete.stat] + 1,
      };

      let newLevel = prevLevel;
      let finalXp = newXp;
      let leveledUp = false;

      const xpForNextLevel = levelUpFormula(prevLevel);
      if (finalXp >= xpForNextLevel) {
        newLevel += 1;
        finalXp -= xpForNextLevel;
        leveledUp = true;
      }

      const newRankEntry = Object.entries(ranks)
        .sort(([, a], [, b]) => b.minLevel - a.minLevel)
        .find(([, details]) => newLevel >= details.minLevel);
      
      let newRank = prevRank;
      if (newRankEntry) {
        const potentialNewRank = newRankEntry[0] as keyof typeof ranks;
        if (potentialNewRank !== prevRank) {
          newRank = potentialNewRank;
        }
      }

      setPlayer({
        ...player,
        xp: finalXp,
        level: newLevel,
        rank: newRank,
        stats: newStats,
        streak: prevStreak + 1,
      });
      
      setWeeklyActivity(currentActivity => {
        const today = new Date();
        const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // 0 = Mon, 6 = Sun
        const newActivity = [...currentActivity];
        newActivity[dayIndex] = {
          ...newActivity[dayIndex],
          xp: newActivity[dayIndex].xp + questToComplete.xp,
        };
        return newActivity;
      });

      if (leveledUp) {
        toast({
          title: 'LEVEL UP!',
          description: `You have reached Level ${newLevel}!`,
        });
      }

      if (newRank !== prevRank) {
        toast({
          title: 'RANK PROMOTION!',
          description: `You have been promoted to ${newRank} Rank!`,
        });
      }
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <Header player={player} />
      <div className="p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">
            <QuestBoard quests={quests} onQuestComplete={handleQuestCompletion} />
            <ActivityCharts weeklyActivityData={weeklyActivity} />
          </div>
          <div className="space-y-6">
            <StatsRadarChart stats={player.stats} />
            <InfoCards player={player} />
          </div>
        </div>
      </div>
    </div>
  );
}
