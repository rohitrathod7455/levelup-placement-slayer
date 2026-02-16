'use server';
/**
 * @fileOverview This file implements a Genkit flow for analyzing user performance
 * and providing personalized insights, recovery missions, and focus areas.
 *
 * - performanceInsightAndSuggestions - A function that triggers the AI analysis for user performance.
 * - PerformanceInsightInput - The input type for the performanceInsightAndSuggestions function.
 * - PerformanceInsightOutput - The return type for the performanceInsightAndSuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TaskBreakdownSchema = z.object({
  dsaProblemsSolved: z.number().int().min(0).describe('Number of DSA problems solved.'),
  codingHours: z.number().min(0).max(24).describe('Hours spent coding.'),
  aptitudeMinutes: z.number().int().min(0).describe('Minutes spent on aptitude practice.'),
  coreSubjectRevisions: z.number().int().min(0).describe('Number of core subject topics revised.'),
  resumeImprovements: z.boolean().describe('Whether resume was improved.'),
  workoutsCompleted: z.number().int().min(0).describe('Number of workouts completed.'),
  noPhoneAfter11pm: z.boolean().describe('Whether the no-phone-after-11 PM rule was followed.'),
});

const DailyPerformanceHistoryEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Date of performance (YYYY-MM-DD).'),
  taskBreakdown: TaskBreakdownSchema.describe('Breakdown of tasks completed on this day.'),
  xpEarned: z.number().int().min(0).describe('Experience points earned on this day.'),
  streakDays: z.number().int().min(0).describe('Current streak days as of this day.'),
});

const CurrentStatsSchema = z.object({
  discipline: z.number().int().min(0).describe('Current Discipline stat.'),
  intelligence: z.number().int().min(0).describe('Current Intelligence stat.'),
  strength: z.number().int().min(0).describe('Current Strength stat.'),
  consistency: z.number().int().min(0).describe('Current Consistency stat.'),
  focus: z.number().int().min(0).describe('Current Focus stat.'),
});

const PerformanceInsightInputSchema = z.object({
  currentStats: CurrentStatsSchema.describe("The user's current player stats."),
  dailyPerformanceHistory: z.array(DailyPerformanceHistoryEntrySchema).describe('A history of daily performance over the past few days or weeks.'),
  currentLevel: z.number().int().min(1).describe("The user's current level."),
  currentRank: z.string().describe("The user's current rank (e.g., E, D, C)."),
});
export type PerformanceInsightInput = z.infer<typeof PerformanceInsightInputSchema>;

const PerformanceInsightOutputSchema = z.object({
  weakAreas: z.array(z.string()).describe('Identified areas where the user needs improvement (e.g., DSA, Aptitude, Consistency).'),
  suggestedRecoveryMissions: z.array(z.string()).describe('Specific, actionable missions to address weak areas (e.g., "Complete 3 Hard DSA problems").'),
  focusAreas: z.array(z.string()).describe('Key areas to concentrate on for improvement (e.g., "Dynamic Programming", "Time Management").'),
  placementReadinessScore: z.number().int().min(0).max(100).describe('An estimated score (0-100) indicating placement readiness based on consistency and performance.'),
  analysisSummary: z.string().describe('A comprehensive summary of the performance analysis and the reasoning behind the suggestions.'),
});
export type PerformanceInsightOutput = z.infer<typeof PerformanceInsightOutputSchema>;

export async function performanceInsightAndSuggestions(input: PerformanceInsightInput): Promise<PerformanceInsightOutput> {
  return performanceInsightAndSuggestionsFlow(input);
}

const performanceInsightPrompt = ai.definePrompt({
  name: 'performanceInsightPrompt',
  input: { schema: PerformanceInsightInputSchema },
  output: { schema: PerformanceInsightOutputSchema },
  prompt: `You are an expert Product Designer, UI/UX Designer, Behavioral Psychologist, and Full Stack Developer.
Your task is to analyze a BTech student's daily performance data and current stats, and provide personalized insights, weak areas, recovery missions, focus areas, and a placement readiness score.
Act as a mentor in a gamified productivity app inspired by "Solo Leveling". Your tone should be motivating, direct, and aligned with the game's theme.

Here is the user's current data:

Player Stats: {{{json currentStats}}}
Current Level: {{{currentLevel}}}
Current Rank: {{{currentRank}}}

Daily Performance History (most recent first, up to the last 14 entries):
{{#each dailyPerformanceHistory}}
  Date: {{{date}}}
  Tasks:
    DSA Problems Solved: {{{taskBreakdown.dsaProblemsSolved}}}
    Coding Hours: {{{taskBreakdown.codingHours}}}
    Aptitude Minutes: {{{taskBreakdown.aptitudeMinutes}}}
    Core Subject Revisions: {{{taskBreakdown.coreSubjectRevisions}}}
    Resume Improved: {{{taskBreakdown.resumeImprovements}}}
    Workouts Completed: {{{taskBreakdown.workoutsCompleted}}}
    No Phone After 11 PM: {{{taskBreakdown.noPhoneAfter11pm}}}
  XP Earned: {{{xpEarned}}}
  Streak Days: {{{streakDays}}}
{{/each}}

Analyze the data and identify:
1.  **Weak Areas**: What specific aspects of their preparation (e.g., DSA, Aptitude, Coding consistency, specific core subjects, physical fitness, sleep discipline) are consistently underperforming or neglected?
2.  **Suggested Recovery Missions**: Based on the weak areas, propose 2-3 concrete, actionable missions. Frame these as game-like quests.
3.  **Focus Areas**: Highlight the top 2-3 most critical areas for the user to concentrate on for maximum improvement.
4.  **Placement Readiness Score**: Calculate a score from 0-100. This score should reflect their consistency, breadth of skills practiced, and recent performance trends. A higher score means they are more prepared for placements.
5.  **Analysis Summary**: Provide a concise but comprehensive summary of the analysis. Explain the 'why' behind the weak areas and suggestions, maintaining the motivational "Solo Leveling" tone.

Return the full analysis in the specified JSON format.`,
});

const performanceInsightAndSuggestionsFlow = ai.defineFlow(
  {
    name: 'performanceInsightAndSuggestionsFlow',
    inputSchema: PerformanceInsightInputSchema,
    outputSchema: PerformanceInsightOutputSchema,
  },
  async (input) => {
    const { output } = await performanceInsightPrompt(input);
    if (!output) {
      throw new Error('Failed to generate performance insights.');
    }
    return output;
  }
);
