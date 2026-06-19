import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRMenu from '../components/Sections/QRMenu';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Sun, Moon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const QRMenuPage = ({ cmsData }) => {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();

  const adminDefault = cmsData?.settings?.theme || 'dark';
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('qr_theme') || adminDefault; }
    catch { return adminDefault; }
  });
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('qr_theme');
    if (!saved) setTheme(adminDefault);
  }, [adminDefault]);

  useEffect(() => {
    if (cmsData && cmsData?.settings?.visible_sections?.menu === false) navigate('/');
  }, [cmsData, navigate]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('qr_theme', next); } catch {}
  };

  if (!cmsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark" style={{ backgroundColor: '#0c0c0c' }}>
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-[#c9a96e]/10 animate-pulse" />
          <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-[#c9a96e] animate-spin" />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#c9a96e]/60">SİSTEM YÜKLENİYOR...</span>
      </div>
    );
  }

  const isDark    = theme === 'dark';
  const accent    = isDark ? '#c9a96e' : '#8b5e3c';
  const pageBg    = isDark ? '#0c0c0c' : '#f5f0e8';
  const headerBg  = isDark ? 'rgba(12,12,12,0.90)' : 'rgba(245,240,232,0.90)';
  const textColor = isDark ? '#ffffff' : '#1c1410';
  const effectiveSettings = { ...(cmsData.settings || {}), theme };

  /* ── background source for splash ── */
  const bgImage =
    cmsData?.welcome_screen?.background_image_url ||
    cmsData?.hero?.backgroundImage ||
    cmsData?.hero?.slides?.[0]?.image ||
    '/assets/img/hero-bg.jpg';

  const priceDate = cmsData?.settings?.price_update_date || '14.05.2026';

  return (
    <div
      className="min-h-screen overflow-x-hidden relative"
      style={{ backgroundColor: pageBg, color: textColor, transition: 'background-color 0.6s ease, color 0.6s ease' }}
    >

      {/* ══════════════════════════════════════════════
          SAYFA 1: KARŞILAMA EKRANI
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            key="welcome"
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[300] flex flex-col overflow-hidden select-none text-white"
          >
            {/* ── Ambient Background ── */}
            <div className="absolute inset-0">
              <img
                src={bgImage}
                alt=""
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none'; }}
              />
              {/* Cinematic dark gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/90" />
              {/* Golden center glow */}
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,0.09) 0%, transparent 70%)'
              }} />
            </div>

            {/* ── Content ── */}
            <div className="relative z-10 flex flex-col items-center justify-between h-[100dvh] py-16 px-6">

              {/* Sol üst köşe tamamen boş */}
              <div />

              {/* ── CENTER: Logo + Brand + CTA ── */}
              <div className="flex flex-col items-center text-center gap-0 w-full">

                {/* Logo emblem */}
                <motion.div
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
                  className="relative w-36 h-36 mb-6 flex items-center justify-center"
                >
                  <div className="absolute inset-0 rounded-full bg-[#c9a96e]/12 blur-2xl" />
                  <div className="absolute inset-3 rounded-full border border-[#c9a96e]/18 animate-pulse" />
                  <img
                    src="/assets/img/pennylane_logo_white.png"
                    alt="Pennylane"
                    className="relative w-full h-full object-contain drop-shadow-[0_8px_32px_rgba(201,169,110,0.4)]"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </motion.div>

                {/* Brand name */}
                <motion.h1
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="font-serif font-black text-white uppercase drop-shadow-2xl"
                  style={{ fontSize: 'clamp(2.5rem, 12vw, 3.5rem)', letterSpacing: '0.28em' }}
                >
                  PENNYLANE
                </motion.h1>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.55, duration: 0.7, ease: 'easeOut' }}
                  className="h-[1px] w-20 bg-[#c9a96e] my-5 opacity-55"
                />

                {/* Tagline */}
                <motion.span
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.7 }}
                  className="text-[10px] md:text-xs uppercase font-semibold tracking-[0.8em] text-[#c9a96e]/65"
                >
                  GASTROPUB &amp; EATERY
                </motion.span>

                {/* ── Bouncing arrows + Let's Start ── */}
                <motion.div
                  initial={{ y: 22, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.85, duration: 0.7 }}
                  className="flex flex-col items-center gap-4 mt-12"
                >
                  {/* Bouncing chevrons */}
                  <motion.div
                    animate={{ y: [0, 9, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="flex flex-col items-center gap-[4px]"
                  >
                    <svg width="24" height="14" viewBox="0 0 22 13" fill="none">
                      <path d="M1 1.5L11 11.5L21 1.5" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
                    </svg>
                    <svg width="24" height="14" viewBox="0 0 22 13" fill="none">
                      <path d="M1 1.5L11 11.5L21 1.5" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
                    </svg>
                  </motion.div>

                  {/* Let's Start button — JIE style: border box, no fill */}
                  <motion.button
                    onClick={() => setShowWelcome(false)}
                    whileHover={{ backgroundColor: '#c9a96e', color: '#0a0a0a', scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.22 }}
                    className="px-10 py-3.5 border border-[#c9a96e] text-[#c9a96e] text-[11px] md:text-xs font-black uppercase bg-transparent cursor-pointer"
                    style={{ letterSpacing: '0.5em', borderRadius: 0 }}
                  >
                    Let&apos;s Start
                  </motion.button>
                </motion.div>
              </div>

              {/* ── FOOTER ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.9 }}
                className="flex flex-col items-center gap-5 w-full"
              >
                {/* Language pills */}
                <div className="flex items-center gap-3">
                  {['tr', 'en'].map(l => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setShowWelcome(false); }}
                      className="px-6 py-2.5 rounded-full text-[10px] md:text-[11px] font-black uppercase border transition-all duration-200"
                      style={{
                        letterSpacing: '0.35em',
                        borderColor: lang === l ? '#c9a96e' : 'rgba(255,255,255,0.15)',
                        color: lang === l ? '#c9a96e' : 'rgba(255,255,255,0.4)',
                        backgroundColor: lang === l ? 'rgba(201,169,110,0.1)' : 'transparent',
                      }}
                    >
                      {l === 'tr' ? 'Türkçe' : 'English'}
                    </button>
                  ))}
                </div>

                {/* Fiyat güncelleme tarihi */}
                <p className="text-[9px] uppercase tracking-[0.28em] text-center" style={{ color: 'rgba(255,255,255,0.22)' }}>
                  Fiyat Güncelleme Tarihi:&nbsp;
                  <span className="font-mono">{priceDate}</span>
                </p>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════
          SAYFA 2: MENÜ — aşağıdan yukarı kayarak girer
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {!showWelcome && (
          <motion.div
            key="menu"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="min-h-screen relative z-[100]"
            style={{ backgroundColor: pageBg, color: textColor }}
          >
            {/* ── Sticky Header ── */}
            <motion.header
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
              className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl flex items-center justify-between px-5 py-4"
              style={{ backgroundColor: headerBg, borderBottom: `1px solid ${accent}20`, transition: 'background-color 0.6s ease' }}
            >
              <div className="w-8 sm:w-20" />

              <Link
                to="/"
                onClick={e => {
                  if (window.location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
                }}
                className="flex flex-col items-center hover:opacity-85 transition-opacity cursor-pointer"
              >
                <h1 className="text-xl font-serif font-black tracking-[0.32em]" style={{ color: textColor }}>PENNYLANE</h1>
                <span className="text-[8px] font-black tracking-[0.5em] uppercase -mt-0.5" style={{ color: accent }}>Digital Menu</span>
              </Link>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  title={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  style={{ backgroundColor: `${accent}14`, border: `1px solid ${accent}28` }}
                >
                  {isDark ? <Sun className="w-4 h-4" style={{ color: accent }} /> : <Moon className="w-4 h-4" style={{ color: accent }} />}
                </button>

                <button
                  onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all hover:opacity-80 active:scale-95"
                  style={{ backgroundColor: `${accent}12`, border: `1px solid ${accent}25` }}
                >
                  <Globe className="w-3.5 h-3.5" style={{ color: accent }} />
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accent }}>{lang.toUpperCase()}</span>
                </button>
              </div>
            </motion.header>

            {/* ── Ana menü içeriği ── */}
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
                <div className="fixed top-1/3 -left-24 w-80 h-80 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(201,169,110,0.035)' }} />
                <div className="fixed bottom-1/3 -right-24 w-80 h-80 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(201,169,110,0.035)' }} />
              </>
            )}

            {/* Footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="py-10 flex flex-col items-center text-center px-10"
              style={{ borderTop: `1px solid ${accent}18` }}
            >
              <div className="w-10 mb-5" style={{ height: '1.5px', backgroundColor: `${accent}45` }} />
              <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: textColor, opacity: 0.3 }}>
                {t(cmsData?.footer?.copyright) || '© 2025 Pennylane Gastropub'}
              </p>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRMenuPage;
