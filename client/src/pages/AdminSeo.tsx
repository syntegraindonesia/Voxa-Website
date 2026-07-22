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

// Sensible default template per fix type — pre-fills textarea so button
// is never stuck disabled if AI hasn't run yet. User can edit or click
// "Buat Saran AI" to have Claude generate a better version.
function defaultTemplate(fixType: string, path: string): string {
  const url = `https://voxa.co.id${path === "/" ? "" : path}`;
  switch (fixType) {
    case "meta_description":
      return "VOXA — Sepeda listrik asli Indonesia. Baterai lithium, garansi resmi, harga mulai Rp 3.4jt. Beli online atau kunjungi showroom terdekat.";
    case "title":
      return "VOXA — Sepeda Listrik Asli Indonesia";
    case "h1":
    case "multiple_h1":
      return "VOXA — Sepeda Listrik Asli Indonesia";
    case "canonical":
      return url;
    case "robots":
      return "index, follow";
    case "og_tags":
      return JSON.stringify({
        title: "VOXA — Sepeda Listrik Asli Indonesia",
        description: "Sepeda listrik VOXA dengan baterai lithium, garansi resmi, harga terjangkau.",
        image: "https://voxa.co.id/logo.png",
      }, null, 2);
    case "json_ld":
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "VOXA",
        url: "https://voxa.co.id",
        logo: "https://voxa.co.id/logo.png",
        description: "Merek sepeda listrik asli Indonesia.",
        sameAs: [
          "https://www.instagram.com/voxa.id",
          "https://www.facebook.com/voxa.id",
        ],
      }, null, 2);
    case "faq":
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Berapa harga sepeda listrik VOXA?",
            acceptedAnswer: { "@type": "Answer", text: "Harga sepeda listrik VOXA mulai Rp 3.400.000." },
          },
          {
            "@type": "Question",
            name: "Berapa jarak tempuh sepeda listrik VOXA?",
            acceptedAnswer: { "@type": "Answer", text: "Jarak tempuh 40-60 km per pengisian penuh, tergantung model." },
          },
        ],
      }, null, 2);
    case "thin_content":
      return `<h2>Tentang VOXA — Sepeda Listrik Asli Indonesia</h2>
<p>VOXA adalah brand sepeda listrik asli Indonesia yang berkomitmen menghadirkan solusi transportasi hemat, ramah lingkungan, dan mudah dirawat untuk kebutuhan harian masyarakat perkotaan. Setiap unit VOXA didesain untuk perjalanan komuter yang lebih cepat, lebih murah, dan lebih nyaman dibanding kendaraan bermotor konvensional.</p>

<h3>Kenapa Memilih VOXA</h3>
<ul>
  <li>Baterai lithium tahan lama dengan jarak tempuh 40-80 km per pengisian penuh</li>
  <li>Garansi resmi baterai selama 1 tahun dan motor selama 6 bulan</li>
  <li>Jaringan servis resmi tersebar di berbagai kota besar Indonesia</li>
  <li>Suku cadang lengkap tersedia melalui katalog <a href="/sparepart">Sparepart VOXA</a></li>
  <li>Harga kompetitif mulai Rp 3.400.000 dengan pilihan cicilan 0%</li>
</ul>

<h3>Katalog Produk VOXA</h3>
<p>Jelajahi lini lengkap sepeda listrik VOXA — dari <a href="/sepeda-listrik">Liberty Series</a> yang cocok untuk komuter harian ringan, hingga Elite Rider S yang dirancang untuk performa maksimal. Semua unit menggunakan komponen berkualitas dengan standar keamanan yang teruji.</p>
<p>Untuk pilihan baterai pengganti dan upgrade, cek <a href="/baterai">koleksi Baterai Greenlife</a>. Untuk kebutuhan sparepart original, tersedia <a href="/sparepart">30+ komponen resmi</a> di katalog Sparepart kami.</p>

<h3>Layanan &amp; Dukungan</h3>
<p>Kunjungi <a href="/showroom">showroom VOXA terdekat</a> untuk test ride sebelum membeli, atau baca <a href="/artikel">artikel VOXA</a> untuk tips perawatan sepeda listrik. Jika ingin menjadi bagian dari jaringan VOXA, cek program <a href="/distributor-voxa">Distributor VOXA</a>.</p>

<p>VOXA percaya bahwa transportasi listrik bukan hanya tentang produk, tapi tentang membangun ekosistem yang mendukung pengguna dari pra-pembelian hingga perawatan jangka panjang. Baca lebih lanjut di halaman <a href="/tentang">Tentang VOXA</a>.</p>`;

    case "llms_txt":
      return `# VOXA

> Sepeda listrik asli Indonesia untuk commuter kota. Baterai lithium, garansi resmi.

## Produk
- [Sepeda Listrik](https://voxa.co.id/sepeda-listrik)
- [Baterai](https://voxa.co.id/baterai)
- [Sparepart](https://voxa.co.id/sparepart)

## Info
- [Tentang VOXA](https://voxa.co.id/tentang)
- [Showroom](https://voxa.co.id/showroom)
- [Bantuan](https://voxa.co.id/bantuan)
- [Artikel](https://voxa.co.id/artikel)
`;
    default:
      return "";
  }
}

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
  if (fixType === "thin_content") {
    return `<!-- Visible content section, injected before </body>, below your React app -->\n<footer class="seo-content" style="max-width:1200px;margin:64px auto 32px;padding:32px 24px;line-height:1.7;border-top:1px solid #e5e7eb;">\n${value}\n</footer>`;
  }
  if (fixType === "llms_txt") {
    return `# File yang akan dibuat di https://voxa.co.id/llms.txt:\n\n${value}`;
  }
  return value;
}

