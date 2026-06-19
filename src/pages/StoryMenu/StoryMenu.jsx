import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { getVal } from '../../utils/i18n';
import { ProductModal } from '../../components/Sections/QRMenu';
import { X } from 'lucide-react';
import mockData from '../../utils/mockData.json';
import storyMenuData from '../../utils/storyMenuData.json';

const HotspotMarker = ({ layout, product, lang, onClick, isImageLabel }) => {
  const name = product ? getVal(product.name, lang) : layout.label;
  const price = product ? product.price : null;
  const isSpicy = product?.tags?.includes('spicy');

  const posX = isImageLabel ? (layout.labelX ?? layout.x) : layout.x;
  const posY = isImageLabel ? (layout.labelY ?? (layout.y + 15)) : layout.y;

  return (
    <div
      className="absolute z-10 cursor-pointer group transition-transform hover:scale-105"
      style={{ left: `${posX}%`, top: `${posY}%`, transform: 'translate(-50%, -50%)' }}
      onClick={() => onClick(layout)}
    >
      <div className="flex flex-col items-center bg-black/85 backdrop-blur-sm px-3 md:px-4 py-2 rounded shadow-2xl min-w-max border border-white/5">
        {isSpicy && (
          <span className="text-red-500 text-xs mb-0.5">🌶️</span>
        )}
        <span className="text-white text-[9px] md:text-[11px] font-medium tracking-wide text-center leading-tight max-w-[140px] md:max-w-[160px] break-words">
          {name || 'İSİMSİZ ETİKET'}
        </span>
        {price && (
          <span className="text-white font-bold text-[10px] md:text-xs mt-1 tracking-wider">
            {price} TL
          </span>
        )}
      </div>
    </div>
  );
};

const sizeMap = { sm: '16%', md: '26%', lg: '40%', xl: '56%' };

const ProductImageHotspot = ({ layout, product, lang, onClick }) => {
  const width = sizeMap[layout.size || 'md'];
  const name = product ? getVal(product.name, lang) : layout.label;

  return (
    <div
      className="absolute flex flex-col items-center cursor-pointer group"
      style={{
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: layout.zIndex || 10,
        width: width
      }}
      onClick={() => onClick(layout)}
    >
      <div className="relative w-full flex justify-center">
        <img
          src={layout.image_url}
          alt={name || ''}
          className="w-full h-auto object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-105 select-none pointer-events-none"
          draggable={false}
        />
      </div>
    </div>
  );
};

