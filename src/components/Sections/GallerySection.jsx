import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SectionHeading from '../Common/SectionHeading';

const GallerySection = ({ data }) => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');

  if (!data) return null;

  const categories = ['all', ...new Set(data.images?.map(img => img.category) || [])];
  const filteredImages = filter === 'all' ? (data.images || []) : (data.images?.filter(img => img.category === filter) || []);

  return (
    <section id="gallery" className="py-24 md:py-36 bg-dark">
      <div className="section-container">
        <SectionHeading title={data.section_title} subtitle={data.section_subtitle} />

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 border ${
                filter === cat ? 'bg-secondary text-primary border-secondary shadow-lg shadow-secondary/20' : 'text-textSecondary border-textSecondary/20 hover:border-secondary hover:text-secondary'
              }`}
            >
              {cat === 'all' ? t({ tr: 'HEPSİ', en: 'ALL' }) : t(cat).toUpperCase()}
            </button>
          ))}
        </div>

        {/* Masonry-like Grid */}
        <motion.div 
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence>
            {filteredImages.map((img, index) => (
              <motion.div
                layout
                key={img.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="relative group cursor-pointer break-inside-avoid overflow-hidden rounded-lg shadow-xl"
                onClick={() => setSelectedImage(img)}
              >
                <img 
                  src={img.image_url} 
                  alt={t(img.caption) || t({ tr: 'Galeri Görseli', en: 'Gallery Image' })} 
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-110 filter grayscale-20 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center p-4">
                    <Maximize2 className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <p className="text-white text-sm font-serif italic">{t(img.caption)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Simple Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="absolute -top-12 right-0 text-white hover:text-secondary p-2 transition-colors z-30"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-8 h-8" />
              </button>
              
              <div className="w-full relative shadow-2xl rounded-2xl overflow-hidden border border-secondary/10 flex flex-col">
                <img 
                   src={selectedImage.image_url} 
                   alt="" 
                   className="w-full max-h-[75vh] object-contain bg-black/20" 
                />
                
                <div className="bg-primary/90 backdrop-blur-md p-6 border-l-4 border-secondary border-t border-secondary/10">
                  <h3 className="text-secondary text-2xl font-serif font-bold uppercase tracking-widest leading-none mb-2">
                    {t(selectedImage.caption) || 'PENNYLANE'}
                  </h3>
                  <span className="text-textSecondary text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">
                    {t(selectedImage.category)}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
