import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QRMenu from '../components/Sections/QRMenu';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, Globe, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  // Admin default değişince, kullanıcı daha önce bir seçim yapmamışsa güncelle
  useEffect(() => {
    const saved = localStorage.getItem('qr_theme');
    if (!saved) setTheme(adminDefault);
  }, [adminDefault]);

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
        <div className="flex flex-col items-center">
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
        </div>

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
          className="text-[10px] uppercase tracking-[0.3em] mb-4"
          style={{ color: textColor, opacity: 0.3 }}
        >
          {cmsData.footer?.copyright || '© 2025 Pennylane Gastropub'}
        </p>
        <div className="flex space-x-6">
          {[
            { label: 'Call',     href: `tel:${cmsData.footer?.contact_info?.phone}` },
            { label: 'Location', href: '#location' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-[10px] font-black uppercase tracking-widest transition-opacity hover:opacity-55"
              style={{ color: accent }}
            >
              {label}
            </a>
          ))}
        </div>
      </motion.footer>
    </div>
  );
};

export default QRMenuPage;
