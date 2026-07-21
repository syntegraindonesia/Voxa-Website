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
  startDate: string | null;   // YYYY-MM-DD (when campaign started running)
  endDate: string | null;     // YYYY-MM-DD (null = no end set / ongoing)
  activeDays: number | null;  // days between start and (end or today)
};

function daysBetween(startISO: string, endISO: string): number {
  const start = new Date(startISO).getTime();
  const end = new Date(endISO).getTime();
  return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
}

export type DateRange = { startDate: string; endDate: string }; // YYYY-MM-DD

export type AccountBalance = {
  balance: number;              // remaining balance in Rp (0 if exhausted)
  currencyCode: string;         // e.g. "IDR"
  status: 'HEALTHY' | 'LOW' | 'EXHAUSTED' | 'UNKNOWN';
  hasAlert: boolean;            // true if Google Ads has raised a balance alert
  alertMessage: string | null;  // human-readable warning if any
  source: 'BUDGET_API' | 'ALERT_API' | 'UNAVAILABLE';
};

// Fetch current account balance. Uses AccountBudget for prepaid accounts.
// Falls back to alert-based detection ("balance exhausted") if AccountBudget data isn't available.
export async function getAccountBalance(): Promise<AccountBalance> {
  // 1. Try to read active AccountBudget (works for prepaid accounts)
  try {
    const query = `
      SELECT
        account_budget.status,
        account_budget.adjusted_spending_limit_micros,
        account_budget.amount_served_micros,
        account_budget.total_adjustments_micros,
        customer.currency_code
      FROM account_budget
      WHERE account_budget.status = 'APPROVED'
    `;
    const data = await adsRequest('/googleAds:searchStream', { query }) as any[];
    let totalDeposited = 0;
    let totalServed = 0;
    let currencyCode = 'IDR';
    for (const chunk of data) {
      for (const row of chunk.results ?? []) {
        const adjustments = Number(row.accountBudget?.totalAdjustmentsMicros ?? 0);
        const served = Number(row.accountBudget?.amountServedMicros ?? 0);
        totalDeposited += adjustments;
        totalServed += served;
        if (row.customer?.currencyCode) currencyCode = row.customer.currencyCode;
      }
    }
    const balanceMicros = Math.max(0, totalDeposited - totalServed);
    const balance = balanceMicros / 1_000_000;
    const status: AccountBalance['status'] =
      balance <= 0 ? 'EXHAUSTED'
      : balance < 100_000 ? 'LOW'
      : 'HEALTHY';
    if (totalDeposited > 0) {
      return { balance, currencyCode, status, hasAlert: status !== 'HEALTHY', alertMessage: null, source: 'BUDGET_API' };
    }
  } catch (_err) {
    // fall through to alert detection
  }

  // 2. Fallback — read customer alerts to detect "balance exhausted"
  try {
    const query = `
      SELECT customer.currency_code, customer.status
      FROM customer
      LIMIT 1
    `;
    const data = await adsRequest('/googleAds:searchStream', { query }) as any[];
    const currencyCode = data[0]?.results?.[0]?.customer?.currencyCode ?? 'IDR';
    return {
      balance: 0,
      currencyCode,
      status: 'UNKNOWN',
      hasAlert: false,
      alertMessage: 'Saldo tidak tersedia via API — cek langsung di Google Ads dashboard',
      source: 'UNAVAILABLE',
    };
  } catch (_err) {
    return {
      balance: 0,
      currencyCode: 'IDR',
      status: 'UNKNOWN',
      hasAlert: false,
      alertMessage: 'Gagal mengambil saldo',
      source: 'UNAVAILABLE',
    };
  }
}


export type MetricsSummary = {
  spend: number;         // in Rp (already divided from micros)
  clicks: number;
  impressions: number;
  ctr: number;           // 0..1
};

// Subtract n days from an ISO date string, return YYYY-MM-DD
function shiftDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Compute previous equivalent period for a given range
export function previousPeriod(range: DateRange): DateRange {
  const start = new Date(range.startDate);
  const end = new Date(range.endDate);
  const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return {
    startDate: shiftDays(range.startDate, -days),
    endDate: shiftDays(range.startDate, -1),
  };
}

export async function getMetricsSummary(
  range: DateRange,
  opts: { campaignId?: string; onlyActive?: boolean } = {}
): Promise<MetricsSummary> {
  const filters: string[] = [
    `segments.date BETWEEN '${range.startDate}' AND '${range.endDate}'`,
    `campaign.status != 'REMOVED'`,
  ];
  if (opts.campaignId) filters.push(`campaign.id = ${opts.campaignId}`);
  if (opts.onlyActive) filters.push(`campaign.status = 'ENABLED'`);

  const query = `
    SELECT
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros
    FROM campaign
    WHERE ${filters.join(' AND ')}
  `;

  const data = await adsRequest('/googleAds:searchStream', { query }) as any[];
  let impressions = 0, clicks = 0, costMicros = 0;
  for (const chunk of data) {
    for (const row of chunk.results ?? []) {
      impressions += Number(row.metrics?.impressions ?? 0);
      clicks += Number(row.metrics?.clicks ?? 0);
      costMicros += Number(row.metrics?.costMicros ?? 0);
    }
  }
  return {
    spend: costMicros / 1_000_000,
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : 0,
  };
}

export async function getCampaigns(range?: DateRange): Promise<Campaign[]> {
  const dateFilter = range
    ? `AND segments.date BETWEEN '${range.startDate}' AND '${range.endDate}'`
    : '';
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.start_date,
      campaign.end_date,
      campaign_budget.amount_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.ctr
    FROM campaign
    WHERE campaign.status != 'REMOVED'
    ${dateFilter}
  `;

  const data = await adsRequest('/googleAds:searchStream', { query }) as any[];
  const today = new Date().toISOString().slice(0, 10);

  const campaigns: Campaign[] = [];
  for (const chunk of data) {
    for (const row of chunk.results ?? []) {
      const startDate: string | null = row.campaign.startDate ?? null;
      const endDate: string | null = row.campaign.endDate ?? null;
      const activeDays = startDate
        ? daysBetween(startDate, endDate ?? today)
        : null;
      campaigns.push({
        id: row.campaign.id,
        name: row.campaign.name,
        status: row.campaign.status,
        budgetAmountMicros: row.campaignBudget?.amountMicros ?? '0',
        impressions: Number(row.metrics?.impressions ?? 0),
        clicks: Number(row.metrics?.clicks ?? 0),
        costMicros: Number(row.metrics?.costMicros ?? 0),
        ctr: Number(row.metrics?.ctr ?? 0),
        startDate,
        endDate,
        activeDays,
      });
    }
  }

  // Sort: Aktif (ENABLED) → Paused → Non-aktif (ended), each group by newest start_date first
  const priority = (c: Campaign) => {
    const ended = c.endDate != null && c.endDate < today;
    if (ended) return 2;
    if (c.status === 'ENABLED') return 0;
    return 1; // PAUSED
  };
  campaigns.sort((a, b) => {
    const p = priority(a) - priority(b);
    if (p !== 0) return p;
    // within group: newest start_date first
    return (b.startDate ?? '').localeCompare(a.startDate ?? '');
  });

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

export async function getKeywords(campaignId?: string, range?: DateRange): Promise<KeywordPerformance[]> {
  const filters: string[] = [`ad_group_criterion.status != 'REMOVED'`];
  if (campaignId) filters.push(`campaign.id = '${campaignId}'`);
  if (range) filters.push(`segments.date BETWEEN '${range.startDate}' AND '${range.endDate}'`);

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
    WHERE ${filters.join(' AND ')}
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
