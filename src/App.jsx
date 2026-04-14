import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
const AdminPanel = React.lazy(() => import('./pages/Admin/AdminPanel'));
const Login = React.lazy(() => import('./pages/Admin/Login'));
const QRMenuPage = React.lazy(() => import('./pages/QRMenuPage'));
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

export default function App() {
  const { cmsData, loading, error } = useFetchCMS();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark text-secondary">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
           className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full mb-8 shadow-2xl shadow-secondary/50"
        />
        <div className="flex flex-col items-center">
           <h2 className="text-3xl font-serif font-bold animate-pulse tracking-widest uppercase mb-2">PENNYLANE</h2>
           <span className="text-[10px] uppercase font-semibold tracking-[1em] opacity-60">GASTROPUB EXPERIENCE</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark px-10 text-center">
        <h2 className="text-5xl font-serif font-bold text-secondary mb-10 uppercase tracking-tighter">API BAĞLANTI HATASI</h2>
        <p className="text-textSecondary text-xl italic max-w-2xl font-light italic mb-10 opacity-70 leading-relaxed">
          İçerik sunucusu şu an aktif değil veya bir ağ sorunu yaşanıyor. Lütfen backend sunucusunun (PORT 5000) açık olduğunu kontrol edin.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-outline"
        >
          YENİDEN DENE
        </button>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <ErrorBoundary>
        <Router>
          <div className="bg-dark text-white min-h-screen selection:bg-secondary selection:text-primary">
            <React.Suspense fallback={
              <div className="flex items-center justify-center min-h-screen bg-dark">
                <div className="w-10 h-10 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
              </div>
            }>
              <Routes>
                <Route path="/" element={
                  <>
                    <Header data={cmsData?.header} />
                    <Home cmsData={cmsData} />
                    <Footer data={cmsData?.footer} />
                  </>
                } />
                <Route path="/admin" element={<AdminPanel initialData={cmsData} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/menu" element={<QRMenuPage cmsData={cmsData} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </React.Suspense>
          </div>
        </Router>
      </ErrorBoundary>
    </LanguageProvider>
  );
}
