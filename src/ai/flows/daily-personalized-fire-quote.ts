'use server';
/**
 * @fileOverview A Genkit flow for generating personalized daily motivational 'Fire Quotes' based on user performance.
 *
 * - dailyPersonalizedFireQuote - A function that generates a personalized motivational quote.
 * - DailyPersonalizedFireQuoteInput - The input type for the dailyPersonalizedFireQuote function.
 * - DailyPersonalizedFireQuoteOutput - The return type for the dailyPersonalizedFireQuote function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DailyPersonalizedFireQuoteInputSchema = z.object({
  playerName: z.string().describe('The display name of the player.'),
  level: z.number().int().positive().describe('The current level of the player.'),
  rank: z.string().describe('The current rank of the player (e.g., "E Rank", "Monarch").'),
  xpGainedToday: z.number().int().min(0).describe('Total XP gained by the player today.'),
  currentStreakDays: z.number().int().min(0).describe('The current daily streak in days.'),
  questsCompletedToday: z.array(z.string()).describe('A list of quests completed by the player today.').optional(),
  weakAreas: z.array(z.string()).describe('Identified weak areas for the player, e.g., "DSA", "Aptitude".').optional(),
  overallPerformanceSummary: z.string().describe('A summary of the player\'s overall performance and recent progress.').optional(),
});
export type DailyPersonalizedFireQuoteInput = z.infer<typeof DailyPersonalizedFireQuoteInputSchema>;

const DailyPersonalizedFireQuoteOutputSchema = z.object({
  quote: z.string().describe('A personalized motivational "Fire Quote".'),
  author: z.string().describe('The author of the quote, usually "The System" or "Your Inner Monarch".'),
});
export type DailyPersonalizedFireQuoteOutput = z.infer<typeof DailyPersonalizedFireQuoteOutputSchema>;

export async function dailyPersonalizedFireQuote(input: DailyPersonalizedFireQuoteInput): Promise<DailyPersonalizedFireQuoteOutput> {
  return dailyPersonalizedFireQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFireQuotePrompt',
  input: { schema: DailyPersonalizedFireQuoteInputSchema },
  output: { schema: DailyPersonalizedFireQuoteOutputSchema },
  prompt: `You are a motivational AI system in the "LevelUp: Placement Slayer" app, themed after Solo Leveling. Your task is to generate a personalized 'Fire Quote' for the player based on their daily progress and performance. The quote should be inspiring, direct, and resonate with the Solo Leveling aesthetic.

Player Name: {{{playerName}}}
Current Level: {{{level}}}
Current Rank: {{{rank}}}
XP Gained Today: {{{xpGainedToday}}}
Current Streak: {{{currentStreakDays}}} days

{{#if questsCompletedToday}}
Quests Completed Today:
{{#each questsCompletedToday}}- {{{this}}}
{{/each}}
{{/if}}

{{#if weakAreas}}
Identified Weak Areas:
{{#each weakAreas}}- {{{this}}}
{{/each}}
{{/if}}

{{#if overallPerformanceSummary}}
Overall Performance Summary: {{{overallPerformanceSummary}}}
{{/if}}

Based on this information, craft a short, powerful, personalized 'Fire Quote' to fuel their grind. Make it sound like it's from the system or a powerful entity in the Solo Leveling universe. Ensure the quote is directly related to the provided performance and progress, and aims to inspire the player for the next challenge.

Set the author of the quote as "The System" or "Your Inner Monarch".`,
});

const dailyPersonalizedFireQuoteFlow = ai.defineFlow(
  {
    name: 'dailyPersonalizedFireQuoteFlow',
    inputSchema: DailyPersonalizedFireQuoteInputSchema,
    outputSchema: DailyPersonalizedFireQuoteOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate personalized fire quote.');
    }
    return output;
  }
);
