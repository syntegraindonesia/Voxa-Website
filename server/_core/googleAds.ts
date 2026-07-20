import { ENV } from './env';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const ADS_BASE = 'https://googleads.googleapis.com/v18';

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedAccessToken;
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: ENV.googleAdsClientId,
      client_secret: ENV.googleAdsClientSecret,
      refresh_token: ENV.googleAdsRefreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to refresh Google Ads access token: ${err}`);
  }

  const data = await res.json() as { access_token: string; expires_in: number };
  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;
  return cachedAccessToken;
}

async function adsRequest(path: string, body: unknown): Promise<unknown> {
  const token = await getAccessToken();
  const customerId = ENV.googleAdsCustomerId;
  const managerId = ENV.googleAdsManagerId;

  const url = `${ADS_BASE}/customers/${customerId}${path}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`,
      'developer-token': ENV.googleAdsDeveloperToken,
      'login-customer-id': managerId,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Ads API error: ${res.status} ${err}`);
  }

  return res.json();
}

export type Campaign = {
  id: string;
  name: string;
  status: 'ENABLED' | 'PAUSED' | 'REMOVED';
  budgetAmountMicros: string;
  impressions: number;
  clicks: number;
  costMicros: number;
  ctr: number;
};

export async function getCampaigns(): Promise<Campaign[]> {
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign_budget.amount_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.ctr
    FROM campaign
    WHERE campaign.status != 'REMOVED'
    ORDER BY campaign.name
  `;

  const data = await adsRequest('/googleAds:searchStream', { query }) as any[];

  const campaigns: Campaign[] = [];
  for (const chunk of data) {
    for (const row of chunk.results ?? []) {
      campaigns.push({
        id: row.campaign.id,
        name: row.campaign.name,
        status: row.campaign.status,
        budgetAmountMicros: row.campaignBudget?.amountMicros ?? '0',
        impressions: Number(row.metrics?.impressions ?? 0),
        clicks: Number(row.metrics?.clicks ?? 0),
        costMicros: Number(row.metrics?.costMicros ?? 0),
        ctr: Number(row.metrics?.ctr ?? 0),
      });
    }
  }
  return campaigns;
}

export async function pauseCampaign(campaignId: string): Promise<void> {
  await adsRequest('/campaigns:mutate', {
    operations: [{
      update: {
        resourceName: `customers/${ENV.googleAdsCustomerId}/campaigns/${campaignId}`,
        status: 'PAUSED',
      },
      updateMask: 'status',
    }],
  });
}

export async function enableCampaign(campaignId: string): Promise<void> {
  await adsRequest('/campaigns:mutate', {
    operations: [{
      update: {
        resourceName: `customers/${ENV.googleAdsCustomerId}/campaigns/${campaignId}`,
        status: 'ENABLED',
      },
      updateMask: 'status',
    }],
  });
}

export async function updateCampaignBudget(campaignId: string, dailyBudgetRp: number): Promise<void> {
  // First get the budget resource name
  const query = `
    SELECT campaign.id, campaign_budget.resource_name
    FROM campaign
    WHERE campaign.id = '${campaignId}'
  `;
  const data = await adsRequest('/googleAds:searchStream', { query }) as any[];
  const budgetResourceName = data[0]?.results?.[0]?.campaignBudget?.resourceName;
  if (!budgetResourceName) throw new Error('Budget resource not found');

  await adsRequest('/campaignBudgets:mutate', {
    operations: [{
      update: {
        resourceName: budgetResourceName,
        amountMicros: String(dailyBudgetRp * 1_000_000),
      },
      updateMask: 'amount_micros',
    }],
  });
}

export type KeywordPerformance = {
  keyword: string;
  matchType: string;
  impressions: number;
  clicks: number;
  costMicros: number;
  ctr: number;
  qualityScore: number | null;
};

export async function getKeywords(campaignId?: string): Promise<KeywordPerformance[]> {
  const whereClause = campaignId
    ? `WHERE campaign.id = '${campaignId}' AND ad_group_criterion.status != 'REMOVED'`
    : `WHERE ad_group_criterion.status != 'REMOVED'`;

  const query = `
    SELECT
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.ctr,
      ad_group_criterion.quality_info.quality_score
    FROM keyword_view
    ${whereClause}
    ORDER BY metrics.impressions DESC
    LIMIT 100
  `;

  const data = await adsRequest('/googleAds:searchStream', { query }) as any[];
  const keywords: KeywordPerformance[] = [];

  for (const chunk of data) {
    for (const row of chunk.results ?? []) {
      keywords.push({
        keyword: row.adGroupCriterion?.keyword?.text ?? '',
        matchType: row.adGroupCriterion?.keyword?.matchType ?? '',
        impressions: Number(row.metrics?.impressions ?? 0),
        clicks: Number(row.metrics?.clicks ?? 0),
        costMicros: Number(row.metrics?.costMicros ?? 0),
        ctr: Number(row.metrics?.ctr ?? 0),
        qualityScore: row.adGroupCriterion?.qualityInfo?.qualityScore ?? null,
      });
    }
  }
  return keywords;
}

export async function createSearchCampaign(params: {
  name: string;
  dailyBudgetRp: number;
  targetUrl: string;
  keywords: Array<{ text: string; matchType: 'BROAD' | 'PHRASE' | 'EXACT' }>;
  headlines: string[];
  descriptions: string[];
}): Promise<{ campaignId: string }> {
  const customerId = ENV.googleAdsCustomerId;

  // 1. Create budget
  const budgetRes = await adsRequest('/campaignBudgets:mutate', {
    operations: [{
      create: {
        name: `Budget - ${params.name} - ${Date.now()}`,
        amountMicros: String(params.dailyBudgetRp * 1_000_000),
        deliveryMethod: 'STANDARD',
      },
    }],
  }) as any;
  const budgetResourceName = budgetRes.results[0].resourceName;

  // 2. Create campaign
  const campaignRes = await adsRequest('/campaigns:mutate', {
    operations: [{
      create: {
        name: params.name,
        status: 'PAUSED', // always start paused — user enables after review
        advertisingChannelType: 'SEARCH',
        campaignBudget: budgetResourceName,
        targetSpend: {},
        networkSettings: {
          targetGoogleSearch: true,
          targetSearchNetwork: true,
          targetContentNetwork: false,
        },
        geoTargetTypeSetting: {
          positiveGeoTargetType: 'PRESENCE_OR_INTEREST',
        },
      },
    }],
  }) as any;
  const campaignResourceName = campaignRes.results[0].resourceName;
  const campaignId = campaignResourceName.split('/').pop();

  // 3. Create ad group
  const adGroupRes = await adsRequest('/adGroups:mutate', {
    operations: [{
      create: {
        name: `${params.name} - Ad Group 1`,
        campaign: campaignResourceName,
        status: 'ENABLED',
        type: 'SEARCH_STANDARD',
      },
    }],
  }) as any;
  const adGroupResourceName = adGroupRes.results[0].resourceName;

  // 4. Create keywords
  await adsRequest('/adGroupCriteria:mutate', {
    operations: params.keywords.map(kw => ({
      create: {
        adGroup: adGroupResourceName,
        status: 'ENABLED',
        keyword: {
          text: kw.text,
          matchType: kw.matchType,
        },
      },
    })),
  });

  // 5. Create responsive search ad
  await adsRequest('/adGroupAds:mutate', {
    operations: [{
      create: {
        adGroup: adGroupResourceName,
        status: 'ENABLED',
        ad: {
          finalUrls: [params.targetUrl],
          responsiveSearchAd: {
            headlines: params.headlines.slice(0, 15).map((text, i) => ({
              text,
              pinnedField: i === 0 ? 'HEADLINE_1' : undefined,
            })),
            descriptions: params.descriptions.slice(0, 4).map(text => ({ text })),
          },
        },
      },
    }],
  });

  return { campaignId };
}
