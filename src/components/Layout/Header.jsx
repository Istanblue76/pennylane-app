import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Sun, Moon, Infinity, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Common/Button';

const Header = ({ data }) => {
  const { lang, setLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data) return null;

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-primary/95 backdrop-blur-md shadow-2xl py-3' : 'bg-transparent py-6'}`}>
      <div className="section-container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          {data?.logo?.image ? (
            <img src={data.logo.image} alt={t(data.logo.text)} className="h-10 md:h-12 w-auto transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <>
              <Infinity className="w-8 h-8 text-secondary group-hover:rotate-180 transition-transform duration-700" />
              <span className="text-2xl md:text-3xl font-serif font-bold text-white tracking-widest">{t(data?.logo?.text)}</span>
            </>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {data.navigation.map((item, index) => (
            <div key={index} className="relative group">
              <a href={item.href} className="nav-link">
                {t(item.label)}
              </a>
              {item.children && (
                <div className="absolute top-full left-0 mt-4 bg-primary border-t-2 border-secondary p-4 space-y-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto min-w-[200px] shadow-2xl">
                  {item.children.map((child, cIdx) => (
                    <a key={cIdx} href={child.href} className="block text-textSecondary hover:text-secondary transition-colors duration-200 py-1 text-sm uppercase tracking-wider">
                      {t(child.label)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {/* Language Toggle */}
          <div className="flex items-center bg-dark/40 rounded-full p-1 border border-secondary/20 mr-2">
            <button 
              onClick={() => setLang('tr')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-300 ${lang === 'tr' ? 'bg-secondary text-primary shadow-lg shadow-secondary/10' : 'text-textSecondary hover:text-white'}`}
            >
              TR
            </button>
            <button 
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-300 ${lang === 'en' ? 'bg-secondary text-primary shadow-lg shadow-secondary/10' : 'text-textSecondary hover:text-white'}`}
            >
              EN
            </button>
          </div>

          <button className="text-textSecondary hover:text-white hidden sm:block">
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-textSecondary hover:text-white transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="hidden sm:block">
            <a 
              href="/menu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary py-2 px-6 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:bg-white hover:text-primary active:scale-95 shadow-lg shadow-secondary/10"
            >
                {t(data.cta_button.text)}
            </a>
          </div>

          <button 
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-[60px] bg-primary z-40 lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8 p-6">
              {data.navigation.map((item, index) => (
                <div key={index} className="text-center">
                  <a 
                    href={item.href} 
                    className="text-3xl font-serif text-white hover:text-secondary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t(item.label)}
                  </a>
                  {item.children && (
                    <div className="mt-4 space-y-2 opacity-70">
                      {item.children.map((child, cIdx) => (
                        <a key={cIdx} href={child.href} className="block text-textSecondary text-xl" onClick={() => setIsMobileMenuOpen(false)}>
                          {t(child.label)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a 
                href="/menu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full max-w-xs btn-primary text-center py-4 rounded-xl font-bold uppercase tracking-widest"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t(data.cta_button.text)}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