function FindingCard({ f, onApplied }: { f: PageFinding; onApplied: () => void }) {
  const [expanded, setExpanded] = useState(false);
  // Start with AI suggestion if available; otherwise the template. Never empty.
  const startingValue =
    f.suggestedValue && f.suggestedValue !== "MANUAL" && f.suggestedValue !== "AUTO"
      ? f.suggestedValue
      : defaultTemplate(f.fixType, f.path);
  const [editValue, setEditValue] = useState(startingValue);
  const [dirty, setDirty] = useState(false);
  const [appliedState, setAppliedState] = useState<null | { value: string; verified: boolean; reason?: string }>(null);

  const utils = trpc.useUtils();
  const apply = trpc.seo.applyFix.useMutation({
    onSuccess: (d, vars) => {
      if (d.verified) {
        toast.success(`✓ Fix diterapkan dan diverifikasi live di ${f.path}`);
      } else {
        toast.warning(`Fix disimpan tapi belum terverifikasi di halaman: ${d.verificationReason ?? "unknown"}`);
      }
      setAppliedState({ value: vars.value, verified: d.verified, reason: d.verificationReason });
      setExpanded(false);
      // Invalidating triggers a refetch — since appliedKeys will now include this fix,
      // the parent will filter this finding out of Rekomendasi Prioritas automatically.
      utils.seo.getAppliedOverrides.invalidate();
      utils.seo.getHistory.invalidate();
      // Also hide this card immediately from the rec list (before refetch resolves)
      setTimeout(() => onApplied(), 800);
    },
    onError: (e) => toast.error("Gagal: " + e.message),
  });
  const revert = trpc.seo.revertFix.useMutation({
    onSuccess: () => {
      toast.success("Fix dibatalkan — halaman kembali ke aslinya");
      setAppliedState(null);
      utils.seo.getAppliedOverrides.invalidate();
      utils.seo.getHistory.invalidate();
    },
    onError: (e) => toast.error("Gagal revert: " + e.message),
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

  const isManualOnly = f.fixType === "fetch_error" || f.fixType === "alt_text";
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

      {/* Applied confirmation state — persistent until user dismisses or reverts */}
      {appliedState && !expanded && (
        <div className={`border rounded-lg p-4 space-y-3 ${appliedState.verified ? "bg-green-50 border-green-300" : "bg-yellow-50 border-yellow-300"}`}>
          <div className="flex items-start gap-2">
            {appliedState.verified ? (
              <CheckCircle2 size={18} className="text-green-600 mt-0.5" />
            ) : (
              <AlertCircle size={18} className="text-yellow-600 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-bold ${appliedState.verified ? "text-green-800" : "text-yellow-800"}`}>
                {appliedState.verified
                  ? "✓ Fix berhasil diterapkan dan terverifikasi LIVE di halaman"
                  : "⚠ Fix disimpan ke database, TAPI belum terlihat di halaman"}
              </div>
              <div className={`text-xs mt-1 ${appliedState.verified ? "text-green-700" : "text-yellow-700"}`}>
                {appliedState.verified
                  ? <>Google &amp; AI crawlers akan melihat perubahan pada next crawl.</>
                  : <>Alasan: {appliedState.reason ?? "unknown"}. Coba Verifikasi Ulang setelah ~30 detik atau cek deploy status Railway.</>}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-1">Nilai yang diterapkan</div>
            <pre className="bg-white border border-green-200 rounded p-2 text-xs font-mono text-gray-800 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
              {appliedState.value}
            </pre>
          </div>
          <div className="flex gap-2 flex-wrap">
            <a
              href={`https://voxa.co.id${f.path}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white border border-green-300 text-green-700 rounded-md hover:bg-green-50"
            >
              <Eye size={12} /> Buka halaman
            </a>
            <a
              href={`view-source:https://voxa.co.id${f.path}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white border border-gray-200 text-gray-700 rounded-md hover:border-gray-400"
            >
              <FileText size={12} /> View source
            </a>
            <Button
              size="sm"
              variant="outline"
              onClick={() => revert.mutate({ path: f.path, fixType: f.fixType })}
              disabled={revert.isPending}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              {revert.isPending ? <Loader2 className="animate-spin" size={12} /> : <RefreshCw size={12} className="mr-1" />}
              Kembalikan (undo)
            </Button>
            <Button size="sm" variant="ghost" onClick={onApplied}>
              Sembunyikan
            </Button>
          </div>
        </div>
      )}

      {/* Collapsed state: just show the action buttons */}
      {!appliedState && !expanded && (
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
            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
              <div className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                ✏️ Nilai yang akan diterapkan (editable)
              </div>
              <div className="flex gap-2">
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
                  {editValue ? "Ganti dgn saran AI" : "Buat Saran AI"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setEditValue(defaultTemplate(f.fixType, f.path)); setDirty(false); }}
                  title="Reset ke template default"
                >
                  Reset template
                </Button>
              </div>
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
                🟢 Kode yang akan ditambahkan ke {f.fixType === "thin_content" || f.fixType === "h1" || f.fixType === "multiple_h1" ? <>&lt;body&gt;</> : <>&lt;head&gt;</>}
              </div>
              <pre className="bg-green-50 border-l-2 border-green-400 rounded p-3 text-xs font-mono text-gray-800 whitespace-pre-wrap break-words overflow-x-auto max-h-64">
                {injectedPreview}
              </pre>
              <div className="text-xs text-gray-500 mt-1">
                Perubahan ini langsung terlihat oleh Google &amp; AI crawlers di next crawl. Tidak perlu deploy ulang.
              </div>
            </div>
          )}

          {/* Visual before/after preview — only for thin_content since it produces visible content */}
          {f.fixType === "thin_content" && editValue && (
            <div>
              <div className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">
                👁 Tampilan visual: sebelum &amp; sesudah
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="border border-red-200 rounded-lg overflow-hidden">
                  <div className="bg-red-50 text-red-700 text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 border-b border-red-200">
                    SEBELUM (halaman saat ini)
                  </div>
                  <div className="bg-white p-4 h-64 overflow-y-auto flex items-center justify-center">
                    <div className="text-center text-gray-400 text-xs italic">
                      Bagian bawah halaman <code className="not-italic bg-gray-100 px-1 rounded">voxa.co.id{f.path}</code> tidak punya konten teks tambahan.
                      <br /><br />
                      Crawler tanpa JS rendering hanya melihat shell HTML kosong.
                    </div>
                  </div>
                </div>
                <div className="border border-green-200 rounded-lg overflow-hidden">
                  <div className="bg-green-50 text-green-700 text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 border-b border-green-200">
                    SESUDAH (dengan konten baru)
                  </div>
                  <div
                    className="bg-white p-6 h-64 overflow-y-auto text-sm text-gray-700 seo-content-preview"
                    style={{ lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={{ __html: editValue }}
                  />
                </div>
              </div>
              <style>{`
                .seo-content-preview h2 { font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 12px; letter-spacing: -0.02em; }
                .seo-content-preview h3 { font-size: 15px; font-weight: 700; color: #111827; margin: 20px 0 8px; }
                .seo-content-preview p { margin: 0 0 12px; }
                .seo-content-preview ul { margin: 0 0 16px; padding-left: 20px; }
                .seo-content-preview li { margin-bottom: 4px; }
                .seo-content-preview a { color: #37C5FF; text-decoration: underline; }
              `}</style>
              <div className="text-xs text-gray-500 mt-2">
                Konten ini akan muncul di bagian paling bawah halaman, sebagai section &lt;footer&gt; dengan max-width 1200px. Tidak mengganggu layout React di atasnya.
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-gray-200 pt-3">
            {!editValue.trim() && (
              <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2 mb-3">
                ⚠️ Nilai kosong. Ketik nilai atau klik "Reset template" untuk mulai dari default.
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                className="bg-[#37C5FF] hover:bg-[#0A4A63]"
                onClick={handleApply}
                disabled={apply.isPending || !editValue.trim()}
                title={!editValue.trim() ? "Isi dulu nilai fix di atas" : "Terapkan fix"}
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
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

// YYYY-MM-DD in local timezone
const toISODate = (d: Date | string) => {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

function AppliedFixesSection() {
  const utils = trpc.useUtils();
  const { data: applied, isLoading } = trpc.seo.getAppliedOverrides.useQuery();
  const [verifyMap, setVerifyMap] = useState<Record<string, { verified: boolean; reason?: string }>>({});
  const todayISO = toISODate(new Date());
  const [dateFilter, setDateFilter] = useState<string>(todayISO);
  const [showAll, setShowAll] = useState(false);
  // Track which page groups are expanded (default = collapsed, showing only the most recent fix per group)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const togglePath = (p: string) => setExpandedPaths(prev => {
    const n = new Set(prev); n.has(p) ? n.delete(p) : n.add(p); return n;
  });

  const revert = trpc.seo.revertFix.useMutation({
    onSuccess: () => {
      toast.success("Fix dibatalkan");
      utils.seo.getAppliedOverrides.invalidate();
      utils.seo.getLatest.invalidate();
    },
    onError: (e) => toast.error("Gagal: " + e.message),
  });

  const verifyAll = trpc.seo.verifyAllApplied.useMutation({
    onSuccess: (d) => {
      const map: Record<string, { verified: boolean; reason?: string }> = {};
      const okCount = d.results.filter(r => r.verified).length;
      const badCount = d.results.length - okCount;
      for (const r of d.results) map[`${r.path}::${r.fixType}`] = { verified: r.verified, reason: r.reason };
      setVerifyMap(map);
      if (badCount === 0) toast.success(`✓ Semua ${okCount} fix terverifikasi live`);
      else toast.warning(`${okCount} live, ${badCount} tidak terverifikasi — cek detail per baris`);
    },
    onError: (e) => toast.error("Verifikasi gagal: " + e.message),
  });

  if (isLoading || !applied || applied.length === 0) return null;

  // Bucket by date, then group by path within the chosen date.
  const availableDates = Array.from(new Set(applied.map(a => toISODate(a.updatedAt))))
    .sort((a, b) => b.localeCompare(a));
  const olderCount = applied.filter(a => toISODate(a.updatedAt) !== dateFilter).length;
  const visibleFixes = showAll
    ? applied
    : applied.filter(a => toISODate(a.updatedAt) === dateFilter);

  // Group by path within the visible slice
  const byPath: Record<string, typeof applied> = {};
  for (const r of visibleFixes) {
    (byPath[r.path] ??= []).push(r);
  }

  const isToday = dateFilter === todayISO;
  const humanDate = new Date(dateFilter + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-gray-900">Fix yang Sudah Diterapkan</h2>
          <div className="text-xs text-gray-500 mt-0.5">
            Total <b className="text-gray-900">{applied.length}</b> fix aktif di database.
            {showAll
              ? " Menampilkan semua fix — klik tombol untuk kembali ke tanggal terpilih."
              : ` Menampilkan fix dari ${isToday ? "hari ini" : humanDate}.`}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="date"
            value={dateFilter}
            max={todayISO}
            onChange={(e) => { setDateFilter(e.target.value); setShowAll(false); }}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white font-medium"
            title="Pilih tanggal untuk melihat fix yang diterapkan pada hari itu"
          />
          {!isToday && !showAll && (
            <Button size="sm" variant="outline" onClick={() => setDateFilter(todayISO)}>
              Hari ini
            </Button>
          )}
          <Button
            size="sm"
            variant={showAll ? "default" : "outline"}
            onClick={() => setShowAll(v => !v)}
            className={showAll ? "bg-[#37C5FF] hover:bg-[#0A4A63]" : ""}
          >
            {showAll ? "Tampilkan filter tanggal" : `Lihat semua (${applied.length})`}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => verifyAll.mutate()}
            disabled={verifyAll.isPending}
          >
            {verifyAll.isPending ? <Loader2 className="animate-spin" size={12} /> : <RefreshCw size={12} className="mr-1" />}
            Verifikasi Semua Live
          </Button>
        </div>
      </div>

      {/* Empty state when the selected date has no fixes */}
      {Object.keys(byPath).length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500 mb-3">
          Tidak ada fix yang diterapkan pada <b>{humanDate}</b>.
          {availableDates.length > 0 && (
            <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs">Tanggal yang punya fix:</span>
              {availableDates.slice(0, 6).map(d => (
                <button
                  key={d}
                  onClick={() => { setDateFilter(d); setShowAll(false); }}
                  className="text-xs px-2 py-1 rounded-md border border-gray-200 hover:border-[#37C5FF] hover:text-[#37C5FF] tabular-nums"
                >
                  {new Date(d + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                </button>
              ))}
              {olderCount > 0 && (
                <button
                  onClick={() => setShowAll(true)}
                  className="text-xs px-2 py-1 rounded-md text-[#37C5FF] hover:underline"
                >
                  Lihat semua →
                </button>
              )}
            </div>
          )}
        </div>
      )}
      {Object.keys(byPath).length > 0 && (
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {Object.entries(byPath).map(([path, fixes], idx) => {
          const sortedFixes = [...fixes].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          const isExpanded = expandedPaths.has(path);
          const visible = isExpanded ? sortedFixes : sortedFixes.slice(0, 1);
          const hiddenCount = sortedFixes.length - visible.length;
          return (
          <div key={path} className={idx > 0 ? "border-t border-gray-100" : ""}>
            <div className="px-6 py-3 bg-gray-50 flex items-center justify-between flex-wrap gap-2">
              <div>
                <code className="text-sm font-mono font-semibold text-gray-900">{path}</code>
                <span className="text-xs text-gray-500 ml-2">
                  {isExpanded ? `${fixes.length} fix` : `Fix paling baru · ${fixes.length} total`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {fixes.length > 1 && (
                  <button
                    onClick={() => togglePath(path)}
                    className="text-xs font-semibold text-[#37C5FF] hover:underline"
                  >
                    {isExpanded ? "Sembunyikan" : `Lihat semua (${fixes.length}) →`}
                  </button>
                )}
                <a
                  href={`https://voxa.co.id${path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#37C5FF] hover:underline"
                >
                  <Eye size={12} /> Buka halaman
                </a>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {visible.map(f => {
                const key = `${f.path}::${f.fixType}`;
                const v = verifyMap[key];
                const badge = v == null
                  ? { color: "bg-gray-100 text-gray-500", icon: null as any, label: "Belum diverifikasi" }
                  : v.verified
                  ? { color: "bg-green-100 text-green-700", icon: CheckCircle2, label: "LIVE terverifikasi" }
                  : { color: "bg-red-100 text-red-700", icon: AlertCircle, label: "TIDAK live" };
                const BadgeIcon = badge.icon;
                return (
                  <div key={key} className="px-6 py-4 flex items-start gap-4">
                    <div className="mt-1">
                      {v == null ? <CheckCircle2 size={16} className="text-gray-300" />
                        : v.verified ? <CheckCircle2 size={16} className="text-green-500" />
                        : <AlertCircle size={16} className="text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">{f.label}</span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.color}`}>
                          {BadgeIcon && <BadgeIcon size={10} />}
                          {badge.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          · diterapkan {fmtDateTime(f.updatedAt)}
                        </span>
                      </div>
                      {v && !v.verified && v.reason && (
                        <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1 mt-1">
                          Alasan tidak live: {v.reason}
                        </div>
                      )}
                      <pre className={`mt-1 border-l-2 rounded p-2 text-xs font-mono text-gray-700 whitespace-pre-wrap break-words max-h-32 overflow-y-auto ${v && !v.verified ? "bg-red-50 border-red-400" : "bg-green-50 border-green-400"}`}>
                        {f.value}
                      </pre>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => revert.mutate({ path: f.path, fixType: f.fixType })}
                      disabled={revert.isPending}
                      className="text-red-600 border-red-200 hover:bg-red-50 shrink-0"
                    >
                      {revert.isPending ? <Loader2 className="animate-spin" size={12} /> : <RefreshCw size={12} className="mr-1" />}
                      Kembalikan
                    </Button>
                  </div>
                );
              })}
              {!isExpanded && hiddenCount > 0 && (
                <button
                  onClick={() => togglePath(path)}
                  className="w-full px-6 py-2 text-xs font-semibold text-gray-500 hover:text-[#37C5FF] hover:bg-[#37C5FF]/5 transition-colors border-t border-gray-100"
                >
                  + {hiddenCount} fix lebih lama di halaman ini
                </button>
              )}
              {isExpanded && fixes.length > 1 && (
                <button
                  onClick={() => togglePath(path)}
                  className="w-full px-6 py-2 text-xs font-semibold text-gray-500 hover:text-[#37C5FF] hover:bg-[#37C5FF]/5 transition-colors border-t border-gray-100"
                >
                  Sembunyikan — tampilkan hanya fix paling baru
                </button>
              )}
            </div>
          </div>
          );
        })}
      </div>
      )}

      {/* Show more hint — appears when there are hidden fixes from other dates */}
      {!showAll && olderCount > 0 && Object.keys(byPath).length > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-2 py-3 text-xs font-semibold text-[#37C5FF] border border-dashed border-gray-300 rounded-xl hover:border-[#37C5FF] hover:bg-[#37C5FF]/5 transition-colors"
        >
          Lihat {olderCount} fix lebih lama dari tanggal lain →
        </button>
      )}
    </div>
  );
}

export default function AdminSeo() {
  const utils = trpc.useUtils();
  const { data: latest, isLoading } = trpc.seo.getLatest.useQuery();
  const { data: applied = [] } = trpc.seo.getAppliedOverrides.useQuery();
  const runAudit = trpc.seo.runAudit.useMutation({
    onSuccess: () => { utils.seo.getLatest.invalidate(); utils.seo.getAppliedOverrides.invalidate(); toast.success("Audit selesai"); },
    onError: (e) => toast.error("Audit gagal: " + e.message),
  });

  // Local dismissal set — hides findings on this session without persisting
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const dismiss = (id: string) => setDismissed(prev => new Set(prev).add(id));

  // Which (path, fixType) combinations already have an active override.
  // Findings matching these are hidden from Rekomendasi Prioritas immediately.
  const appliedKeys = new Set<string>();
  for (const a of applied) {
    appliedKeys.add(`${a.path}::${a.fixType}`);
    // Map related fix types that share the same underlying override column
    if (a.fixType === 'meta_description') appliedKeys.add(`${a.path}::meta_description_length`);
    if (a.fixType === 'json_ld') appliedKeys.add(`${a.path}::faq`);
    if (a.fixType === 'faq') appliedKeys.add(`${a.path}::json_ld`);
    if (a.fixType === 'h1') appliedKeys.add(`${a.path}::multiple_h1`);
    if (a.fixType === 'multiple_h1') appliedKeys.add(`${a.path}::h1`);
    if (a.fixType === 'thin_content') appliedKeys.add(`${a.path}::thin_content`);
  }
  const isAlreadyApplied = (f: PageFinding) => appliedKeys.has(`${f.path}::${f.fixType}`);

  const audit = (latest?.data as SiteAudit | undefined) ?? null;
  const rawFindings = audit ? [...audit.siteFindings, ...audit.pages.flatMap(p => p.findings)] : [];
  const remainingFindings = rawFindings.filter(f => !dismissed.has(f.id) && !isAlreadyApplied(f));
  const totalDetected = rawFindings.length;
  const alreadyApplied = rawFindings.filter(isAlreadyApplied).length;
  const bySeverity = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  remainingFindings.forEach(f => { bySeverity[f.severity]++; });

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

            {/* Per-page score breakdown — right below the two big tiles */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Skor per Halaman</h3>
                <div className="text-xs text-gray-500">Klik "Buka halaman" untuk melihat detail</div>
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

            {/* Applied fixes */}
            <AppliedFixesSection />

            {/* Progress bar */}
            {totalDetected > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Progres Fix</div>
                    <div className="text-lg font-bold text-gray-900 tabular-nums">
                      {alreadyApplied}<span className="text-gray-400">/{totalDetected}</span>
                      <span className="text-sm font-normal text-gray-500 ml-2">fix sudah selesai</span>
                    </div>
                  </div>
                  <div className="text-sm font-bold tabular-nums text-[#37C5FF]">
                    {totalDetected === 0 ? 0 : Math.round((alreadyApplied / totalDetected) * 100)}%
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#37C5FF] to-[#0A4A63] transition-all"
                    style={{ width: `${totalDetected === 0 ? 0 : (alreadyApplied / totalDetected) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {remainingFindings.length > 0 ? (
                    <>Sisa <b className="text-gray-900">{remainingFindings.length}</b> fix untuk diselesaikan.</>
                  ) : (
                    <>🎉 Semua fix sudah selesai! Klik <b>Analisis Sekarang</b> untuk scan ulang &amp; cari issue baru.</>
                  )}
                </div>
              </div>
            )}

            {/* Priority findings */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Rekomendasi Prioritas</h2>
              <div className="text-xs text-gray-500">
                {remainingFindings.length} sisa —{" "}
                <b className="text-red-600">{bySeverity.HIGH} high</b>,{" "}
                <b className="text-yellow-600">{bySeverity.MEDIUM} medium</b>,{" "}
                <b className="text-blue-600">{bySeverity.LOW} low</b>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {remainingFindings.length === 0 && (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl text-gray-400">
                  Semua fix sudah diterapkan atau tidak ada issue prioritas.
                </div>
              )}
              {remainingFindings
                .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "HIGH" ? -1 : b.severity === "HIGH" ? 1 : a.severity === "MEDIUM" ? -1 : 1))
                .slice(0, 20)
                .map(f => (
                  <FindingCard key={f.id} f={f} onApplied={() => dismiss(f.id)} />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
