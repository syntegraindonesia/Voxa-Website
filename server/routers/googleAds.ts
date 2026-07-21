import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { protectedProcedure, router } from '../_core/trpc';
import { getDb } from '../db';
import { archivedCampaigns } from '../../drizzle/schema';
import {
  getCampaigns,
  pauseCampaign,
  enableCampaign,
  updateCampaignBudget,
  getKeywords,
  createSearchCampaign,
  getMetricsSummary,
  previousPeriod,
  getAccountBalance,
} from '../_core/googleAds';
import { invokeLLM } from '../_core/llm';

export const googleAdsRouter = router({
  // Get all campaigns with metrics + archive flag, scoped to a date range
  getCampaigns: protectedProcedure
    .input(z.object({
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    }).optional())
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const range = input?.startDate && input?.endDate
        ? { startDate: input.startDate, endDate: input.endDate }
        : undefined;
      const [campaigns, db] = [await getCampaigns(range), await getDb()];
      const archivedIds = new Set<string>();
      if (db) {
        const rows = await db.select({ campaignId: archivedCampaigns.campaignId }).from(archivedCampaigns);
        rows.forEach(r => archivedIds.add(r.campaignId));
      }
      return campaigns.map(c => ({ ...c, archived: archivedIds.has(c.id) }));
    }),

  // Get current account balance (live from Google Ads)
  getAccountBalance: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return getAccountBalance();
    }),

  // Get aggregate metrics for tiles: current period + previous equivalent period
  // scope: "all" = every non-removed campaign, "active" = ENABLED only, or a specific campaignId
  getMetricsSummary: protectedProcedure
    .input(z.object({
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      scope: z.union([z.literal('all'), z.literal('active'), z.string()]).default('active'),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const range = { startDate: input.startDate, endDate: input.endDate };
      const prev = previousPeriod(range);
      const opts = input.scope === 'all' ? {}
        : input.scope === 'active' ? { onlyActive: true }
        : { campaignId: input.scope };
      const [current, previous] = await Promise.all([
        getMetricsSummary(range, opts),
        getMetricsSummary(prev, opts),
      ]);
      const pct = (a: number, b: number) => b === 0 ? null : ((a - b) / b) * 100;
      return {
        current,
        previous,
        deltas: {
          spend: pct(current.spend, previous.spend),
          clicks: pct(current.clicks, previous.clicks),
          impressions: pct(current.impressions, previous.impressions),
          ctr: current.ctr - previous.ctr, // pp difference, not %
        },
        previousRange: prev,
      };
    }),

  // Archive a campaign (hide from dashboard, don't touch Google Ads)
  archiveCampaign: protectedProcedure
    .input(z.object({ campaignId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'DB unavailable' });
      await db.insert(archivedCampaigns).values({ campaignId: input.campaignId }).onDuplicateKeyUpdate({ set: { campaignId: input.campaignId } });
      return { success: true };
    }),

  // Unarchive (bring back to main list)
  unarchiveCampaign: protectedProcedure
    .input(z.object({ campaignId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'DB unavailable' });
      await db.delete(archivedCampaigns).where(eq(archivedCampaigns.campaignId, input.campaignId));
      return { success: true };
    }),

  // Pause a campaign
  pauseCampaign: protectedProcedure
    .input(z.object({ campaignId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      await pauseCampaign(input.campaignId);
      return { success: true };
    }),

  // Enable a campaign
  enableCampaign: protectedProcedure
    .input(z.object({ campaignId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      await enableCampaign(input.campaignId);
      return { success: true };
    }),

  // Update daily budget
  updateBudget: protectedProcedure
    .input(z.object({ campaignId: z.string(), dailyBudgetRp: z.number().min(10000) }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      await updateCampaignBudget(input.campaignId, input.dailyBudgetRp);
      return { success: true };
    }),

  // Get keywords (optionally filtered by campaign + date range)
  getKeywords: protectedProcedure
    .input(z.object({
      campaignId: z.string().optional(),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const range = input.startDate && input.endDate
        ? { startDate: input.startDate, endDate: input.endDate }
        : undefined;
      return getKeywords(input.campaignId, range);
    }),

  // AI: suggest keywords for a topic/URL
  suggestKeywords: protectedProcedure
    .input(z.object({
      targetUrl: z.string(),
      topic: z.string(),
      count: z.number().min(5).max(20).default(10),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });

      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'You are a Google Ads expert specializing in the Indonesian market and electric bicycle industry. Suggest high-intent Search keywords in Bahasa Indonesia and English.',
          },
          {
            role: 'user',
            content: `Suggest ${input.count} Google Search Ad keywords for this page: ${input.targetUrl}\nTopic: ${input.topic}\n\nInclude a mix of broad, phrase, and exact match types. Focus on high purchase intent. Include Indonesian language keywords. Return JSON: {"keywords": [{"text": "keyword", "matchType": "BROAD|PHRASE|EXACT", "rationale": "why this keyword"}]}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content ?? '{}';
      const parsed = JSON.parse(typeof content === 'string' ? content : JSON.stringify(content));
      return { keywords: parsed.keywords ?? [] };
    }),

  // AI: suggest ad copy (headlines + descriptions)
  suggestAdCopy: protectedProcedure
    .input(z.object({
      targetUrl: z.string(),
      topic: z.string(),
      keywords: z.array(z.string()),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });

      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'You are a Google Ads copywriter expert for VOXA, an Indonesian electric bicycle brand. Write compelling Search Ad copy that follows Google Ads character limits: headlines max 30 chars, descriptions max 90 chars.',
          },
          {
            role: 'user',
            content: `Write Google Search Ad copy for:\nURL: ${input.targetUrl}\nTopic: ${input.topic}\nTarget keywords: ${input.keywords.join(', ')}\n\nWrite 10 headlines (max 30 chars each) and 4 descriptions (max 90 chars each). Mix Bahasa Indonesia and English. Include strong CTAs. Return JSON: {"headlines": ["..."], "descriptions": ["..."]}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content ?? '{}';
      const parsed = JSON.parse(typeof content === 'string' ? content : JSON.stringify(content));
      return {
        headlines: (parsed.headlines ?? []).map((h: string) => h.slice(0, 30)),
        descriptions: (parsed.descriptions ?? []).map((d: string) => d.slice(0, 90)),
      };
    }),

  // AI: analyze campaigns and generate recommendations
  getRecommendations: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });

      const [campaigns, keywords] = await Promise.all([
        getCampaigns(),
        getKeywords(),
      ]);

      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: `You are an expert Google Ads strategist for VOXA, an Indonesian electric bicycle brand (voxa.co.id).
Analyze campaign and keyword performance data and provide specific, actionable recommendations.
Each recommendation must include: type, severity, title, reasoning, expected_impact, and action_details.
Be specific with numbers. Reference actual campaign names and keyword data.`,
          },
          {
            role: 'user',
            content: `Analyze this Google Ads account data and provide recommendations:\n\nCAMPAIGNS:\n${JSON.stringify(campaigns, null, 2)}\n\nKEYWORDS:\n${JSON.stringify(keywords, null, 2)}\n\nProvide 3-7 prioritized recommendations. Return JSON: {"recommendations": [{"type": "PAUSE_KEYWORD|INCREASE_BUDGET|DECREASE_BUDGET|ADD_KEYWORD|PAUSE_CAMPAIGN|ENABLE_CAMPAIGN|CHANGE_MATCH_TYPE|ADD_NEGATIVE_KEYWORD", "severity": "HIGH|MEDIUM|LOW", "title": "short title", "reasoning": "detailed explanation with specific numbers", "expected_impact": "what will improve and by how much", "action_details": {}}]}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content ?? '{}';
      const parsed = JSON.parse(typeof content === 'string' ? content : JSON.stringify(content));
      return { recommendations: parsed.recommendations ?? [] };
    }),

  // Create a full search campaign (starts PAUSED for review)
  createCampaign: protectedProcedure
    .input(z.object({
      name: z.string().min(3).max(100),
      dailyBudgetRp: z.number().min(10000),
      targetUrl: z.string().url(),
      keywords: z.array(z.object({
        text: z.string(),
        matchType: z.enum(['BROAD', 'PHRASE', 'EXACT']),
      })),
      headlines: z.array(z.string().max(30)).min(3).max(15),
      descriptions: z.array(z.string().max(90)).min(2).max(4),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return createSearchCampaign(input);
    }),
});
