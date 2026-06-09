import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRMenu from '../components/Sections/QRMenu';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, Globe, Sun, Moon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const QRMenuPage = ({ cmsData }) => {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();

  // Admin'in belirlediği default tema
  const adminDefault = cmsData?.settings?.theme || 'dark';

  // Kullanıcının localStorage'daki tercihi (yoksa admin default)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('qr_theme') || adminDefault;
    } catch {
      return adminDefault;
    }
  });

  const [showWelcome, setShowWelcome] = useState(true);

  // Admin default değişince, kullanıcı daha önce bir seçim yapmamışsa güncelle
  useEffect(() => {
    const saved = localStorage.getItem('qr_theme');
    if (!saved) setTheme(adminDefault);
  }, [adminDefault]);

  // Sayfa gizli ise ana sayfaya yönlendir
  useEffect(() => {
    if (cmsData && cmsData?.settings?.visible_sections?.menu === false) {
      navigate('/');
    }
  }, [cmsData, navigate]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('qr_theme', next); } catch {}
  };

  if (!cmsData) return null;

  const isDark   = theme === 'dark';
  const accent   = isDark ? '#c9a96e' : '#8b5e3c';
  const pageBg   = isDark ? '#0c0c0c' : '#f5f0e8';
  const headerBg = isDark ? 'rgba(12,12,12,0.90)' : 'rgba(245,240,232,0.90)';
  const textColor = isDark ? '#ffffff' : '#1c1410';

  // Settings'i override'la — kullanıcının seçtiği tema geçerli
  const effectiveSettings = { ...(cmsData.settings || {}), theme };

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: pageBg,
        color: textColor,
        transition: 'background-color 0.6s ease, color 0.6s ease',
      }}
    >
      {/* ── Welcome Splash Screen ── */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            key="welcome-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
            transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[300] flex flex-col justify-between items-center py-20 px-6 cursor-pointer select-none text-white"
            style={{
              backgroundColor: '#0a0a0a',
              backgroundImage: 'radial-gradient(circle at center, #1b1712 0%, #070707 100%)',
            }}
            onClick={() => setShowWelcome(false)}
          >
            {/* Top slogan / brand label */}
            <motion.div 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 0.4 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-[9px] uppercase tracking-[0.45em] text-[#c9a96e] font-black text-center"
            >
              {t({ tr: 'Pennylane Gastropub Deneyimi', en: 'Pennylane Gastropub Experience' })}
            </motion.div>

            {/* Center Logo & Brand Name */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="relative w-28 h-28 mb-8 flex items-center justify-center"
              >
                {/* Glowing aura */}
                <div className="absolute inset-0 rounded-full bg-[#c9a96e]/10 blur-2xl animate-pulse" />
                <img
                  src="/assets/img/pennylane_logo_white.png"
                  alt="Pennylane Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(201,169,110,0.25)]"
                  onError={(e) => {
                    e.target.style.display = 'none'; // Fallback if image not found
                  }}
                />
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-4xl sm:text-5xl font-serif font-black tracking-[0.25em] text-white uppercase"
              >
                PENNYLANE
              </motion.h1>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="h-[1.5px] bg-[#c9a96e] my-4 opacity-50"
              />

              <motion.span
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-[10px] uppercase font-bold tracking-[0.7em] text-[#c9a96e]/80"
              >
                GASTROPUB & EATERY
              </motion.span>
            </div>

            {/* Bottom Actions, Disclaimer & Languages */}
            <div 
              className="w-full max-w-sm flex flex-col items-center text-center space-y-8" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Click / Tap to Enter Action */}
              <div className="space-y-5 cursor-pointer w-full flex flex-col items-center" onClick={() => setShowWelcome(false)}>
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6], scale: [0.97, 1.03, 0.97] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="text-sm sm:text-base font-black uppercase tracking-[0.35em] text-[#c9a96e] drop-shadow-[0_0_8px_rgba(201,169,110,0.45)]"
                >
                  {t({ tr: 'BAŞLAMAK İÇİN TIKLAYIN!', en: 'TAP TO START!' })}
                </motion.div>
                
                <div className="text-[9.5px] text-white/50 uppercase tracking-[0.18em] leading-relaxed font-medium">
                  {t({ tr: 'FİYATLARIMIZA TÜM VERGİLER DAHİLDİR.', en: 'ALL TAXES ARE INCLUDED IN OUR PRICES.' })}
                  <span className="opacity-70 mt-1.5 block font-mono">
                    {t({ tr: 'Son fiyat güncellemesi: 14.05.2026', en: 'Last price update: 14.05.2026' })}
                  </span>
                </div>
              </div>

              {/* Language Selection Buttons */}
              <div className="flex items-center justify-center space-x-4 pt-6 border-t border-[#c9a96e]/15 w-full">
                <button
                  onClick={() => { setLang('tr'); setShowWelcome(false); }}
                  className={`flex items-center space-x-2.5 px-6 py-3 rounded-2xl transition-all duration-350 hover:scale-105 active:scale-95 border cursor-pointer ${
                    lang === 'tr' 
                      ? 'border-[#c9a96e] bg-[#c9a96e]/10 text-[#c9a96e] shadow-lg shadow-[#c9a96e]/5' 
                      : 'border-white/10 text-white/60 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">TR - TÜRKÇE</span>
                </button>
                
                <button
                  onClick={() => { setLang('en'); setShowWelcome(false); }}
                  className={`flex items-center space-x-2.5 px-6 py-3 rounded-2xl transition-all duration-350 hover:scale-105 active:scale-95 border cursor-pointer ${
                    lang === 'en' 
                      ? 'border-[#c9a96e] bg-[#c9a96e]/10 text-[#c9a96e] shadow-lg shadow-[#c9a96e]/5' 
                      : 'border-white/10 text-white/60 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">EN - ENGLISH</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── Sticky Header ── */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl flex items-center justify-between px-5 py-4"
        style={{
          backgroundColor: headerBg,
          borderBottom: `1px solid ${accent}20`,
          transition: 'background-color 0.6s ease',
        }}
      >
        {/* Left placeholder to keep logo centered */}
        <div className="w-8 sm:w-20" />

        {/* Logo */}
        <Link 
          to="/" 
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex flex-col items-center hover:opacity-85 transition-opacity cursor-pointer"
        >
          <h1
            className="text-xl font-serif font-black tracking-[0.32em]"
            style={{ color: textColor }}
          >
            PENNYLANE
          </h1>
          <span
            className="text-[8px] font-black tracking-[0.5em] uppercase -mt-0.5"
            style={{ color: accent }}
          >
            Digital Menu
          </span>
        </Link>

        {/* Sağ kontroller: Tema + Dil */}
        <div className="flex items-center space-x-2">
          {/* Tema toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              backgroundColor: `${accent}14`,
              border: `1px solid ${accent}28`,
            }}
          >
            {isDark
              ? <Sun  className="w-4 h-4" style={{ color: accent }} />
              : <Moon className="w-4 h-4" style={{ color: accent }} />
            }
          </button>

          {/* Dil toggle */}
          <button
            onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all hover:opacity-80 active:scale-95"
            style={{
              backgroundColor: `${accent}12`,
              border: `1px solid ${accent}25`,
            }}
          >
            <Globe className="w-3.5 h-3.5" style={{ color: accent }} />
            <span
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: accent }}
            >
              {lang.toUpperCase()}
            </span>
          </button>
        </div>
      </motion.header>

      {/* ── Ana içerik ── */}
      <div className="pt-20">
        <QRMenu
          data={cmsData.menu}
          allergens={cmsData.allergens}
          settings={effectiveSettings}
          isPage={true}
        />
      </div>

      {/* Ortam ışığı (koyu temada) */}
      {isDark && (
        <>
          <div
            className="fixed top-1/3 -left-24 w-80 h-80 rounded-full blur-[120px] pointer-events-none"
            style={{ backgroundColor: 'rgba(201,169,110,0.035)' }}
          />
          <div
            className="fixed bottom-1/3 -right-24 w-80 h-80 rounded-full blur-[120px] pointer-events-none"
            style={{ backgroundColor: 'rgba(201,169,110,0.035)' }}
          />
        </>
      )}

      {/* ── Footer ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="py-10 flex flex-col items-center text-center px-10"
        style={{ borderTop: `1px solid ${accent}18` }}
      >
        <div
          className="w-10 mb-5"
          style={{ height: '1.5px', backgroundColor: `${accent}45` }}
        />
        <p
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{ color: textColor, opacity: 0.3 }}
        >
          {t(cmsData?.footer?.copyright) || '© 2025 Pennylane Gastropub'}
        </p>
      </motion.footer>
    </div>
  );
};

export default QRMenuPage;
