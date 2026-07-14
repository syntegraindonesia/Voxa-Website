import { CheckCircle } from 'lucide-react';
import { Link, useSearch } from 'wouter';

export default function CheckoutSuccess() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderId = params.get('order');

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-3">Pembayaran Berhasil!</h1>
      <p className="text-gray-500 max-w-md mb-2">
        Terima kasih telah berbelanja di VOXA. Pesanan Anda sedang kami proses.
      </p>
      {orderId && (
        <p className="text-xs text-gray-400 mb-8">ID Pesanan: {orderId}</p>
      )}
      <p className="text-sm text-gray-500 max-w-sm mb-8">
        Konfirmasi pesanan dan informasi pengiriman akan dikirim ke email Anda. Tim VOXA akan menghubungi Anda untuk detail pengiriman.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/sepeda-listrik"
          className="px-6 py-3 bg-[#00B4D8] text-white font-bold rounded-xl hover:bg-[#0099bb] transition-colors"
        >
          Lanjut Belanja
        </Link>
        <a
          href={`https://wa.me/628156161071?text=${encodeURIComponent(
            'Halo VOXA, saya baru saja melakukan pembayaran. ID Pesanan: ' + (orderId ?? '-')
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
