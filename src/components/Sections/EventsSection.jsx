import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, X, ArrowRight, Grab } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SectionHeading from '../Common/SectionHeading';

const EventsSection = ({ data }) => {
  const { t } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const carouselRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        const scrollWidth = carouselRef.current.scrollWidth;
        const offsetWidth = carouselRef.current.offsetWidth;
        setWidth(scrollWidth > offsetWidth ? scrollWidth - offsetWidth : 0);
      }
    };
    
    // Give it a tiny timeout to ensure elements are rendered
    const timer = setTimeout(updateWidth, 100);
    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateWidth);
    };
  }, [data.events]);

  if (!data || !data.events || data.events.length === 0) return null;

  return (
    <section id="events" className="py-24 md:py-36 bg-dark/70 relative overflow-hidden">
      <div className="section-container">
        <SectionHeading title={data.section_title} subtitle={t({ tr: "Unutulmaz Anlar İçin Takipte Kalın", en: "Stay Tuned for Unforgettable Moments" })} />

        {/* Horizontal Drag Instruction */}
        <div className="flex items-center justify-center space-x-2 text-textSecondary/60 text-xs uppercase tracking-[0.2em] mt-8 mb-4">
          <Grab className="w-4 h-4 animate-pulse text-secondary" />
          <span>{t({ tr: "Kaydırmak için sürükleyin", en: "Drag to scroll" })}</span>
        </div>

        {/* Carousel Viewport Container */}
        <div 
          ref={carouselRef} 
          className="w-full overflow-hidden cursor-grab active:cursor-grabbing px-4"
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            dragElastic={0.1}
            whileTap={{ cursor: 'grabbing' }}
            className="flex gap-6 py-6"
            style={{ width: 'max-content' }}
          >
            {data.events.map((event) => {
              const dateStr = t(event.date) || t({ tr: 'YAKINDA', en: 'COMING SOON' });
              const day = dateStr.split(' ')[0];
              const month = dateStr.split(' ')[1]?.slice(0, 3) || '';
              
              return (
                <motion.div
                  key={event.id}
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-[280px] sm:w-[320px] md:w-[350px] h-[420px] md:h-[480px] flex-shrink-0 relative rounded-[2rem] overflow-hidden border border-secondary/15 group shadow-2xl bg-primary/20 backdrop-blur-sm"
                  onClick={() => setSelectedEvent(event)}
                >
                  {/* Event Poster Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-110 filter brightness-95 group-hover:brightness-100"
                    style={{ backgroundImage: `url(${event.image_url})` }}
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-95 transition-opacity duration-500 group-hover:opacity-90" />

                  {/* Date Badge (Top Right) */}
                  {day && (
                    <div className="absolute top-5 right-5 z-20 bg-dark/70 backdrop-blur-md border border-secondary/20 px-3.5 py-2 rounded-2xl flex flex-col items-center min-w-[50px] shadow-lg">
                      <span className="text-secondary font-black text-lg md:text-xl leading-none">{day}</span>
                      <span className="text-secondary/60 font-bold text-[9px] md:text-[10px] uppercase tracking-widest mt-0.5">{month}</span>
                    </div>
                  )}

                  {/* Card Content (Bottom) */}
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end z-10">
                    <span className="text-secondary/60 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-secondary" />
                      {t(event.location) || t({ tr: 'PENNYLANE CADDE', en: 'PENNYLANE CADDE' })}
                    </span>

                    <h3 className="font-serif font-bold uppercase text-xl md:text-2xl text-white tracking-wide group-hover:text-secondary transition-colors duration-300 mb-3 line-clamp-2">
                      {t(event.title)}
                    </h3>

                    <p className="text-textSecondary/80 text-xs md:text-sm font-light leading-relaxed mb-5 line-clamp-2 italic opacity-85 group-hover:opacity-100 transition-opacity">
                      {t(event.description) || t({ tr: 'Detaylı bilgi için tıklayın.', en: 'Click for details.' })}
                    </p>

                    <div className="flex items-center space-x-3 text-secondary text-xs font-black uppercase tracking-widest border-t border-secondary/15 pt-4 group-hover:border-secondary/40 transition-colors">
                      <span>{t({ tr: 'DETAYLARI GÖR', en: 'VIEW DETAILS' })}</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Global Detail Lightbox */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark/98 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative max-w-5xl w-full bg-primary/40 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-secondary/15 flex flex-col md:flex-row cursor-default max-h-[90vh] md:max-h-[750px]"
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-6 text-white hover:text-dark z-20 bg-dark/40 rounded-full w-12 h-12 flex items-center justify-center border border-secondary/20 hover:bg-secondary hover:border-secondary transition-all duration-300"
                onClick={() => setSelectedEvent(null)}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-full md:w-3/5 h-[350px] md:h-full relative overflow-hidden bg-black/10 flex items-center justify-center">
                <motion.img 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    src={selectedEvent.image_url} 
                    alt="" 
                    className="w-full h-full object-contain" 
                />
              </div>

              <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-dark/40 backdrop-blur-md relative">
                <div className="space-y-6 relative z-10">
                    <div className="flex items-center space-x-4 text-secondary text-[11px] font-bold uppercase tracking-[0.5em]">
                        <Calendar className="w-5 h-5" />
                        <span>{t(selectedEvent.date) || t({ tr: 'TARİH YAKINDA', en: 'DATE COMING SOON' })}</span>
                        {selectedEvent.time && (
                            <>
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary/40 mx-2" />
                                <Clock className="w-5 h-5" />
                                <span>{t(selectedEvent.time)}</span>
                            </>
                        )}
                    </div>

                    <h3 className="text-3xl lg:text-5xl text-white font-serif font-bold uppercase tracking-widest leading-tight">
                      {t(selectedEvent.title)}
                    </h3>
                    
                    <div className="w-16 h-[2px] bg-secondary/40" />
                    
                    <p className="text-textSecondary text-lg md:text-xl font-light italic leading-relaxed opacity-90 border-l-2 border-secondary/20 pl-8">
                      {t(selectedEvent.description) || t({ tr: 'Bu özel etkinlik için yerinizi şimdiden ayırtmayı unutmayın. Detaylı bilgi Pennylane ekibi tarafından paylaşılacaktır.', en: 'Don\'t forget to reserve your place for this special event. Detailed information will be shared by the Pennylane team.' })}
                    </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EventsSection;
