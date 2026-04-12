import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SectionHeading from '../Common/SectionHeading';

const TestimonialsSection = ({ data }) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!data?.reviews) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.reviews.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [data?.reviews?.length]);

  if (!data || !data.reviews) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % data.reviews.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + data.reviews.length) % data.reviews.length);

  return (
    <section className="py-24 md:py-36 bg-primary relative overflow-hidden">
      {/* Decorative Gold Elements */}
      <Quote className="absolute top-10 left-10 w-48 h-48 text-secondary opacity-5 pointer-events-none -rotate-12" />
      <Quote className="absolute bottom-10 right-10 w-48 h-48 text-secondary opacity-5 pointer-events-none rotate-[168deg]" />

      <div className="section-container relative z-10">
        <SectionHeading title={data.section_title} light={false} subtitle="Sizin İçin Buradayız" />

        <div className="relative max-w-4xl mx-auto px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-dark/50 p-10 md:p-16 border-2 border-secondary/20 shadow-2xl rounded-2xl text-center relative"
            >
              <div className="flex justify-center mb-8">
                {[...Array(data.reviews[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-secondary fill-secondary mx-0.5" />
                ))}
              </div>
              
              <p className="text-xl md:text-3xl font-serif italic text-white mb-10 leading-relaxed font-light">
                "{t(data.reviews[currentIndex].text)}"
              </p>

              <div className="flex flex-col items-center">
                <span className="text-secondary font-bold text-lg uppercase tracking-widest mb-1">{t(data.reviews[currentIndex].author_name)}</span>
                <span className="text-textSecondary text-sm uppercase font-semibold">{t(data.reviews[currentIndex].author_role)}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-center mt-12 space-x-6">
            <button 
              onClick={prev}
              className="p-3 border border-secondary text-secondary hover:bg-secondary hover:text-primary transition-all duration-300 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3">
              {data.reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-secondary w-8' : 'bg-secondary/30'}`}
                />
              ))}
            </div>
            <button 
              onClick={next}
              className="p-3 border border-secondary text-secondary hover:bg-secondary hover:text-primary transition-all duration-300 rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
