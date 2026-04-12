import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SectionHeading from '../Common/SectionHeading';

const EventsSection = ({ data }) => {
  const { t } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeAccIdx, setActiveAccIdx] = useState(0);

  if (!data || !data.events) return null;

  return (
    <section id="events" className="py-24 md:py-36 bg-dark/70 relative overflow-hidden">
      <div className="section-container">
        <SectionHeading title={data.section_title} subtitle="Unutulmaz Anlar İçin Takipte Kalın" />

        {/* All Events - Horizontal Accordion Layout */}
        <div className="mt-16 flex flex-col md:flex-row gap-4 h-[500px] md:h-[600px]">
          {data.events?.map((event, idx) => {
            const isActive = activeAccIdx === idx;
            const dateStr = t(event.date) || 'YAKINDA';
            const dateParts = dateStr.split(' ');
            
            return (
              <motion.div
                key={event.id}
                onClick={() => {
                    if (isActive) setSelectedEvent(event);
                    else setActiveAccIdx(idx);
                }}
                layout
                className={`relative overflow-hidden rounded-[2rem] cursor-pointer border transition-all duration-700 flex-shrink-0 group ${
                  isActive 
                    ? 'flex-[4] border-secondary/40 shadow-[0_30px_60px_-15px_rgba(244,228,193,0.15)] ring-1 ring-secondary/20' 
                    : 'flex-[1] border-secondary/10 hover:border-secondary/30'
                }`}
              >
                {/* Background Image */}
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
                    isActive ? 'scale-110 brightness-75' : 'scale-100 brightness-[0.25] grayscale'
                  }`}
                  style={{ backgroundImage: `url(${event.image_url})` }}
                />
                
                {/* Gradient Overlays */}
                <div className={`absolute inset-0 transition-opacity duration-700 ${
                  isActive ? 'bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-90' : 'bg-dark/40 opacity-100'
                }`} />

                {/* Vertical Title (when collapsed) */}
                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-secondary/20 text-3xl md:text-4xl font-serif font-black uppercase tracking-[0.35em] -rotate-90 origin-center whitespace-nowrap opacity-40 group-hover:opacity-100 transition-all duration-500">
                      {t(event.title)}
                    </span>
                  </div>
                )}

                {/* Expanded Content */}
                <div className="absolute inset-0 z-10 p-8 md:p-12 flex flex-col justify-end">
                    <div className={`transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="text-secondary text-xs font-bold tracking-[0.5em] uppercase">{dateStr}</span>
                            <div className="w-1 h-1 rounded-full bg-secondary/30" />
                            <span className="text-secondary/60 text-[10px] font-bold uppercase tracking-[0.3em]">{t(event.location) || 'PENNYLANE'}</span>
                        </div>
                        
                        <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 uppercase tracking-widest leading-tight">
                          {t(event.title)}
                        </h3>
                        
                        <p className="text-textSecondary/80 text-sm md:text-base font-light leading-relaxed max-w-md line-clamp-1 italic border-l-2 border-secondary/30 pl-6 mb-8 group-hover:translate-x-2 transition-transform duration-500">
                          {t(event.description) || t({ tr: 'Detaylı bilgi ve rezervasyon için tıklayın.', en: 'Click for details and reservation.' })}
                        </p>
                        
                        <div className="flex items-center space-x-4 group/btn">
                            <div className="h-[2px] w-12 bg-secondary group-hover/btn:w-20 transition-all duration-500" />
                            <span className="text-white text-[10px] font-black uppercase tracking-[0.4em] group-hover/btn:text-secondary transition-colors">
                              {t({ tr: 'ETKİNLİK DETAYI', en: 'EVENT DETAILS' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Date Badge (Always visible top) */}
                <div className={`absolute top-8 left-8 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-50 -translate-y-2'}`}>
                    <div className="bg-secondary text-primary font-black px-4 py-2 rounded-xl text-xs tracking-widest uppercase shadow-xl flex flex-col items-center">
                        <span className="leading-none">{dateParts[0] || '??'}</span>
                        <span className="text-[9px] opacity-80 mt-1">{dateParts[1]?.slice(0,3) || '??'}</span>
                    </div>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 bg-secondary transition-opacity pointer-events-none" />
              </motion.div>
            );
          })}
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
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative max-w-5xl w-full bg-primary/40 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-secondary/15 flex flex-col md:flex-row cursor-default max-h-[90vh] md:max-h-[750px]"
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-6 text-white hover:text-dark z-20 bg-dark/40 rounded-full w-12 h-12 flex items-center justify-center border border-secondary/20 hover:bg-secondary hover:border-secondary transition-all duration-300"
                onClick={() => setSelectedEvent(null)}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden">
                <motion.img 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1 }}
                    src={selectedEvent.image_url} 
                    alt="" 
                    className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/60" />
              </div>

              <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-dark/40 backdrop-blur-md relative">
                <div className="space-y-8 relative z-10">
                    <div className="flex items-center space-x-4 text-secondary text-[11px] font-bold uppercase tracking-[0.5em]">
                        <Calendar className="w-5 h-5" />
                        <span>{t(selectedEvent.date) || 'TARİH YAKINDA'}</span>
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
                    
                    <div className="flex flex-col sm:flex-row gap-6 pt-6">
                        <div className="flex items-center space-x-4 text-white font-bold text-[9px] tracking-[0.4em] uppercase bg-secondary/5 px-6 py-4 rounded-2xl border border-secondary/15">
                            <MapPin className="w-5 h-5 text-secondary" />
                            <span>{t(selectedEvent.location) || 'PENNYLANE CADDEBOSTAN'}</span>
                        </div>
                        
                        <a href="#reservation" onClick={() => setSelectedEvent(null)} className="flex items-center justify-center space-x-4 bg-secondary text-dark font-black text-[9px] tracking-[0.4em] uppercase px-8 py-4 rounded-2xl hover:bg-white transition-all transform hover:-translate-y-1 shadow-lg shadow-secondary/10">
                            <span>{t({ tr: 'REZERVASYON YAP', en: 'MAKE RESERVATION' })}</span>
                        </a>
                    </div>
                </div>

                {/* Artistic decorative text */}
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-serif font-black text-white/[0.02] select-none pointer-events-none">
                    EVENT
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EventsSection;
