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
import { ranks, type Player, initialPlayerData } from '@/lib/data';
import { RankBadge } from '@/components/icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PlayerCard = () => {
  const defaultAvatar = PlaceHolderImages.find(p => p.id === 'player-avatar')?.imageUrl || '';
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [player, setPlayer] = useState<Player | null>(null);

  const rank = player?.rank || 'E';
  const rankInfo = ranks[rank];

  useEffect(() => {
    const updatePlayerData = () => {
      const storedAvatar = localStorage.getItem('playerAvatar');
      setAvatar(storedAvatar || defaultAvatar);

      const savedPlayer = localStorage.getItem('playerData');
      if (savedPlayer) {
        try {
          setPlayer(JSON.parse(savedPlayer));
        } catch (e) {
          setPlayer(initialPlayerData);
        }
      } else {
        setPlayer(initialPlayerData);
      }
    };

    updatePlayerData();

    // Listen for changes from other components/tabs
    window.addEventListener('storage', updatePlayerData);
    window.addEventListener('avatarChanged', updatePlayerData);
    window.addEventListener('playerDataChanged', updatePlayerData);

    return () => {
      window.removeEventListener('storage', updatePlayerData);
      window.removeEventListener('avatarChanged', updatePlayerData);
      window.removeEventListener('playerDataChanged', updatePlayerData);
    };
  }, [defaultAvatar]);
  
  if (!player) {
    return (
        <div className="flex flex-col items-center p-4 text-center">
            <div className="relative mb-3">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="absolute -bottom-2 -right-2 bg-card p-1 rounded-full border border-primary">
                    <Skeleton className="w-6 h-6 rounded-full" />
                </div>
            </div>
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-4 w-40" />
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 text-center">
      <div className="relative mb-3">
        <Image
          src={avatar}
          alt="Player Avatar"
          width={80}
          height={80}
          className="rounded-full border-2 border-primary glowing-border object-cover"
          data-ai-hint="profile avatar"
        />
        <div className="absolute -bottom-2 -right-2 bg-card p-1 rounded-full border border-primary">
           <RankBadge rank={rank} className={cn('w-6 h-6', rankInfo.color)} />
        </div>
      </div>
      <h2 className="text-lg font-bold font-headline">{player.name}</h2>
      <p className="text-sm text-muted-foreground">{player.title}</p>
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
            <SidebarMenuButton asChild tooltip="Settings" isActive={pathname === '/dashboard/settings'}>
              <Link href="/dashboard/settings">
                <Settings />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </div>
  );
}
