import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { getVal } from '../../utils/i18n';
import { ChevronLeft, X } from 'lucide-react';
import mockData from '../../utils/mockData.json';
import storyMenuData from '../../utils/storyMenuData.json';

const StoryProductView = ({ product, onClose, lang, allergens }) => {
  const [showImageFullScreen, setShowImageFullScreen] = useState(false);

  const name = getVal(product.name, lang);
  const desc = getVal(product.description, lang);
  const price = product.price;
  const imgUrl = product.image_url || product.image;

  return (
    <>
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: '0%' }}
        exit={{ y: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[100] bg-[#0a0a0a]"
      >
      {/* Product Image */}
      {imgUrl ? (
        <div className="absolute inset-0 z-0 cursor-zoom-in" onClick={() => setShowImageFullScreen(true)}>
          <img src={imgUrl} alt={name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-dark" />
      )}
      
      {/* Top Left Back Button */}
      <div className="absolute top-6 left-4 z-20">
        <button onClick={onClose} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-black/60 transition-colors border border-white/10">
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Gradient and Details */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pt-40 pb-12 px-6 pointer-events-none">
        <h2 className="text-white text-2xl md:text-3xl font-bold tracking-wide uppercase mb-1 drop-shadow-md pointer-events-auto">{name}</h2>
        <div className="text-white text-xl md:text-2xl font-bold mb-3 drop-shadow-md pointer-events-auto">{price} TL</div>
        
        {desc && <p className="text-white/80 text-sm md:text-base leading-relaxed mb-4 drop-shadow-sm max-w-prose pointer-events-auto">{desc}</p>}

        {/* Allergens */}
        {product.allergens?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 pointer-events-auto">
            {product.allergens.map(id => {
              const a = (allergens || []).find(x => x.id === id);
              if (!a) return null;
              return (
                <div key={id} className="w-8 h-8 rounded-full bg-[#E5253A] flex items-center justify-center shadow-lg border border-white/10" title={getVal(a.name, lang)}>
                  <img src={a.icon} alt={id} className="w-4 h-4 filter brightness-0 invert" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>

    {/* Fullscreen Image Lightbox */}
    <AnimatePresence>
      {showImageFullScreen && imgUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-4"
        >
          <button 
            onClick={() => setShowImageFullScreen(false)} 
            className="absolute top-6 right-4 z-50 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <motion.img 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            src={imgUrl} 
            alt={name} 
            className="w-full max-h-full object-contain rounded-lg" 
          />
        </motion.div>
      )}
    </AnimatePresence>
  </>
  );
};

const HotspotMarker = ({ layout, product, lang, onClick, isImageLabel }) => {
  const name = product ? getVal(product.name, lang) : layout.label;
  const price = product ? product.price : null;
  const isSpicy = product?.tags?.includes('spicy');

  const posX = isImageLabel ? (layout.labelX ?? layout.x) : layout.x;
  const posY = isImageLabel ? (layout.labelY ?? (layout.y + 15)) : layout.y;

  const labelScaleMap = { sm: 0.8, md: 1, lg: 1.25, xl: 1.6 };
  const scale = labelScaleMap[layout.label_size || 'md'];

  return (
    <div
      className="absolute z-10 cursor-pointer group transition-transform hover:scale-105"
      style={{ left: `${posX}%`, top: `${posY}%`, transform: `translate(-50%, -50%) scale(${scale})` }}
      onClick={() => onClick(layout)}
    >
      <div className="flex flex-col items-center bg-black/50 backdrop-blur-md px-3 md:px-4 py-2 rounded shadow-2xl min-w-max border border-white/10">
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

/* ─────────────────────────────────────────────
   FREE TEXT MARKER
───────────────────────────────────────────── */
const FreeTextMarker = ({ layout }) => {
  const labelScaleMap = { sm: 0.8, md: 1, lg: 1.25, xl: 1.6, '2xl': 2.0, '3xl': 2.5 };
  const scale = labelScaleMap[layout.label_size || 'md'];

  return (
    <div
      className="absolute z-20 pointer-events-none"
      style={{ left: `${layout.x}%`, top: `${layout.y}%`, transform: `translate(-50%, -50%) scale(${scale})` }}
    >
      <div className="font-serif font-black text-white tracking-widest uppercase drop-shadow-lg leading-tight pointer-events-auto whitespace-nowrap">
        {layout.label || ''}
      </div>
    </div>
  );
};

const sizeMap = { sm: '16%', md: '26%', lg: '40%', xl: '56%' };

const ProductImageHotspot = ({ layout, product, lang, onClick }) => {
  const sizeMap = { sm: '16%', md: '26%', lg: '40%', xl: '56%' };
  const width = layout.custom_scale ? `${layout.custom_scale}%` : sizeMap[layout.size || 'md'];
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

/* ─────────────────────────────────────────────
   LIST BLOCK DISPLAY (frontend rendering)
───────────────────────────────────────────── */
const ListBlockDisplay = ({ layout, allProducts, lang, onClick }) => {
  const items = layout.listItems || [];
  if (items.length === 0) return null;

  return (
    <div
      className="absolute z-10"
      style={{ left: '4%', right: '4%', top: `${layout.y}%`, transform: 'translateY(-50%)' }}
    >
      <div className="flex flex-col gap-[10px] px-1 py-1 w-full">
        {items.map((item) => {
          const prod = allProducts?.find(p => p.id === item.product_id);
          const name = prod ? getVal(prod.name, lang) : item.label;
          const price = prod ? prod.price : item.price;
          const isClickable = !!prod;
          return (
            <div
              key={item.id}
              className={`flex items-baseline gap-3 w-full ${isClickable ? 'cursor-pointer group' : ''}`}
              onClick={() => isClickable && onClick({ product_id: item.product_id })}
            >
              <span className="text-white font-bold text-[clamp(12px,3.5vw,18px)] leading-tight whitespace-nowrap shrink-0 group-hover:text-amber-200 transition-colors">
                {name || 'Ürün Adı'}
              </span>
              <span className="flex-1 border-b border-dotted border-white/40 mb-[4px]" style={{ minWidth: '8px' }} />
              <span className="text-white font-bold text-[clamp(11px,3vw,16px)] whitespace-nowrap shrink-0 group-hover:text-amber-200 transition-colors">
                {price ? `${price} TL` : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const MenuStoryPage = ({ page, onHotspotClick, allProducts, lang }) => {
  return (
    <div className="relative w-full min-h-[100dvh] bg-[#0a0a0a] flex flex-col items-center justify-start">
      {/* Container that takes the height of the image */}
      <div className="relative w-full h-auto bg-[#111] flex flex-col mx-auto">
        
        <div className="relative inset-0 w-full">
          <img 
            src={page.hero_image_url} 
            alt="Hero" 
            className="w-full h-auto object-cover opacity-90 block"
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

            // List block layout
            if (layout.listBlock) {
              return (
                <ListBlockDisplay
                  key={layout.id}
                  layout={layout}
                  allProducts={allProducts}
                  lang={lang}
                  onClick={onHotspotClick}
                />
              );
            }
            
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
            
            if (layout.isTextOnly) {
              return <FreeTextMarker key={layout.id} layout={layout} />;
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

  const bgOpacity = ws.bg_opacity !== undefined ? ws.bg_opacity : 0.6;
  const blurAmount = ws.bg_blur !== undefined ? ws.bg_blur : 0;
  const overlayColor = ws.overlay_color || '#000000';
  const overlayOpacity = ws.overlay_opacity !== undefined ? ws.overlay_opacity : 0.4;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black flex items-center justify-center">
      {ws.background_image_url && (
        <div className="absolute inset-0">
          {isVideo ? (
            <video src={ws.background_image_url} autoPlay loop muted playsInline className="w-full h-full object-cover transition-all" style={{ opacity: bgOpacity, filter: `blur(${blurAmount}px)` }} />
          ) : (
            <img src={ws.background_image_url} alt="Welcome BG" className="w-full h-full object-cover transition-all" style={{ opacity: bgOpacity, filter: `blur(${blurAmount}px)` }} />
          )}
          <div className="absolute inset-0 transition-all" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center h-[100dvh] px-6 w-full">
        {/* CENTER: Logo + Brand + CTA */}
        <div className="flex flex-col items-center justify-center gap-3 w-full">
          {/* Logo emblem */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center"
          >
            {ws.logo_url ? (
              <img src={ws.logo_url} alt="Logo" className="relative w-full h-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]" />
            ) : (
              <img src="/assets/img/pennylane_logo_white.png" alt="Pennylane" className="relative w-full h-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]" />
            )}
          </motion.div>

          {/* Tagline */}
          <motion.span
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-[9px] md:text-[10px] uppercase font-semibold tracking-[0.3em] text-white/80 drop-shadow-sm text-center"
          >
            {ws.tagline || 'GASTROPUB & EATERY'}
          </motion.span>

          {/* Spacer */}
          <div className="h-3" />

          {/* Let's Start button */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            onClick={onScrollNext}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)', scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="px-8 py-2.5 border-[1px] border-white/90 text-white/90 text-[10px] md:text-[11px] font-black uppercase bg-black/20 backdrop-blur-sm cursor-pointer shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
            style={{ letterSpacing: '0.1em', borderRadius: 0 }}
          >
            {ws.cta_text || "LET'S START"}
          </motion.button>

          {/* Spacer */}
          <div className="h-1" />

          {/* Bouncing arrows */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            className="mt-1"
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-[3px] cursor-pointer"
              onClick={onScrollNext}
            >
              <svg width="16" height="10" viewBox="0 0 22 13" fill="none">
                <path d="M1 1.5L11 11.5L21 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
              </svg>
              <svg width="16" height="10" viewBox="0 0 22 13" fill="none">
                <path d="M1 1.5L11 11.5L21 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Fiyat Güncelleme Tarihi (Footer) */}
        {ws.price_update_date && (
          <div className="absolute bottom-5 left-0 right-0 text-center pointer-events-none">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-[9px] md:text-[10px] text-white/50 tracking-wider font-light"
            >
              {ws.price_update_date}
            </motion.span>
          </div>
        )}
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
      {/* Main Content — fluid scroll */}
      <div
        ref={scrollContainerRef}
        className="relative w-full md:max-w-[600px] h-[100dvh] bg-[#111] overflow-y-auto hide-scrollbar z-[100] shadow-[20px_0_50px_rgba(0,0,0,0.8)] border-r border-white/5"
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
              <StoryProductView
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                lang={lang}
                allergens={allergens}
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
