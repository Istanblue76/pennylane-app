import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const SectionHeading = ({ title, subtitle, light = false }) => {
  const { t } = useLanguage();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12 text-center"
    >
      <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 uppercase tracking-tighter ${light ? 'text-primary' : 'text-secondary'}`}>
        {t(title)}
      </h2>
      {subtitle && (
        <p className={`text-lg md:text-xl font-light max-w-2xl mx-auto italic ${light ? 'text-primary/70' : 'text-textSecondary'}`}>
          {t(subtitle)}
        </p>
      )}
      <div className={`w-20 h-[1px] ${light ? 'bg-primary' : 'bg-secondary'} mx-auto mt-6 opacity-60`}></div>
    </motion.div>
  );
};

export default SectionHeading;
