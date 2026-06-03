import React from 'react';
import { motion } from 'framer-motion';
import { X, Shield, Cookie, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { policyTexts } from '../../utils/policyTexts';

const PolicyModal = ({ isOpen, onClose, policyType, policyData }) => {
  const { t } = useLanguage();

  if (!isOpen || !policyType) return null;

  const policy = policyData || policyTexts[policyType];
  if (!policy) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-dark/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 cursor-zoom-out" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative max-w-3xl w-full max-h-[85vh] bg-primary/95 border border-secondary/20 rounded-3xl shadow-[0_0_60px_rgba(244,228,193,0.1)] flex flex-col cursor-default overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Decorative Gradient */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-secondary/10 bg-dark/20 relative z-10">
          <div className="flex items-center space-x-3">
            {policyType === 'cookie' ? (
              <Cookie className="w-6 h-6 text-secondary" />
            ) : (
              <Shield className="w-6 h-6 text-secondary" />
            )}
            <div>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight uppercase">
                {t(policy.title)}
              </h2>
              {policy.lastUpdated && (
                <span className="text-[10px] text-textSecondary/60 tracking-wider uppercase font-bold block mt-0.5">
                  {t(policy.lastUpdated)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-secondary bg-dark/50 hover:bg-secondary/10 border border-secondary/10 rounded-full p-2 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-6 relative z-10">
          {policy.sections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-base md:text-lg font-serif font-bold text-secondary tracking-wide uppercase">
                {t(section.title)}
              </h3>
              <p className="text-textSecondary text-sm font-light leading-relaxed whitespace-pre-line opacity-95">
                {t(section.content)}
              </p>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-secondary/10 bg-dark/30 flex justify-end relative z-10">
          <button
            onClick={onClose}
            className="bg-secondary text-primary font-bold uppercase tracking-widest py-2.5 px-6 rounded-xl hover:bg-white active:scale-95 transition-all text-xs border border-secondary"
          >
            {t({ tr: 'Anladım', en: 'Got it' })}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PolicyModal;