const MenuStoryPage = ({ page, onHotspotClick, allProducts, lang }) => {
  return (
    <div className="relative w-full h-[100dvh] snap-start overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
      {/* Container that perfectly matches the aspect-[9/16] of the Admin Canvas */}
      <div className="relative w-full max-h-full aspect-[9/16] bg-[#111] overflow-hidden flex flex-col mx-auto">
        
        <div className="absolute inset-0">
          <img 
            src={page.hero_image_url} 
            alt="Hero" 
            className="w-full h-full object-cover opacity-90"
          />
          {/* Subtle gradient to ensure text readability */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        </div>
        
        {/* Title overlay - Right aligned */}
        <div className="absolute top-6 left-6 right-6 z-30 pointer-events-none text-right">
          <h1 className="text-[clamp(1.1rem,4vw,1.4rem)] font-serif font-black text-white tracking-widest uppercase drop-shadow-lg leading-tight">
            {getVal(page.title, lang) || 'TITLE'}
          </h1>
        </div>

        {/* Hotspots */}
        <div className="absolute inset-0 pointer-events-auto">
          {(page.layouts || []).map(layout => {
            const product = allProducts.find(p => p.id === layout.product_id);
            const hasLabel = layout.product_id || layout.label;
            
            if (layout.image_url) {
              return (
                <React.Fragment key={`group-${layout.id}`}>
                  <ProductImageHotspot layout={layout} product={product} lang={lang} onClick={onHotspotClick} />
                  {hasLabel && (
                    <HotspotMarker layout={layout} product={product} lang={lang} onClick={onHotspotClick} isImageLabel={true} />
                  )}
                </React.Fragment>
              );
            }
            return (
              <HotspotMarker key={layout.id} layout={layout} product={product} lang={lang} onClick={onHotspotClick} isImageLabel={false} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const WelcomeStoryPage = ({ config, lang, setLang, onScrollNext }) => {
  const ws = config || {};
  
  const isVideo = ws.background_image_url && ws.background_image_url.match(/\.(mp4|webm)$/i);

  return (
    <div className="relative w-full h-[100dvh] snap-start overflow-hidden bg-black flex items-center justify-center">
      {ws.background_image_url && (
        <div className="absolute inset-0">
          {isVideo ? (
            <video src={ws.background_image_url} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60" />
          ) : (
            <img src={ws.background_image_url} alt="Welcome BG" className="w-full h-full object-cover opacity-60" />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-between h-[100dvh] py-16 px-6 w-full">
        {/* Top empty */}
        <div />

        {/* CENTER: Logo + Brand + CTA */}
        <div className="flex flex-col items-center text-center gap-0 w-full">
          {/* Logo emblem */}
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative w-36 h-36 mb-6 flex items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full bg-[#c9a96e]/12 blur-2xl" />
            <div className="absolute inset-3 rounded-full border border-[#c9a96e]/18 animate-pulse" />
            {ws.logo_url ? (
              <img src={ws.logo_url} alt="Logo" className="relative w-full h-full object-contain drop-shadow-[0_8px_32px_rgba(201,169,110,0.4)]" />
            ) : (
              <img src="/assets/img/pennylane_logo_white.png" alt="Pennylane" className="relative w-full h-full object-contain drop-shadow-[0_8px_32px_rgba(201,169,110,0.4)]" />
            )}
          </motion.div>

          {/* Brand name */}
          <motion.h1
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-serif font-black text-white uppercase drop-shadow-2xl text-center"
            style={{ fontSize: 'clamp(2.5rem, 12vw, 3.5rem)', letterSpacing: '0.28em' }}
          >
            {ws.title1 || 'PENNYLANE'}
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.7, ease: 'easeOut' }}
            className="h-[1px] w-20 bg-[#c9a96e] my-5 opacity-55"
          />

          {/* Tagline */}
          <motion.span
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="text-[10px] md:text-xs uppercase font-semibold tracking-[0.8em] text-[#c9a96e]/65"
          >
            {ws.tagline || 'GASTROPUB & EATERY'}
          </motion.span>

          {/* Bouncing arrows + Let's Start */}
          <motion.div
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="flex flex-col items-center gap-4 mt-12"
          >
            {/* Bouncing chevrons */}
            <motion.div
              animate={{ y: [0, 9, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-[4px]"
            >
              <svg width="24" height="14" viewBox="0 0 22 13" fill="none">
                <path d="M1 1.5L11 11.5L21 1.5" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
              </svg>
              <svg width="24" height="14" viewBox="0 0 22 13" fill="none">
                <path d="M1 1.5L11 11.5L21 1.5" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
              </svg>
            </motion.div>

            {/* Let's Start button */}
            <motion.button
              onClick={onScrollNext}
              whileHover={{ backgroundColor: '#c9a96e', color: '#0a0a0a', scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className="px-10 py-3.5 border border-[#c9a96e] text-[#c9a96e] text-[11px] md:text-xs font-black uppercase bg-transparent cursor-pointer"
              style={{ letterSpacing: '0.5em', borderRadius: 0 }}
            >
              {ws.cta_text || "Let's Start"}
            </motion.button>
          </motion.div>
        </div>

        {/* FOOTER - Empty now since we removed language pills */}
        <div />
      </div>
    </div>
  );
};

const StoryMenu = ({ cmsData }) => {
  const [pages, setPages] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { lang, setLang } = useLanguage();
  const scrollContainerRef = React.useRef(null);

  useEffect(() => {
    const dataSource = cmsData || mockData;
    
    // Load products and allergens
    setAllergens(dataSource.allergens || []);
    const products = [];
    (dataSource.menu?.categories || []).forEach(cat => {
      (cat.items || []).forEach(item => {
        products.push(item);
      });
    });
    setAllProducts(products);

    // Load story menu data
    const storyPages = dataSource.storyMenu?.pages || storyMenuData.pages || [];
    // Only show active pages
    setPages(storyPages.filter(p => p.active !== false).sort((a, b) => a.sort_order - b.sort_order));
  }, [cmsData]);

  const handleHotspotClick = (layout) => {
    const product = allProducts.find(p => p.id === layout.product_id);
    if (product) {
      setSelectedProduct(product);
    } else {
      console.warn("Product not found for hotspot:", layout.product_id);
    }
  };

  const handleAddToCart = (product) => {
    alert(`${getVal(product.name, lang)} sepete eklendi!`);
  };

  const scrollToNextSlide = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  const welcomeConfig = (cmsData || mockData)?.welcome_screen || {};

  return (
    <div className="fixed inset-0 bg-black flex justify-start overflow-hidden">
      {/* Main Content — natural snap-y scroll */}
      <div
        ref={scrollContainerRef}
        className="relative w-full md:max-w-[600px] h-[100dvh] bg-[#111] overflow-y-auto snap-y snap-mandatory hide-scrollbar z-[100] shadow-[20px_0_50px_rgba(0,0,0,0.8)] border-r border-white/5"
      >
        <WelcomeStoryPage config={welcomeConfig} lang={lang} setLang={setLang} onScrollNext={scrollToNextSlide} />
        
        {pages.map(page => (
           <MenuStoryPage 
             key={page.id} 
             page={page} 
             onHotspotClick={handleHotspotClick}
             allProducts={allProducts}
             lang={lang}
           />
         ))}

        {/* Product Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              t={(val) => getVal(val, lang)}
              allergens={allergens}
              isDark={true}
              onAddToCart={handleAddToCart}
              allProducts={allProducts}
            />
          )}
        </AnimatePresence>
      </div>
      

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default StoryMenu;
