import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  X,
  Eye,
  Search,
  Bot,
  Image as ImageIcon,
  FileText,
  Zap,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

// ── Types (mirror seoAudit.ts) ────────────────────────────────────────────────

type PageFinding = {
  id: string;
  path: string;
  category: "SEO" | "GEO";
  severity: "HIGH" | "MEDIUM" | "LOW";
  fixType: string;
  title: string;
  issue: string;
  currentValue: string | null;
  suggestedValue: string | null;
  expectedImpact: string;
};

type PageAudit = {
  path: string;
  name: string;
  fetchedAt: string;
  ok: boolean;
  status: number;
  seoScore: number;
  geoScore: number;
  breakdown: Record<string, number>;
  findings: PageFinding[];
};

type SiteAudit = {
  seoScore: number;
  geoScore: number;
  pages: PageAudit[];
  siteFindings: PageFinding[];
  fetchedAt: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const grade = (n: number): string => (n >= 90 ? "A" : n >= 80 ? "B" : n >= 65 ? "C" : n >= 50 ? "D" : "F");
const gradeClass = (n: number) => {
  const g = grade(n);
  if (g === "A" || g === "B") return "bg-green-100 text-green-700";
  if (g === "C" || g === "D") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};
const pillClass = (n: number) => {
  if (n >= 80) return "bg-green-100 text-green-700";
  if (n >= 60) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

const fixIcon: Record<string, any> = {
  meta_description: FileText,
  title: FileText,
  h1: FileText,
  alt_text: ImageIcon,
  og_tags: MessageSquare,
  json_ld: Bot,
  faq: MessageSquare,
  llms_txt: Bot,
  thin_content: FileText,
  canonical: Search,
  robots: Search,
};

const fmtDateTime = (iso?: string | Date) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

// ── Score tile ────────────────────────────────────────────────────────────────

function ScoreTile({ label, score, kind, breakdown }: {
  label: string;
  score: number;
  kind: "SEO" | "GEO";
  breakdown: Record<string, number>;
}) {
  const items = kind === "SEO"
    ? [["Meta tags", "metaTags"], ["Headings", "headings"], ["Images", "images"], ["Content", "content"], ["Structured data", "structuredData"], ["Technical", "technical"]]
    : [["Explicit facts", "explicitFacts"], ["JSON-LD schema", "jsonLdSchema"], ["FAQ sections", "faqSections"], ["E-E-A-T signals", "eeatSignals"], ["Spec tables", "specTables"], ["llms.txt file", "llmsTxt"]];
  const stripe = kind === "SEO" ? "from-[#37C5FF] to-[#0A4A63]" : "from-purple-500 to-blue-500";
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stripe}`} />
      <div className="flex justify-between items-start mb-4">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
          {kind === "SEO" ? <Search size={14} className="text-[#37C5FF]" /> : <Bot size={14} className="text-purple-500" />}
          Skor {kind} {kind === "SEO" ? "Website" : "(LLM Optimization)"}
        </div>
        <div className={`text-2xl font-extrabold px-3 py-1 rounded-lg ${gradeClass(score)}`}>{grade(score)}</div>
      </div>
      <div className="text-4xl font-extrabold tracking-tight tabular-nums">
        {score}<span className="text-lg font-semibold text-gray-400">/100</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
        {items.map(([label, key]) => (
          <div key={key}>{label}: <b className="text-gray-900 tabular-nums">{breakdown[key] ?? 0}</b></div>
        ))}
      </div>
    </div>
  );
}

// ── Finding card ──────────────────────────────────────────────────────────────

// Build the exact HTML snippet that will be injected into <head> for preview
function buildInjectedTag(fixType: string, value: string): string {
  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (!value) return "";
  if (fixType === "meta_description") return `<meta name="description" content="${escape(value)}">`;
  if (fixType === "title") return `<title>${escape(value)}</title>`;
  if (fixType === "canonical") return `<link rel="canonical" href="${escape(value)}">`;
  if (fixType === "robots") return `<meta name="robots" content="${escape(value)}">`;
  if (fixType === "og_tags") {
    try {
      const og = JSON.parse(value);
      const t = og.title ?? og.ogTitle ?? "";
      const d = og.description ?? og.ogDescription ?? "";
      const i = og.image ?? og.ogImage ?? "";
      return [
        t && `<meta property="og:title" content="${escape(t)}">`,
        d && `<meta property="og:description" content="${escape(d)}">`,
        i && `<meta property="og:image" content="${escape(i)}">`,
      ].filter(Boolean).join("\n");
    } catch {
      return `<meta property="og:description" content="${escape(value)}">`;
    }
  }
  if (fixType === "json_ld" || fixType === "faq") {
    return `<script type="application/ld+json">\n${value}\n</script>`;
  }
  if (fixType === "h1" || fixType === "multiple_h1") {
    return `<!-- Injected into <body> before React root, visible to crawlers, styled with sr-only pattern -->\n<h1 style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">${escape(value)}</h1>`;
  }
  if (fixType === "llms_txt") {
    return `# File yang akan dibuat di https://voxa.co.id/llms.txt:\n\n${value}`;
  }
  return value;
}

