'use client';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Flame, LayoutDashboard, Settings, Star, User } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ranks, type Rank } from '@/lib/data';
import { RankBadge } from '@/components/icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PlayerCard = () => {
  const playerAvatar = PlaceHolderImages.find(p => p.id === 'player-avatar');
  const rank: Rank = 'E'; // Example rank
  const rankInfo = ranks[rank];

  return (
    <div className="flex flex-col items-center p-4 text-center">
      <div className="relative mb-3">
        <Image
          src={playerAvatar?.imageUrl || ''}
          alt="Player Avatar"
          width={80}
          height={80}
          className="rounded-full border-2 border-primary glowing-border"
          data-ai-hint={playerAvatar?.imageHint}
        />
        <div className="absolute -bottom-2 -right-2 bg-card p-1 rounded-full border border-primary">
           <RankBadge rank={rank} className={cn('w-6 h-6', rankInfo.color)} />
        </div>
      </div>
      <h2 className="text-lg font-bold font-headline">Player Rohit</h2>
      <p className="text-sm text-muted-foreground">Shadow Monarch in Training</p>
    </div>
  );
};

export function SidebarContent() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full">
      <SidebarHeader>
        <PlayerCard />
      </SidebarHeader>
      <Separator />
      <div className="flex-1 overflow-y-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === '/dashboard'}>
              <Link href="/dashboard">
                <LayoutDashboard />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Profile" isActive={pathname === '/dashboard/profile'}>
              <Link href="/dashboard/profile">
                <User />
                Profile
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Streaks" isActive={pathname === '/dashboard/streaks'}>
              <Link href="/dashboard/streaks">
                <Flame />
                Streaks
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Achievements" isActive={pathname === '/dashboard/achievements'}>
              <Link href="/dashboard/achievements">
                <Star />
                Achievements
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </div>
  );
}
