import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'tr');

  useEffect(() => {
    localStorage.setItem('appLang', lang);
  }, [lang]);

  const t = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    
    // Robust object handling
    const result = field[lang] || field['tr'] || '';
    
    // Safety check: If the result is somehow still an object, don't crash React!
    if (typeof result !== 'string') {
        console.warn('t() function received/resolved an object instead of a string for field:', field);
        return String(result.tr || result.en || '');
    }
    
    return result;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