function FindingCard({ f, onApplied }: { f: PageFinding; onApplied: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [editValue, setEditValue] = useState(f.suggestedValue && f.suggestedValue !== "MANUAL" && f.suggestedValue !== "AUTO" ? f.suggestedValue : "");
  const [dirty, setDirty] = useState(false);

  const apply = trpc.seo.applyFix.useMutation({
    onSuccess: () => { toast.success(`Fix diterapkan ke ${f.path}`); onApplied(); },
    onError: (e) => toast.error("Gagal: " + e.message),
  });

  const suggest = trpc.seo.suggestFix.useMutation({
    onSuccess: (d) => {
      setEditValue(d.suggestion ?? "");
      toast.success("Saran AI dibuat — silakan review sebelum apply");
    },
    onError: (e) => toast.error("Gagal generate: " + e.message),
  });

  const sevBg = f.category === "GEO"
    ? "bg-purple-50 border-purple-500"
    : f.severity === "HIGH" ? "bg-red-50 border-red-500"
    : f.severity === "MEDIUM" ? "bg-yellow-50 border-yellow-500"
    : "bg-blue-50 border-blue-500";
  const sevText = f.category === "GEO" ? "text-purple-700"
    : f.severity === "HIGH" ? "text-red-700"
    : f.severity === "MEDIUM" ? "text-yellow-700"
    : "text-blue-700";
  const Icon = fixIcon[f.fixType] ?? Sparkles;

  const isManualOnly = f.fixType === "thin_content" || f.fixType === "fetch_error" || f.fixType === "alt_text";
  const injectedPreview = buildInjectedTag(f.fixType, editValue);

  const handleApply = () => {
    if (!editValue.trim()) {
      toast.error("Isi dulu nilai fix-nya (atau klik 🤖 Buat Saran AI)");
      return;
    }
    apply.mutate({
      findingId: f.id,
      path: f.path,
      fixType: f.fixType,
      value: editValue,
    });
  };

  return (
    <div className={`border-l-4 border rounded-xl p-5 ${sevBg}`}>
      <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 ${sevText}`}>
        <Icon size={12} />
        {f.severity} · {f.category} · {f.fixType.replace(/_/g, " ")}
      </div>
      <h4 className="text-base font-bold text-gray-900 mb-3">{f.title}</h4>

      <div className="text-sm text-gray-700 mb-2">
        <span className="font-semibold">Halaman:</span>{" "}
        <code className="text-xs bg-black/5 px-1.5 py-0.5 rounded">{f.path}</code>
      </div>
      <div className="text-sm text-gray-700 mb-2">
        <span className="font-semibold">Masalah:</span> {f.issue}
      </div>
      <div className="text-sm text-gray-700 mb-3">
        <span className="font-semibold">Dampak:</span> {f.expectedImpact}
      </div>

      {/* Collapsed state: just show the action buttons */}
      {!expanded && (
        <div className="flex gap-2 flex-wrap">
          {isManualOnly ? (
            <div className="text-xs text-gray-500 italic">
              Fix ini perlu edit manual di source code — tidak bisa auto-apply.
            </div>
          ) : (
            <>
              <Button size="sm" className="bg-[#37C5FF] hover:bg-[#0A4A63]" onClick={() => setExpanded(true)}>
                <Eye size={12} className="mr-1" /> Preview &amp; Setujui
              </Button>
              <Button size="sm" variant="outline" onClick={onApplied}>
                <X size={12} className="mr-1" /> Tolak
              </Button>
            </>
          )}
        </div>
      )}

      {/* Expanded state: preview + editable value + apply */}
      {expanded && !isManualOnly && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          {/* Current value */}
          <div>
            <div className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-1">
              🔴 Saat ini di halaman
            </div>
            <div className="bg-red-50 border-l-2 border-red-400 rounded p-2 text-xs font-mono text-gray-700 break-words">
              {f.currentValue ?? <em className="not-italic text-gray-400">(tidak ada — tag belum di-set)</em>}
            </div>
          </div>

          {/* Editable value */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                ✏️ Nilai yang akan diterapkan (editable)
              </div>
              {!editValue && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    suggest.mutate({
                      path: f.path,
                      fixType: f.fixType,
                      title: f.title,
                      issue: f.issue,
                      currentValue: f.currentValue,
                    })
                  }
                  disabled={suggest.isPending}
                >
                  {suggest.isPending ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} className="mr-1" />}
                  Buat Saran AI
                </Button>
              )}
            </div>
            <textarea
              value={editValue}
              onChange={(e) => { setEditValue(e.target.value); setDirty(true); }}
              rows={f.fixType === "json_ld" || f.fixType === "faq" || f.fixType === "llms_txt" ? 8 : 3}
              placeholder={
                f.fixType === "og_tags"
                  ? '{"title":"...","description":"...","image":"https://..."}'
                  : f.fixType === "json_ld" || f.fixType === "faq"
                  ? '{ "@context":"https://schema.org", "@type":"..." }'
                  : "Ketik nilai fix di sini, atau klik 'Buat Saran AI'…"
              }
              className="w-full text-sm p-3 border border-gray-300 rounded font-mono resize-y"
            />
            {dirty && f.suggestedValue && editValue !== f.suggestedValue && (
              <div className="text-xs text-yellow-700 mt-1">
                ⚠️ Kamu sudah mengedit saran AI. Kalau ingin kembali, klik reset.
                <button
                  className="ml-1 underline"
                  onClick={() => { setEditValue(f.suggestedValue ?? ""); setDirty(false); }}
                >
                  Reset ke saran AI
                </button>
              </div>
            )}
          </div>

          {/* HTML injection preview */}
          {editValue && (
            <div>
              <div className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-1">
                🟢 Kode yang akan ditambahkan ke &lt;head&gt;
              </div>
              <pre className="bg-green-50 border-l-2 border-green-400 rounded p-3 text-xs font-mono text-gray-800 whitespace-pre-wrap break-words overflow-x-auto">
                {injectedPreview}
              </pre>
              <div className="text-xs text-gray-500 mt-1">
                Perubahan ini langsung terlihat oleh Google &amp; AI crawlers di next crawl. Tidak perlu deploy ulang.
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 flex-wrap border-t border-gray-200 pt-3">
            <Button
              size="sm"
              className="bg-[#37C5FF] hover:bg-[#0A4A63]"
              onClick={handleApply}
              disabled={apply.isPending || !editValue.trim()}
            >
              {apply.isPending ? <Loader2 className="animate-spin" size={12} /> : <CheckCircle2 size={12} className="mr-1" />}
              Konfirmasi &amp; Terapkan
            </Button>
            <Button size="sm" variant="outline" onClick={() => setExpanded(false)}>
              Batal
            </Button>
            <a
              href={`https://voxa.co.id${f.path}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-md hover:border-gray-400"
            >
              <Eye size={12} /> Buka halaman
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminSeo() {
  const utils = trpc.useUtils();
  const { data: latest, isLoading } = trpc.seo.getLatest.useQuery();
  const runAudit = trpc.seo.runAudit.useMutation({
    onSuccess: () => { utils.seo.getLatest.invalidate(); toast.success("Audit selesai"); },
    onError: (e) => toast.error("Audit gagal: " + e.message),
  });

  // Local dismissal set — hides findings on this session without persisting
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const dismiss = (id: string) => setDismissed(prev => new Set(prev).add(id));

  const audit = (latest?.data as SiteAudit | undefined) ?? null;
  const allFindings = audit
    ? [...audit.siteFindings, ...audit.pages.flatMap(p => p.findings)].filter(f => !dismissed.has(f.id))
    : [];
  const bySeverity = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  allFindings.forEach(f => { bySeverity[f.severity]++; });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Admin Panel</div>
            <h1 className="text-3xl font-bold text-gray-900">
              SEO / GEO <span className="text-[#37C5FF]">Optimizer</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Audit dan perbaiki performa SEO tradisional + Generative Engine Optimization</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-gray-500">
              Terakhir: <b className="text-gray-900 tabular-nums">{fmtDateTime(latest?.createdAt)}</b>
            </span>
            <Button
              className="bg-[#37C5FF] hover:bg-[#0A4A63]"
              onClick={() => runAudit.mutate()}
              disabled={runAudit.isPending}
            >
              {runAudit.isPending ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} className="mr-1" />}
              Analisis Sekarang
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-16 text-gray-400"><Loader2 className="animate-spin inline mr-2" /> Memuat…</div>
        )}

        {!isLoading && !audit && (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
            <Search size={40} className="mx-auto text-gray-300 mb-3" />
            <div className="text-lg font-bold text-gray-900">Belum ada audit</div>
            <p className="text-sm text-gray-500 mt-1">Klik "Analisis Sekarang" untuk memulai scan pertama.</p>
          </div>
        )}

        {audit && (
          <>
            {/* Score tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <ScoreTile label="SEO" score={audit.seoScore} kind="SEO" breakdown={
                audit.pages.reduce((acc, p) => {
                  Object.entries(p.breakdown).forEach(([k, v]) => {
                    acc[k] = (acc[k] ?? 0) + v;
                  });
                  return acc;
                }, {} as Record<string, number>)
              } />
              <ScoreTile label="GEO" score={audit.geoScore} kind="GEO" breakdown={
                audit.pages.reduce((acc, p) => {
                  Object.entries(p.breakdown).forEach(([k, v]) => {
                    acc[k] = (acc[k] ?? 0) + v;
                  });
                  return acc;
                }, {} as Record<string, number>)
              } />
            </div>

            {/* Priority findings */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Rekomendasi Prioritas</h2>
              <div className="text-xs text-gray-500">
                {allFindings.length} fix —{" "}
                <b className="text-red-600">{bySeverity.HIGH} high</b>,{" "}
                <b className="text-yellow-600">{bySeverity.MEDIUM} medium</b>,{" "}
                <b className="text-blue-600">{bySeverity.LOW} low</b>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {allFindings.length === 0 && (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl text-gray-400">
                  Semua fix sudah diterapkan atau tidak ada issue prioritas.
                </div>
              )}
              {allFindings
                .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "HIGH" ? -1 : b.severity === "HIGH" ? 1 : a.severity === "MEDIUM" ? -1 : 1))
                .slice(0, 20)
                .map(f => (
                  <FindingCard key={f.id} f={f} onApplied={() => dismiss(f.id)} />
                ))}
            </div>

            {/* Per-page table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Skor per Halaman</h3>
                <div className="text-xs text-gray-500">Klik row untuk detail lengkap</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-6 py-3">Halaman</th>
                      <th className="px-6 py-3 text-center">Skor SEO</th>
                      <th className="px-6 py-3 text-center">Skor GEO</th>
                      <th className="px-6 py-3 text-center">Grade</th>
                      <th className="px-6 py-3 text-right">Issues</th>
                      <th className="px-6 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {audit.pages.map(p => (
                      <tr key={p.path} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold">{p.name}</div>
                          <div className="text-xs text-gray-400 font-mono">https://voxa.co.id{p.path}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums ${pillClass(p.seoScore)}`}>
                            {p.seoScore}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums ${pillClass(p.geoScore)}`}>
                            {p.geoScore}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold">
                          {grade(Math.round((p.seoScore + p.geoScore) / 2))}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums">
                          {p.findings.filter(f => !dismissed.has(f.id)).length}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a
                            href={`https://voxa.co.id${p.path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:border-gray-400"
                          >
                            <Eye size={12} /> Buka halaman
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
