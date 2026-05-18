import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  articles,
  categories,
  getFeaturedArticle,
  getRegularArticles,
  type ArticleCategory,
} from '../data/articles';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Article Card ────────────────────────────────────────────────────────────

function ArticleCard({ article }: { article: (typeof articles)[0] }) {
  return (
    <Link href={`/artikel/${article.slug}`}>
      <article className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#37C5FF]/40 hover:shadow-xl hover:shadow-[#37C5FF]/10 transition-all duration-300 hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative overflow-hidden aspect-[16/9]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ background: '#37C5FF' }}
          >
            {article.category}
          </span>
        </div>
        {/* Body */}
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span>{formatDate(article.publishDate)}</span>
            <span>·</span>
            <span>{article.readTime} menit baca</span>
          </div>
          <h3 className="text-gray-900 font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-[#37C5FF] transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
            {article.excerpt}
          </p>
          <span className="text-xs font-semibold transition-colors" style={{ color: '#37C5FF' }}>
            Baca Selengkapnya →
          </span>
        </div>
      </article>
    </Link>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Bisnis() {
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const featured = getFeaturedArticle();
  const regular = getRegularArticles();

  const filteredArticles = useMemo(() => {
    let list =
      activeCategory === 'Semua'
        ? regular
        : regular.filter((a) => a.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, searchQuery, regular]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative py-24 px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #EAF9FF 0%, #ffffff 40%, #EAF9FF 100%)',
        }}
      >
        {/* Ambient glow orbs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: '#37C5FF' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: '#0A4A63' }}
        />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#37C5FF 1px, transparent 1px), linear-gradient(90deg, #37C5FF 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{
              color: '#37C5FF',
              borderColor: '#37C5FF',
              background: 'rgba(55,197,255,0.08)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: '#37C5FF' }}
            />
            VOXA NEWSROOM
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-5 tracking-tight">
            Artikel <span style={{ color: '#37C5FF' }}>VOXA</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Wawasan terbaru seputar kendaraan listrik, mobilitas berkelanjutan, teknologi masa depan,
            dan perkembangan VOXA.
          </p>
        </div>
      </section>

      {/* ── Search + Filter ──────────────────────────────────────────────── */}
      <section className="sticky top-[60px] z-30 bg-white/90 backdrop-blur border-b border-gray-100 py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-72 shrink-0">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border bg-white/80 backdrop-blur outline-none transition-all"
              style={{
                borderColor: searchQuery ? '#37C5FF' : '#e5e7eb',
                boxShadow: searchQuery ? '0 0 0 3px rgba(55,197,255,0.15)' : 'none',
              }}
            />
          </div>
          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full">
            {(['Semua', ...categories] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as ArticleCategory | 'Semua')}
                className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border"
                style={
                  activeCategory === cat
                    ? {
                        background: '#37C5FF',
                        color: '#fff',
                        borderColor: '#37C5FF',
                        boxShadow: '0 0 12px rgba(55,197,255,0.4)',
                      }
                    : { background: 'transparent', color: '#6b7280', borderColor: '#e5e7eb' }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {/* ── Featured Article ─────────────────────────────────────────── */}
        {activeCategory === 'Semua' && !searchQuery && (
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="w-1 h-6 rounded-full inline-block"
                style={{ background: '#37C5FF' }}
              />
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                Artikel Pilihan
              </h2>
            </div>
            <Link href={`/artikel/${featured.slug}`}>
              <article className="group grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-gray-100 hover:border-[#37C5FF]/40 hover:shadow-2xl hover:shadow-[#37C5FF]/10 transition-all duration-300 cursor-pointer">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3] md:aspect-auto">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col justify-center bg-white">
                  <span
                    className="inline-flex self-start px-3 py-1 rounded-full text-xs font-bold mb-4"
                    style={{ background: 'rgba(55,197,255,0.12)', color: '#37C5FF' }}
                  >
                    {featured.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4 group-hover:text-[#37C5FF] transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed mb-6 line-clamp-4">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      <span>{formatDate(featured.publishDate)}</span>
                      <span className="mx-2">·</span>
                      <span>{featured.readTime} menit baca</span>
                    </div>
                    <span
                      className="text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200"
                      style={{
                        background: '#37C5FF',
                        color: '#fff',
                        boxShadow: '0 4px 15px rgba(55,197,255,0.3)',
                      }}
                    >
                      Baca Selengkapnya →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </section>
        )}

        {/* ── Article Grid ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span
                className="w-1 h-6 rounded-full inline-block"
                style={{ background: '#37C5FF' }}
              />
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                {activeCategory === 'Semua' ? 'Semua Artikel' : activeCategory}
              </h2>
            </div>
            <span className="text-xs text-gray-400">{filteredArticles.length} artikel</span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-24">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(55,197,255,0.1)' }}
              >
                <svg
                  className="w-8 h-8"
                  style={{ color: '#37C5FF' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Tidak ada artikel ditemukan</p>
              <p className="text-gray-400 text-sm mt-1">Coba kata kunci atau kategori lain</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>

        {/* ── Load More ────────────────────────────────────────────────── */}
        {filteredArticles.length > 0 && (
          <div className="mt-12 text-center">
            <button
              className="px-8 py-3 rounded-full text-sm font-semibold border-2 transition-all duration-200 hover:shadow-lg"
              style={{ borderColor: '#37C5FF', color: '#37C5FF' }}
            >
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
