import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../Common/Button';

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const numValue = parseInt(value, 10) || 0;
  const suffix = value.toString().replace(/[0-9]/g, '');

  useEffect(() => {
    if (isInView && numValue > 0) {
      setIsCounting(true);
      const duration = 4500; // Daha yavaş ilerlemesi için 4.5 saniye
      const startTime = performance.now();
      
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easeOutExpo - Sona yaklaştıkça çok daha fazla yavaşlıyor
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setCount(Math.floor(easeOut * numValue));
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          setCount(numValue);
          setIsCounting(false);
        }
      };
      
      requestAnimationFrame(updateCounter);
    }
  }, [isInView, numValue]);

  return (
    <span 
      ref={ref}
      style={{ display: 'inline-block' }}
      className={`transition-all duration-1000 ${isCounting ? 'blur-[1.5px] scale-110 opacity-75 text-white/80' : 'blur-none scale-100 opacity-100 text-secondary'}`}
    >
      {isInView && numValue > 0 ? count : 0}{suffix}
    </span>
  );
};

const AboutSection = ({ data }) => {
  const { t } = useLanguage();
  if (!data) return null;

  return (
    <section id="about" className="py-16 md:py-24 bg-dark relative overflow-hidden">
      <div className="section-container">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Left: Images */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-1/2 h-1/2 border-2 border-secondary/20 z-0 rounded-xl" />
            <div className="absolute -bottom-4 -right-4 w-1/3 h-1/3 bg-secondary/5 z-0 rounded-xl" />
            
            <div className="flex flex-col gap-4 relative z-10">
              <img 
                src={data.main_image_url} 
                alt={t(data.section_title)} 
                className={`w-full aspect-[16/9] object-cover rounded-xl shadow-xl transition-all duration-700 hover:filter-none ${data.image_effect || 'grayscale'}`}
              />
              
              {data.secondary_image_url && (
                <img 
                  src={data.secondary_image_url} 
                  alt={t(data.main_heading)} 
                  className={`w-full aspect-[16/9] object-cover rounded-xl shadow-xl transition-all duration-700 hover:filter-none ${data.image_effect || 'grayscale'}`}
                />
              )}
            </div>
          </motion.div>

          {/* Right: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 pt-4 lg:pt-0"
          >
            <div className="space-y-2 mb-6">
              <h2 className="text-secondary font-serif font-bold text-3xl md:text-4xl uppercase tracking-widest leading-tight">{t(data.section_title)}</h2>
              <h3 className="text-white text-lg font-light tracking-wide">{t(data.main_heading)}</h3>
            </div>
            
            <div className="space-y-4">
              {data.paragraphs?.map((p, index) => (
                <p key={index} className="text-textSecondary/90 text-sm font-light leading-relaxed">
                  {t(p.text)}
                </p>
              ))}
            </div>

            <div className="bg-secondary/10 border-l-2 border-secondary p-5 shadow-inner mt-6 rounded-r-xl">
              <h4 className="text-secondary font-serif font-bold text-lg tracking-widest uppercase mb-1">{t(data.highlight_box?.title)}</h4>
              <p className="text-textSecondary text-xs font-light italic leading-relaxed">"{t(data.highlight_box?.content)}"</p>
            </div>
             
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 border-t border-secondary/10 pt-6 mt-6">
              {data.stats && data.stats.map((stat, idx) => (
                <div key={idx} className="text-center group">
                  <h4 className="text-2xl lg:text-3xl text-secondary font-serif font-bold mb-1 group-hover:scale-105 transition-transform">
                    <AnimatedCounter value={stat.number} />
                  </h4>
                  <span className="text-textSecondary text-[8px] md:text-[10px] uppercase tracking-widest font-semibold opacity-80">{t(stat.label)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
