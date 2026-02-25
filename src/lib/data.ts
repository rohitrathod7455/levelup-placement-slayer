import { BrainCircuit, Repeat, Swords, Target, Zap } from 'lucide-react';
import { Icon } from '@/components/icons';

export type StatName = 'discipline' | 'intelligence' | 'strength' | 'consistency' | 'focus';

export const statIcons: Record<StatName, Icon> = {
  discipline: Zap,
  intelligence: BrainCircuit,
  strength: Swords,
  consistency: Repeat,
  focus: Target,
};

export interface Stats {
  discipline: number;
  intelligence: number;
  strength: number;
  consistency: number;
  focus: number;
}

export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'Monarch';

export interface PersonalBest {
  title: string;
  value: string;
  icon: string;
}

export interface Player {
  name: string;
  title: string;
  level: number;
  xp: number;
  rank: Rank;
  stats: Stats;
  streak: number;
  personalBests: PersonalBest[];
  lastCompletionDate: string;
}

export const levelUpFormula = (level: number) => 100 * level;

export const ranks: Record<Rank, { minLevel: number; color: string }> = {
  E: { minLevel: 0, color: 'text-gray-400' },
  D: { minLevel: 4, color: 'text-green-400' },
  C: { minLevel: 8, color: 'text-blue-400' },
  B: { minLevel: 13, color: 'text-purple-400' },
  A: { minLevel: 21, color: 'text-red-400' },
  S: { minLevel: 31, color: 'text-yellow-400' },
  SS: { minLevel: 46, color: 'text-orange-400' },
  Monarch: { minLevel: 60, color: 'text-primary animate-fire-flicker' },
};

export const initialPlayerData: Player = {
  name: 'Rohit',
  title: 'Shadow Monarch in Training',
  level: 1,
  xp: 0,
  rank: 'E',
  streak: 0,
  stats: {
    discipline: 10,
    intelligence: 10,
    strength: 10,
    consistency: 10,
    focus: 10,
  },
  personalBests: [
    { title: 'Highest Level Achieved', value: '1', icon: 'ArrowUp' },
    { title: 'Longest Streak', value: '0', icon: 'Flame' },
    { title: 'Total XP Earned', value: '0', icon: 'Star' },
  ],
  lastCompletionDate: '',
};

export interface Quest {
  id: string;
  title: string;
  xp: number;
  stat: StatName;
  completed: boolean;
}

export const mainQuests: Quest[] = [
  { id: 'mq1', title: 'Solve 3 DSA problems', xp: 50, stat: 'intelligence', completed: false },
  { id: 'mq2', title: 'Revise 1 core subject topic', xp: 25, stat: 'intelligence', completed: false },
  { id: 'mq3', title: '30 min aptitude practice', xp: 25, stat: 'focus', completed: false },
];

export const sideQuests: Quest[] = [
  { id: 'sq1', title: 'Workout', xp: 30, stat: 'strength', completed: false },
  { id: 'sq2', title: 'No phone after 11 PM', xp: 20, stat: 'discipline', completed: false },
  { id: 'sq3', title: 'Improve resume', xp: 10, stat: 'consistency', completed: false },
  { id: 'sq4', title: 'Post on LinkedIn', xp: 10, stat: 'consistency', completed: false },
];

export const emergencyQuest: Quest = {
  id: 'eq1',
  title: 'Hunter in Danger – Recover 150 XP Today',
  xp: 0,
  stat: 'discipline',
  completed: false,
};

export const achievements = [
    { id: 'ach1', title: 'First Blood', description: 'First task completed', icon: '🩸', unlocked: true },
    { id: 'ach2', title: 'Dungeon Survivor', description: '7-day streak', icon: '🛡️', unlocked: true },
    { id: 'ach3', title: 'Elite Hunter', description: '30-day streak', icon: '⚔️', unlocked: false },
    { id: 'ach4', title: 'Placement Slayer', description: '60-day streak', icon: '👑', unlocked: false },
]

export const weeklyActivity = [
    { day: 'Mon', xp: 0 },
    { day: 'Tue', xp: 0 },
    { day: 'Wed', xp: 0 },
    { day: 'Thu', xp: 0 },
    { day: 'Fri', xp: 0 },
    { day: 'Sat', xp: 0 },
    { day: 'Sun', xp: 0 },
]
