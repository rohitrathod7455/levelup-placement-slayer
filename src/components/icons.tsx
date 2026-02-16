import type { LucideIcon, LucideProps } from 'lucide-react';
import type { Rank } from '@/lib/data';

export type Icon = LucideIcon;

export const Icons = {
  RankE: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 6v12h10M7 12h8"/></svg>
  ),
  RankD: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 6v12h6a4 4 0 0 0 4-4v-4a4 4 0 0 0-4-4H7z"/></svg>
  ),
  RankC: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 6a6 6 0 1 0 0 12"/></svg>
  ),
  RankB: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 6v12h6a4 4 0 0 0 4-4v-4a4 4 0 0 0-4-4H7zM7 12h6"/></svg>
  ),
  RankA: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 18L12 6l5 12M9 14h6"/></svg>
  ),
  RankS: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 6a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h-2a4 4 0 0 1 0-8h2zm-2 8a4 4 0 0 0 4 4v0a4 4 0 0 0-4-4h2a4 4 0 0 0 0-8h-2z"/></svg>
  ),
  RankSS: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><g transform="translate(-2, 0)"><path d="M10 6a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h-2a4 4 0 0 1 0-8h2zm-2 8a4 4 0 0 0 4 4v0a4 4 0 0 0-4-4h2a4 4 0 0 0 0-8h-2z"/><path d="M18 6a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h-2a4 4 0 0 1 0-8h2zm-2 8a4 4 0 0 0 4 4v0a4 4 0 0 0-4-4h2a4 4 0 0 0 0-8h-2z"/></g></svg>
  ),
  RankMonarch: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 4l3 7h-6l3-7zM8 11h8l-4 8-4-8z"/></svg>
  ),
};

export const RankBadge = ({ rank, ...props }: { rank: Rank } & LucideProps) => {
  const rankKey = `Rank${rank}` as keyof typeof Icons;
  const IconComponent = Icons[rankKey];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};
