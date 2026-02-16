import { Progress } from '@/components/ui/progress';
import { Player, levelUpFormula, ranks } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

const XPProgress = ({ player }: { player: Player }) => {
  const xpForNextLevel = levelUpFormula(player.level);
  const progressPercentage = (player.xp / xpForNextLevel) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-sm font-medium">
        <span className="text-primary glowing-text-primary">LV. {player.level}</span>
        <span className="text-muted-foreground">
          {player.xp} / {xpForNextLevel} XP
        </span>
      </div>
      <Progress value={progressPercentage} className="h-3 bg-primary/20 [&>div]:bg-primary" />
    </div>
  );
};


export const Header = ({ player }: { player: Player }) => {
  const rankInfo = ranks[player.rank];
  const isShadowMode = player.streak >= 7;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
        <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-headline tracking-tighter">LevelUp</h1>
            <span className={cn("text-2xl font-bold", rankInfo.color)}>[{player.rank}]</span>
        </div>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          <XPProgress player={player} />
        </div>
        <div className="flex items-center gap-2 font-bold text-orange-400">
           <Flame className={cn("h-5 w-5", isShadowMode && 'animate-fire-flicker text-orange-400')}/>
           <span>{player.streak}</span>
        </div>
      </div>
    </header>
  );
};
