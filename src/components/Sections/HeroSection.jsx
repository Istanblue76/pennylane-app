import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../Common/Button';

const HeroSection = ({ data }) => {
  const { t } = useLanguage();
  if (!data) return null;

  const getMainHeadingSize = (size) => {
    switch(size) {
      case 'kucuk': return 'text-4xl md:text-5xl lg:text-7xl';
      case 'orta': return 'text-5xl md:text-6xl lg:text-8xl';
      case 'cok-buyuk': return 'text-6xl md:text-8xl lg:text-[10rem]';
      case 'buyuk':
      default: return 'text-5xl md:text-7xl lg:text-9xl';
    }
  };

  const getSubHeadingSize = (size) => {
    switch(size) {
      case 'kucuk': return 'text-xs md:text-sm';
      case 'buyuk': return 'text-base md:text-lg lg:text-xl tracking-[0.3em]';
      case 'orta':
      default: return 'text-sm md:text-base tracking-[0.2em]';
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
        style={{ backgroundImage: `url(${data.background_image_url})` }}
      />
      {/* Strong dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/60 to-dark" />
      <div className="absolute inset-0 bg-dark/30" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl -mt-24 md:-mt-32">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          className={`${getMainHeadingSize(data.main_heading_size)} font-serif font-bold text-secondary mb-6 leading-[0.9] uppercase tracking-tighter`}
        >
          {t(data.main_heading)}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.2em' }}
          transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
          className={`text-secondary font-serif uppercase font-semibold mb-10 ${getSubHeadingSize(data.sub_heading_size)}`}
        >
          {t(data.sub_heading)}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Button href="#specials" className="w-full sm:w-auto">{t(data.cta_primary.text)}</Button>
          <Button href={data.cta_secondary.href} variant="outline" className="w-full sm:w-auto">{t(data.cta_secondary.text)}</Button>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-[10px] uppercase text-textSecondary mb-2 tracking-[0.5em]">{t({ tr: 'KAYDIR', en: 'SCROLL' })}</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-secondary opacity-70" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
