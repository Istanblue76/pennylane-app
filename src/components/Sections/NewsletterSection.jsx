import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../Common/Button';

const NewsletterSection = ({ data }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success

  if (!data) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      // Vercel'de /api doğrudan çalışır, localde port 5000 gerekir
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiBase = isLocal ? 'http://localhost:5000' : '';
      
      const response = await fetch(`${apiBase}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const result = await response.json();
      if (result.status === 'success') {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Newsletter error:', err);
      setStatus('idle');
      alert('Bir hata oluştu, lütfen tekrar deneyin.');
    }
  };

  return (
    <section className="py-24 md:py-48 bg-[#080808] relative overflow-hidden">
      {/* Premium Floating Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c9a96e]/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="section-container relative z-10 text-center max-w-5xl">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2, ease: "easeOut" }}
           viewport={{ once: true }}
           className="relative bg-black/40 backdrop-blur-3xl p-12 md:p-24 border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.4)] rounded-[3rem] overflow-hidden group"
        >
          {/* Subtle line decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#c9a96e]/50 to-transparent" />

          <motion.span 
            initial={{ opacity: 0, tracking: '0.2em' }}
            whileInView={{ opacity: 1, tracking: '0.4em' }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[#c9a96e] font-black uppercase text-[10px] mb-6 inline-block"
          >
            {t({ tr: 'PENNYLANE AİLESİ', en: 'PENNYLANE FAMILY' })}
          </motion.span>

          <motion.h2 
            whileHover={{ letterSpacing: '0.25em' }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-white mb-8 uppercase tracking-widest cursor-default select-none"
          >
            {t(data?.section_title) || 'PENNYLANE SOCIETY'}
          </motion.h2>

          <p className="text-base md:text-xl text-white/50 italic mb-14 font-light leading-relaxed max-w-2xl mx-auto">
            {t(data?.section_subtitle) || 'Stay tuned for premium updates.'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <div className="relative w-full group">
                <input 
                  type="email" 
                  placeholder={t(data.placeholder) || t({ tr: 'E-posta adresiniz', en: 'Your email address' })} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-8 py-5 rounded-2xl focus:outline-none focus:border-[#c9a96e]/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-[#c9a96e]/5 transition-all placeholder:text-white/20 font-light tracking-widest text-sm"
                  required
                />
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={status === 'loading'}
              type="submit"
              className="w-full sm:w-auto min-w-[180px] bg-[#c9a96e] text-black font-black uppercase tracking-[0.2em] text-[11px] py-5 px-10 rounded-2xl shadow-[0_10px_30px_rgba(201,169,110,0.3)] hover:shadow-[0_15px_40px_rgba(201,169,110,0.4)] transition-all disabled:opacity-50"
            >
              <AnimatePresence mode="wait">
                {status === 'loading' ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {t({ tr: 'BEKLEYİN...', en: 'WAIT...' })}
                  </motion.div>
                ) : status === 'success' ? (
                  <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center space-x-2">
                    <span>{t({ tr: 'ABONE OLUNDU!', en: 'DONE!' })}</span>
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {t(data.cta_text)}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-4 rounded-2xl bg-[#c9a96e]/10 border border-[#c9a96e]/20"
              >
                <p className="text-[#c9a96e] text-xs font-black uppercase tracking-widest">
                  {t({ tr: 'Ailemize Hoş Geldiniz!', en: 'Welcome to our Family!' })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
