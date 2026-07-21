import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  Plus,
  Archive,
  ArchiveRestore,
  Wallet,
  RefreshCw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  DollarSign,
  Target,
  MousePointerClick,
  Eye,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtRp = (micros: number | string) => {
  const n = Number(micros) / 1_000_000;
  return "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });
};

const fmtNum = (n: number) => n.toLocaleString("id-ID");
const fmtPct = (n: number) => (n * 100).toFixed(2) + "%";

// ── Metric Tile ───────────────────────────────────────────────────────────────

function MetricTile({
  icon: Icon,
  label,
  value,
  delta,
  deltaKind = "pct",
  color = "text-[#00B4D8]",
}: {
  icon: any;
  label: string;
  value: string;
  delta?: number | null;
  deltaKind?: "pct" | "pp";
  color?: string;
}) {
  const showDelta = delta != null && !Number.isNaN(delta);
  const positive = showDelta && delta > 0;
  const negative = showDelta && delta < 0;
  const deltaStr = showDelta
    ? deltaKind === "pct"
      ? `${delta > 0 ? "↑" : "↓"} ${Math.abs(delta).toFixed(1)}%`
      : `${delta > 0 ? "↑" : "↓"} ${Math.abs(delta * 100).toFixed(2)} pts`
    : null;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 mb-2">
        <Icon size={14} className={color} />
        {label}
      </div>
      <div className="text-2xl font-bold text-gray-900 tabular-nums">{value}</div>
      {showDelta && (
        <div className={`text-xs mt-1 tabular-nums ${positive ? "text-green-600" : negative ? "text-red-500" : "text-gray-400"}`}>
          {deltaStr} vs periode sebelumnya
        </div>
      )}
    </div>
  );
}

// ── Campaigns Table ───────────────────────────────────────────────────────────

const fmtDate = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const STATUS_FILTERS = [
  { value: "all", label: "Semua" },
  { value: "ENABLED", label: "Aktif" },
  { value: "PAUSED", label: "Paused" },
  { value: "ENDED", label: "Non-aktif" },
  { value: "ARCHIVED", label: "Arsip" },
] as const;

type StatusFilter = typeof STATUS_FILTERS[number]["value"];

// Date range helpers
type RangePreset = "7d" | "30d" | "90d" | "this-month" | "last-month" | "custom";

function computeRange(preset: RangePreset, customStart?: string, customEnd?: string): { startDate: string; endDate: string } {
  const today = new Date();
  const toISO = (d: Date) => d.toISOString().slice(0, 10);
  const daysAgo = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return d; };

  if (preset === "custom" && customStart && customEnd) return { startDate: customStart, endDate: customEnd };
  if (preset === "7d") return { startDate: toISO(daysAgo(7)), endDate: toISO(today) };
  if (preset === "30d") return { startDate: toISO(daysAgo(30)), endDate: toISO(today) };
  if (preset === "90d") return { startDate: toISO(daysAgo(90)), endDate: toISO(today) };
  if (preset === "this-month") {
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    return { startDate: toISO(first), endDate: toISO(today) };
  }
  if (preset === "last-month") {
    const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const last = new Date(today.getFullYear(), today.getMonth(), 0);
    return { startDate: toISO(first), endDate: toISO(last) };
  }
  return { startDate: toISO(daysAgo(30)), endDate: toISO(today) };
}

const RANGE_PRESETS: Array<{ value: RangePreset; label: string }> = [
  { value: "7d", label: "7 hari" },
  { value: "30d", label: "30 hari" },
  { value: "90d", label: "90 hari" },
  { value: "this-month", label: "Bulan ini" },
  { value: "last-month", label: "Bulan lalu" },
  { value: "custom", label: "Kustom" },
];

