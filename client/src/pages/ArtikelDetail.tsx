import { Link, useParams } from 'wouter';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { articles, getRegularArticles } from '../data/articles';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ArtikelDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-32 px-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'rgba(55,197,255,0.1)' }}
          >
            <svg className="w-10 h-10" style={{ color: '#37C5FF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Artikel Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-8">Artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
          <Link href="/artikel">
            <span
              className="px-6 py-3 rounded-full text-sm font-bold text-white transition-all"
              style={{ background: '#37C5FF' }}
            >
              ← Kembali ke Artikel
            </span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = getRegularArticles()
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* ── Hero image ───────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ maxHeight: '520px' }}>
        <img
          src={article.image}
          alt={article.title}
          className="w-full object-cover"
          style={{ maxHeight: '520px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {/* Category badge */}
        <div className="absolute bottom-6 left-6">
          <span
            className="px-4 py-1.5 rounded-full text-xs font-bold text-white"
            style={{ background: '#37C5FF' }}
          >
            {article.category}
          </span>
        </div>
      </div>

      {/* ── Article body ─────────────────────────────────────────────────── */}
      <article className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link href="/">
            <span className="hover:text-[#37C5FF] transition-colors cursor-pointer">Beranda</span>
          </Link>
          <span>/</span>
          <Link href="/artikel">
            <span className="hover:text-[#37C5FF] transition-colors cursor-pointer">Artikel</span>
          </Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[200px]">{article.title}</span>
        </nav>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-5">
          <span>{formatDate(article.publishDate)}</span>
          <span>·</span>
          <span>{article.readTime} menit baca</span>
          <span>·</span>
          <span>Oleh {article.author}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6">
          {article.title}
        </h1>

        {/* Excerpt / lead */}
        <p
          className="text-lg text-gray-600 leading-relaxed mb-8 pb-8 border-b border-gray-100 font-medium"
        >
          {article.excerpt}
        </p>

        {/* Content */}
        <div
          className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tags</p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{ borderColor: '#37C5FF', color: '#37C5FF', background: 'rgba(55,197,255,0.06)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10">
          <Link href="/artikel">
            <span
              className="inline-flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer"
              style={{ color: '#37C5FF' }}
            >
              ← Kembali ke Semua Artikel
            </span>
          </Link>
        </div>
      </article>

      {/* ── Related Articles ─────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-14 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="w-1 h-6 rounded-full inline-block"
                style={{ background: '#37C5FF' }}
              />
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                Artikel Terkait
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((a) => (
                <Link href={`/artikel/${a.slug}`} key={a.id}>
                  <article className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#37C5FF]/40 hover:shadow-xl hover:shadow-[#37C5FF]/10 transition-all duration-300 hover:-translate-y-1">
                    <div className="relative overflow-hidden aspect-[16/9]">
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-semibold mb-2" style={{ color: '#37C5FF' }}>
                        {a.category}
                      </p>
                      <h3 className="text-gray-900 font-bold text-sm leading-snug line-clamp-2 group-hover:text-[#37C5FF] transition-colors">
                        {a.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
