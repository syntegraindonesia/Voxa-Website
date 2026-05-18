import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
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
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
