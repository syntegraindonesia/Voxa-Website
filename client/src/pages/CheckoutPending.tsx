import { Clock } from 'lucide-react';
import { Link, useSearch } from 'wouter';

export default function CheckoutPending() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderId = params.get('order');

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
        <Clock size={40} className="text-yellow-500" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-3">Pembayaran Tertunda</h1>
      <p className="text-gray-500 max-w-md mb-2">
        Pembayaran Anda belum berhasil atau sudah kadaluarsa. Silakan coba lagi atau hubungi tim VOXA jika perlu bantuan.
      </p>
      {orderId && (
        <p className="text-xs text-gray-400 mb-8">ID Pesanan: {orderId}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/checkout"
          className="px-6 py-3 bg-[#00B4D8] text-white font-bold rounded-xl hover:bg-[#0099bb] transition-colors"
        >
          Coba Lagi
        </Link>
        <a
          href={`https://wa.me/628156161071?text=${encodeURIComponent(
            'Halo VOXA, saya mengalami kendala pembayaran. ID Pesanan: ' + (orderId ?? '-')
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-colors"
        >
          Hubungi Kami
        </a>
      </div>
    </div>
  );
}
