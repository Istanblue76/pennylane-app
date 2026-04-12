import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../Common/Button';

const NewsletterSection = ({ data }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success

  if (!data) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <section className="py-24 md:py-36 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-dark/40 z-0" />
      {/* Dynamic Background Image if available */}
      <div 
        className="absolute inset-0 bg-cover bg-center grayscale-100 opacity-20 -z-1"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1543007630-9710e4a00a20?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')` }}
      />

      <div className="section-container relative z-10 text-center max-w-4xl">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1 }}
           viewport={{ once: true }}
           className="bg-dark/60 p-10 md:p-20 border-2 border-secondary/20 shadow-2xl rounded-3xl"
        >
          <span className="text-secondary font-semibold uppercase tracking-[0.4em] text-xs mb-4 inline-block">{t({ tr: 'PENNYLANE AİLESİ', en: 'PENNYLANE FAMILY' })}</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 uppercase tracking-widest">{t(data.section_title)}</h2>
          <p className="text-lg md:text-xl text-textSecondary italic mb-12 font-light leading-relaxed max-w-2xl mx-auto">{t(data.section_subtitle)}</p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch space-y-4 sm:space-y-0 sm:space-x-4 max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder={t(data.placeholder) || t({ tr: 'E-posta adresiniz', en: 'Your email address' })} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-primary/40 border border-secondary/30 text-white px-6 py-4 rounded-md focus:outline-none focus:border-secondary transition-all placeholder:text-textSecondary/50 font-light tracking-widest"
              required
            />
            <Button type="submit" disabled={status === 'loading'} className="min-w-[150px]">
              {status === 'loading' ? t({ tr: 'BEKLEYİN...', en: 'WAIT...' }) : (status === 'success' ? t({ tr: 'ABONE OLUNDU!', en: 'SUBSCRIBED!' }) : t(data.cta_text))}
            </Button>
          </form>
          {status === 'success' && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-secondary text-sm font-semibold uppercase tracking-widest"
            >
              {t({ tr: 'Ailemize Hoş Geldiniz!', en: 'Welcome to our Family!' })}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
