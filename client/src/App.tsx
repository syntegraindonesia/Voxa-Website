import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Batre from "./pages/Batre";
import Sparepart from "./pages/Sparepart";
import ProductDetail from "./pages/ProductDetail";
import Compare from "./pages/Compare";
import Bisnis from "./pages/Bisnis";
import ArtikelDetail from "./pages/ArtikelDetail";
import Pemerintah from "./pages/Pemerintah";
import Showroom from "./pages/Showroom";
import Tentang from "./pages/Tentang";
import Bantuan from "./pages/Bantuan";
import Guide from "./pages/Guide";
import Katalog from "./pages/Katalog";
import Wishlist from "./pages/Wishlist";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";

// Wrapper so /sepeda-listrik renders the Catalog page with the correct category
function SepedaListrikCatalog() {
  return <Catalog />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      {/* Unified discovery page */}
      <Route path="/katalog" component={Katalog} />

      {/* Clean top-level catalog routes (used by navbar dropdown) */}
      <Route path="/sepeda-listrik" component={SepedaListrikCatalog} />
      <Route path="/batre" component={Batre} />
      <Route path="/sparepart" component={Sparepart} />

      {/* Legacy /catalog/:category routes (keep for backward compat) */}
      <Route path="/catalog/:category" component={Catalog} />

      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/compare" component={Compare} />
      <Route path="/bisnis" component={Bisnis} />
      <Route path="/artikel" component={Bisnis} />
      <Route path="/artikel/:slug" component={ArtikelDetail} />
      <Route path="/pemerintah" component={Pemerintah} />
      <Route path="/showroom" component={Showroom} />
      <Route path="/tentang" component={Tentang} />
      <Route path="/bantuan" component={Bantuan} />
      <Route path="/guide" component={Guide} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

const WA_NUMBER = "628156161071";
const WA_MESSAGE = encodeURIComponent(
  "Halo, saya mengunjungi website VOXA dan ingin mengetahui lebih lanjut mengenai produk-produk VOXA. Terima kasih."
);

function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi Kami via WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
      style={{ backgroundColor: "#25D366" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="22"
        height="22"
        fill="white"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.47 2.027 7.773L0 32l8.476-2.004A15.934 15.934 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.77-1.852l-.486-.29-5.03 1.189 1.21-4.897-.318-.503A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.878c-.398-.199-2.354-1.162-2.72-1.294-.365-.133-.631-.199-.897.199-.265.398-1.03 1.294-1.262 1.56-.232.265-.465.298-.863.1-.398-.2-1.681-.62-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.2-.232.265-.398.398-.664.133-.265.066-.497-.033-.697-.1-.199-.897-2.162-1.229-2.96-.324-.777-.653-.672-.897-.684l-.764-.013c-.265 0-.697.1-1.062.497-.365.398-1.394 1.362-1.394 3.322s1.427 3.853 1.626 4.119c.199.265 2.808 4.286 6.804 6.013.951.41 1.693.655 2.271.839.954.304 1.823.261 2.51.158.766-.114 2.354-.963 2.686-1.893.332-.93.332-1.727.232-1.893-.099-.166-.365-.265-.763-.464z" />
      </svg>
      <span className="text-white font-semibold text-sm">Hubungi Kami</span>
    </a>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <WishlistProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                  <Router />
                </main>
                <Footer />
              </div>
              <CartSidebar />
              <FloatingWhatsApp />
            </TooltipProvider>
          </CartProvider>
        </WishlistProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
