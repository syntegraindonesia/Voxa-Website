import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { products, Product } from '@/data/products';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '');
}

function searchProducts(query: string): Product[] {
  if (!query.trim()) return [];
  const q = normalize(query);
  const tokens = q.split(/\s+/).filter(Boolean);

  return products.filter((p) => {
    const haystack = normalize(
      [
        p.name,
        p.series,
        p.category,
        p.description,
        p.shortDesc ?? '',
        p.price,
        p.specs?.motor ?? '',
        p.specs?.baterai ?? '',
        p.specs?.voltase ?? '',
        p.specs?.model ?? '',
        ...(p.features ?? []),
      ].join(' ')
    );
    return tokens.every((t) => haystack.includes(t));
  });
}

const CATEGORY_LABEL: Record<string, string> = {
  'sepeda-listrik': 'Sepeda Listrik',
  batre: 'Baterai',
  sparepart: 'Sparepart',
};

export default function SearchOverlay({ open, onClose, onSelectProduct }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    const r = searchProducts(query);
    setResults(r.slice(0, 8));
  }, [query]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, handleKey]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 bg-white w-full max-w-2xl mx-auto mt-20 mx-4 rounded-xl shadow-2xl overflow-hidden">
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk VOXA..."
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-1 text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded px-2 py-0.5"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === '' && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              Ketik nama produk, seri, atau kategori...
            </div>
          )}

          {query.trim() !== '' && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              Produk tidak ditemukan.
            </div>
          )}

          {results.length > 0 && (
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => { onSelectProduct(p); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 object-contain rounded bg-gray-50 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {CATEGORY_LABEL[p.category] ?? p.category} · {p.series}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-bold text-[#00B4D8]">{p.price}</p>
                    </div>
                    <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {results.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-50 text-xs text-gray-400 text-center">
              {results.length} produk ditemukan
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
