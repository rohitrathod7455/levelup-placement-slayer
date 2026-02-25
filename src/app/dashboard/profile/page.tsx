'use client';

import { useState, useRef, useEffect } from 'react';
import { initialPlayerData, ranks, Player } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatsRadarChart } from '@/components/dashboard/stats-radar-chart';
import { Separator } from '@/components/ui/separator';
import { RankBadge } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Pencil, Camera } from 'lucide-react';

export default function ProfilePage() {
  const [player, setPlayer] = useState<Player>(initialPlayerData);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(player.name);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const defaultAvatar = PlaceHolderImages.find(p => p.id === 'player-avatar')?.imageUrl;
  const [avatar, setAvatar] = useState<string | undefined>(defaultAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedPlayer = localStorage.getItem('playerData');
    if (savedPlayer) {
      const parsedPlayer = JSON.parse(savedPlayer);
      setPlayer(parsedPlayer);
      setName(parsedPlayer.name);
    }

    const storedAvatar = localStorage.getItem('playerAvatar');
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded) {
      localStorage.setItem('playerData', JSON.stringify(player));
      window.dispatchEvent(new Event('playerDataChanged'));
    }
  }, [player, isLoaded]);

  const rankInfo = ranks[player.rank];

  const handleSave = () => {
    setPlayer(prevPlayer => ({...prevPlayer, name}));
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatarUrl = reader.result as string;
        setAvatar(newAvatarUrl);
        localStorage.setItem('playerAvatar', newAvatarUrl);
        window.dispatchEvent(new Event('avatarChanged'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  if (!isLoaded) {
    return <div className="p-4 md:p-6 lg:p-8"><p>Loading profile...</p></div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold font-headline tracking-tighter">Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="items-center text-center">
              <div className="relative mb-3">
                <Avatar className="h-24 w-24 border-2 border-primary glowing-border">
                  <AvatarImage src={avatar} alt="Player Avatar" className="object-cover" />
                  <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                  accept="image/*"
                />
                 <Button 
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  onClick={handleAvatarClick}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <div className="absolute -bottom-2 -right-2 bg-card p-1 rounded-full border border-primary">
                  <RankBadge rank={player.rank} className={cn('w-8 h-8', rankInfo.color)} />
                </div>
              </div>
              {isEditing ? (
                <div className="flex flex-col items-center gap-2 w-full max-w-sm">
                   <Input value={name} onChange={(e) => setName(e.target.value)} className="text-center" />
                   <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm">Save</Button>
                    <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">Cancel</Button>
                   </div>
                </div>
              ) : (
                <>
                  <div className='flex items-center gap-2'>
                    <CardTitle className="text-2xl font-headline">{player.name}</CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(true)}>
                      <Pencil className="h-4 w-4"/>
                    </Button>
                  </div>
                  <CardDescription>{player.title}</CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent>
              <Separator className="my-4"/>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-medium">{player.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rank</span>
                  <span className={cn("font-medium", rankInfo.color)}>{player.rank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">XP</span>
                  <span className="font-medium">{player.xp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Streak</span>
                  <span className="font-medium">{player.streak} days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <StatsRadarChart stats={player.stats} />
        </div>
      </div>
    </div>
  );
}
