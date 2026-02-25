'use client';

import { useState, useEffect } from 'react';
import {
  initialPlayerData,
  mainQuests as defaultMainQuests,
  sideQuests as defaultSideQuests,
  emergencyQuest,
  levelUpFormula,
  ranks,
  Player,
  Quest,
  weeklyActivity as initialWeeklyActivityData,
  PersonalBest,
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
    main: defaultMainQuests,
    side: defaultSideQuests,
    emergency: emergencyQuest,
  });
  const [weeklyActivity, setWeeklyActivity] = useState(initialWeeklyActivityData);
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedPlayer = localStorage.getItem('playerData');
    if (savedPlayer) {
      setPlayer(JSON.parse(savedPlayer));
    }

    const savedActivity = localStorage.getItem('weeklyActivityData');
    if (savedActivity) {
      setWeeklyActivity(JSON.parse(savedActivity));
    }

    const loadQuests = () => {
      const storedMain = localStorage.getItem('customMainQuests');
      const storedSide = localStorage.getItem('customSideQuests');

      const main = storedMain ? JSON.parse(storedMain) : defaultMainQuests;
      const side = storedSide ? JSON.parse(storedSide) : defaultSideQuests;

      // Reset completion status on load
      setQuests({
        main: main.map((q: Quest) => ({ ...q, completed: false })),
        side: side.map((q: Quest) => ({ ...q, completed: false })),
        emergency: { ...emergencyQuest, completed: false },
      });
    };

    loadQuests();
    setIsLoaded(true);

    window.addEventListener('questsChanged', loadQuests);
    return () => {
      window.removeEventListener('questsChanged', loadQuests);
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('playerData', JSON.stringify(player));
    }
  }, [player, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('weeklyActivityData', JSON.stringify(weeklyActivity));
    }
  }, [weeklyActivity, isLoaded]);

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

      setPlayer(prevPlayer => {
          const {
            xp: prevXp,
            level: prevLevel,
            rank: prevRank,
            stats: prevStats,
            streak: prevStreak,
            personalBests: prevBests,
          } = prevPlayer;
    
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
            if (ranks[potentialNewRank].minLevel > ranks[prevRank].minLevel) {
              newRank = potentialNewRank;
            }
          }

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

          // Update Personal Bests
          const newStreak = prevStreak + 1;
          const newBests: PersonalBest[] = JSON.parse(JSON.stringify(prevBests));

          const highestLevelBest = newBests.find(b => b.title === 'Highest Level Achieved');
          if (highestLevelBest && newLevel > parseInt(highestLevelBest.value)) {
            highestLevelBest.value = newLevel.toString();
          }

          const longestStreakBest = newBests.find(b => b.title === 'Longest Streak');
          if (longestStreakBest && newStreak > parseInt(longestStreakBest.value)) {
            longestStreakBest.value = `${newStreak}`;
          }

          const totalXpBest = newBests.find(b => b.title === 'Total XP Earned');
          if (totalXpBest) {
            totalXpBest.value = (parseInt(totalXpBest.value) + questToComplete.xp).toString();
          }
    
          return {
            ...prevPlayer,
            xp: finalXp,
            level: newLevel,
            rank: newRank,
            stats: newStats,
            streak: newStreak,
            personalBests: newBests,
          };
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
    }
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen"><p>Loading player data...</p></div>;
  }

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
