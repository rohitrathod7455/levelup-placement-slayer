'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import type { Quest, StatName } from '@/lib/data';
import { statIcons } from '@/lib/data';
import { cn } from '@/lib/utils';

type QuestBoardProps = {
  quests: {
    main: Quest[];
    side: Quest[];
    emergency: Quest;
  };
  onQuestComplete: (questId: string, questType: keyof QuestBoardProps['quests']) => void;
};

const QuestItem = ({ quest, onComplete }: { quest: Quest; onComplete: () => void }) => {
  const Icon = statIcons[quest.stat as StatName];
  return (
    <div
      className={cn(
        "flex items-center space-x-4 rounded-md p-3 transition-all",
        quest.completed ? "bg-primary/10" : "hover:bg-muted/50"
      )}
    >
      <Checkbox
        id={quest.id}
        checked={quest.completed}
        onCheckedChange={() => !quest.completed && onComplete()}
        disabled={quest.completed}
        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      />
      <div className="flex-1">
        <label
          htmlFor={quest.id}
          className={cn(
            "font-medium leading-none",
            quest.completed ? "text-muted-foreground line-through" : "cursor-pointer"
          )}
        >
          {quest.title}
        </label>
      </div>
      <div className={cn("flex items-center gap-2 text-sm font-semibold", quest.completed ? "text-muted-foreground" : "text-primary")}>
        {quest.xp > 0 && <span>+{quest.xp} XP</span>}
        <Icon className="h-4 w-4" />
      </div>
    </div>
  );
};

export const QuestBoard = ({ quests, onQuestComplete }: QuestBoardProps) => {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl glowing-text-primary">Daily Quests</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="main">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="main">Main Quests</TabsTrigger>
            <TabsTrigger value="side">Side Quests</TabsTrigger>
            <TabsTrigger value="emergency" className="text-destructive data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">Emergency</TabsTrigger>
          </TabsList>
          <TabsContent value="main" className="space-y-2 mt-4">
            {quests.main.map(quest => (
              <QuestItem key={quest.id} quest={quest} onComplete={() => onQuestComplete(quest.id, 'main')} />
            ))}
          </TabsContent>
          <TabsContent value="side" className="space-y-2 mt-4">
            {quests.side.map(quest => (
              <QuestItem key={quest.id} quest={quest} onComplete={() => onQuestComplete(quest.id, 'side')} />
            ))}
          </TabsContent>
          <TabsContent value="emergency" className="mt-4">
            <QuestItem quest={quests.emergency} onComplete={() => onQuestComplete(quests.emergency.id, 'emergency')} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
