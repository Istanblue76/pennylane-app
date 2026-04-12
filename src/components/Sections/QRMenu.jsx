import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, X, Info, LayoutGrid, List, ArrowLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

/* ─────────────────────────────────────────
   THEME TOKENS
───────────────────────────────────────── */
const darkTheme = {
  pageBg:       'bg-[#0c0c0c]',
  headerBg:     'bg-[#0c0c0c]/90',
  text:         'text-white',
  textMuted:    'text-white/40',
  textSubtle:   'text-white/20',
  cardBg:       'bg-[#131313]',
  cardBorder:   'border-white/[0.06]',
  cardHover:    'hover:border-[#c9a96e]/40',
  inputBg:      'bg-white/[0.04] border-white/10 text-white placeholder:text-white/25',
  pillBg:       'bg-white/[0.05] border-white/10',
  pillText:     'text-white/50',
  catCardBg:    'bg-[#0e0e0e]',
  catCardBorder:'border-white/[0.07]',
  divider:      'bg-white/10',
  accent:       '#c9a96e',   // warm gold
  accentClass:  'text-[#c9a96e]',
  accentBg:     'bg-[#c9a96e]',
  accentBorder: 'border-[#c9a96e]',
};

const lightTheme = {
  pageBg:       'bg-[#f5f0e8]',
  headerBg:     'bg-[#f5f0e8]/90',
  text:         'text-[#1c1410]',
  textMuted:    'text-[#1c1410]/45',
  textSubtle:   'text-[#1c1410]/20',
  cardBg:       'bg-white',
  cardBorder:   'border-[#1c1410]/[0.06]',
  cardHover:    'hover:border-[#8b5e3c]/40',
  inputBg:      'bg-white border-[#1c1410]/10 text-[#1c1410] placeholder:text-[#1c1410]/30',
  pillBg:       'bg-[#1c1410]/[0.04] border-[#1c1410]/10',
  pillText:     'text-[#1c1410]/50',
  catCardBg:    'bg-white',
  catCardBorder:'border-[#1c1410]/[0.06]',
  divider:      'bg-[#1c1410]/10',
  accent:       '#8b5e3c',   // warm bronze
  accentClass:  'text-[#8b5e3c]',
  accentBg:     'bg-[#8b5e3c]',
  accentBorder: 'border-[#8b5e3c]',
};

