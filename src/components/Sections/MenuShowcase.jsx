import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SectionHeading from '../Common/SectionHeading';

const MenuShowcase = ({ data }) => {
  const { t } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!data) return null;

  return (
    <section id="specials" className="py-24 md:py-36 bg-dark overflow-hidden">
      <div className="section-container">
        <SectionHeading title={data.section_title} subtitle={data.section_subtitle} />

        {/* Horizontal Accordion */}
        <div className="flex flex-col md:flex-row gap-4 mt-16 h-[500px] md:h-[600px]">
          {data.categories?.map((cat, idx) => {
            const isActive = activeIdx === idx;
            return (
              <motion.div
                key={cat.id}
                onClick={() => {
                  if (isActive) {
                    setSelectedProduct(cat);
                  } else {
                    setActiveIdx(idx);
                  }
                }}
                layout
                className={`relative overflow-hidden rounded-3xl cursor-pointer border transition-all duration-700 flex-shrink-0 group ${
                  isActive 
                    ? 'flex-[4] border-secondary/40 shadow-[0_30px_60px_-15px_rgba(244,228,193,0.15)] ring-1 ring-secondary/20' 
                    : 'flex-[1] border-secondary/10 hover:border-secondary/30'
                }`}
                transition={{ 
                  layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                  duration: 0.6
                }}
              >
                {/* Background Image */}
                <motion.div
                  layout
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-1000 ${
                    isActive ? 'scale-110 brightness-75' : 'scale-100 brightness-[0.35] grayscale-[0.5]'
                  }`}
                  style={{ backgroundImage: `url(${cat.image_url})` }}
                />

                {/* Overlays */}
                <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                  isActive ? 'bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-80' : 'bg-dark/40 opacity-100'
                }`} />

                {/* Content Container */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-10 h-full">
                  
                  {/* Vertical Title (when collapsed) */}
                  {!isActive && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <span className="text-white text-3xl md:text-4xl font-serif font-bold uppercase tracking-[0.2em] whitespace-nowrap -rotate-90 origin-center select-none opacity-100 group-hover:text-secondary transition-all duration-500 drop-shadow-lg">
                        {t(cat.title)}
                      </span>
                    </motion.div>
                  )}

                  {/* Top Info (Number & Small Icon) */}
                  <div className={`absolute top-8 left-0 right-0 px-6 flex items-center justify-between transition-all duration-500 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-40 -translate-y-2'
                  }`}>
                    <span className={`text-lg font-serif font-bold italic ${isActive ? 'text-secondary' : 'text-white/50'}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-500 ${
                      isActive ? 'border-secondary text-secondary bg-secondary/10' : 'border-white/20 text-white/20'
                    }`}>
                      {isActive ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <div className={`transition-all duration-700 ease-out flex flex-col ${
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}>
                    <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight max-w-sm">
                      {t(cat.title)}
                    </h3>
                    <p className="text-textSecondary/80 text-sm md:text-base font-light leading-relaxed max-w-md italic border-l-2 border-secondary/30 pl-6 mb-8 translate-x-0 group-hover:translate-x-2 transition-transform duration-500 line-clamp-1">
                      {t(cat.description)}
                    </p>
                    
                    <div 
                      onClick={(e) => { e.stopPropagation(); setSelectedProduct(cat); }}
                      className="flex items-center space-x-4 group/btn cursor-pointer"
                    >
                      <div className="h-[2px] w-12 bg-secondary group-hover/btn:w-20 transition-all duration-500" />
                      <span className="text-white text-[10px] font-black uppercase tracking-[0.4em] group-hover/btn:text-secondary transition-colors">
                        {t({ tr: 'DETAYLARI İNCELE', en: 'VIEW DETAILS' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom decorative line (Only when collapsed) */}
                {!isActive && (
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-secondary/30 group-hover:bg-secondary/60 transition-colors" />
                )}
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

                {/* Left Side: Image */}
                <div className="w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden">
                  <motion.div 
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${selectedProduct.image_url})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark/40" />
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-dark relative">
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
                      className="text-textSecondary text-base md:text-lg font-light leading-relaxed italic"
                    >
                      {t(selectedProduct.description)}
                    </motion.p>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="pt-6"
                    >
                      <a 
                        href={selectedProduct.link || '#'}
                        className="inline-flex items-center space-x-4 group/link"
                      >
                        <span className="w-12 h-12 rounded-full border border-secondary/30 flex items-center justify-center text-secondary group-hover/link:bg-secondary group-hover/link:text-dark transition-all duration-500">
                          <ArrowRight className="w-5 h-5 transition-transform group-hover/link:translate-x-1" />
                        </span>
                        <span className="text-white text-[10px] font-bold tracking-[0.4em] uppercase group-hover/link:text-secondary transition-colors">
                          {t({ tr: 'İNCELE', en: 'VIEW' })}
                        </span>
                      </a>
                    </motion.div>
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
