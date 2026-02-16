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
  const { toast } = useToast();

  const handleQuestCompletion = (questId: string, questType: keyof typeof quests) => {
    let questToComplete: Quest | undefined;
    const newQuests = { ...quests };

    if (questType === 'emergency') {
        questToComplete = newQuests.emergency;
        if(questToComplete) newQuests.emergency.completed = true;
    } else {
        const qList = newQuests[questType] as Quest[];
        questToComplete = qList.find(q => q.id === questId);
        if (questToComplete) {
            const index = qList.indexOf(questToComplete);
            newQuests[questType][index].completed = true;
        }
    }

    if (questToComplete) {
      setQuests(newQuests);
      updatePlayerStats(questToComplete);
    }
  };

  const updatePlayerStats = (quest: Quest) => {
    setPlayer(prevPlayer => {
      let newXp = prevPlayer.xp + quest.xp;
      let newLevel = prevPlayer.level;
      let newRank = prevPlayer.rank;

      const newStats = {
        ...prevPlayer.stats,
        [quest.stat]: prevPlayer.stats[quest.stat] + 1,
      };

      const xpForNextLevel = levelUpFormula(prevPlayer.level);
      if (newXp >= xpForNextLevel) {
        newLevel += 1;
        newXp -= xpForNextLevel;
        toast({
          title: 'LEVEL UP!',
          description: `You have reached Level ${newLevel}!`,
        });
      }

      const newRankEntry = Object.entries(ranks).find(([, details]) => newLevel >= details.minLevel);
      if (newRankEntry) {
        const potentialNewRank = newRankEntry[0] as keyof typeof ranks;
        if (potentialNewRank !== newRank) {
            newRank = potentialNewRank;
            toast({
                title: 'RANK PROMOTION!',
                description: `You have been promoted to ${newRank} Rank!`,
            });
        }
      }

      return {
        ...prevPlayer,
        xp: newXp,
        level: newLevel,
        rank: newRank,
        stats: newStats,
        streak: prevPlayer.streak + 1, // Simplified streak logic
      };
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header player={player} />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">
            <QuestBoard quests={quests} onQuestComplete={handleQuestCompletion} />
            <ActivityCharts />
          </div>
          <div className="space-y-6">
            <StatsRadarChart stats={player.stats} />
            <InfoCards player={player} />
          </div>
        </div>
      </main>
    </div>
  );
}