function CampaignsPanel() {
  const utils = trpc.useUtils();
  const [preset, setPreset] = useState<RangePreset>("30d");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [scope, setScope] = useState<string>("active"); // "all" | "active" | campaignId
  const range = computeRange(preset, customStart, customEnd);
  const { data: campaigns, isLoading, error } = trpc.googleAds.getCampaigns.useQuery(range);
  const { data: summary } = trpc.googleAds.getMetricsSummary.useQuery({ ...range, scope });
  const [filter, setFilter] = useState<StatusFilter>("all");
  const invalidateAll = () => {
    utils.googleAds.getCampaigns.invalidate();
    utils.googleAds.getMetricsSummary.invalidate();
  };
  const pause = trpc.googleAds.pauseCampaign.useMutation({
    onSuccess: () => { invalidateAll(); toast.success("Campaign paused"); },
    onError: (e) => toast.error("Failed: " + e.message),
  });
  const enable = trpc.googleAds.enableCampaign.useMutation({
    onSuccess: () => { invalidateAll(); toast.success("Campaign enabled"); },
    onError: (e) => toast.error("Failed: " + e.message),
  });
  const archive = trpc.googleAds.archiveCampaign.useMutation({
    onSuccess: () => { invalidateAll(); toast.success("Campaign diarsipkan"); },
    onError: (e) => toast.error("Failed: " + e.message),
  });
  const unarchive = trpc.googleAds.unarchiveCampaign.useMutation({
    onSuccess: () => { invalidateAll(); toast.success("Campaign dikembalikan"); },
    onError: (e) => toast.error("Failed: " + e.message),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <Loader2 className="animate-spin mr-2" /> Memuat data kampanye...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
        <div className="font-semibold mb-2">Gagal terhubung ke Google Ads</div>
        <div className="text-sm">{error.message}</div>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const all = campaigns ?? [];
  // Archive view: only archived. All other views: hide archived.
  const filtered = all.filter(c => {
    if (filter === "ARCHIVED") return c.archived;
    if (c.archived) return false;
    if (filter === "all") return true;
    if (filter === "ENDED") return c.endDate != null && c.endDate < today;
    return c.status === filter;
  });

  // Tile values come from the dedicated summary endpoint (respects scope + comparison)
  const totalSpend = (summary?.current.spend ?? 0) * 1_000_000; // fmtRp expects micros
  const totalClicks = summary?.current.clicks ?? 0;
  const totalImpressions = summary?.current.impressions ?? 0;
  const avgCtr = summary?.current.ctr ?? 0;
  const deltas = summary?.deltas ?? { spend: null, clicks: null, impressions: null, ctr: null };

  // Non-archived, non-removed campaigns available in the scope selector
  const selectableCampaigns = all.filter(c => !c.archived);

  return (
    <div className="space-y-6">
      {/* Date range + campaign scope */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Rentang</div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {RANGE_PRESETS.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPreset(p.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    preset === p.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {preset === "custom" && (
              <div className="flex items-center gap-2">
                <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs" />
                <span className="text-gray-400 text-xs">→</span>
                <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs" />
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500 tabular-nums">
            {fmtDate(range.startDate)} — {fmtDate(range.endDate)}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
          <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Kampanye</div>
          <select
            value={scope}
            onChange={e => setScope(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white font-medium min-w-[200px]"
          >
            <option value="active">Semua Aktif</option>
            <option value="all">Semua (termasuk paused)</option>
            <optgroup label="Kampanye individual">
              {selectableCampaigns.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </optgroup>
          </select>
          <div className="text-xs text-gray-400">
            Dibandingkan dgn: {summary?.previousRange ? `${fmtDate(summary.previousRange.startDate)} — ${fmtDate(summary.previousRange.endDate)}` : "—"}
          </div>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricTile icon={DollarSign} label="Total Spend" value={fmtRp(totalSpend)} delta={deltas.spend} />
        <MetricTile icon={MousePointerClick} label="Total Clicks" value={fmtNum(totalClicks)} delta={deltas.clicks} />
        <MetricTile icon={Eye} label="Impressions" value={fmtNum(totalImpressions)} delta={deltas.impressions} />
        <MetricTile icon={Target} label="Avg CTR" value={fmtPct(avgCtr)} delta={deltas.ctr} deltaKind="pp" />
      </div>

      {/* Campaigns table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-bold text-gray-900">Kampanye ({filtered.length})</h3>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  filter === f.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            {campaigns?.length === 0
              ? 'Belum ada kampanye. Buat kampanye baru di tab "Buat Kampanye".'
              : `Tidak ada kampanye dengan status ${STATUS_FILTERS.find(f => f.value === filter)?.label}.`}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Mulai</th>
                  <th className="px-6 py-3">Berakhir</th>
                  <th className="px-6 py-3 text-right">Durasi</th>
                  <th className="px-6 py-3">Budget/Hari</th>
                  <th className="px-6 py-3 text-right">Impressions</th>
                  <th className="px-6 py-3 text-right">Clicks</th>
                  <th className="px-6 py-3 text-right">CTR</th>
                  <th className="px-6 py-3 text-right">Spend</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => {
                  const isEnded = c.endDate != null && c.endDate < today;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                      <td className="px-6 py-4">
                        {isEnded ? (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Non-aktif</Badge>
                        ) : c.status === "ENABLED" ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">Paused</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{fmtDate(c.startDate)}</td>
                      <td className="px-6 py-4 text-gray-600">{c.endDate ? fmtDate(c.endDate) : <span className="text-gray-400 italic">Ongoing</span>}</td>
                      <td className="px-6 py-4 text-right text-gray-600">{c.activeDays != null ? `${c.activeDays} hari` : "—"}</td>
                      <td className="px-6 py-4">{fmtRp(c.budgetAmountMicros)}</td>
                      <td className="px-6 py-4 text-right">{fmtNum(c.impressions)}</td>
                      <td className="px-6 py-4 text-right">{fmtNum(c.clicks)}</td>
                      <td className="px-6 py-4 text-right">{fmtPct(c.ctr)}</td>
                      <td className="px-6 py-4 text-right">{fmtRp(c.costMicros)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {filter === "ARCHIVED" ? (
                            <Button size="sm" variant="outline" onClick={() => unarchive.mutate({ campaignId: c.id })} disabled={unarchive.isPending}>
                              <ArchiveRestore size={12} className="mr-1" /> Kembalikan
                            </Button>
                          ) : (
                            <>
                              {isEnded ? null : c.status === "ENABLED" ? (
                                <Button size="sm" variant="outline" onClick={() => pause.mutate({ campaignId: c.id })} disabled={pause.isPending}>
                                  <Pause size={12} className="mr-1" /> Pause
                                </Button>
                              ) : (
                                <Button size="sm" className="bg-[#00B4D8] hover:bg-[#0099bb]" onClick={() => enable.mutate({ campaignId: c.id })} disabled={enable.isPending}>
                                  <Play size={12} className="mr-1" /> Enable
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => archive.mutate({ campaignId: c.id })} disabled={archive.isPending} title="Arsipkan">
                                <Archive size={12} />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Keywords Panel ────────────────────────────────────────────────────────────

function KeywordsPanel() {
  const [preset, setPreset] = useState<RangePreset>("30d");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [campaignId, setCampaignId] = useState<string>("");
  const range = computeRange(preset, customStart, customEnd);

  const { data: campaigns } = trpc.googleAds.getCampaigns.useQuery(range);
  const { data: keywords, isLoading, error } = trpc.googleAds.getKeywords.useQuery({
    campaignId: campaignId || undefined,
    startDate: range.startDate,
    endDate: range.endDate,
  });

  const selectableCampaigns = (campaigns ?? []).filter(c => !c.archived);

  return (
    <div className="space-y-6">
      {/* Date range + campaign scope */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Rentang</div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {RANGE_PRESETS.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPreset(p.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    preset === p.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {preset === "custom" && (
              <div className="flex items-center gap-2">
                <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs" />
                <span className="text-gray-400 text-xs">→</span>
                <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs" />
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500 tabular-nums">
            {fmtDate(range.startDate)} — {fmtDate(range.endDate)}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
          <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Kampanye</div>
          <select
            value={campaignId}
            onChange={e => setCampaignId(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white font-medium min-w-[200px]"
          >
            <option value="">Semua Kampanye</option>
            {selectableCampaigns.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-400 py-8 text-center"><Loader2 className="animate-spin inline mr-2" /> Memuat keywords...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
          <div className="font-semibold mb-2">Gagal memuat keywords</div>
          <div className="text-sm">{error.message}</div>
        </div>
      ) : (
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Top Keywords ({keywords?.length ?? 0})</h3>
        </div>
        {(keywords?.length ?? 0) === 0 ? (
          <div className="p-12 text-center text-gray-400">Belum ada data keywords untuk rentang ini.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Keyword</th>
                  <th className="px-6 py-3">Match Type</th>
                  <th className="px-6 py-3 text-right">Impressions</th>
                  <th className="px-6 py-3 text-right">Clicks</th>
                  <th className="px-6 py-3 text-right">CTR</th>
                  <th className="px-6 py-3 text-right">Spend</th>
                  <th className="px-6 py-3 text-right">Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {keywords!.map((k, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{k.keyword}</td>
                    <td className="px-6 py-4"><Badge variant="outline">{k.matchType}</Badge></td>
                    <td className="px-6 py-4 text-right">{fmtNum(k.impressions)}</td>
                    <td className="px-6 py-4 text-right">{fmtNum(k.clicks)}</td>
                    <td className="px-6 py-4 text-right">{fmtPct(k.ctr)}</td>
                    <td className="px-6 py-4 text-right">{fmtRp(k.costMicros)}</td>
                    <td className="px-6 py-4 text-right">
                      {k.qualityScore != null ? (
                        <Badge className={k.qualityScore >= 7 ? "bg-green-100 text-green-700" : k.qualityScore >= 4 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}>
                          {k.qualityScore}/10
                        </Badge>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

// ── Create Campaign Panel ─────────────────────────────────────────────────────

function CreateCampaignPanel() {
  const utils = trpc.useUtils();
  const [name, setName] = useState("");
  const [targetUrl, setTargetUrl] = useState("https://voxa.co.id");
  const [topic, setTopic] = useState("");
  const [dailyBudget, setDailyBudget] = useState(50000);
  const [keywords, setKeywords] = useState<Array<{ text: string; matchType: "BROAD"|"PHRASE"|"EXACT"; rationale?: string }>>([]);
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);

  const suggestKw = trpc.googleAds.suggestKeywords.useMutation({
    onSuccess: (d) => { setKeywords(d.keywords); toast.success(`${d.keywords.length} keywords disarankan Claude`); },
    onError: (e) => toast.error(e.message),
  });
  const suggestCopy = trpc.googleAds.suggestAdCopy.useMutation({
    onSuccess: (d) => { setHeadlines(d.headlines); setDescriptions(d.descriptions); toast.success("Ad copy dibuat"); },
    onError: (e) => toast.error(e.message),
  });
  const create = trpc.googleAds.createCampaign.useMutation({
    onSuccess: () => {
      toast.success("Kampanye dibuat (status PAUSED — aktifkan di tab Kampanye)");
      // Clear form
      setName("");
      setTopic("");
      setKeywords([]);
      setHeadlines([]);
      setDescriptions([]);
      // Refresh campaign list so the new one shows up in Kampanye tab
      utils.googleAds.getCampaigns.invalidate();
      utils.googleAds.getMetricsSummary.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const canPublish = name && targetUrl && keywords.length >= 3 && headlines.length >= 3 && descriptions.length >= 2;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Setup */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Sparkles size={18} className="text-[#00B4D8]" />
          Buat Kampanye Baru
        </h3>

        <div>
          <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Nama Kampanye</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="VOXA Brand - Homepage" className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#00B4D8] outline-none" />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Landing URL</label>
          <input value={targetUrl} onChange={e => setTargetUrl(e.target.value)} className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#00B4D8] outline-none" />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Topik (untuk AI)</label>
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Sepeda listrik VOXA di Indonesia" className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#00B4D8] outline-none" />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Budget Harian (Rp)</label>
          <input type="number" value={dailyBudget} onChange={e => setDailyBudget(Number(e.target.value))} className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#00B4D8] outline-none" />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" disabled={!topic || suggestKw.isPending} onClick={() => suggestKw.mutate({ targetUrl, topic })}>
            {suggestKw.isPending ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} className="mr-1" />} Saran Keywords
          </Button>
          <Button variant="outline" className="flex-1" disabled={!topic || keywords.length === 0 || suggestCopy.isPending} onClick={() => suggestCopy.mutate({ targetUrl, topic, keywords: keywords.map(k => k.text) })}>
            {suggestCopy.isPending ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} className="mr-1" />} Saran Ad Copy
          </Button>
        </div>

        <Button
          className="w-full bg-[#00B4D8] hover:bg-[#0099bb]"
          disabled={!canPublish || create.isPending}
          onClick={() => create.mutate({ name, targetUrl, dailyBudgetRp: dailyBudget, keywords: keywords.map(k => ({ text: k.text, matchType: k.matchType })), headlines, descriptions })}
        >
          {create.isPending ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} className="mr-1" />}
          Buat Kampanye (PAUSED)
        </Button>
        <p className="text-xs text-gray-500">Kampanye dibuat dalam status PAUSED. Review & aktifkan dari tab Kampanye setelah dibuat.</p>
      </div>

      {/* Right: Preview */}
      <div className="space-y-4">
        {/* Keywords */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h4 className="font-bold text-gray-900 mb-3">Keywords ({keywords.length})</h4>
          {keywords.length === 0 ? (
            <div className="text-sm text-gray-400 py-4 text-center">Klik "Saran Keywords" untuk membuat</div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {keywords.map((kw, i) => (
                <div key={i} className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{kw.text}</div>
                    {kw.rationale && <div className="text-xs text-gray-500 truncate">{kw.rationale}</div>}
                  </div>
                  <select value={kw.matchType} onChange={e => {
                    const next = [...keywords]; next[i] = { ...kw, matchType: e.target.value as any }; setKeywords(next);
                  }} className="text-xs border border-gray-200 rounded px-2 py-1">
                    <option>BROAD</option><option>PHRASE</option><option>EXACT</option>
                  </select>
                  <button onClick={() => setKeywords(keywords.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ad Copy */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h4 className="font-bold text-gray-900 mb-3">Ad Copy</h4>
          {headlines.length === 0 ? (
            <div className="text-sm text-gray-400 py-4 text-center">Klik "Saran Ad Copy" setelah punya keywords</div>
          ) : (
            <div className="space-y-3">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Headlines ({headlines.length})</div>
                <div className="space-y-1">
                  {headlines.map((h, i) => (
                    <div key={i} className="text-sm bg-blue-50 rounded px-2 py-1 flex justify-between">
                      <span className="truncate">{h}</span>
                      <span className="text-xs text-gray-400 ml-2">{h.length}/30</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Descriptions ({descriptions.length})</div>
                <div className="space-y-1">
                  {descriptions.map((d, i) => (
                    <div key={i} className="text-sm bg-blue-50 rounded px-2 py-1 flex justify-between">
                      <span className="truncate">{d}</span>
                      <span className="text-xs text-gray-400 ml-2">{d.length}/90</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── AI Recommendations Panel ──────────────────────────────────────────────────

function RecommendationsPanel() {
  const [recs, setRecs] = useState<any[]>([]);
  const utils = trpc.useUtils();

  const analyze = trpc.googleAds.getRecommendations.useMutation({
    onSuccess: (d) => { setRecs(d.recommendations); toast.success(`${d.recommendations.length} rekomendasi ditemukan`); },
    onError: (e) => toast.error(e.message),
  });

  const invalidate = () => {
    utils.googleAds.getCampaigns.invalidate();
    utils.googleAds.getMetricsSummary.invalidate();
  };
  const removeRec = (idx: number) => setRecs(prev => prev.filter((_, i) => i !== idx));

  const pause = trpc.googleAds.pauseCampaign.useMutation();
  const enable = trpc.googleAds.enableCampaign.useMutation();
  const budget = trpc.googleAds.updateBudget.useMutation();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900">Rekomendasi dari Claude</h3>
          <p className="text-sm text-gray-500">Analisis penuh performa akun + saran actionable</p>
        </div>
        <Button className="bg-[#00B4D8] hover:bg-[#0099bb]" onClick={() => analyze.mutate()} disabled={analyze.isPending}>
          {analyze.isPending ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} className="mr-1" />}
          Analisis Sekarang
        </Button>
      </div>

      {recs.length === 0 && !analyze.isPending && (
        <div className="text-center py-12 text-gray-400">Klik "Analisis Sekarang" untuk mendapatkan rekomendasi.</div>
      )}

      {recs.map((r, i) => {
        const sev = r.severity === "HIGH" ? "bg-red-50 border-red-200" : r.severity === "MEDIUM" ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200";
        const sevText = r.severity === "HIGH" ? "text-red-700" : r.severity === "MEDIUM" ? "text-yellow-700" : "text-blue-700";
        return (
          <div key={i} className={`border rounded-2xl p-6 ${sev}`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className={`flex items-center gap-2 text-xs uppercase tracking-wide font-bold mb-1 ${sevText}`}>
                  {r.severity === "HIGH" ? <AlertCircle size={14} /> : <TrendingUp size={14} />}
                  {r.severity} · {r.type?.replace(/_/g, " ")}
                </div>
                <h4 className="text-lg font-bold text-gray-900">{r.title}</h4>
              </div>
              <button onClick={() => setRecs(recs.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="text-sm text-gray-700 mb-3"><span className="font-semibold">Alasan: </span>{r.reasoning}</div>
            <div className="text-sm text-gray-700 mb-4"><span className="font-semibold">Dampak: </span>{r.expected_impact}</div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-[#00B4D8] hover:bg-[#0099bb]" onClick={() => {
                const d = r.action_details ?? {};
                const onOk = (msg: string) => () => { invalidate(); removeRec(i); toast.success(msg); };
                const onFail = (e: any) => toast.error("Gagal: " + (e?.message ?? "unknown"));
                if (r.type === "PAUSE_CAMPAIGN" && d.campaignId) {
                  pause.mutate({ campaignId: d.campaignId }, { onSuccess: onOk("Campaign paused"), onError: onFail });
                } else if (r.type === "ENABLE_CAMPAIGN" && d.campaignId) {
                  enable.mutate({ campaignId: d.campaignId }, { onSuccess: onOk("Campaign enabled"), onError: onFail });
                } else if ((r.type === "INCREASE_BUDGET" || r.type === "DECREASE_BUDGET") && d.campaignId && d.newDailyBudgetRp) {
                  budget.mutate({ campaignId: d.campaignId, dailyBudgetRp: d.newDailyBudgetRp }, { onSuccess: onOk("Budget updated"), onError: onFail });
                } else {
                  toast.info("Aksi manual diperlukan untuk rekomendasi ini — lakukan di Google Ads dashboard");
                }
              }}>
                <CheckCircle2 size={12} className="mr-1" /> Setujui
              </Button>
              <Button size="sm" variant="outline" onClick={() => setRecs(recs.filter((_, idx) => idx !== i))}>
                <X size={12} className="mr-1" /> Tolak
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Saldo (Balance) Pill ──────────────────────────────────────────────────────

function SaldoPill() {
  const { data, isFetching, refetch } = trpc.googleAds.getAccountBalance.useQuery(undefined, {
    refetchInterval: 60_000, // auto-refresh every 60s
    refetchOnWindowFocus: true,
  });

  const status = data?.status ?? "UNKNOWN";
  const tone =
    status === "HEALTHY" ? "bg-green-50 border-green-200 text-green-700"
    : status === "LOW" ? "bg-yellow-50 border-yellow-200 text-yellow-700"
    : status === "EXHAUSTED" ? "bg-red-50 border-red-200 text-red-700"
    : "bg-gray-50 border-gray-200 text-gray-600";

  const label =
    status === "HEALTHY" ? "Sehat"
    : status === "LOW" ? "Saldo Menipis"
    : status === "EXHAUSTED" ? "Habis"
    : "Cek Manual";

  return (
    <div className={`border rounded-2xl px-5 py-3 flex items-center gap-4 ${tone}`}>
      <div className="flex items-center gap-2">
        <Wallet size={16} />
        <div className="text-xs uppercase tracking-wide font-semibold">Saldo Google Ads</div>
      </div>
      <div className="flex flex-col">
        <div className="text-xl font-bold tabular-nums leading-tight">
          {data?.source === "UNAVAILABLE"
            ? "—"
            : "Rp " + (data?.balance ?? 0).toLocaleString("id-ID")}
        </div>
        <div className="text-[10px] uppercase tracking-wide font-semibold opacity-70">{label}</div>
      </div>
      <button
        onClick={() => refetch()}
        disabled={isFetching}
        className="ml-2 p-1.5 rounded-lg hover:bg-white/50 disabled:opacity-50"
        title="Refresh"
      >
        <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminAds() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Admin Panel</div>
            <h1 className="text-3xl font-bold text-gray-900">
              Google Ads <span className="text-[#00B4D8]">Dashboard</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Kelola kampanye Google Ads VOXA — didukung Claude</p>
          </div>
          <SaldoPill />
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="campaigns">Kampanye</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="create">Buat Kampanye</TabsTrigger>
            <TabsTrigger value="ai">Rekomendasi AI</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns"><CampaignsPanel /></TabsContent>
          <TabsContent value="keywords"><KeywordsPanel /></TabsContent>
          <TabsContent value="create"><CreateCampaignPanel /></TabsContent>
          <TabsContent value="ai"><RecommendationsPanel /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
