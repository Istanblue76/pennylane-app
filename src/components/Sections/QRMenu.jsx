import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, X, Info, LayoutGrid, List, ArrowLeft, ChevronRight, ZoomIn, ShoppingBasket, Plus, Minus, Trash2, Check, Flame } from 'lucide-react';
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
   SUBCATEGORY TAB BAR
   ───────────────────────────────────────── */
const SubcategoryBar = ({ subcategories, activeId, onSelect, items, depth, activePath, t, tk, isDark, allLabel }) => {
  if (!subcategories || subcategories.length === 0) return null;

  const getCount = (subId) => {
    return items.filter(i => {
      if (i.passive) return false;
      const itemPath = i.categoryPath || [i.subcategory, i.subSubcategory].filter(Boolean);
      
      // Match parent paths up to depth
      for(let j=0; j<depth; j++) {
         if (activePath[j] !== 'all' && itemPath[j] !== activePath[j]) return false;
      }
      
      // Match current level
      if (subId !== 'all') {
         if (itemPath[depth] !== subId) return false;
      }
      return true;
    }).length;
  };

  const tabs = [{ id: 'all', title: { tr: allLabel || 'TÜMÜ', en: allLabel || 'ALL' } }, ...subcategories];

  return (
    <div className="mb-10 w-full px-4 sm:px-0 transition-all duration-500" style={{ transform: `scale(${1 - depth * 0.05})`, marginTop: depth > 0 ? '-1.5rem' : '0' }}>
      <div className="flex flex-wrap gap-3 justify-center">
        {tabs.map((sub) => {
          const isActive = activeId === sub.id;
          const count = getCount(sub.id);
          
          return (
            <button
              key={sub.id}
              onClick={() => onSelect(sub.id)}
              className="relative flex items-center justify-between px-3 py-1.5 rounded-lg transition-all duration-300 border"
              style={{
                backgroundColor: isActive ? tk.accent : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                borderColor: isActive ? tk.accent : `${tk.accent}30`,
                boxShadow: isActive ? `0 2px 8px ${tk.accent}30` : 'none'
              }}
            >
              <span 
                className="text-[8px] font-black uppercase tracking-widest text-left"
                style={{ 
                  color: isActive ? '#fff' : (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)')
                }}
              >
                {t(sub.title)}
              </span>
              
              <span 
                className="ml-2 flex items-center justify-center px-1.5 py-0.5 min-w-[16px] rounded-full text-[7px] font-black border flex-shrink-0"
                style={{
                  backgroundColor: isActive ? 'rgba(0,0,0,0.2)' : `${tk.accent}15`,
                  color: isActive ? '#fff' : tk.accent,
                  borderColor: isActive ? 'transparent' : `${tk.accent}30`
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   RECURSIVE SUBCATEGORY WRAPPER
   ───────────────────────────────────────── */
const CategoryTabsRecursive = ({ categoryNode, items, activePath, setActivePath, depth = 0, t, tk, isDark }) => {
  if (!categoryNode?.subcategories || categoryNode.subcategories.length === 0) return null;
  
  const activeId = activePath[depth] || 'all';

  return (
    <>
      <SubcategoryBar
        subcategories={categoryNode.subcategories}
        activeId={activeId}
        onSelect={(id) => {
          const newPath = [...activePath.slice(0, depth), id, 'all'];
          setActivePath(newPath);
        }}
        items={items}
        depth={depth}
        activePath={activePath}
        t={t}
        tk={tk}
        isDark={isDark}
      />
      
      {activeId !== 'all' && (() => {
        const selectedSub = categoryNode.subcategories.find(s => s.id === activeId);
        if (selectedSub?.subcategories) {
           return <CategoryTabsRecursive
             categoryNode={selectedSub}
             items={items}
             activePath={activePath}
             setActivePath={setActivePath}
             depth={depth + 1}
             t={t}
             tk={tk}
             isDark={isDark}
           />
        }
        return null;
      })()}
    </>
  );
};

const getCategorySvg = (catId, color) => {
  const idMap = {
    'starters-sauces': 'starter-sauces',
    'salads': 'salad',
    'wineprosecco': 'wine-prosecco',
    'mocktail-cocktails': 'cocktails',
    'cider': 'beers',
    'whisky': 'spirits',
    'tequila-mezcal': 'cocktails',
  };
  const key = idMap[catId] || catId;
  return categorySVGs[key] ? categorySVGs[key](color) : null;
};

/* ─────────────────────────────────────────
   CATEGORY CARD — Premium square layout
   ───────────────────────────────────────── */
const CategoryCard = ({ cat, onClick, t, tk, index, isDark }) => {
  const svgElement = getCategorySvg(cat.id, tk.accent);
  const customSvg = svgElement ? React.cloneElement(svgElement, {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.9,
      pointerEvents: 'none'
    }
  }) : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className={`group relative cursor-pointer aspect-square rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-500 flex flex-col justify-between ${
        isDark 
          ? 'border-white/[0.06] hover:border-[#c9a96e]/60' 
          : 'border-[#1c1410]/[0.06] hover:border-[#8b5e3c]/60'
      }`}
      style={{
        backgroundColor: isDark ? '#0e0d0b' : '#faf9f6',
        backgroundImage: !cat.image_url 
          ? (isDark 
              ? 'radial-gradient(circle at center, #1b1712 0%, #0a0907 100%)' 
              : 'radial-gradient(circle at center, #fbfafa 0%, #f2eedf 100%)')
          : 'none',
        boxShadow: `0 8px 30px rgba(0,0,0,0.12)`,
      }}
    >
      {cat.image_url ? (
        <>
          {/* Background Image (Mockup Photo Style) */}
          <img 
            src={cat.image_url} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-out" 
          />
          {/* Dark overlay for text legibility */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />
        </>
      ) : (
        <>
          {/* Premium glowing background overlay on hover */}
          <div 
            className="absolute inset-0 opacity-40 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none"
            style={{
              background: isDark
                ? 'radial-gradient(circle at center, rgba(201,169,110,0.18) 0%, rgba(20,18,15,0) 70%)'
                : 'radial-gradient(circle at center, rgba(139,94,60,0.12) 0%, rgba(252,251,250,0) 70%)'
            }}
          />

          {/* Subtle geometric dot pattern overlay */}
          <div 
            className="absolute inset-0 opacity-5 group-hover:opacity-8 transition-opacity duration-500 pointer-events-none"
            style={{
              backgroundImage: isDark
                ? 'radial-gradient(circle, #c9a96e 1px, transparent 1px)'
                : 'radial-gradient(circle, #8b5e3c 1px, transparent 1px)',
              backgroundSize: '14px 14px'
            }}
          />
        </>
      )}

      {/* Center Icon Wrapper (only shown if there is no image_url) */}
      {!cat.image_url && (
        <div className="flex-grow flex items-center justify-center relative pb-8 sm:pb-14 p-3 sm:p-5">
          {/* Glow behind the SVG */}
          <div 
            className="absolute w-18 h-18 sm:w-32 sm:h-32 rounded-full blur-xl opacity-0 group-hover:opacity-35 transition-all duration-500 pointer-events-none"
            style={{ backgroundColor: tk.accent }}
          />
          
          {customSvg ? (
            <div className="relative w-16 h-16 sm:w-28 sm:h-28 scale-[2.3] sm:scale-[2.1] group-hover:scale-[2.5] sm:group-hover:scale-[2.3] transition-all duration-500 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] [&_path]:stroke-[3.5] [&_circle]:stroke-[3.5] [&_rect]:stroke-[3.5] [&_line]:stroke-[3.5] [&_path]:stroke-round [&_circle]:stroke-round [&_rect]:stroke-round [&_line]:stroke-round">
              {customSvg}
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-28 sm:h-28 scale-[2.3] sm:scale-[2.1] group-hover:scale-[2.5] sm:group-hover:scale-[2.3] flex items-center justify-center text-4xl sm:text-6xl font-serif text-secondary opacity-65 group-hover:opacity-100 transition-all duration-500">
              {cat.title?.tr?.[0] || cat.title?.[0]}
            </div>
          )}
        </div>
      )}

      {/* Bottom Title overlay (matching mockup style) */}
      <div 
        className="absolute bottom-0 left-0 right-0 py-2 sm:py-3.5 px-1.5 text-center backdrop-blur-[2px] transition-all duration-300 border-t border-white/[0.03] z-10"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0) 100%)',
        }}
      >
        <h3
          className="font-sans font-black uppercase tracking-[0.05em] sm:tracking-[0.12em] text-white text-[9px] sm:text-[11px] md:text-[13px] leading-tight transition-colors duration-300 group-hover:text-[#c9a96e]"
          style={{
            textShadow: '0 1px 3px rgba(0,0,0,0.9)',
          }}
        >
          {t(cat.title)}
        </h3>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   PRODUCT CARD
   ───────────────────────────────────────── */
const ProductCard = ({ item, onClick, t, tk, onAddToCart }) => (
  <div
    className={`group relative ${tk.cardBg} border ${tk.cardBorder} ${tk.cardHover} rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-pointer p-3 md:p-4 flex flex-col`}
    onClick={onClick}
  >
    <div className="relative aspect-square md:aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-5 bg-black/40 flex items-center justify-center">
      <img
        src={item.image_url || ''}
        alt=""
        className="w-full h-full object-cover grayscale-[25%] group-hover:grayscale-0 transition-all duration-[2500ms] group-hover:scale-105"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      {/* New Product Badge */}
      {item.isNew && (
        <div 
          className="absolute top-2 left-2 z-20 px-2 py-1 rounded-md shadow-lg backdrop-blur-md"
          style={{ backgroundColor: tk.accent, color: '#fff' }}
        >
          <span className="text-[9px] font-black tracking-[0.2em] uppercase">
            {t({ tr: 'YENİ', en: 'NEW' })}
          </span>
        </div>
      )}
      
      {/* Quick Add Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
        className="absolute bottom-2 right-2 w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shadow-lg transition-all active:scale-90 z-20"
        style={{ backgroundColor: tk.accent, color: '#fff' }}
      >
        <Plus className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
    
    <div className="px-1 pb-1 flex-grow flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start gap-1 md:gap-3 mb-2">
        <h3 className={`${tk.text} font-serif font-black text-xs md:text-base uppercase leading-tight tracking-tight flex-grow`}
          style={{ '--tw-text-opacity': 1 }}
        >
          <span className="group-hover:opacity-80 transition-opacity line-clamp-2 md:line-clamp-1">{t(item.name)}</span>
        </h3>
        <span className="font-black text-sm md:text-lg flex-shrink-0" style={{ color: tk.accent }}>
          {item.price && item.price !== '0' && item.price !== '0 TL'
            ? `${item.price.toString().replace(/ TL/g, '').replace(/ ₺/g, '')}₺`
            : ''}
        </span>
      </div>
      <p className={`${tk.textMuted} text-[9px] md:text-[11px] font-light leading-snug line-clamp-2 italic`}>
        {t(item.description)}
      </p>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   PRODUCT MODAL
   ───────────────────────────────────────── */
export const ProductModal = ({ product, onClose, t, allergens, isDark, onAddToCart, isMinimal = false, allProducts = [] }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [modalView, setModalView] = useState('main'); // 'main' | 'extras' | 'pairs_well'
  const [addedPairs, setAddedPairs] = useState({}); // To track newly added pairs well items
  const { lang } = useLanguage();
  const tk = isDark ? darkTheme : lightTheme;

  // Dynamic extras state
  const extrasOptions = product.extras || [];
  const hasExtras = extrasOptions.length > 0;
  const [selectedExtras, setSelectedExtras] = useState(() => {
    const initial = {};
    extrasOptions.forEach(opt => {
      initial[opt.id] = false;
    });
    return initial;
  });

  const handleToggleExtra = (id) => {
    setSelectedExtras(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeExtrasCount = Object.values(selectedExtras).filter(Boolean).length;

  const basePrice = parseFloat(product.price?.toString().replace(/[^\d.]/g, '') || 0);
  const extraPrice = extrasOptions.reduce((sum, opt) => sum + (selectedExtras[opt.id] ? opt.price : 0), 0);
  const currentPrice = basePrice + extraPrice;

  // Dynamic pairs well products
  const pairsWellIds = product.pairs_well || [];
  const pairsWellProducts = useMemo(() => {
    return allProducts.filter(p => pairsWellIds.includes(p.id));
  }, [allProducts, pairsWellIds]);

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
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-40 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-xl transition-all group"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <X className="w-4 h-4 text-white group-hover:rotate-90 transition-transform" />
        </button>

        <div 
          className="w-full md:w-[45%] h-[280px] md:h-full relative flex-shrink-0 group cursor-pointer overflow-hidden bg-black/40 flex items-center justify-center" 
          onClick={() => setIsFullscreen(true)}
        >
          <img
            src={product.image_url}
            alt=""
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <ZoomIn className="w-12 h-12 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" />
          </div>
          
          {/* New Product Badge for Modal */}
          {product.isNew && (
            <div 
              className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md"
              style={{ backgroundColor: tk.accent, color: '#fff' }}
            >
              <span className="text-[11px] font-black tracking-[0.2em] uppercase">
                {t({ tr: 'YENİ', en: 'NEW' })}
              </span>
            </div>
          )}
        </div>

        <div
          className={`w-full md:w-[55%] p-8 md:p-12 flex flex-col overflow-y-auto no-scrollbar ${isDark ? 'bg-[#0e0e0e]' : 'bg-white'}`}
        >
          {modalView === 'main' && (
            <>
              <div className="flex-grow">
                <div className="flex items-center space-x-3 mb-5">
                  <div className="h-[1.5px] w-8 flex-shrink-0" style={{ backgroundColor: tk.accent }} />
                  <span className="text-[9px] font-black tracking-[0.5em] uppercase" style={{ color: tk.accent, opacity: 0.7 }}>
                    {t(product.categoryTitle)}
                  </span>
                </div>

                <h3 className={`font-serif font-black uppercase leading-tight tracking-tight mb-5 ${tk.text}`}
                  style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}>
                  {t(product.name)}
                </h3>

                {product.price && product.price !== '0' && product.price !== '0 TL' && (
                  <div
                    className="inline-flex items-center px-5 py-2 rounded-2xl mb-6"
                    style={{ backgroundColor: `${tk.accent}18`, border: `1px solid ${tk.accent}35` }}
                  >
                    <span className="font-black text-2xl" style={{ color: tk.accent }}>
                      {currentPrice}₺
                    </span>
                  </div>
                )}

                <div className="border-l-2 pl-5 mb-6" style={{ borderColor: `${tk.accent}50` }}>
                  <p className={`${tk.textMuted} text-sm font-light italic leading-relaxed`}>
                    {t(product.description)}
                  </p>
                </div>

                {/* Extras Button */}
                {hasExtras && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setModalView('extras');
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-xs font-bold mb-4 ${
                      isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' : 'bg-black/5 border-black/10 hover:bg-black/10 hover:border-black/20'
                    }`}
                    style={{ color: tk.text }}
                  >
                    <span className="uppercase tracking-wider flex items-center gap-2">
                      <Star className="w-4 h-4" style={{ color: tk.accent }} />
                      {t({ tr: 'Ekstralar / Seçenekler', en: 'Extras / Options' })}
                    </span>
                    <div className="flex items-center gap-2">
                      {activeExtrasCount > 0 ? (
                        <span className="px-3 py-1 rounded-xl text-[10px] font-black text-white animate-pulse" style={{ backgroundColor: tk.accent }}>
                          +{extraPrice}₺ ({activeExtrasCount})
                        </span>
                      ) : (
                        <span className={`text-[10px] font-bold ${tk.textMuted}`}>
                          {t({ tr: 'SEÇİN', en: 'CHOOSE' })}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </div>
                  </button>
                )}

                {/* Pairs Well Button */}
                {pairsWellProducts.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setModalView('pairs_well');
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-xs font-bold mb-4 ${
                      isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' : 'bg-black/5 border-black/10 hover:bg-black/10 hover:border-black/20'
                    }`}
                    style={{ color: tk.text }}
                  >
                    <span className="uppercase tracking-wider flex items-center gap-2">
                      <Plus className="w-4 h-4" style={{ color: tk.accent }} />
                      {t({ tr: 'Yanında İyi Gider', en: 'Pairs Well With' })}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl text-[10px] font-black text-white animate-pulse" style={{ backgroundColor: tk.accent }}>
                        {pairsWellProducts.length}
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </div>
                  </button>
                )}

                {(product.allergens?.length > 0 || product.isSpicy) && (
                  <div className="mt-6">
                    <span className={`text-[9px] ${tk.textSubtle} uppercase font-bold tracking-[0.25em] block mb-3`}>
                      {product.allergens?.length > 0 ? t({ tr: 'Alerjenler & Uyarılar', en: 'Allergens & Warnings' }) : t({ tr: 'Uyarılar', en: 'Warnings' })}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(product.allergens || []).map(id => {
                        const a = (allergens || []).find(x => x.id === id);
                        if (!a) return null;
                        return (
                          <div
                            key={id}
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center p-2 transition-all shadow-sm`}
                            style={{ backgroundColor: `${tk.accent}10`, borderColor: `${tk.accent}25` }}
                          >
                            {a.icon_url
                              ? <img src={a.icon_url} alt="" className="w-full h-full object-contain" />
                              : <Info className="w-4 h-4" style={{ color: tk.accent }} />}
                          </div>
                        );
                      })}
                      {product.isSpicy && (
                        <div
                          className="w-10 h-10 rounded-xl border flex items-center justify-center p-2 transition-all shadow-sm bg-red-500/10 border-red-500/30"
                          title={t({ tr: 'Acılı', en: 'Spicy' })}
                        >
                          <Flame className="w-5 h-5 text-red-600" fill="currentColor" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 mt-8">
                {!isMinimal && (
                  <button
                    onClick={() => {
                      if (hasExtras) {
                        const activeExtras = extrasOptions.filter(opt => selectedExtras[opt.id]);
                        if (activeExtras.length > 0) {
                          const extrasIdStr = activeExtras.map(e => e.id).sort().join('-');
                          const extraNamesTr = activeExtras.map(e => e.name.tr).join(', ');
                          const extraNamesEn = activeExtras.map(e => e.name.en).join(', ');
                          
                          const modifiedProduct = {
                            ...product,
                            id: `${product.id}-${extrasIdStr}`,
                            price: currentPrice.toString(),
                            name: {
                              tr: `${product.name.tr} (${extraNamesTr})`,
                              en: `${product.name.en} (${extraNamesEn})`,
                            },
                            baseProductId: product.id,
                            selectedExtras: activeExtras
                          };
                          onAddToCart(modifiedProduct);
                        } else {
                          onAddToCart(product);
                        }
                      } else {
                        onAddToCart(product);
                      }
                      onClose();
                    }}
                    className="font-black uppercase tracking-[0.35em] py-4 px-10 rounded-2xl transition-all text-[10px] active:scale-95 flex items-center justify-center space-x-3 shadow-lg cursor-pointer"
                    style={{ backgroundColor: tk.accent, color: '#fff' }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t({ tr: 'SEPETE EKLE', en: 'ADD TO BASKET' })}</span>
                  </button>
                )}
                <button
                    onClick={onClose}
                    className={`font-black uppercase tracking-[0.35em] py-4 px-10 rounded-2xl transition-all text-[10px] cursor-pointer ${isMinimal ? 'bg-secondary text-primary' : 'opacity-40 hover:opacity-100 ' + tk.text}`}
                    style={isMinimal ? { backgroundColor: tk.accent, color: '#fff' } : {}}
                >
                    {t({ tr: 'KAPAT', en: 'CLOSE' })}
                </button>
              </div>
            </>
          )}

          {modalView === 'extras' && (
            <>
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-6">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setModalView('main');
                    }}
                    className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                  >
                    <ArrowLeft className={`w-5 h-5 ${tk.text}`} />
                  </button>
                  <span className={`text-sm font-black uppercase tracking-[0.2em] ${tk.text}`}>
                    {t({ tr: 'Ekstralar / Seçenekler', en: 'Extras / Options' })}
                  </span>
                </div>

                <div className="space-y-3">
                  {extrasOptions.map(option => (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer select-none transition-all duration-200 ${
                        selectedExtras[option.id]
                          ? `bg-[#c9a96e]/10 border-[#c9a96e] ${tk.text}`
                          : `bg-transparent ${tk.cardBorder} ${tk.textMuted} hover:border-white/20`
                      }`}
                      style={selectedExtras[option.id] ? { borderColor: tk.accent, backgroundColor: `${tk.accent}15`, color: tk.accent } : {}}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedExtras[option.id]}
                          onChange={() => handleToggleExtra(option.id)}
                          className="w-4 h-4 rounded border-white/20 text-[#c9a96e] focus:ring-[#c9a96e] focus:ring-offset-0 bg-transparent cursor-pointer"
                          style={{ accentColor: tk.accent }}
                        />
                        <span className={`text-xs font-bold uppercase tracking-wide ${selectedExtras[option.id] ? '' : tk.text}`}>
                          {t(option.name)}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold">
                        +{option.price}₺
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-8">
                <button
                  onClick={() => setModalView('main')}
                  className="font-black uppercase tracking-[0.35em] py-4 px-10 rounded-2xl transition-all text-[10px] active:scale-95 flex items-center justify-center space-x-3 shadow-lg cursor-pointer"
                  style={{ backgroundColor: tk.accent, color: '#fff' }}
                >
                  <span>{t({ tr: 'SEÇİMİ TAMAMLA', en: 'COMPLETE SELECTION' })}</span>
                </button>
              </div>
            </>
          )}

          {modalView === 'pairs_well' && (
            <>
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-6">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setModalView('main');
                    }}
                    className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                  >
                    <ArrowLeft className={`w-5 h-5 ${tk.text}`} />
                  </button>
                  <span className={`text-sm font-black uppercase tracking-[0.2em] ${tk.text}`}>
                    {t({ tr: 'Yanında İyi Gider', en: 'Pairs Well With' })}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pairsWellProducts.map(pwItem => (
                    <div
                      key={pwItem.id}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border ${tk.cardBorder} ${tk.cardBg} transition-all duration-200 hover:border-[#c9a96e]/30`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-black/10">
                          <img src={pwItem.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className={`text-xs font-bold uppercase tracking-wide truncate ${tk.text}`}>
                            {t(pwItem.name)}
                          </h4>
                          <span className="text-[10px] font-mono font-bold" style={{ color: tk.accent }}>
                            {pwItem.price && pwItem.price !== '0' ? `${pwItem.price.toString().replace(/ TL/g, '').replace(/ ₺/g, '')}₺` : ''}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(pwItem);
                          setAddedPairs(prev => ({ ...prev, [pwItem.id]: true }));
                          setTimeout(() => {
                            setAddedPairs(prev => ({ ...prev, [pwItem.id]: false }));
                          }, 1500);
                        }}
                        className={`flex items-center justify-center w-8 h-8 rounded-lg text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md ${
                          addedPairs[pwItem.id] ? 'bg-green-500 shadow-green-500/20' : 'shadow-[#c9a96e]/10'
                        }`}
                        style={!addedPairs[pwItem.id] ? { backgroundColor: tk.accent } : {}}
                      >
                        {addedPairs[pwItem.id] ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-8">
                <button
                  onClick={() => setModalView('main')}
                  className="font-black uppercase tracking-[0.35em] py-4 px-10 rounded-2xl transition-all text-[10px] active:scale-95 flex items-center justify-center space-x-3 shadow-lg cursor-pointer"
                  style={{ backgroundColor: tk.accent, color: '#fff' }}
                >
                  <span>{t({ tr: 'ANA ÜRÜNE DÖN', en: 'BACK TO PRODUCT' })}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
               onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
               className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/50 text-white z-50"
            >
               <X className="w-6 h-6" />
            </button>
            <motion.img
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               src={product.image_url}
               alt=""
               className="max-w-full max-h-full object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────
   BASKET DRAWER
   ───────────────────────────────────────── */
const BasketDrawer = ({ isOpen, onClose, cart, updateQuantity, removeFromCart, t, tk }) => {
    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price?.toString().replace(/[^\d.]/g, '') || 0);
        return sum + (price * item.quantity);
    }, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[250]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`fixed top-0 right-0 bottom-0 w-full max-w-md ${tk.pageBg} z-[260] shadow-2xl flex flex-col border-l ${tk.cardBorder}`}
                    >
                        {/* Header */}
                        <div className={`p-6 flex items-center justify-between border-b ${tk.cardBorder}`}>
                            <div className="flex items-center space-x-3">
                                <ShoppingBasket className="w-6 h-6" style={{ color: tk.accent }} />
                                <h2 className={`font-serif font-black uppercase tracking-widest text-xl ${tk.text}`}>
                                    {t({ tr: 'SEPETİM', en: 'YOUR BASKET' })}
                                </h2>
                            </div>
                            <button onClick={onClose} className={`p-2 rounded-full hover:bg-white/5 ${tk.text}`}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-30">
                                    <ShoppingBasket className="w-20 h-20 mb-4" />
                                    <p className={`font-medium ${tk.text}`}>{t({ tr: 'Sepetiniz henüz boş.', en: 'Your basket is empty.' })}</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className={`flex items-center space-x-4 p-4 rounded-2xl ${tk.cardBg} border ${tk.cardBorder}`}>
                                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className={`font-serif font-black text-xs uppercase tracking-wider ${tk.text} line-clamp-2`}>{t(item.name)}</h4>
                                            <p className="text-sm font-black mt-1" style={{ color: tk.accent }}>
                                                {parseFloat(item.price?.toString().replace(/[^\d.]/g, '') || 0)}₺
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-1">
                                                <button 
                                                    onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)}
                                                    className={`p-1 rounded hover:bg-white/10 ${tk.text}`}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className={`px-2 text-xs font-black min-w-[20px] text-center ${tk.text}`}>{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className={`p-1 rounded hover:bg-white/10 ${tk.text}`}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-500/50 hover:text-red-500 transition-colors p-1">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className={`p-6 border-t ${tk.cardBorder} space-y-4`}>
                                <div className="flex items-center justify-between">
                                    <span className={`${tk.textMuted} font-bold uppercase tracking-widest text-[10px]`}>{t({ tr: 'TOPLAM TUTAR', en: 'TOTAL AMOUNT' })}</span>
                                    <span className={`text-2xl font-black ${tk.text}`}>{total}₺</span>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl font-black uppercase tracking-[0.4em] text-xs shadow-xl active:scale-95 transition-all outline-none"
                                    style={{ backgroundColor: tk.accent, color: '#fff' }}
                                >
                                    {t({ tr: 'KAPAT', en: 'CLOSE' })}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────── */
const QRMenu = ({ data, allergens, settings, isPage = false }) => {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activePath, setActivePath] = useState(['all']);

  const allProducts = useMemo(() => {
    if (!data?.categories) return [];
    const list = [];
    data.categories.forEach(cat => {
      (cat.items || []).forEach(item => {
        list.push({ ...item, categoryTitle: cat.title });
      });
    });
    return list;
  }, [data]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState(() => {
    const mode = settings?.menu_display_mode;
    if (mode === 'small' || mode === 'categories') return 'categories';
    return 'grid'; // Default fallback
  });
  const [drilledCategory, setDrilledCategory] = useState(null);
  
  // Basket State
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('pennylane_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('pennylane_cart', JSON.stringify(cart));
  }, [cart]);

  const isDark = (settings?.theme || 'dark') === 'dark';
  const tk = isDark ? darkTheme : lightTheme;

  const addToCart = (item) => {
    setCart(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) {
            return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { ...item, quantity: 1 }];
    });
    // Visual feedback could be added here
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
  };

  useEffect(() => {
    const mode = settings?.menu_display_mode;
    if (mode === 'small' || mode === 'categories') {
      setViewMode('categories');
    } else if (mode === 'large' || mode === 'grid') {
      setViewMode('grid');
    }
  }, [settings]);

  useEffect(() => {
    document.body.style.overflow = (selectedProduct || isCartOpen) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProduct, isCartOpen]);

  useEffect(() => {
    if (data?.categories && !activeCategory) {
      setActiveCategory(data.categories[0]?.id);
      setActivePath(['all']);
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
      
      const itemPath = item.categoryPath || [item.subcategory, item.subSubcategory].filter(Boolean);
      const matchesPath = activePath.every((p, idx) => {
        if (p === 'all') return true;
        return itemPath[idx] === p;
      });

      const q = searchQuery.toLowerCase();
      const matchesSearch = t(item.name).toLowerCase().includes(q) || t(item.description).toLowerCase().includes(q);
      return matchesCat && matchesPath && matchesSearch && !item.passive;
    });
  }, [data, activeCategory, activePath, searchQuery, t, drilledCategory]);

  if (!data?.categories) return null;

  /* ── PAGE VERSION ── */
  if (isPage) {
    const isDrilled = drilledCategory !== null;

    return (
      <section
        id="menu"
        className={`relative transition-colors duration-700 ${tk.pageBg} min-h-screen px-4 sm:px-6 md:px-10 max-w-7xl mx-auto pb-24`}
      >
        <div className="pt-6 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 mb-8">
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

            <div className={`flex p-1 rounded-2xl border ${tk.pillBg}`}>
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
          </div>

          {isDrilled && (
            <div className="mb-8">
              <button
                onClick={() => { setDrilledCategory(null); setActivePath(['all']); }}
                className="mb-6 flex items-center space-x-2 transition-all active:scale-95 group"
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

              {/* Drilled-view subcategory tab bar (Recursive) */}
              <CategoryTabsRecursive
                 categoryNode={drilledCategory}
                 items={drilledCategory?.items || []}
                 activePath={activePath}
                 setActivePath={setActivePath}
                 t={t}
                 tk={tk}
                 isDark={isDark}
              />
            </div>
          )}

          {viewMode === 'grid' && !isDrilled && (
            <>
            <div className="flex flex-wrap gap-2 mb-3">
              {[{ id: 'all', title: { tr: 'Hepsi', en: 'All' } }, ...data.categories].map(cat => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setActivePath(['all']); setDrilledCategory(null); }}
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

            {activeCategory !== 'all' && (() => {
               const activeCat = data.categories.find(c => c.id === activeCategory);
               if (!activeCat?.subcategories) return null;
               
               return (
                 <CategoryTabsRecursive
                    categoryNode={activeCat}
                    items={activeCat.items || []}
                    activePath={activePath}
                    setActivePath={setActivePath}
                    t={t}
                    tk={tk}
                    isDark={isDark}
                 />
               );
            })()}
            </>
          )}
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'categories' && !isDrilled ? (
            <motion.div
              key="cats"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-6 md:gap-8"
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
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
            >
              {filteredItems.map(item => (
                <ProductCard
                  key={item.id}
                  item={item}
                  t={t}
                  tk={tk}
                  onAddToCart={addToCart}
                  onClick={() => setSelectedProduct(item)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Basket Button */}
        <AnimatePresence>
            {cart.length > 0 && (
                <motion.button
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: 20 }}
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-8 right-8 z-[150] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center group"
                    style={{ backgroundColor: tk.accent }}
                >
                    <ShoppingBasket className="w-7 h-7 text-white" />
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#0c0c0c]">
                        {cart.reduce((sum, i) => sum + i.quantity, 0)}
                    </span>
                    {/* Ring animation */}
                    <div className="absolute inset-0 rounded-full bg-inherit animate-ping opacity-25 -z-10" />
                </motion.button>
            )}
        </AnimatePresence>

        {/* Modals & Basket */}
        <AnimatePresence>
          {selectedProduct && (
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              t={t}
              allergens={allergens}
              isDark={isDark}
              onAddToCart={addToCart}
              allProducts={allProducts}
            />
          )}
          <BasketDrawer 
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              t={t}
              tk={tk}
          />
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

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {[{ id: 'all', title: { tr: 'Hepsi', en: 'All' } }, ...data.categories].map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setActivePath(['all']); }}
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

        {/* Subcategory tab bar (Recursive) */}
        {activeCategory !== 'all' && (() => {
          const activeCat = data.categories.find(c => c.id === activeCategory);
          return activeCat?.subcategories ? (
            <div className="max-w-3xl mx-auto mb-8">
              <CategoryTabsRecursive
                categoryNode={activeCat}
                items={activeCat.items || []}
                activePath={activePath}
                setActivePath={setActivePath}
                t={t}
                tk={darkTheme}
                isDark={true}
              />
            </div>
          ) : null;
        })()}

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 px-4 sm:px-0">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                layout
              >
                <div 
                  className="group cursor-pointer text-left"
                  onClick={() => setSelectedProduct(item)}
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-[#1a1a1a] border border-white/5 group-hover:border-secondary/30 transition-all duration-500 flex items-center justify-center">
                    <img 
                      src={item.image_url || '/assets/img/pennylane-default.png'} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="font-serif font-bold text-white uppercase tracking-wider mb-1 group-hover:text-secondary transition-colors">
                    {t(item.name)}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary/60 text-[10px] font-bold uppercase tracking-widest italic line-clamp-1">
                      {t(item.description)}
                    </span>
                    <span className="text-secondary font-black text-sm ml-2">
                      {item.price && item.price !== '0' ? `${item.price}₺` : ''}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
          {selectedProduct && (
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              t={t}
              allergens={allergens}
              isDark={isDark}
              onAddToCart={() => {}} // Ana sayfada sepete ekleme yok
              isMinimal={true} // Yeni prop
              allProducts={allProducts}
            />
          )}
      </AnimatePresence>
    </section>
  );
};

export default QRMenu;