/* ─────────────────────────────────────────
   CATEGORY DECORATIVE SVG ICONS
───────────────────────────────────────── */
const categorySVGs = {
  breakfast: (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <path d="M 200 80 Q 220 100 210 130 Q 200 150 180 145 Q 160 140 150 120 Q 140 90 160 70 Q 180 60 200 80" fill={color}/>
      <circle cx="200" cy="100" r="15" fill="none" stroke={color} strokeWidth="1.5"/>
      <path d="M 120 180 L 280 180 Q 280 220 240 240 L 160 240 Q 120 220 120 180" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="150" cy="200" r="8" fill="none" stroke={color} strokeWidth="1.5"/>
      <circle cx="200" cy="210" r="8" fill="none" stroke={color} strokeWidth="1.5"/>
      <circle cx="250" cy="200" r="8" fill="none" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  'starter-sauces': (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <path d="M 200 100 L 240 180 L 220 240 L 180 240 L 160 180 Z" fill={color} opacity="0.3"/>
      <circle cx="200" cy="140" r="20" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M 160 200 Q 170 220 180 230" fill="none" stroke={color} strokeWidth="1.5"/>
      <path d="M 240 200 Q 230 220 220 230" fill="none" stroke={color} strokeWidth="1.5"/>
      <circle cx="200" cy="260" r="6" fill={color}/>
      <circle cx="170" cy="270" r="5" fill={color}/>
      <circle cx="230" cy="270" r="5" fill={color}/>
    </svg>
  ),
  salad: (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <path d="M 200 80 Q 170 110 160 150 Q 150 190 170 230 Q 200 260 230 230 Q 250 190 240 150 Q 230 110 200 80" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M 180 150 L 220 200" fill="none" stroke={color} strokeWidth="1.5"/>
      <path d="M 220 150 L 180 200" fill="none" stroke={color} strokeWidth="1.5"/>
      <circle cx="190" cy="120" r="3" fill={color}/>
      <circle cx="210" cy="115" r="3" fill={color}/>
      <circle cx="170" cy="170" r="2" fill={color}/>
      <circle cx="230" cy="170" r="2" fill={color}/>
    </svg>
  ),
  'burger-sandwich': (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <path d="M 150 120 Q 150 100 200 100 Q 250 100 250 120 Q 250 140 200 145 Q 150 140 150 120" fill={color} opacity="0.5"/>
      <rect x="160" y="150" width="80" height="25" fill="none" stroke={color} strokeWidth="1.5" rx="2"/>
      <rect x="160" y="185" width="80" height="25" fill="none" stroke={color} strokeWidth="1.5" rx="2"/>
      <path d="M 150 220 Q 150 240 200 245 Q 250 240 250 220" fill={color} opacity="0.5"/>
      <line x1="170" y1="165" x2="230" y2="165" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="170" y1="200" x2="230" y2="200" stroke={color} strokeWidth="1" opacity="0.6"/>
    </svg>
  ),
  main: (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <circle cx="200" cy="180" r="60" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M 200 120 L 200 240" stroke={color} strokeWidth="1.5" opacity="0.7"/>
      <path d="M 140 180 L 260 180" stroke={color} strokeWidth="1.5" opacity="0.7"/>
      <path d="M 150 130 L 250 230" stroke={color} strokeWidth="1.5" opacity="0.7"/>
      <path d="M 250 130 L 150 230" stroke={color} strokeWidth="1.5" opacity="0.7"/>
      <circle cx="200" cy="180" r="30" fill="none" stroke={color} strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  desserts: (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <path d="M 170 120 Q 170 100 200 100 Q 230 100 230 120 L 225 200 Q 225 220 200 225 Q 175 220 175 200 Z" fill={color} opacity="0.3"/>
      <circle cx="180" cy="140" r="4" fill={color}/>
      <circle cx="200" cy="135" r="4" fill={color}/>
      <circle cx="220" cy="140" r="4" fill={color}/>
      <circle cx="190" cy="160" r="3" fill={color}/>
      <circle cx="210" cy="160" r="3" fill={color}/>
      <path d="M 200 220 L 200 280" stroke={color} strokeWidth="2"/>
      <circle cx="190" cy="290" r="8" fill="none" stroke={color} strokeWidth="1.5"/>
      <circle cx="210" cy="290" r="8" fill="none" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  beers: (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <rect x="160" y="100" width="50" height="120" fill="none" stroke={color} strokeWidth="2" rx="4"/>
      <path d="M 165 100 L 165 80 Q 165 70 175 70 Q 185 70 185 80 L 185 100" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M 210 140 Q 240 150 245 180" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="200" cy="160" r="25" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <line x1="165" y1="115" x2="210" y2="115" stroke={color} strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  cocktails: (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <path d="M 170 100 L 190 140 L 230 140 L 210 100 Z" fill={color} opacity="0.3"/>
      <path d="M 190 140 L 180 220 Q 180 240 200 245 Q 220 240 220 220 L 210 140" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M 200 240 L 200 300" stroke={color} strokeWidth="2"/>
      <circle cx="160" cy="110" r="2" fill={color}/>
      <circle cx="175" cy="105" r="2" fill={color}/>
      <circle cx="220" cy="110" r="2" fill={color}/>
      <path d="M 150 220 Q 180 210 200 215" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7"/>
    </svg>
  ),
  spirits: (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <rect x="175" y="110" width="50" height="130" fill="none" stroke={color} strokeWidth="2.5" rx="3"/>
      <path d="M 180 110 L 180 75" stroke={color} strokeWidth="2"/>
      <path d="M 220 110 L 220 75" stroke={color} strokeWidth="2"/>
      <circle cx="180" cy="70" r="4" fill="none" stroke={color} strokeWidth="1.5"/>
      <circle cx="220" cy="70" r="4" fill="none" stroke={color} strokeWidth="1.5"/>
      <line x1="175" y1="125" x2="225" y2="125" stroke={color} strokeWidth="1" opacity="0.5"/>
      <circle cx="200" cy="180" r="15" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6"/>
    </svg>
  ),
  'wine-prosecco': (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <path d="M 180 100 Q 170 120 170 160 L 170 200 Q 170 220 190 225 L 210 225 Q 230 220 230 200 L 230 160 Q 230 120 220 100" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M 185 100 L 215 100" stroke={color} strokeWidth="2.5"/>
      <circle cx="185" cy="110" r="2" fill={color}/>
      <circle cx="200" cy="108" r="2" fill={color}/>
      <circle cx="215" cy="110" r="2" fill={color}/>
      <path d="M 200 225 L 200 280" stroke={color} strokeWidth="1.5"/>
      <circle cx="190" cy="290" r="6" fill="none" stroke={color} strokeWidth="1"/>
      <circle cx="210" cy="290" r="6" fill="none" stroke={color} strokeWidth="1"/>
    </svg>
  ),
  coffee: (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <rect x="160" y="120" width="80" height="100" fill="none" stroke={color} strokeWidth="2.5" rx="4"/>
      <path d="M 240 150 Q 260 155 265 180 Q 260 200 240 205" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="175" cy="135" r="2.5" fill={color}/>
      <circle cx="190" cy="135" r="2.5" fill={color}/>
      <circle cx="205" cy="135" r="2.5" fill={color}/>
      <circle cx="220" cy="135" r="2.5" fill={color}/>
      <path d="M 165 200 L 235 200" stroke={color} strokeWidth="1.5" opacity="0.6"/>
    </svg>
  ),
  'iced-coffees': (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <rect x="160" y="130" width="80" height="90" fill="none" stroke={color} strokeWidth="2" rx="3"/>
      <circle cx="180" cy="105" r="3.5" fill={color}/>
      <circle cx="200" cy="100" r="3.5" fill={color}/>
      <circle cx="220" cy="105" r="3.5" fill={color}/>
      <line x1="160" y1="130" x2="240" y2="130" stroke={color} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.7"/>
      <path d="M 240 150 L 260 180" stroke={color} strokeWidth="1.5"/>
      <path d="M 240 180 L 260 150" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  'coffee-beans': (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <path d="M 190 110 Q 180 140 185 180 Q 190 220 210 230 Q 230 220 235 180 Q 240 140 230 110 Q 220 100 210 100 Q 200 100 190 110" fill={color} opacity="0.4"/>
      <path d="M 160 150 Q 150 160 155 190 Q 160 210 170 215" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M 240 150 Q 250 160 245 190 Q 240 210 230 215" stroke={color} strokeWidth="2" fill="none"/>
      <line x1="210" y1="100" x2="210" y2="230" stroke={color} strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  tea: (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <rect x="160" y="130" width="80" height="100" fill="none" stroke={color} strokeWidth="2" rx="4"/>
      <path d="M 170 130 L 170 90" stroke={color} strokeWidth="2"/>
      <path d="M 190 130 L 190 85" stroke={color} strokeWidth="2"/>
      <path d="M 210 130 L 210 85" stroke={color} strokeWidth="2"/>
      <path d="M 230 130 L 230 90" stroke={color} strokeWidth="2"/>
      <circle cx="170" cy="80" r="3" fill="none" stroke={color} strokeWidth="1.5"/>
      <circle cx="190" cy="75" r="3" fill="none" stroke={color} strokeWidth="1.5"/>
      <circle cx="210" cy="75" r="3" fill="none" stroke={color} strokeWidth="1.5"/>
      <circle cx="230" cy="80" r="3" fill="none" stroke={color} strokeWidth="1.5"/>
      <path d="M 240 160 Q 260 165 265 185" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  ),
  'soft-drinks': (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <rect x="165" y="120" width="70" height="110" fill="none" stroke={color} strokeWidth="2" rx="3"/>
      <rect x="170" y="125" width="60" height="10" fill={color} opacity="0.3"/>
      <circle cx="180" cy="155" r="3" fill={color}/>
      <circle cx="195" cy="150" r="3" fill={color}/>
      <circle cx="210" cy="155" r="3" fill={color}/>
      <circle cx="200" cy="175" r="3" fill={color}/>
      <circle cx="185" cy="185" r="3" fill={color}/>
      <circle cx="215" cy="180" r="3" fill={color}/>
      <path d="M 235 150 L 255 170 M 235 170 L 255 150" stroke={color} strokeWidth="2"/>
    </svg>
  ),
  'mini-tuzlu': (color) => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.32,pointerEvents:'none'}}>
      <rect x="160" y="140" width="35" height="35" fill={color} opacity="0.3"/>
      <rect x="210" y="140" width="35" height="35" fill={color} opacity="0.3"/>
      <rect x="160" y="190" width="35" height="35" fill={color} opacity="0.3"/>
      <rect x="210" y="190" width="35" height="35" fill={color} opacity="0.3"/>
      <line x1="175" y1="140" x2="185" y2="175" stroke={color} strokeWidth="1" opacity="0.7"/>
      <line x1="185" y1="140" x2="175" y2="175" stroke={color} strokeWidth="1" opacity="0.7"/>
      <line x1="225" y1="140" x2="235" y2="175" stroke={color} strokeWidth="1" opacity="0.7"/>
      <line x1="235" y1="140" x2="225" y2="175" stroke={color} strokeWidth="1" opacity="0.7"/>
      <line x1="175" y1="190" x2="185" y2="225" stroke={color} strokeWidth="1" opacity="0.7"/>
      <line x1="185" y1="190" x2="175" y2="225" stroke={color} strokeWidth="1" opacity="0.7"/>
      <line x1="225" y1="190" x2="235" y2="225" stroke={color} strokeWidth="1" opacity="0.7"/>
      <line x1="235" y1="190" x2="225" y2="225" stroke={color} strokeWidth="1" opacity="0.7"/>
    </svg>
  ),
};

/* ─────────────────────────────────────────
   CATEGORY CARD — Premium split layout
───────────────────────────────────────── */
const CategoryCard = ({ cat, onClick, t, tk, index }) => {
  const itemCount = cat.items?.filter(i => !i.passive)?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onClick={onClick}
      className={`group relative cursor-pointer rounded-[2rem] overflow-hidden border ${tk.catCardBorder} ${tk.catCardBg} shadow-xl hover:shadow-2xl transition-all duration-700`}
      style={{ boxShadow: `0 8px 40px rgba(0,0,0,0.18)` }}
    >
      <div className="relative h-[320px] sm:h-[360px] w-full overflow-hidden">
        {cat.image_url ? (
          <img
            src={cat.image_url}
            alt=""
            loading="eager"
            className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[2500ms] ease-out"
            style={{ filter: 'brightness(0.72) saturate(0.85)' }}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,16,12,0.98) 100%)`,
            }}
          />
        )}

        {/* Decorative SVG watermark */}
        {categorySVGs[cat.id] && categorySVGs[cat.id](tk.accent)}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.0) 75%)'
          }}
        />

        {/* Arrow — top right */}
        <div
          className="absolute top-6 right-6 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-opacity-30"
          style={{ borderColor: `${tk.accent}55`, backgroundColor: `${tk.accent}12` }}
        >
          <ChevronRight className="w-4 h-4" style={{ color: tk.accent }} />
        </div>

        {/* Bottom content — category name centered, count bottom-left */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-7 pointer-events-none">
          {/* Centered thin rule */}
          <div
            className="mb-4 transition-all duration-700 group-hover:w-16"
            style={{ height: '1.5px', width: '36px', backgroundColor: tk.accent, opacity: 0.75 }}
          />

          {/* Category name — centered */}
          <h3
            className="font-serif font-black uppercase tracking-[0.14em] text-white leading-tight text-center px-6 transition-all duration-500"
            style={{
              fontSize: 'clamp(1.1rem, 2.8vw, 1.7rem)',
              textShadow: '0 2px 20px rgba(0,0,0,0.8)',
            }}
          >
            {t(cat.title)}
          </h3>
        </div>

        {/* Item count — top LEFT */}
        <div className="absolute top-6 left-6 pointer-events-none">
          <div
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full"
            style={{ backgroundColor: `${tk.accent}20`, border: `1px solid ${tk.accent}38` }}
          >
            <span
              className="text-[9px] font-black tracking-[0.5em] uppercase"
              style={{ color: tk.accent }}
            >
              {itemCount} {t({ tr: 'ÜRÜN', en: 'ITEMS' })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────── */
const ProductCard = ({ item, onClick, t, tk }) => (
  <div
    className={`group relative ${tk.cardBg} border ${tk.cardBorder} ${tk.cardHover} rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-pointer p-4`}
    onClick={onClick}
  >
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
      <img
        src={item.image_url || ''}
        alt=""
        className="w-full h-full object-cover grayscale-[25%] group-hover:grayscale-0 transition-all duration-[2500ms] group-hover:scale-105"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-50 pointer-events-none" />
    </div>
    <div className="px-2 pb-2">
      <div className="flex justify-between items-start gap-3 mb-2">
        <h3 className={`${tk.text} font-serif font-black text-base uppercase leading-snug tracking-tight transition-all duration-300`}
          style={{ '--tw-text-opacity': 1 }}
        >
          <span className="group-hover:opacity-80 transition-opacity">{t(item.name)}</span>
        </h3>
        <span className="font-black text-lg flex-shrink-0" style={{ color: tk.accent }}>
          {item.price && item.price !== '0' && item.price !== '0 TL'
            ? `${item.price.toString().replace(/ TL/g, '').replace(/ ₺/g, '')}₺`
            : ''}
        </span>
      </div>
      <p className={`${tk.textMuted} text-[11px] font-light leading-relaxed line-clamp-2 italic`}>
        {t(item.description)}
      </p>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   PRODUCT MODAL
───────────────────────────────────────── */
const ProductModal = ({ product, onClose, t, allergens, isDark }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tk = isDark ? darkTheme : lightTheme;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.3 }}
        className={`relative w-full max-w-4xl ${tk.cardBg} border ${tk.cardBorder} rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row md:h-[600px] max-h-[95vh] pointer-events-auto shadow-[0_32px_100px_rgba(0,0,0,0.6)]`}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-40 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-xl transition-all group"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <X className="w-4 h-4 text-white group-hover:rotate-90 transition-transform" />
        </button>

        {/* Image */}
        <div 
          className="w-full md:w-[45%] h-[280px] md:h-full relative flex-shrink-0 group cursor-pointer overflow-hidden" 
          onClick={() => setIsFullscreen(true)}
        >
          <img
            src={product.image_url}
            alt=""
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <ZoomIn className="w-12 h-12 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div
          className={`w-full md:w-[55%] p-8 md:p-12 flex flex-col overflow-y-auto no-scrollbar ${isDark ? 'bg-[#0e0e0e]' : 'bg-white'}`}
        >
          <div className="flex-grow">
            {/* Category label */}
            <div className="flex items-center space-x-3 mb-5">
              <div className="h-[1.5px] w-8 flex-shrink-0" style={{ backgroundColor: tk.accent }} />
              <span className="text-[9px] font-black tracking-[0.5em] uppercase" style={{ color: tk.accent, opacity: 0.7 }}>
                {t(product.categoryTitle)}
              </span>
            </div>

            {/* Name */}
            <h3 className={`font-serif font-black uppercase leading-tight tracking-tight mb-5 ${tk.text}`}
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}>
              {t(product.name)}
            </h3>

            {/* Price */}
            {product.price && product.price !== '0' && product.price !== '0 TL' && (
              <div
                className="inline-flex items-center px-5 py-2 rounded-2xl mb-6"
                style={{ backgroundColor: `${tk.accent}18`, border: `1px solid ${tk.accent}35` }}
              >
                <span className="font-black text-2xl" style={{ color: tk.accent }}>
                  {product.price.toString().replace(/ TL/g, '').replace(/ ₺/g, '')}₺
                </span>
              </div>
            )}

            {/* Description */}
            <div className="border-l-2 pl-5 mb-8" style={{ borderColor: `${tk.accent}50` }}>
              <p className={`${tk.textMuted} text-sm font-light italic leading-relaxed`}>
                {t(product.description)}
              </p>
            </div>

            {/* Allergens */}
            {product.allergens?.length > 0 && (
              <div>
                <span className={`text-[9px] ${tk.textSubtle} uppercase font-bold tracking-[0.25em] block mb-3`}>
                  {t({ tr: 'Alerjenler', en: 'Allergens' })}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.allergens.map(id => {
                    const a = (allergens || []).find(x => x.id === id);
                    if (!a) return null;
                    return (
                      <div
                        key={id}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center p-2 transition-all`}
                        style={{ backgroundColor: `${tk.accent}10`, borderColor: `${tk.accent}25` }}
                        title={a.name}
                      >
                        {a.icon_url
                          ? <img src={a.icon_url} alt="" className="w-full h-full object-contain" />
                          : <Info className="w-4 h-4" style={{ color: tk.accent }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="mt-8 font-black uppercase tracking-[0.35em] py-4 px-10 rounded-2xl transition-all text-[10px] active:scale-95 w-full"
            style={{ backgroundColor: tk.accent, color: '#fff' }}
          >
            {t({ tr: 'KAPAT', en: 'CLOSE' })}
          </button>
        </div>
      </motion.div>

      {/* Fullscreen Lightbox Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
               onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
               className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/50 text-white hover:rotate-90 transition-all z-50"
            >
               <X className="w-6 h-6" />
            </button>
            <motion.img
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', damping: 25 }}
               src={product.image_url}
               alt=""
               className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
               onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const QRMenu = ({ data, allergens, settings, isPage = false }) => {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState(settings?.menu_display_mode === 'all' ? 'categories' : (settings?.menu_display_mode || 'categories'));
  const [drilledCategory, setDrilledCategory] = useState(null);

  const isDark = (settings?.theme || 'dark') === 'dark';
  const tk = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    const mode = settings?.menu_display_mode || 'all';
    setViewMode(mode === 'small' ? 'categories' : 'grid');
  }, [settings]);

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProduct]);

  useEffect(() => {
    if (data?.categories && !activeCategory) {
      setActiveCategory(data.categories[0]?.id);
      setActiveSubcategory('all');
    }
  }, [data, activeCategory]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [drilledCategory, viewMode]);

  const filteredItems = useMemo(() => {
    if (!data?.categories) return [];
    const allItems = [];
    data.categories.forEach(cat => {
      cat.items?.forEach(item => {
        allItems.push({ ...item, categoryTitle: cat.title, categoryId: cat.id });
      });
    });
    return allItems.filter(item => {
      if (drilledCategory && item.categoryId !== drilledCategory.id) return false;
      const matchesCat = activeCategory === 'all' || item.categoryId === activeCategory;
      const matchesSubCat = activeSubcategory === 'all' || item.subcategory === activeSubcategory || !item.subcategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = t(item.name).toLowerCase().includes(q) || t(item.description).toLowerCase().includes(q);
      return matchesCat && matchesSubCat && matchesSearch && !item.passive;
    });
  }, [data, activeCategory, activeSubcategory, searchQuery, t, drilledCategory]);

  if (!data?.categories) return null;

  /* ── PAGE VERSION ── */
  if (isPage) {
    const isDrilled = drilledCategory !== null;

    return (
      <section
        id="menu"
        className={`relative transition-colors duration-700 ${tk.pageBg} min-h-screen px-4 sm:px-6 md:px-10 max-w-7xl mx-auto pb-24`}
      >
        {/* ── Top Controls ── */}
        <div className="pt-6 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 mb-8">

            {/* Search */}
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder={t({ tr: 'Menüde ara…', en: 'Search menu…' })}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full border rounded-2xl py-3.5 pl-11 pr-4 text-sm transition-all focus:outline-none ${tk.inputBg}`}
                style={{ '--tw-ring-color': tk.accent }}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" style={{ color: isDark ? '#fff' : '#1c1410' }} />
            </div>

            {/* View toggle */}
            {(settings?.menu_display_mode === 'all' || !settings?.menu_display_mode) && (
              <div
                className={`flex p-1 rounded-2xl border ${tk.pillBg}`}
              >
                {[
                  { key: 'grid',       label: t({ tr: 'Liste', en: 'List' }),      icon: LayoutGrid },
                  { key: 'categories', label: t({ tr: 'Büyük', en: 'Large' }),     icon: List       },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => { setViewMode(key); if (key === 'grid') setDrilledCategory(null); }}
                    className={`flex items-center space-x-1.5 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all`}
                    style={viewMode === key
                      ? { backgroundColor: tk.accent, color: '#fff' }
                      : { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(28,20,16,0.4)' }
                    }
                  >
                    <Icon className="w-3 h-3" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Back button (drilled) */}
          {isDrilled && (
            <button
              onClick={() => setDrilledCategory(null)}
              className="mb-8 flex items-center space-x-2 transition-all active:scale-95 group"
              style={{ color: tk.accent }}
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${tk.accent}18`, border: `1px solid ${tk.accent}35` }}
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                {t({ tr: 'Kategoriler', en: 'Categories' })}
              </span>
            </button>
          )}

          {/* Category pills (grid mode only) */}
          {viewMode === 'grid' && !isDrilled && (
            <>
            <div className="flex flex-wrap gap-2 mb-3">
              {[{ id: 'all', title: { tr: 'Hepsi', en: 'All' } }, ...data.categories].map(cat => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setActiveSubcategory('all'); setDrilledCategory(null); }}
                    className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border"
                    style={isActive
                      ? { backgroundColor: tk.accent, color: '#fff', borderColor: tk.accent }
                      : {
                          backgroundColor: `${tk.accent}0a`,
                          color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(28,20,16,0.45)',
                          borderColor: `${tk.accent}20`,
                        }
                    }
                  >
                    {t(cat.title)}
                  </button>
                );
              })}
            </div>
            
            {/* Subcategory pills */}
            {activeCategory !== 'all' && data.categories.find(c => c.id === activeCategory)?.subcategories && (
               <div className="flex flex-wrap gap-2 mb-6">
                 {[{ id: 'all', title: { tr: 'Tümü', en: 'All' } }, ...data.categories.find(c => c.id === activeCategory).subcategories].map(sub => {
                    const isActive = activeSubcategory === sub.id;
                    return (
                        <button
                          key={sub.id}
                          onClick={() => setActiveSubcategory(sub.id)}
                          className="px-5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border"
                          style={isActive
                            ? { backgroundColor: tk.accent, color: '#fff', borderColor: tk.accent }
                            : {
                                backgroundColor: 'transparent',
                                color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(28,20,16,0.4)',
                                borderColor: `${tk.accent}20`,
                              }
                          }
                        >
                          {t(sub.title)}
                        </button>
                    )
                 })}
               </div>
            )}
            </>
          )}
        </div>

        {/* ── Content ── */}
        <AnimatePresence mode="wait">
          {viewMode === 'categories' && !isDrilled ? (
            <motion.div
              key="cats"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {data.categories.map((cat, i) => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  index={i}
                  t={t}
                  tk={tk}
                  isDark={isDark}
                  onClick={() => { setDrilledCategory(cat); setActiveCategory(cat.id); }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {filteredItems.map(item => (
                <ProductCard
                  key={item.id}
                  item={item}
                  t={t}
                  tk={tk}
                  onClick={() => setSelectedProduct(item)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedProduct && (
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              t={t}
              allergens={allergens}
              isDark={isDark}
            />
          )}
        </AnimatePresence>
      </section>
    );
  }

  /* ── HOME SECTION VERSION ── */
  return (
    <section id="menu" className="py-24 bg-dark relative overflow-hidden text-white">
      <div className="section-container relative z-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          className="text-[#c9a96e] font-bold uppercase tracking-[0.4em] text-[10px] block mb-4"
        >
          {t({ tr: 'PENNYLANE SEÇKİSİ', en: 'PENNYLANE SELECTION' })}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl text-white font-serif font-bold mb-16 leading-tight"
        >
          {lang === 'tr'
            ? <><span>Leziz Menümüze </span><span className="text-[#c9a96e]">Göz Atın</span></>
            : <><span>Discover Our </span><span className="text-[#c9a96e]">Delicious Menu</span></>}
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {[{ id: 'all', title: { tr: 'Hepsi', en: 'All' } }, ...data.categories].map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setActiveSubcategory('all'); }}
              className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border"
              style={activeCategory === cat.id
                ? { backgroundColor: '#c9a96e', color: '#fff', borderColor: '#c9a96e' }
                : {
                    backgroundColor: 'rgba(201,169,110,0.05)',
                    color: 'rgba(255,255,255,0.45)',
                    borderColor: 'rgba(201,169,110,0.2)',
                  }
              }
            >
              {t(cat.title)}
            </button>
          ))}
        </div>

        {/* Subcategory Pills */}
        <div className="h-10 mb-8 flex justify-center">
        {activeCategory !== 'all' && data.categories.find(c => c.id === activeCategory)?.subcategories && (
           <div className="flex flex-wrap justify-center gap-2">
             {[{ id: 'all', title: { tr: 'Tümü', en: 'All' } }, ...data.categories.find(c => c.id === activeCategory).subcategories].map(sub => {
                const isActive = activeSubcategory === sub.id;
                return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubcategory(sub.id)}
                      className="px-5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border"
                      style={isActive
                        ? { backgroundColor: '#c9a96e', color: '#fff', borderColor: '#c9a96e' }
                        : {
                            backgroundColor: 'transparent',
                            color: 'rgba(255,255,255,0.3)',
                            borderColor: 'rgba(201,169,110,0.2)'
                          }
                      }
                    >
                      {t(sub.title)}
                    </button>
                )
             })}
           </div>
        )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left">
          {filteredItems.map(item => (
            <div key={item.id} className="flex items-center space-x-5 group cursor-pointer" onClick={() => setSelectedProduct(item)}>
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all" style={{ borderColor: 'rgba(201,169,110,0.2)' }}>
                <img src={item.image_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold uppercase tracking-wider text-sm transition-colors group-hover:text-[#c9a96e] truncate">{t(item.name)}</h3>
                  <span className="font-bold text-[#c9a96e] flex-shrink-0">{item.price}₺</span>
                </div>
                <p className="text-white/40 text-[11px] line-clamp-1 italic mt-0.5">{t(item.description)}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} t={t} allergens={allergens} isDark={true} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default QRMenu;
