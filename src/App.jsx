import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { useFetchCMS } from './hooks/useFetchCMS';
import Header from './components/Layout/Header';
import HeroSection from './components/Sections/HeroSection';
import MenuShowcase from './components/Sections/MenuShowcase';
import QRMenu from './components/Sections/QRMenu';
import AboutSection from './components/Sections/AboutSection';
import GallerySection from './components/Sections/GallerySection';
import TestimonialsSection from './components/Sections/TestimonialsSection';
import EventsSection from './components/Sections/EventsSection';
import TeamSection from './components/Sections/TeamSection';
import NewsletterSection from './components/Sections/NewsletterSection';
import Footer from './components/Layout/Footer';
import PolicyModal from './components/Common/PolicyModal';
import AdminPanel from './pages/Admin/AdminPanel';
import Login from './pages/Admin/Login';
import QRMenuPage from './pages/QRMenuPage';
import PrintMenuPage from './pages/PrintMenuPage';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, X, AlertTriangle } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Critical Render Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-dark px-10 text-center">
          <AlertTriangle className="w-20 h-20 text-secondary mb-8 animate-bounce" />
          <h2 className="text-4xl font-serif font-bold text-secondary mb-6 uppercase tracking-tighter">BİR GÖRÜNÜM HATASI OLUŞTU</h2>
          <p className="text-textSecondary text-lg italic max-w-2xl font-light mb-10 opacity-70 leading-relaxed">
            İçerik verilerinde bir yapısal fark oluştuğu için sayfa yüklenemedi. Admin panelinden yaptığınız son değişikliği kontrol edin veya sayfayı yenileyin.
          </p>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="btn-outline">SİSTEMİ SIFIRLA VE YENİLE</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Home = ({ cmsData }) => {
  const { t } = useLanguage();
  const [showPopup, setShowPopup] = React.useState(false);

  const featuredEvent = React.useMemo(() => {
    if (!cmsData?.events?.events) return null;
    const today = new Date().setHours(0, 0, 0, 0);
    return cmsData.events.events.find(ev => {
      if (!ev.is_popup) return false;
      if (ev.popup_start_date) {
        const start = new Date(ev.popup_start_date).setHours(0, 0, 0, 0);
        if (today < start) return false;
      }
      if (ev.popup_end_date) {
        const end = new Date(ev.popup_end_date).setHours(0, 0, 0, 0);
        if (today > end) return false;
      }
      return true;
    });
  }, [cmsData]);

  React.useEffect(() => {
    if (featuredEvent) {
      const timer = setTimeout(() => setShowPopup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [featuredEvent]);

  React.useEffect(() => {
    if (showPopup && featuredEvent && featuredEvent.popup_duration > 0) {
      const timer = setTimeout(() => setShowPopup(false), featuredEvent.popup_duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, featuredEvent]);

  return (
    <main className="relative z-0">
      <AnimatePresence>
        {showPopup && featuredEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-dark/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
            onClick={() => setShowPopup(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-4xl w-full bg-primary rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(244,228,193,0.15)] border border-secondary/30 flex flex-col md:flex-row cursor-default"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 z-10 w-32 h-32 bg-secondary/10 rotate-45 translate-x-12 -translate-y-12" />
              
              <button 
                className="absolute top-4 right-4 text-white hover:text-secondary z-20 bg-dark/80 rounded-full p-2 transition-colors border border-secondary/20"
                onClick={() => setShowPopup(false)}
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-full md:w-5/12 h-64 md:h-auto relative">
                <img src={featuredEvent.image_url} alt="" className="w-full h-full object-cover filter brightness-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent md:bg-gradient-to-r" />
              </div>
              <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center relative">
                <span className="text-secondary font-bold uppercase tracking-[0.4em] text-[10px] mb-2">{t({ tr: 'ÖNE ÇIKAN ETKİNLİK', en: 'FEATURED EVENT' })}</span>
                <h3 className="text-3xl lg:text-4xl text-white font-serif font-bold uppercase tracking-tight mb-4 leading-none">{t(featuredEvent.title)}</h3>
                
                <div className="flex items-center space-x-4 text-secondary text-xs font-bold mb-6 uppercase tracking-widest">
                  <div className="flex items-center space-x-1 bg-dark/50 px-3 py-1 rounded-md border border-secondary/10">
                    <Clock className="w-3 h-3" />
                    <span>{t(featuredEvent.date)} {featuredEvent.time ? `- ${t(featuredEvent.time)}` : ''}</span>
                  </div>
                </div>
                
                <p className="text-textSecondary text-sm font-light leading-relaxed mb-8 opacity-90">{t(featuredEvent.description)}</p>
                
                <button 
                  onClick={() => setShowPopup(false)}
                  className="bg-secondary text-primary font-bold uppercase tracking-widest py-3 px-8 rounded-lg hover:bg-white transition-colors self-start text-xs border border-secondary"
                >
                  {t({ tr: 'Kapat', en: 'Close' })}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <HeroSection data={cmsData?.hero} />
        <EventsSection data={cmsData?.events} />
        <AboutSection data={cmsData?.about} />
        <MenuShowcase data={cmsData?.menu_showcase} />
        <QRMenu data={cmsData?.menu} allergens={cmsData?.allergens} settings={cmsData?.settings} />
        <GallerySection data={cmsData?.gallery} />
        <TestimonialsSection data={cmsData?.testimonials} />
        <TeamSection data={cmsData?.team} />
        <NewsletterSection data={cmsData?.newsletter} />
      </AnimatePresence>
    </main>
  );
};

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const { cmsData, loading, error } = useFetchCMS();
  const [activePolicy, setActivePolicy] = React.useState(null);
  const [progress, setProgress] = React.useState(0);
  const [showLoader, setShowLoader] = React.useState(true);

  // 1. Progress animation (runs once on mount, takes exactly 2.5 seconds to go 0 -> 100)
  React.useEffect(() => {
    let start = null;
    const duration = 2500; // 2.5 seconds minimum load time for smooth vinyl feel
    let animationFrameId;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progressVal = Math.min((elapsed / duration) * 100, 100);
      setProgress(progressVal);

      if (progressVal < 100) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. Hide loader when animation is complete (progress === 100) and API loading is finished (loading === false)
  React.useEffect(() => {
    if (progress === 100 && !loading) {
      const timer = setTimeout(() => setShowLoader(false), 500);
      return () => clearTimeout(timer);
    }
  }, [progress, loading]);

  const getNeedleAngle = (prog) => {
    if (prog === 0) return -32;
    if (prog < 15) {
      const ratio = prog / 15;
      return -32 + ratio * 22; // -32 to -10 (lifts and swings to outer grooves)
    }
    const ratio = (prog - 15) / 85;
    return -10 + ratio * 22; // -10 to 12 (slowly crawls inwards)
  };

  if (showLoader) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark text-secondary select-none">
        {/* Plak ve İğne Kutusu */}
        <div className="relative w-[240px] h-[240px] mb-4 flex items-center justify-center">
          
          {/* Dönen Plak (Vinyl Record) */}
          <div className="absolute left-[40px] top-[40px] w-[160px] h-[160px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="w-full h-full"
            >
              <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]">
                {/* Plak Gövdesi */}
                <circle cx="80" cy="80" r="78" fill="#121212" stroke="#d4af37" strokeWidth="0.5" />
                <circle cx="80" cy="80" r="76" fill="#161616" />
                
                {/* Plak Kanalları (İzler) */}
                <circle cx="80" cy="80" r="70" stroke="#222" strokeWidth="0.5" fill="none" />
                <circle cx="80" cy="80" r="65" stroke="#2a2a2a" strokeWidth="0.75" fill="none" />
                <circle cx="80" cy="80" r="60" stroke="#1d1d1d" strokeWidth="0.5" fill="none" />
                <circle cx="80" cy="80" r="55" stroke="#2a2a2a" strokeWidth="0.5" fill="none" />
                <circle cx="80" cy="80" r="50" stroke="#1d1d1d" strokeWidth="0.5" fill="none" />
                <circle cx="80" cy="80" r="45" stroke="#2a2a2a" strokeWidth="0.75" fill="none" />
                <circle cx="80" cy="80" r="40" stroke="#1d1d1d" strokeWidth="0.5" fill="none" />
                <circle cx="80" cy="80" r="34" stroke="#222" strokeWidth="0.5" fill="none" />
                
                {/* Göbek Etiketi (Gold/Bronz) */}
                <circle cx="80" cy="80" r="26" fill="#d4af37" />
                <circle cx="80" cy="80" r="23" fill="#121212" stroke="#d4af37" strokeWidth="1" />
                
                {/* Göbek Logosu */}
                <text x="80" y="83" fill="#d4af37" fontSize="5.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.8" fontFamily="serif">PENNYLANE</text>
                
                {/* Spindle Deliği */}
                <circle cx="80" cy="80" r="3" fill="#121212" />
              </svg>
            </motion.div>
          </div>

          {/* İğne Katmanı (Needle overlay) */}
          <div className="absolute inset-0 pointer-events-none">
            <svg viewBox="0 0 240 240" className="w-full h-full">
              {/* İğne Yatağı / Armrest */}
              <path d="M 213,65 Q 218,75 218,85" stroke="#2a2a2a" strokeWidth="2.5" fill="none" />
              <line x1="213" y1="85" x2="223" y2="85" stroke="#333" strokeWidth="2" />
              
              {/* Kol Grubu (Tonearm) */}
              <g 
                style={{ 
                  transform: `rotate(${getNeedleAngle(progress)}deg)`, 
                  transformOrigin: "200px 40px",
                  transition: "transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                }}
              >
                {/* Bağlantı noktası dikey pimi */}
                <line x1="200" y1="40" x2="200" y2="52" stroke="#444" strokeWidth="3" />
                
                {/* Metal Kol Borusu */}
                <path d="M 200,40 Q 185,90 80,130" stroke="#888" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M 200,40 Q 185,90 80,130" stroke="#d4af37" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                
                {/* Kafa / Kartuş (Headshell) */}
                <g transform="translate(68, 125) rotate(-35)">
                  <rect x="0" y="0" width="18" height="9" rx="1.5" fill="#222" stroke="#d4af37" strokeWidth="1" />
                  {/* Kartuş detayı */}
                  <rect x="2" y="2" width="5" height="5" fill="#d4af37" />
                  {/* İğne ucu */}
                  <line x1="12" y1="9" x2="14" y2="12" stroke="#fff" strokeWidth="1.5" />
                </g>
                
                {/* Döner Kol Tabanı */}
                <circle cx="200" cy="40" r="11" fill="#222" stroke="#d4af37" strokeWidth="2" />
                <circle cx="200" cy="40" r="6" fill="#3a3a3a" />
                
                {/* Ağırlık / Counterweight */}
                <rect x="194" y="20" width="12" height="8" rx="1" fill="#111" stroke="#d4af37" strokeWidth="1" />
              </g>
            </svg>
          </div>

        </div>

        {/* Yüzde & Metin */}
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/60 mb-3 font-mono">
          {Math.round(progress)}%
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-serif font-bold tracking-widest uppercase mb-1.5">PENNYLANE</h2>
          <span className="text-[9px] uppercase font-semibold tracking-[0.9em] opacity-50">GASTROPUB EXPERIENCE</span>
        </div>
      </div>
    );
  }

  // Error durumunda bile siteyi kapatmıyoruz (Hook artık fallback veriyor)
  if (error && !cmsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark px-10 text-center">
        <h2 className="text-5xl font-serif font-bold text-secondary mb-10 uppercase tracking-tighter">SİSTEM YÜKLENİYOR</h2>
        <p className="text-textSecondary text-xl italic max-w-2xl font-light mb-10 opacity-70 leading-relaxed">
          Verilere şu an ulaşılamıyor, lütfen sayfayı yenileyin.
        </p>
        <button onClick={() => window.location.reload()} className="btn-outline">YENİDEN DENE</button>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <div className="bg-dark text-white min-h-screen selection:bg-secondary selection:text-primary">
            <Routes>
              <Route path="/" element={
                <>
                  <Header data={cmsData?.header} />
                  <Home cmsData={cmsData} />
                  <Footer data={cmsData?.footer} onOpenPolicy={setActivePolicy} />
                </>
              } />
              <Route path="/admin" element={<AdminPanel initialData={cmsData} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/menu" element={<QRMenuPage cmsData={cmsData} />} />
              <Route path="/print-menu" element={<PrintMenuPage cmsData={cmsData} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <AnimatePresence>
              {activePolicy && (
                <PolicyModal
                  isOpen={!!activePolicy}
                  onClose={() => setActivePolicy(null)}
                  policyType={activePolicy}
                  policyData={cmsData?.policies?.[activePolicy]}
                />
              )}
            </AnimatePresence>
          </div>
        </Router>
      </ErrorBoundary>
    </LanguageProvider>
  );
}
