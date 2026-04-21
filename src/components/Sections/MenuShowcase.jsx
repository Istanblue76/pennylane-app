import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SectionHeading from '../Common/SectionHeading';

const MenuShowcase = ({ data }) => {
  const { t } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(-1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!data) return null;

  return (
    <section id="specials" className="py-24 md:py-36 bg-dark overflow-hidden">
      <div className="section-container">
        <SectionHeading title={data.section_title} subtitle={data.section_subtitle} />

        {/* Vertical List Accordion */}
        <div className="mt-16 flex flex-col gap-4 max-w-4xl mx-auto">
          {data.categories?.map((cat, idx) => {
            const isActive = activeIdx === idx;
            
            return (
              <motion.div
                key={cat.id}
                layout
                className={`relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] cursor-pointer border transition-all duration-500 bg-dark/40 backdrop-blur-sm ${
                  isActive 
                    ? 'border-secondary/40 shadow-[0_20px_50px_-15px_rgba(244,228,193,0.1)]' 
                    : 'border-secondary/10 hover:border-secondary/30'
                }`}
                onClick={() => setActiveIdx(isActive ? -1 : idx)}
              >
                {/* Background Image Card Style */}
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none z-0 ${
                    isActive ? 'scale-110 opacity-60' : 'scale-100 opacity-45 group-hover:opacity-100'
                  }`}
                  style={{ backgroundImage: `url(${cat.image_url})` }}
                />

                {/* Overlay for readability */}
                <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none z-10 ${
                    isActive ? 'bg-black/40' : 'bg-black/20 group-hover:opacity-0'
                }`} />

                {/* Header Area (Always Visible) */}
                <div className="p-6 md:p-8 flex items-center justify-between relative z-20">
                    <div className="flex items-center space-x-6 md:space-x-10">
                        {/* Number info */}
                        <div className="flex flex-col items-center min-w-[50px] md:min-w-[70px]">
                            <span className="text-secondary font-black text-xl md:text-2xl leading-none">
                                {String(idx + 1).padStart(2, '0')}
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="w-[1px] h-10 bg-secondary/20" />

                        {/* Title & Collection */}
                        <div>
                            <span className="text-secondary/50 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-1 block">
                                {t({ tr: 'ÖZEL SEÇKİ', en: 'SPECIAL SELECTION' })}
                            </span>
                            <h3 className={`font-serif font-bold uppercase tracking-wider transition-all duration-500 ${
                                isActive ? 'text-secondary text-xl md:text-3xl' : 'text-white text-lg md:text-2xl'
                            }`}>
                                {t(cat.title)}
                            </h3>
                        </div>
                    </div>

                    {/* Plus/Minus Icon */}
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${
                      isActive ? 'border-secondary text-secondary bg-secondary/10' : 'border-white/20 text-white/20'
                    }`}>
                      {isActive ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                    {isActive && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="relative overflow-hidden"
                        >
                            <div className="px-6 pb-8 md:px-24 md:pb-12 pt-0">
                                <div className="max-w-3xl">
                                    <p className="text-textSecondary text-sm md:text-lg font-light leading-relaxed mb-8 italic border-l-2 border-secondary/30 pl-6">
                                        {t(cat.description)}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-4">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedProduct(cat); }}
                                            className="bg-secondary text-primary font-black uppercase tracking-[0.3em] py-3 px-8 rounded-xl hover:bg-white transition-all text-[9px] md:text-[10px]"
                                        >
                                            {t({ tr: 'DETAYLARI İNCELE', en: 'VIEW DETAILS' })}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Product Detail Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProduct(null)}
                className="absolute inset-0 bg-dark/95 backdrop-blur-xl"
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-dark border border-secondary/20 rounded-[2rem] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[600px] shadow-2xl"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-dark/50 border border-secondary/20 flex items-center justify-center text-white hover:bg-secondary hover:text-dark transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-full md:w-3/5 h-[350px] md:h-full relative overflow-hidden bg-black/10 flex items-center justify-center">
                  <motion.img 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    src={selectedProduct.image_url} 
                    alt="" 
                    className="w-full h-full object-contain" 
                  />
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-center bg-dark relative">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <motion.span 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-secondary text-[10px] font-bold tracking-[0.5em] uppercase block"
                      >
                        {t({ tr: 'ÖZEL SEÇKİ', en: 'SPECIAL SELECTION' })}
                      </motion.span>
                      <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight"
                      >
                        {t(selectedProduct.title)}
                      </motion.h2>
                    </div>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="w-16 h-[2px] bg-secondary/30"
                    />

                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-textSecondary text-base md:text-xl font-light leading-relaxed italic"
                    >
                      {t(selectedProduct.description)}
                    </motion.p>
                  </div>

                  {/* Decorative background number */}
                  <span className="absolute bottom-[-10px] right-[-10px] text-[10rem] font-serif font-black text-white/5 select-none pointer-events-none">
                    {selectedProduct.id.slice(-2)}
                  </span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MenuShowcase;
