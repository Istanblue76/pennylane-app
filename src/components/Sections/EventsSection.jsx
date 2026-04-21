import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SectionHeading from '../Common/SectionHeading';

const EventsSection = ({ data }) => {
  const { t } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeAccIdx, setActiveAccIdx] = useState(-1);

  if (!data || !data.events) return null;

  return (
    <section id="events" className="py-24 md:py-36 bg-dark/70 relative overflow-hidden">
      <div className="section-container">
        <SectionHeading title={data.section_title} subtitle="Unutulmaz Anlar İçin Takipte Kalın" />

        {/* All Events - High Depth Vertical Accordion */}
        <div className="mt-16 flex flex-col gap-4 max-w-4xl mx-auto">
          {data.events?.map((event, idx) => {
            const isActive = activeAccIdx === idx;
            const dateStr = t(event.date) || 'YAKINDA';
            
            return (
              <motion.div
                key={event.id}
                layout
                className={`relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] cursor-pointer border transition-all duration-700 flex-shrink-0 group ${
                  isActive 
                    ? 'border-secondary/40 shadow-[0_30px_60px_-15px_rgba(244,228,193,0.15)] ring-1 ring-secondary/20 bg-dark/20' 
                    : 'border-secondary/10 hover:border-secondary/30 bg-dark/40'
                }`}
                onClick={() => {
                    if (isActive) setSelectedEvent(event);
                    else setActiveAccIdx(idx);
                }}
              >
                {/* Background Image with Depth Effect */}
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
                    isActive ? 'scale-110 opacity-60' : 'scale-100 opacity-20 grayscale group-hover:opacity-100 group-hover:grayscale-0'
                  }`}
                  style={{ backgroundImage: `url(${event.image_url})` }}
                />
                
                {/* Gradient Overlays for readability */}
                <div className={`absolute inset-0 transition-opacity duration-700 ${
                  isActive ? 'bg-gradient-to-t from-dark via-dark/40 to-transparent opacity-95' : 'bg-dark/60 opacity-100 md:bg-dark/40'
                }`} />

                {/* Header Area (Always Visible) */}
                <div className="p-6 md:p-8 flex items-center justify-between relative z-20">
                    <div className="flex items-center space-x-6 md:space-x-10">
                        {/* Date info */}
                        <div className="flex flex-col items-center min-w-[50px] md:min-w-[70px]">
                            <span className="text-secondary font-black text-xl md:text-2xl leading-none">{dateStr.split(' ')[0]}</span>
                            <span className="text-secondary/60 font-bold text-[9px] md:text-xs uppercase tracking-widest mt-1">{dateStr.split(' ')[1]?.slice(0,3)}</span>
                        </div>

                        {/* Divider */}
                        <div className="w-[1px] h-10 bg-secondary/20" />

                        {/* Title & Category */}
                        <div>
                            <span className="text-secondary/50 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-1 block">
                                {t(event.location) || 'PENNYLANE CADDE'}
                            </span>
                            <h3 className={`font-serif font-bold uppercase tracking-wider transition-all duration-500 ${
                                isActive ? 'text-secondary text-xl md:text-3xl' : 'text-white text-lg md:text-2xl'
                            }`}>
                                {t(event.title)}
                            </h3>
                        </div>
                    </div>

                    {/* Interaction Icon */}
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${
                      isActive ? 'border-secondary text-secondary bg-secondary/10' : 'border-white/20 text-white/20'
                    }`}>
                      <ArrowRight className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'rotate-90' : 'rotate-0'}`} />
                    </div>
                </div>

                {/* Expanded Content (Description only) */}
                <AnimatePresence>
                    {isActive && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="relative overflow-hidden z-20"
                        >
                            <div className="px-6 pb-8 md:px-24 md:pb-12 pt-0">
                                <div className="max-w-3xl">
                                    <p className="text-textSecondary text-sm md:text-lg font-light leading-relaxed italic border-l-2 border-secondary/30 pl-6 mb-6">
                                        {t(event.description) || t({ tr: 'Detaylı bilgi ve rezervasyon için tıklayın.', en: 'Click for details and reservation.' })}
                                    </p>
                                    <span className="text-white text-[8px] font-black uppercase tracking-[0.4em] opacity-60">ETKİNLİK DETAYI İÇİN TIKLAYIN</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
