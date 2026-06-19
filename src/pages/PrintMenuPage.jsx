import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Printer, 
  Settings, 
  CheckSquare, 
  Square, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Check, 
  RefreshCw,
  FileText,
  LayoutGrid,
  Image as ImageIcon,
  GripVertical,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

// ── CUSTOM PREMIUM VECTOR SKETCHES (LINE ART) ──

const CroissantSketch = ({ color = 'currentColor' }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 opacity-80">
    <path d="M12 42C8 38 7 28 12 24C17 20 23 23 27 28" />
    <path d="M52 42C56 38 57 28 52 24C47 20 41 23 37 28" />
    <path d="M22 21C26 15 38 15 42 21" />
    <path d="M18 31C24 25 40 25 46 31" />
    <path d="M16 38C22 34 42 34 48 38" />
    <path d="M12 42C20 40 44 40 52 42" />
    <path d="M22 42C25 48 39 48 42 42" />
  </svg>
);

const BurgerSketch = ({ color = 'currentColor' }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 opacity-80">
    {/* Upper Bun */}
    <path d="M12 28C12 18 20 14 32 14C44 14 52 18 52 28" />
    <path d="M10 28H54" />
    {/* Sesame seeds */}
    <path d="M22 19H23" />
    <path d="M30 18H31" />
    <path d="M38 19H39" />
    <path d="M26 23H27" />
    <path d="M34 23H35" />
    <path d="M42 23H43" />
    {/* Cheese / Lettuce ripple */}
    <path d="M8 32Q12 29 16 32Q20 35 24 32Q28 29 32 32Q36 35 40 32Q44 29 48 32Q52 35 56 32" />
    {/* Meat Patty */}
    <rect x="10" y="34" width="44" height="6" rx="3" />
    {/* Tomato / Onion layer */}
    <path d="M12 42H52" />
    {/* Lower Bun */}
    <path d="M12 44C12 50 20 52 32 52C44 52 52 50 52 44" />
    <path d="M10 44H54" />
  </svg>
);

const PretzelSketch = ({ color = 'currentColor' }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 opacity-80">
    <path d="M32 54C43.0457 54 52 45.0457 52 34C52 25.5 45.5 16.5 35 14C33 19 32 25 32 30C32 25 31 19 29 14C18.5 16.5 12 25.5 12 34C12 45.0457 20.9543 54 32 54Z" />
    <path d="M17 29C20 35 27 38 32 30" />
    <path d="M47 29C44 35 37 38 32 30" />
    {/* Salt crystals */}
    <path d="M22 46H23" />
    <path d="M42 46H43" />
    <path d="M32 50H33" />
    <path d="M15 36H16" />
    <path d="M48 36H49" />
  </svg>
);

const SteakSketch = ({ color = 'currentColor' }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 opacity-80">
    <path d="M16 28C16 20 22 14 36 14C46 14 50 20 50 30C50 42 42 50 28 50C18 50 16 44 16 38Z" />
    {/* Bone */}
    <circle cx="28" cy="24" r="4" />
    <path d="M28 20V14" />
    <path d="M32 24H38" />
    {/* Grill marks */}
    <path d="M22 34L44 26" />
    <path d="M20 40L42 32" />
    <path d="M22 46L38 40" />
  </svg>
);

const BeerSketch = ({ color = 'currentColor' }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 opacity-80">
    {/* Pint Glass */}
    <path d="M20 18L24 50C24 52 26 53 28 53H36C38 53 40 52 40 50L44 18" />
    {/* Foam */}
    <path d="M18 16C18 13 22 11 26 12C28 10 36 10 38 12C42 11 46 13 46 16C46 19 42 20 32 20C22 20 18 19 18 16Z" />
    {/* Glass reflections */}
    <path d="M25 24V46" />
    <path d="M39 24V46" />
    {/* Bubbles */}
    <circle cx="30" cy="30" r="1" />
    <circle cx="34" cy="38" r="1.5" />
    <circle cx="28" cy="42" r="1" />
    <circle cx="36" cy="28" r="1" />
  </svg>
);

const CocktailSketch = ({ color = 'currentColor' }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 opacity-80">
    {/* Martini Glass */}
    <path d="M14 14H50L32 32L14 14Z" />
    <path d="M32 32V50" />
    <path d="M22 50H42" />
    {/* Liquid Line */}
    <path d="M18 18H46" />
    {/* Olive on stick */}
    <path d="M30 12L36 24" />
    <circle cx="33" cy="18" r="3" />
    {/* Lemon Peel ornament */}
    <path d="M48 12C50 14 51 18 47 20" />
  </svg>
);

const WineSketch = ({ color = 'currentColor' }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 opacity-80">
    {/* Bottle */}
    <path d="M22 52V24C22 22 24 20 26 18V10H30V18C32 20 34 22 34 24V52H22Z" />
    <path d="M22 28H34" />
    <path d="M22 46H34" />
    {/* Glass */}
    <path d="M38 34C38 30 46 30 46 34C46 38 43 42 42 42H42L42 48" />
    <path d="M39 48H45" />
    {/* Pour lines */}
    <path d="M34 26C36 28 37 32 39 33" />
  </svg>
);

const CoffeeSketch = ({ color = 'currentColor' }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 opacity-80">
    {/* Cup */}
    <path d="M16 26C16 38 22 42 32 42C42 42 48 38 48 26H16Z" />
    {/* Handle */}
    <path d="M48 30C52 30 54 32 54 34C54 37 51 38 48 38" />
    {/* Saucer */}
    <path d="M12 46C20 50 44 50 52 46" />
    {/* Steams */}
    <path d="M24 20Q26 16 25 12" />
    <path d="M32 20Q34 14 33 12" />
    <path d="M40 20Q42 16 41 12" />
  </svg>
);

const ThreeCoffeeCups = ({ color = 'currentColor' }) => (
  <div className="flex items-center justify-start gap-4 my-2 opacity-75 print:opacity-75">
    <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <path d="M20 30C20 38 24 40 32 40C40 40 44 38 44 30H20Z" />
      <path d="M44 32C47 32 49 33 49 35C49 37 47 38 44 38" />
      <path d="M16 44C24 47 40 47 48 44" />
      <path d="M28 24Q30 20 29 16" />
      <path d="M36 24Q38 20 37 16" />
    </svg>
    <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <path d="M16 28C16 38 22 42 32 42C42 42 48 38 48 28H16Z" />
      <path d="M48 32C52 32 54 34 54 36C54 39 51 40 48 40" />
      <path d="M12 46C20 50 44 50 52 46" />
      <path d="M26 22Q28 18 27 14" />
      <path d="M32 22Q34 16 33 14" />
      <path d="M38 22Q40 18 39 14" />
    </svg>
    <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <path d="M18 26C18 36 24 38 32 38C40 38 46 36 46 26H18Z" />
      <path d="M46 29C49 29 51 30 51 32C51 34 49 35 46 35" />
      <path d="M14 42C22 45 42 45 50 42" />
      <path d="M52 40L42 44" />
      <path d="M30 20C32 18 30 15 32 13" />
      <path d="M34 20C36 18 34 15 36 13" />
    </svg>
  </div>
);

const WindowIllustration = ({ color = 'currentColor' }) => (
  <svg viewBox="0 0 100 220" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full max-w-[280px] h-full max-h-[190mm] opacity-75 print:opacity-75">
    {/* Frame and grid structure */}
    <path d="M10 30 C10 5, 90 5, 90 30 L90 200 L10 200 Z" />
    {/* Double lines for frame depth */}
    <path d="M13 32 C13 9, 87 9, 87 32 L87 197 L13 197 Z" />
    
    {/* Window panes */}
    <path d="M13 70 H87" />
    <path d="M13 110 H87" />
    <path d="M13 150 H87" />
    <path d="M50 10 V197" />
    
    {/* Curtains */}
    <path d="M13 32 Q35 60, 25 110 Q15 150, 13 197" />
    <path d="M87 32 Q65 60, 75 110 Q85 150, 87 197" />
    
    {/* Hanging lamp */}
    <path d="M50 10 V45" />
    <path d="M40 45 H60 L55 53 H45 Z" />
    <circle cx="50" cy="56" r="3" fill={color} />
    
    {/* Bistro Table */}
    <path d="M25 197 L35 160 H65 L75 197" />
    <ellipse cx="50" cy="160" rx="28" ry="6" />
    
    {/* Wine glass & bottle */}
    <path d="M42 158 V146 C42 144, 44 143, 45 143 V136 H47 V143 C48 143, 50 144, 50 146 V158 Z" />
    {/* Stem glass */}
    <path d="M58 158 V152 H54 H62 M58 152 V148 C58 146, 60 146, 60 148 L60 152" />
    
    {/* Classical Chair backrest silhouette */}
    <path d="M20 197 V165 C20 165, 23 155, 28 155 C33 155, 30 165, 30 197" />
    <path d="M18 175 H32" />
  </svg>
);

// Map Category ID to a Sketch component
const getSketchForCategory = (catId, color) => {
  switch (catId) {
    case 'breakfast':
      return <CroissantSketch color={color} />;
    case 'burger-sandwich':
      return <BurgerSketch color={color} />;
    case 'starters-sauces':
      return <PretzelSketch color={color} />;
    case 'main':
      return <SteakSketch color={color} />;
    case 'salads':
      return <PretzelSketch color={color} />; // Fallback
    case 'beers':
      return <BeerSketch color={color} />;
    case 'cocktails':
      return <CocktailSketch color={color} />;
    case 'wineprosecco':
      return <WineSketch color={color} />;
    case 'coffee':
      return <CoffeeSketch color={color} />;
    default:
      return null;
  }
};

const PrintMenuPage = ({ cmsData }) => {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();

  // Sayfa gizli ise ana sayfaya yönlendir
  useEffect(() => {
    if (cmsData && cmsData?.settings?.visible_sections?.print_menu === false) {
      navigate('/');
    }
  }, [cmsData, navigate]);

  const menuData = cmsData?.menu;
  const categories = menuData?.categories || [];

  // Settings initialized from localStorage with fallback values
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('print_menu_theme') || 'paper';
  });
  const [layout, setLayout] = useState(() => {
    return localStorage.getItem('print_menu_layout') || 'booklet';
  });
  const [activeTab, setActiveTab] = useState('filters');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCover, setShowCover] = useState(() => {
    const saved = localStorage.getItem('print_menu_show_cover');
    return saved !== null ? saved === 'true' : true;
  });
  const [showSketches, setShowSketches] = useState(() => {
    const saved = localStorage.getItem('print_menu_show_sketches');
    return saved !== null ? saved === 'true' : true;
  });

  // Customizable cover and footer texts
  const [coverLogoText, setCoverLogoText] = useState(() => {
    return localStorage.getItem('print_menu_cover_logo_text') || 'PL';
  });
  const [coverTitle, setCoverTitle] = useState(() => {
    return localStorage.getItem('print_menu_cover_title') || 'PENNYLANE';
  });
  const [coverSubtitle, setCoverSubtitle] = useState(() => {
    return localStorage.getItem('print_menu_cover_subtitle') || 'GASTROPUB';
  });
  const [coverTopQuote, setCoverTopQuote] = useState(() => {
    return localStorage.getItem('print_menu_cover_top_quote') || 'ÖZGÜN GASTROPUB DENEYİMİ';
  });
  const [coverEst, setCoverEst] = useState(() => {
    return localStorage.getItem('print_menu_cover_est') || 'EST. 2023';
  });
  const [coverDesc, setCoverDesc] = useState(() => {
    return localStorage.getItem('print_menu_cover_desc') || 'İyi müzik, seçkin lezzetler ve zengin bar kütüphanesi ile.';
  });

  const [footerLeftText, setFooterLeftText] = useState(() => {
    return localStorage.getItem('print_menu_footer_left_text') || 'PENNYLANE GASTROPUB';
  });
  const [footerRightText1, setFooterRightText1] = useState(() => {
    return localStorage.getItem('print_menu_footer_right_text1') || 'FİYATLARA TÜM VERGİLER DAHİLDİR';
  });
  const [footerRightText2, setFooterRightText2] = useState(() => {
    return localStorage.getItem('print_menu_footer_right_text2') || '20 OCAK 2025 TARİHİNDEN İTİBAREN GEÇERLİDİR.';
  });

  const [logoImage, setLogoImage] = useState(() => {
    return localStorage.getItem('print_menu_logo_image') || null;
  });

  const pageRefs = useRef({});
  const [placedImages, setPlacedImages] = useState(() => {
    try {
      const saved = localStorage.getItem('print_menu_placed_images');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [targetPageNum, setTargetPageNum] = useState(1);

  // Automatically update placed images in localStorage
  useEffect(() => {
    localStorage.setItem('print_menu_placed_images', JSON.stringify(placedImages));
  }, [placedImages]);

  // Adjust targetPageNum based on layout/cover settings
  useEffect(() => {
    if (layout === 'placemat') {
      setTargetPageNum(1);
    } else if (layout === 'booklet' && !showCover && targetPageNum === 1) {
      setTargetPageNum(2);
    }
  }, [layout, showCover]);

  // Dragging event handler for placed images
  const handleImageMouseDown = (e, imgId, pageNum) => {
    e.preventDefault();
    const sheetElement = pageRefs.current[pageNum];
    if (!sheetElement) return;

    const rect = sheetElement.getBoundingClientRect();
    const imgElement = e.currentTarget;
    const imgRect = imgElement.getBoundingClientRect();
    
    const offsetX = e.clientX - imgRect.left;
    const offsetY = e.clientY - imgRect.top;
    
    setSelectedImageId(imgId);

    const handleMouseMove = (moveEvent) => {
      let newLeftPx = moveEvent.clientX - rect.left - offsetX;
      let newTopPx = moveEvent.clientY - rect.top - offsetY;
      
      let leftPercent = (newLeftPx / rect.width) * 100;
      let topPercent = (newTopPx / rect.height) * 100;
      
      const imgWidthPercent = (imgRect.width / rect.width) * 100;
      const imgHeightPercent = (imgRect.height / rect.height) * 100;
      
      leftPercent = Math.max(0, Math.min(100 - imgWidthPercent, leftPercent));
      topPercent = Math.max(0, Math.min(100 - imgHeightPercent, topPercent));
      
      setPlacedImages(prev => prev.map(img => 
        img.id === imgId ? { ...img, x: leftPercent, y: topPercent } : img
      ));
    };
    
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const itemsWithImages = useMemo(() => {
    const list = [];
    const seen = new Set();
    categories.forEach(cat => {
      (cat.items || []).forEach(item => {
        if (item.image_url && !seen.has(item.image_url)) {
          seen.add(item.image_url);
          list.push(item);
        }
      });
    });
    return list;
  }, [categories]);

  const getImageStyle = (img) => {
    let style = {};
    let classes = "w-full h-auto object-cover";
    
    // Shape
    if (img.shape === 'circle') {
      classes += " rounded-full aspect-square";
    } else if (img.shape === 'rounded') {
      classes += " rounded-xl";
    } else {
      classes += " rounded-none";
    }
    
    // Filter
    if (img.filter === 'grayscale') {
      style.filter = 'grayscale(100%) brightness(0.9) contrast(1.1)';
    } else if (img.filter === 'sepia') {
      style.filter = 'sepia(80%) contrast(1.1) brightness(0.95)';
    }
    
    // Blend Mode
    if (img.blendMode === 'multiply') {
      style.mixBlendMode = 'multiply';
    }
    
    return { style, classes };
  };

  const getFrameClasses = (img) => {
    let classes = "";
    let paddingStyle = {};
    
    const borderColorClass = theme === 'paper' ? 'border-[#8c6a2b]' : 'border-[#c9a861]';
    
    if (img.frame === 'thin') {
      classes += ` border ${borderColorClass}/60`;
    } else if (img.frame === 'double') {
      classes += ` border-4 border-double ${borderColorClass}/85`;
      paddingStyle.padding = '3px';
    }
    
    if (img.shape === 'circle') {
      classes += " rounded-full";
    } else if (img.shape === 'rounded') {
      classes += " rounded-xl";
    }
    
    return { classes, paddingStyle };
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Automatically update defaults on language change if they match the previous defaults
  useEffect(() => {
    if (lang === 'en') {
      if (coverTopQuote === 'ÖZGÜN GASTROPUB DENEYİMİ') setCoverTopQuote('THE ULTIMATE GASTROPUB EXPERIENCE');
      if (coverDesc === 'İyi müzik, seçkin lezzetler ve zengin bar kütüphanesi ile.') setCoverDesc('With good music, curated tastes, and an extensive bar library.');
    } else {
      if (coverTopQuote === 'THE ULTIMATE GASTROPUB EXPERIENCE') setCoverTopQuote('ÖZGÜN GASTROPUB DENEYİMİ');
      if (coverDesc === 'With good music, curated tastes, and an extensive bar library.') setCoverDesc('İyi müzik, seçkin lezzetler ve zengin bar kütüphanesi ile.');
    }
  }, [lang]);

  // Save settings to localStorage on change
  useEffect(() => {
    localStorage.setItem('print_menu_theme', theme);
    localStorage.setItem('print_menu_layout', layout);
    localStorage.setItem('print_menu_show_cover', String(showCover));
    localStorage.setItem('print_menu_show_sketches', String(showSketches));
    localStorage.setItem('print_menu_cover_logo_text', coverLogoText);
    localStorage.setItem('print_menu_cover_title', coverTitle);
    localStorage.setItem('print_menu_cover_subtitle', coverSubtitle);
    localStorage.setItem('print_menu_cover_top_quote', coverTopQuote);
    localStorage.setItem('print_menu_cover_est', coverEst);
    localStorage.setItem('print_menu_cover_desc', coverDesc);
    localStorage.setItem('print_menu_footer_left_text', footerLeftText);
    localStorage.setItem('print_menu_footer_right_text1', footerRightText1);
    localStorage.setItem('print_menu_footer_right_text2', footerRightText2);
    if (logoImage) {
      localStorage.setItem('print_menu_logo_image', logoImage);
    } else {
      localStorage.removeItem('print_menu_logo_image');
    }
  }, [
    theme, layout, showCover, showSketches, 
    coverLogoText, coverTitle, coverSubtitle, coverTopQuote, coverEst, coverDesc,
    footerLeftText, footerRightText1, footerRightText2, logoImage
  ]);
  
  // Expanded states for accordion in Sidebar (starts empty, meaning all closed by default)
  const [expandedCategories, setExpandedCategories] = useState({});

  // Product Selection State
  const [selectedItems, setSelectedItems] = useState(() => {
    const saved = localStorage.getItem('print_menu_selected_items');
    return saved ? JSON.parse(saved) : {};
  });

  // Drag and drop states for items and categories
  const [customOrder, setCustomOrder] = useState(() => {
    const saved = localStorage.getItem('print_menu_custom_order');
    return saved ? JSON.parse(saved) : {};
  });
  const [draggedItem, setDraggedItem] = useState(null); // { catId, itemId }
  const [customCategoryOrder, setCustomCategoryOrder] = useState(() => {
    const saved = localStorage.getItem('print_menu_custom_category_order');
    return saved ? JSON.parse(saved) : [];
  });
  const [draggedCategory, setDraggedCategory] = useState(null); // catId
  const [categoryDragActive, setCategoryDragActive] = useState(null); // catId hovering handle
  const [productDragActive, setProductDragActive] = useState(null); // itemId hovering handle

  // Save selection/sorting lists to localStorage on change
  useEffect(() => {
    if (Object.keys(selectedItems).length > 0) {
      localStorage.setItem('print_menu_selected_items', JSON.stringify(selectedItems));
    }
  }, [selectedItems]);

  useEffect(() => {
    if (Object.keys(customOrder).length > 0) {
      localStorage.setItem('print_menu_custom_order', JSON.stringify(customOrder));
    }
  }, [customOrder]);

  useEffect(() => {
    if (customCategoryOrder.length > 0) {
      localStorage.setItem('print_menu_custom_category_order', JSON.stringify(customCategoryOrder));
    }
  }, [customCategoryOrder]);

  // Initialize customOrder from categories data
  useEffect(() => {
    if (categories.length > 0 && Object.keys(customOrder).length === 0) {
      const initialOrder = {};
      categories.forEach(c => {
        initialOrder[c.id] = c.items.map(item => item.id);
      });
      setCustomOrder(initialOrder);
    }
  }, [categories]);

  // Initialize customCategoryOrder from categories data
  useEffect(() => {
    if (categories.length > 0 && customCategoryOrder.length === 0) {
      setCustomCategoryOrder(categories.map(c => c.id));
    }
  }, [categories]);

  // Drag and drop event handlers for items
  const handleDragStart = (e, catId, itemId) => {
    setDraggedItem({ catId, itemId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetCatId, targetItemId) => {
    e.preventDefault();
    if (!draggedItem) return;
    if (draggedItem.catId !== targetCatId) return; // only allow sorting within the same category
    if (draggedItem.itemId === targetItemId) return;

    const catOrder = [...(customOrder[targetCatId] || [])];
    const draggedIdx = catOrder.indexOf(draggedItem.itemId);
    const targetIdx = catOrder.indexOf(targetItemId);

    if (draggedIdx === -1 || targetIdx === -1) return;

    // Reorder in master array
    catOrder.splice(draggedIdx, 1);
    catOrder.splice(targetIdx, 0, draggedItem.itemId);

    setCustomOrder(prev => ({
      ...prev,
      [targetCatId]: catOrder
    }));
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // Drag and drop event handlers for categories
  const handleCategoryDragStart = (e, catId) => {
    setDraggedCategory(catId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCategoryDragOver = (e, targetCatId) => {
    e.preventDefault();
    if (!draggedCategory) return;
    if (draggedCategory === targetCatId) return;

    const newOrder = [...customCategoryOrder];
    const draggedIdx = newOrder.indexOf(draggedCategory);
    const targetIdx = newOrder.indexOf(targetCatId);

    if (draggedIdx === -1 || targetIdx === -1) return;

    // Reorder in master array
    newOrder.splice(draggedIdx, 1);
    newOrder.splice(targetIdx, 0, draggedCategory);

    setCustomCategoryOrder(newOrder);
  };

  const handleCategoryDragEnd = () => {
    setDraggedCategory(null);
  };



  // Default Curation Logic (Recommended selection)
  const getRecommendedState = () => {
    const initialState = {};
    categories.forEach(c => {
      const isFoodOrSoft = [
        'breakfast', 'burger-sandwich', 'starters-sauces', 
        'desserts', 'main', 'salads', 'mini-tuzlu', 
        'soft-drinks', 'coffee', 'coffee-beans', 'mocktail-cocktails'
      ].includes(c.id);

      c.items.forEach(item => {
        let checked = false;

        if (isFoodOrSoft) {
          checked = true;
        } else if (c.id === 'cider') {
          checked = true;
        } else if (c.id === 'beers') {
          if (item.subcategory === 'draft-beers') {
            checked = true;
          } else {
            const name = (item.name?.tr || '').toUpperCase();
            if (
              name.includes('CORONA') || 
              name.includes('HEINEKEN') || 
              name.includes('BUDWEISER') || 
              name.includes('EFES') || 
              name.includes('TUBORG') || 
              name.includes('ERDINGER') || 
              name.includes('BLANC 33')
            ) {
              checked = true;
            }
          }
        } else if (c.id === 'cocktails') {
          if (item.subcategory === 'signature') {
            checked = true;
          } else {
            const name = (item.name?.tr || '').toUpperCase();
            if (
              name.includes('APEROL') || 
              name.includes('NEGRONI') || 
              name.includes('SOUR') || 
              name.includes('MARTINI') || 
              name.includes('MARGARITA') || 
              name.includes('COSMOPOLITAN') || 
              name.includes('MOJITO') || 
              name.includes('MAI TAI')
            ) {
              checked = true;
            }
          }
        } else if (c.id === 'wineprosecco') {
          if (item.subcategory === 'glass-of-wine') {
            checked = true;
          } else {
            const name = (item.name?.tr || '').toUpperCase();
            if (
              name.includes('PROSECCO') || 
              name.includes('KABATEPE') || 
              name.includes('BOĞAZKERE') || 
              name.includes('SAUVIGNON BLANC') || 
              name.includes('PINOT GRIGIO') || 
              name.includes('CHATEAU')
            ) {
              checked = true;
            }
          }
        } else if (c.id === 'whisky') {
          const name = (item.name?.tr || '').toUpperCase();
          if (
            name.includes('CHIVAS 12') || 
            name.includes('BLACK LABEL') || 
            name.includes('JAMESON 5 CL') || 
            name.includes('JACK DANIEL\'S NO:7') || 
            name.includes('GLENFIDDICH 12') || 
            name.includes('TALISKER 10') || 
            name.includes('LAGAVULIN') || 
            name.includes('WOODFORD') ||
            name.includes('HIBIKI')
          ) {
            checked = true;
          }
        } else if (c.id === 'tequila-mezcal') {
          const name = (item.name?.tr || '').toUpperCase();
          if (
            name.includes('CASAMIGOS') || 
            name.includes('DEL MAGUEY') || 
            name.includes('PATRON') || 
            name.includes('CENOTE BLANCO') || 
            name.includes('OLMECA')
          ) {
            checked = true;
          }
        } else if (c.id === 'spirits') {
          const name = (item.name?.tr || '').toUpperCase();
          const isShot = item.subcategory === 'shots' || item.subcategory === 'gin' || item.subcategory === 'vodka' || item.subcategory === 'liqueur' || item.subcategory === 'rum-cognac-cachaca';
          
          if (isShot && !name.includes('10 CL')) {
            if (
              name.includes('BEEFEATER') || 
              name.includes('BOMBAY SAPPHIRE') || 
              name.includes('HENDRICK') || 
              name.includes('ABSOLUT') || 
              name.includes('GREY GOOSE') || 
              name.includes('BELVEDERE') || 
              name.includes('BACARDI') || 
              name.includes('CAPTAIN MORGAN') || 
              name.includes('JÄGERMEISTER') || 
              name.includes('HENNESSY') || 
              name.includes('CAMPARI') || 
              name.includes('APEROL') || 
              name.includes('MARTINI BIANCO') || 
              name.includes('MARTINI ROSSO')
            ) {
              checked = true;
            }
          }
        }

        initialState[item.id] = checked;
      });
    });
    return initialState;
  };

  const handleResetSettings = () => {
    if (window.confirm(lang === 'tr' ? 'Tüm özelleştirmeleri, sıralamaları ve metinleri varsayılana sıfırlamak istediğinize emin misiniz?' : 'Are you sure you want to reset all customizations, orderings, and texts to default?')) {
      const keysToRemove = [
        'print_menu_theme',
        'print_menu_layout',
        'print_menu_show_cover',
        'print_menu_show_sketches',
        'print_menu_cover_logo_text',
        'print_menu_cover_title',
        'print_menu_cover_subtitle',
        'print_menu_cover_top_quote',
        'print_menu_cover_est',
        'print_menu_cover_desc',
        'print_menu_footer_left_text',
        'print_menu_footer_right_text1',
        'print_menu_footer_right_text2',
        'print_menu_logo_image',
        'print_menu_selected_items',
        'print_menu_custom_order',
        'print_menu_custom_category_order',
        'print_menu_placed_images'
      ];
      keysToRemove.forEach(k => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  useEffect(() => {
    if (categories.length > 0 && Object.keys(selectedItems).length === 0) {
      setSelectedItems(getRecommendedState());
    }
  }, [categories]);

  useEffect(() => {
    if (categories.length > 0 && Object.keys(expandedCategories).length === 0) {
      const initialExpanded = {};
      categories.forEach(c => {
        initialExpanded[c.id] = false;
      });
      setExpandedCategories(initialExpanded);
    }
  }, [categories]);

  const selectedCount = useMemo(() => {
    return Object.values(selectedItems).filter(Boolean).length;
  }, [selectedItems]);

  const toggleItem = (itemId) => {
    setSelectedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const toggleCategoryAll = (catId, checked) => {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return;
    
    const updated = { ...selectedItems };
    cat.items.forEach(item => {
      updated[item.id] = checked;
    });
    setSelectedItems(updated);
  };

  const handleSelectRecommended = () => {
    const message = lang === 'tr' 
      ? 'Menü sistem tarafından önerilen ilk haline döndürülecektir. Devam etmek istiyor musunuz?' 
      : 'The menu will be returned to its initial recommended state. Do you want to continue?';
    if (window.confirm(message)) {
      setSelectedItems(getRecommendedState());
    }
  };

  const handleSelectAll = () => {
    const updated = {};
    categories.forEach(c => {
      c.items.forEach(item => {
        updated[item.id] = true;
      });
    });
    setSelectedItems(updated);
  };

  const handleClearAll = () => {
    const updated = {};
    categories.forEach(c => {
      c.items.forEach(item => {
        updated[item.id] = false;
      });
    });
    setSelectedItems(updated);
  };

  const toggleCategoryExpand = (catId) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const menuUrl = useMemo(() => {
    return `${window.location.origin}/menu`;
  }, []);

  // Filter and process category data
  const processedCategories = useMemo(() => {
    // 1. Process items in each category
    const processed = categories.map(c => {
      const activeItems = c.items.filter(item => selectedItems[item.id]);
      
      // Sort based on customOrder if it exists
      const catOrder = customOrder[c.id];
      if (catOrder) {
        activeItems.sort((a, b) => {
          const indexA = catOrder.indexOf(a.id);
          const indexB = catOrder.indexOf(b.id);
          const posA = indexA === -1 ? 9999 : indexA;
          const posB = indexB === -1 ? 9999 : indexB;
          return posA - posB;
        });
      }
      
      const itemsBySubcat = {};
      const subcatsList = c.subcategories || [];
      subcatsList.forEach(sub => {
        itemsBySubcat[sub.id] = [];
      });
      itemsBySubcat['none'] = [];

      activeItems.forEach(item => {
        const sub = item.subcategory || 'none';
        if (!itemsBySubcat[sub]) {
          itemsBySubcat[sub] = [];
        }
        itemsBySubcat[sub].push(item);
      });

      return {
        ...c,
        activeItems,
        itemsBySubcat,
        hasContent: activeItems.length > 0
      };
    });

    // 2. Filter categories that have content
    const withContent = processed.filter(c => c.hasContent);

    // 3. Sort categories based on customCategoryOrder
    if (customCategoryOrder.length > 0) {
      withContent.sort((a, b) => {
        const indexA = customCategoryOrder.indexOf(a.id);
        const indexB = customCategoryOrder.indexOf(b.id);
        const posA = indexA === -1 ? 9999 : indexA;
        const posB = indexB === -1 ? 9999 : indexB;
        return posA - posB;
      });
    }

    return withContent;
  }, [categories, selectedItems, customOrder, customCategoryOrder]);

  // ── PAGINATION ALGORITHM FOR A4 BOOKLET ──
  // Distributes selected categories across exactly 3 content pages.
  const paginatedBookletData = useMemo(() => {
    if (layout !== 'booklet') return [];

    const foodCatIds = ['breakfast', 'burger-sandwich', 'starters-sauces', 'main', 'salads', 'mini-tuzlu'];
    const barCatIds = ['beers', 'cocktails', 'wineprosecco', 'whisky', 'tequila-mezcal', 'cider', 'spirits'];
    const softDessertCatIds = ['coffee', 'coffee-beans', 'desserts', 'soft-drinks', 'mocktail-cocktails'];

    const page2Cats = processedCategories.filter(c => foodCatIds.includes(c.id));
    const page3Cats = processedCategories.filter(c => barCatIds.includes(c.id));
    const page4Cats = processedCategories.filter(c => softDessertCatIds.includes(c.id));

    return [
      { pageNum: 2, name: lang === 'tr' ? 'MUTFAK' : 'KITCHEN', categories: page2Cats },
      { pageNum: 3, name: lang === 'tr' ? 'BAR' : 'BAR SELECTION', categories: page3Cats },
      { pageNum: 4, name: lang === 'tr' ? 'KAPANIŞ' : 'SWEETS & COFFEES', categories: page4Cats }
    ];
  }, [processedCategories, layout, lang]);

  // ── EDITORIAL LAYOUT PAGINATION ──
  // "Yeni Tasarım" menüsü için 2 sütunlu akış mantığı (The Date PDF stili)
  const paginatedEditorialData = useMemo(() => {
    if (layout !== 'editorial') return [];
    
    // Matched categories lists to group cleanly
    const matchedIds = [
      'breakfast', 'burger-sandwich', 'starters-sauces',
      'main', 'salads', 'mini-tuzlu',
      'beers', 'cider', 'cocktails',
      'wineprosecco', 'whisky', 'tequila-mezcal', 'spirits',
      'coffee', 'coffee-beans', 'desserts', 'soft-drinks', 'mocktail-cocktails'
    ];
    // Collect leftovers
    const leftovers = processedCategories.filter(c => !matchedIds.includes(c.id));
    
    const pageGroups = [
      {
        id: 'food1',
        name: lang === 'tr' ? 'BAŞLANGIÇ & LEZZETLER' : 'STARTERS & SAVORIES',
        categories: processedCategories.filter(c => ['breakfast', 'burger-sandwich', 'starters-sauces'].includes(c.id)),
        leftCatIds: ['breakfast', 'starters-sauces'],
        rightCatIds: ['burger-sandwich'],
        rightSketch: 'burger'
      },
      {
        id: 'food2',
        name: lang === 'tr' ? 'ANA YEMEKLER & SALATALAR' : 'MAINS & SALADS',
        categories: processedCategories.filter(c => ['main', 'salads', 'mini-tuzlu'].includes(c.id) || leftovers.map(l => l.id).includes(c.id)),
        leftCatIds: ['main', ...leftovers.map(l => l.id)],
        rightCatIds: ['salads', 'mini-tuzlu'],
        rightSketch: 'steak'
      },
      {
        id: 'bar1',
        name: lang === 'tr' ? 'BİRA & KOKTEYL KÜTÜPHANESİ' : 'BEER & COCKTAIL LIBRARY',
        categories: processedCategories.filter(c => ['beers', 'cider', 'cocktails'].includes(c.id)),
        leftCatIds: ['beers', 'cider'],
        rightCatIds: ['cocktails'],
        rightSketch: 'cocktail'
      },
      {
        id: 'bar2',
        name: lang === 'tr' ? 'MAHSEN & YÜKSEK ALKOLLÜLER' : 'CELLAR & SPIRITS',
        categories: processedCategories.filter(c => ['wineprosecco', 'whisky', 'tequila-mezcal', 'spirits'].includes(c.id)),
        leftCatIds: ['wineprosecco'],
        rightCatIds: ['whisky', 'tequila-mezcal', 'spirits'],
        rightSketch: 'wine'
      },
      {
        id: 'drinks_sweets',
        name: lang === 'tr' ? 'SOĞUK & SICAK İÇECEKLER' : 'COLD & HOT DRINKS',
        categories: processedCategories.filter(c => ['coffee', 'coffee-beans', 'desserts', 'soft-drinks', 'mocktail-cocktails'].includes(c.id)),
        leftCatIds: ['soft-drinks', 'coffee', 'coffee-beans', 'desserts', 'mocktail-cocktails'],
        rightCatIds: [],
        isLastPage: true
      }
    ];

    let pageNum = 2;
    const finalPages = [];
    pageGroups.forEach(group => {
      if (group.categories.length > 0) {
        const leftCats = group.categories.filter(c => group.leftCatIds.includes(c.id));
        const rightCats = group.categories.filter(c => group.rightCatIds.includes(c.id));
        finalPages.push({
          ...group,
          pageNum,
          leftCats,
          rightCats
        });
        pageNum++;
      }
    });

    return finalPages;
  }, [processedCategories, layout, lang]);

  // ── PAGE CAPACITY WARNINGS ──
  // Computes approximate fill % for each content page so the sidebar can warn the user.
  const pageCapacityInfo = useMemo(() => {
    const COST_CAT_HEADER = 3.2;
    const COST_SUBCAT_LABEL = 2.0;
    const COST_ITEM = 1.45;
    const COST_ITEM_WITH_DESC = 2.2;
    const MAX_COL_COST = 28;

    const calcGroupCost = (cats) => {
      let leftCost = 0;
      let rightCost = 0;
      let isLeft = true;
      for (const cat of cats) {
        let cost = COST_CAT_HEADER;
        const allSubs = cat.subcategories && cat.subcategories.length > 0
          ? cat.subcategories : [{ id: 'none' }];
        for (const sub of allSubs) {
          const items = cat.itemsBySubcat[sub.id] || [];
          if (items.length === 0) continue;
          if (sub.id !== 'none') cost += COST_SUBCAT_LABEL;
          for (const item of items) {
            cost += item.description?.[lang] ? COST_ITEM_WITH_DESC : COST_ITEM;
          }
        }
        if (isLeft) { leftCost += cost; } else { rightCost += cost; }
        isLeft = !isLeft;
      }
      const maxCol = Math.max(leftCost, rightCost);
      const pct = Math.round((maxCol / MAX_COL_COST) * 100);
      return { cost: maxCol, pct, overflows: maxCol > MAX_COL_COST };
    };

    const foodCatIds = ['breakfast', 'burger-sandwich', 'starters-sauces', 'main', 'salads', 'mini-tuzlu'];
    const barCatIds = ['beers', 'cocktails', 'wineprosecco', 'whisky', 'tequila-mezcal', 'cider', 'spirits'];
    const softDessertCatIds = ['coffee', 'coffee-beans', 'desserts', 'soft-drinks', 'mocktail-cocktails'];

    return {
      kitchen: calcGroupCost(processedCategories.filter(c => foodCatIds.includes(c.id))),
      bar:     calcGroupCost(processedCategories.filter(c => barCatIds.includes(c.id))),
      sweets:  calcGroupCost(processedCategories.filter(c => softDessertCatIds.includes(c.id))),
    };
  }, [processedCategories, lang]);

  if (!cmsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark text-secondary">
        <RefreshCw className="w-12 h-12 animate-spin mb-4" />
        <h2 className="text-xl font-bold uppercase tracking-wider">Menü Verileri Yükleniyor...</h2>
      </div>
    );
  }

  const isPaper = theme === 'paper';
  
  // Theme colors
  const themeStyles = {
    containerBg: isPaper ? 'bg-[#f4efe4]' : 'bg-[#15181a]',
    pageBg: isPaper ? 'bg-[#faf6ee]' : 'bg-[#1c2022]',
    border: isPaper ? 'border-[#8c6a2b]/35' : 'border-[#c9a861]/35',
    titleColor: isPaper ? 'text-[#3d2e16]' : 'text-[#f4e4c1]',
    textColor: isPaper ? 'text-[#2c241b]' : 'text-[#e5e0d8]',
    accentColor: isPaper ? 'text-[#8c6a2b]' : 'text-[#c9a861]',
    sketchColor: isPaper ? '#8c6a2b' : '#c9a861',
    divider: isPaper ? 'border-[#8c6a2b]/20' : 'border-[#c9a861]/20',
    dots: isPaper ? 'border-[#8c6a2b]/30' : 'border-[#c9a861]/30',
    priceColor: isPaper ? 'text-[#3d2e16] font-bold' : 'text-[#f4e4c1] font-bold',
    qrBg: isPaper ? 'bg-[#f3ead6]' : 'bg-[#222222]',
  };

  const currentYear = new Date().getFullYear();

  const renderCategory = (cat) => {
    const hasSubcats = cat.subcategories && cat.subcategories.length > 0;
    
    // Custom table for Beers
    if (cat.id === 'beers') {
      // Group beers by brand
      const brands = {
        'TUBORG': { name: 'TUBORG', draft33: null, draft50: null, bottle: null },
        'CARLSBERG': { name: 'CARLSBERG', draft33: null, draft50: null, bottle: null },
        'CARLSBERG LUNA': { name: 'CARLSBERG LUNA', draft33: null, draft50: null, bottle: null },
        '1664 BLANC': { name: '1664 BLANC', draft33: null, draft50: null, bottle: null },
        'GUINNESS': { name: 'GUINNESS', draft33: null, draft50: null, bottle: null },
        'WEIHENSTEPHAN': { name: 'WEIHENSTEPHAN', draft33: null, draft50: null, bottle: null }
      };

      const others = [];
      const allBeerItems = [];
      
      // Collect all items in beers category
      if (hasSubcats) {
        cat.subcategories.forEach(sub => {
          const subcatItems = cat.itemsBySubcat[sub.id] || [];
          allBeerItems.push(...subcatItems);
        });
      } else {
        allBeerItems.push(...(cat.itemsBySubcat['none'] || []));
      }

      allBeerItems.forEach(item => {
        const nameUpper = item.name[lang]?.toUpperCase() || item.name.tr?.toUpperCase() || '';
        const priceVal = item.price?.toString().replace(/\s*(TL|₺)/i, '').trim() + ' ₺';
        
        // Draft (fıçı) check
        const isDraft = item.subcategory === 'draft-beers' || nameUpper.includes('FIÇI') || nameUpper.includes('DRAFT');
        
        let matched = false;
        
        if (nameUpper.includes('TUBORG')) {
          matched = true;
          if (isDraft) {
            if (nameUpper.includes('33')) brands['TUBORG'].draft33 = priceVal;
            else if (nameUpper.includes('50')) brands['TUBORG'].draft50 = priceVal;
          } else {
            brands['TUBORG'].bottle = priceVal;
          }
        } else if (nameUpper.includes('CARLSBERG LUNA') || nameUpper.includes('LUNA')) {
          matched = true;
          if (isDraft) {
            if (nameUpper.includes('33')) brands['CARLSBERG LUNA'].draft33 = priceVal;
            else if (nameUpper.includes('50')) brands['CARLSBERG LUNA'].draft50 = priceVal;
          } else {
            brands['CARLSBERG LUNA'].bottle = priceVal;
          }
        } else if (nameUpper.includes('CARLSBERG')) {
          matched = true;
          if (isDraft) {
            if (nameUpper.includes('33')) brands['CARLSBERG'].draft33 = priceVal;
            else if (nameUpper.includes('50')) brands['CARLSBERG'].draft50 = priceVal;
          } else {
            brands['CARLSBERG'].bottle = priceVal;
          }
        } else if (nameUpper.includes('BLANC') || nameUpper.includes('1664')) {
          matched = true;
          if (isDraft) {
            if (nameUpper.includes('33')) brands['1664 BLANC'].draft33 = priceVal;
            else if (nameUpper.includes('50')) brands['1664 BLANC'].draft50 = priceVal;
          } else {
            brands['1664 BLANC'].bottle = priceVal;
          }
        } else if (nameUpper.includes('GUINNESS')) {
          matched = true;
          if (isDraft) {
            if (nameUpper.includes('25') || nameUpper.includes('HALF')) brands['GUINNESS'].draft33 = priceVal;
            else if (nameUpper.includes('50') || nameUpper.includes('PINT') || nameUpper.includes('44')) brands['GUINNESS'].draft50 = priceVal;
          } else {
            brands['GUINNESS'].bottle = priceVal;
          }
        } else if (nameUpper.includes('WEIHENSTEPHAN')) {
          matched = true;
          if (isDraft) {
            if (nameUpper.includes('33')) brands['WEIHENSTEPHAN'].draft33 = priceVal;
            else if (nameUpper.includes('50')) brands['WEIHENSTEPHAN'].draft50 = priceVal;
          } else {
            brands['WEIHENSTEPHAN'].bottle = priceVal;
          }
        }

        if (!matched) {
          others.push(item);
        }
      });

      const brandList = Object.values(brands).filter(b => b.draft33 || b.draft50 || b.bottle);

      return (
        <div className="space-y-3 avoid-break">
          {/* Table Header */}
          <div className="flex items-end justify-between pb-1.5 border-b-2 mb-2" style={{ borderColor: themeStyles.sketchColor }}>
            <h3 className={`text-[13px] font-serif font-black uppercase tracking-wider ${themeStyles.titleColor}`}>
              {t(cat.title)}
            </h3>
            
            <div className="flex items-center gap-6 text-[8px] font-sans font-bold uppercase tracking-wider">
              {/* Draft Header */}
              <div className="flex items-center gap-2">
                <span className="opacity-0 text-[10px]">|</span>
                <div className="flex flex-col items-center min-w-[80px]">
                  <span className="text-[7px] opacity-60">DRAFT</span>
                  <div className="flex gap-4 opacity-75 font-mono text-[8px]">
                    <span>33CL</span>
                    <span>50CL</span>
                  </div>
                </div>
              </div>
              
              {/* Bottle Header */}
              <div className="flex items-center gap-2">
                <span className="opacity-0 text-[10px]">|</span>
                <div className="flex flex-col items-end min-w-[40px]">
                  <span className="text-[7px] opacity-60">BOTTLE</span>
                  <span className="opacity-75 font-mono text-[8px]">33CL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-0">
            {brandList.map((brand, idx) => {
              const isLast = idx === brandList.length - 1 && others.length === 0;
              return (
                <div key={brand.name} className={`flex items-center justify-between py-1.5 border-b border-current/5 ${isLast ? 'border-b-0' : ''}`}>
                  <div className="flex flex-col">
                    <span className={`text-[10.5px] font-bold uppercase tracking-wider ${themeStyles.titleColor}`}>
                      {brand.name}
                    </span>
                    {brand.name === 'GUINNESS' && (
                      <span className="text-[7px] font-mono opacity-50">25CL / 44CL</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-6 font-mono text-[10.5px]">
                    {/* Draft Column */}
                    <div className="flex items-center gap-2">
                      <span className="opacity-30 font-sans text-[10px]">|</span>
                      <div className="flex gap-4 min-w-[80px] justify-center">
                        <span className={brand.draft33 ? themeStyles.priceColor : 'opacity-25'}>
                          {brand.draft33 ? brand.draft33 : '-'}
                        </span>
                        <span className={brand.draft50 ? themeStyles.priceColor : 'opacity-25'}>
                          {brand.draft50 ? brand.draft50 : '-'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Bottle Column */}
                    <div className="flex items-center gap-2">
                      <span className="opacity-30 font-sans text-[10px]">|</span>
                      <span className={`min-w-[40px] text-right ${brand.bottle ? themeStyles.priceColor : 'opacity-25'}`}>
                        {brand.bottle ? brand.bottle : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Other beers listed inline in the same style */}
            {others.map((item, idx) => {
              const isLast = idx === others.length - 1;
              return (
                <div key={item.id} className={`flex items-baseline justify-between py-1.5 border-b border-current/5 ${isLast ? 'border-b-0' : ''}`}>
                  <div className="flex flex-col">
                    <span className={`text-[10.5px] font-bold uppercase tracking-wider ${themeStyles.titleColor}`}>
                      {t(item.name)}
                    </span>
                    {item.description?.[lang] && (
                      <p className={`text-[8px] italic font-light opacity-65 leading-normal pr-16 ${themeStyles.textColor}`}>
                        {item.description[lang]}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10.5px]">
                    <span className="opacity-30 font-sans text-[10px]">|</span>
                    <span className={`text-[10.5px] font-bold ${themeStyles.priceColor}`}>
                      {item.price?.toString().replace(/\s*(TL|₺)/i, '').trim()} ₺
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      );
    }

    // Standard Category layout
    return (
      <div className="space-y-3 avoid-break">
        {/* Category Header */}
        <div className="border-b-2 pb-1.5 mb-2 opacity-95 text-left" style={{ borderColor: themeStyles.sketchColor }}>
          <h3 className={`text-[13px] font-serif font-black uppercase tracking-wider ${themeStyles.titleColor}`}>
            {t(cat.title)}
          </h3>
        </div>

        {/* Items list */}
        <div className="space-y-3">
          {hasSubcats ? (
            cat.subcategories.map(sub => {
              const subcatItems = cat.itemsBySubcat[sub.id] || [];
              if (subcatItems.length === 0) return null;
              return (
                <div key={sub.id} className="space-y-1.5 avoid-break">
                  <div className={`text-[8.5px] font-black uppercase tracking-[0.25em] ${themeStyles.accentColor} mb-2`}>
                    — {t(sub.title)} —
                  </div>
                  <div className="space-y-2 pl-1">
                    {subcatItems.map(item => (
                      <div key={item.id} className="flex flex-col space-y-0.5">
                        <div className="flex items-baseline justify-between w-full">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${themeStyles.titleColor}`}>
                            {t(item.name)}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0 ml-4">
                            <span className="opacity-30 font-sans text-[10px]">|</span>
                            <span className={`text-[10.5px] font-bold font-mono ${themeStyles.priceColor}`}>
                              {item.price?.toString().replace(/\s*(TL|₺)/i, '').trim()} ₺
                            </span>
                          </div>
                        </div>
                        {item.description?.[lang] && (
                          <p className={`text-[8px] italic font-light opacity-65 leading-normal pr-16 ${themeStyles.textColor}`}>
                            {item.description[lang]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="space-y-2 pl-1">
              {(cat.itemsBySubcat['none'] || []).map(item => (
                <div key={item.id} className="flex flex-col space-y-0.5">
                  <div className="flex items-baseline justify-between w-full">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${themeStyles.titleColor}`}>
                      {t(item.name)}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0 ml-4">
                      <span className="opacity-30 font-sans text-[10px]">|</span>
                      <span className={`text-[10.5px] font-bold font-mono ${themeStyles.priceColor}`}>
                        {item.price?.toString().replace(/\s*(TL|₺)/i, '').trim()} ₺
                      </span>
                    </div>
                  </div>
                  {item.description?.[lang] && (
                    <p className={`text-[8px] italic font-light opacity-65 leading-normal pr-16 ${themeStyles.textColor}`}>
                      {item.description[lang]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Horizontal Coffee cups line on last page right after Soft Drinks */}
        {cat.id === 'soft-drinks' && showSketches && (
          <div className="py-1 flex justify-start">
            <ThreeCoffeeCups color={themeStyles.sketchColor} />
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="lg:h-screen lg:overflow-hidden bg-[#0a0a0a] text-white flex flex-col lg:flex-row font-sans print-menu-container">
      
      {/* ── SIDEBAR PANEL (Hidden during Print) ── */}
      <aside className="w-full lg:w-[450px] bg-[#141414] border-b lg:border-b-0 lg:border-r border-white/10 p-6 flex flex-col h-auto lg:h-screen lg:overflow-y-auto custom-scrollbar no-print">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-secondary" />
            <h2 className="text-lg font-serif font-bold tracking-wider text-secondary uppercase">BASKI MENÜ YAZICISI</h2>
          </div>
          <button 
            onClick={() => navigate('/menu')}
            className="text-xs text-textSecondary hover:text-white transition-colors bg-white/5 border border-white/10 px-2.5 py-1 rounded"
          >
            ← Dijital Menü
          </button>
        </div>

        {/* Auto-save Badge */}
        <div className="mb-4 flex items-center space-x-1.5 text-[10px] text-green-400 font-mono tracking-wider bg-green-500/5 border border-green-500/10 px-2.5 py-1.5 rounded-lg select-none no-print">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span>{lang === 'tr' ? '✓ DEĞİŞİKLİKLER TARAYICINIZA OTOMATİK KAYDEDİLİR' : '✓ CHANGES AUTO-SAVED TO YOUR BROWSER'}</span>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button 
            onClick={() => window.print()}
            className="bg-secondary text-primary hover:bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-secondary/10 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>MENÜYÜ YAZDIR</span>
          </button>
          
          <button 
            onClick={handleSelectRecommended}
            className="bg-white/5 text-secondary border border-secondary/20 hover:bg-white/10 transition-colors py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ÖNERİLEN KÜRAT</span>
          </button>
        </div>

        {/* Selected Counter */}
        <div className="bg-[#1f1f1f] border border-white/5 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-textSecondary uppercase tracking-widest font-black">SEÇİLİ ÜRÜN ADETİ</div>
            <div className="text-xl font-black text-secondary">{selectedCount} <span className="text-xs font-light text-textSecondary">/ {categories.reduce((acc, c) => acc + c.items.length, 0)}</span></div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleSelectAll}
              className="text-[10px] bg-white/5 hover:bg-white/10 text-white font-bold px-2 py-1 rounded border border-white/10"
            >
              Tümünü Seç
            </button>
            <button 
              onClick={handleClearAll}
              className="text-[10px] bg-red-950/20 hover:bg-red-950/40 text-red-400 font-bold px-2 py-1 rounded border border-red-500/10"
            >
              Temizle
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-[#1a1a1a] rounded-lg p-1 mb-6 border border-white/5">
          <button
            onClick={() => setActiveTab('filters')}
            className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-wider rounded-md transition-colors ${
              activeTab === 'filters' ? 'bg-secondary text-primary' : 'text-textSecondary hover:text-white'
            }`}
          >
            Tasarım & Ayarlar
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-wider rounded-md transition-colors ${
              activeTab === 'categories' ? 'bg-secondary text-primary' : 'text-textSecondary hover:text-white'
            }`}
          >
            Ürün Seçimi
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-wider rounded-md transition-colors ${
              activeTab === 'images' ? 'bg-secondary text-primary' : 'text-textSecondary hover:text-white'
            }`}
          >
            Görsel Yerleştir
          </button>
        </div>

        {/* TAB 1: DESIGN & FILTERS */}
        {activeTab === 'filters' && (
          <div className="space-y-5 animate-fade-in text-xs font-light">
            
            {/* Theme */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-textSecondary block mb-3">RENK ŞABLONU (KAĞIT TEMA)</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme('paper')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                    isPaper ? 'border-secondary bg-secondary/5 text-secondary' : 'border-white/5 bg-[#1a1a1a] text-textSecondary'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#faf6ee] border border-[#8c6a2b]/30 mb-2" />
                  <span className="text-xs font-bold">Krem Kağıt</span>
                  <span className="text-[9px] opacity-50 mt-0.5">Premium Restoran</span>
                </button>

                <button
                  onClick={() => setTheme('chalkboard')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                    !isPaper ? 'border-secondary bg-secondary/5 text-secondary' : 'border-white/5 bg-[#1a1a1a] text-textSecondary'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#1c2022] border border-white/20 mb-2" />
                  <span className="text-xs font-bold">Gece Siyahı</span>
                  <span className="text-[9px] opacity-50 mt-0.5">Chalkboard / Pub</span>
                </button>
              </div>
            </div>

            {/* Layout Mode */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-textSecondary block mb-3">SAYFA DÜZENİ</label>
              <div className="space-y-2">
                <button
                  onClick={() => setLayout('booklet')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                    layout === 'booklet' ? 'border-secondary bg-secondary/5 text-secondary' : 'border-white/5 bg-[#1a1a1a] text-textSecondary'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5" />
                    <div>
                      <div className="text-xs font-bold">A4 Kitapçık (4 Sayfalı Kapaklı Şablon)</div>
                      <div className="text-[9px] opacity-60 mt-0.5">Kapaklı dikey kitapçık. Bölünme korumalı.</div>
                    </div>
                  </div>
                  {layout === 'booklet' && <Check className="w-4 h-4 text-secondary" />}
                </button>

                <button
                  onClick={() => setLayout('placemat')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                    layout === 'placemat' ? 'border-secondary bg-secondary/5 text-secondary' : 'border-white/5 bg-[#1a1a1a] text-textSecondary'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <LayoutGrid className="w-5 h-5" />
                    <div>
                      <div className="text-xs font-bold">A3 Servislik / Placemat (Yatay - 3 Sütun)</div>
                      <div className="text-[9px] opacity-60 mt-0.5">Tek bir büyük sayfada 3 sütunlu pub menüsü.</div>
                    </div>
                  </div>
                  {layout === 'placemat' && <Check className="w-4 h-4 text-secondary" />}
                </button>

                {/* ── YENİ BASKIMENU TASARIMI (Editöryal) ── */}
                <button
                  onClick={() => setLayout('editorial')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                    layout === 'editorial'
                      ? 'border-amber-400 bg-amber-400/8 text-amber-300'
                      : 'border-white/5 bg-[#1a1a1a] text-textSecondary'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Layers className="w-5 h-5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">Editöryal Baskı Menüsü</span>
                        <span className="text-[8px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">YENİ</span>
                      </div>
                      <div className="text-[9px] opacity-60 mt-0.5">Çift sütunlu, akışkan mizanpaj. The Date PDF tarzı.</div>
                    </div>
                  </div>
                  {layout === 'editorial' && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              </div>
            </div>
 
            {/* Language */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-textSecondary block mb-3">MENÜ DİLİ</label>
              <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-white/5">
                <button
                  onClick={() => setLang('tr')}
                  className={`flex-1 py-2 text-xs font-bold rounded ${
                    lang === 'tr' ? 'bg-secondary/15 text-secondary border border-secondary/20' : 'text-textSecondary'
                  }`}
                >
                  Türkçe (TR)
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`flex-1 py-2 text-xs font-bold rounded ${
                    lang === 'en' ? 'bg-secondary/15 text-secondary border border-secondary/20' : 'text-textSecondary'
                  }`}
                >
                  English (EN)
                </button>
              </div>
            </div>
 
            {/* Sketches Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl border border-white/5">
              <div>
                <span className="text-xs font-bold block">Sanatsal Çizimleri Göster</span>
                <span className="text-[9px] text-textSecondary">Kategori yanlarına suluboya/line-art eskiz ekler</span>
              </div>
              <button 
                onClick={() => setShowSketches(!showSketches)}
                className={`w-10 h-6 rounded-full p-1 transition-colors ${showSketches ? 'bg-secondary' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-primary transition-transform ${showSketches ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
 
            {/* Cover Page Toggle (Booklet & Editorial) */}
            {(layout === 'booklet' || layout === 'editorial') && (
              <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl border border-white/5">
                <div>
                  <span className="text-xs font-bold block">Premium Kapak Sayfası</span>
                  <span className="text-[9px] text-textSecondary">Kapak sayfasını (Sayfa 1) menüye ekler</span>
                </div>
                <button 
                  onClick={() => setShowCover(!showCover)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${showCover ? 'bg-secondary' : 'bg-white/10'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-primary transition-transform ${showCover ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            )}

            {/* KAPAK YAZILARI VE LOGO */}
            <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 space-y-4">
              <span className="font-bold text-secondary flex items-center space-x-1.5 uppercase text-[10px] tracking-wider mb-2">
                ✒️ KAPAK SAYFASI AYARLARI
              </span>
              
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3 items-end">
                  <div className="col-span-1">
                    <label className="text-[9px] text-textSecondary uppercase tracking-widest block mb-1">Logo Harfleri</label>
                    <input
                      type="text"
                      value={coverLogoText}
                      onChange={e => setCoverLogoText(e.target.value)}
                      className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary font-bold disabled:opacity-40"
                      maxLength={4}
                      disabled={!!logoImage}
                      placeholder="PL"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] text-textSecondary uppercase tracking-widest block mb-1">Logo Görseli (PNG/JPG)</label>
                    <div className="flex space-x-2">
                      <label className="flex-1 bg-[#141414] border border-white/10 hover:border-secondary hover:text-white transition-colors rounded-lg px-2.5 py-2 text-center text-xs text-textSecondary cursor-pointer font-bold truncate">
                        {logoImage ? 'Görsel Seçildi' : 'Görsel Yükle'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                      {logoImage && (
                        <button
                          onClick={() => setLogoImage(null)}
                          className="bg-red-950/20 hover:bg-red-950/40 text-red-400 font-bold px-2 py-2 rounded-lg border border-red-500/10 text-xs transition-colors"
                        >
                          Kaldır
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] text-textSecondary uppercase tracking-widest block mb-1">Kapak Başlığı</label>
                    <input
                      type="text"
                      value={coverTitle}
                      onChange={e => setCoverTitle(e.target.value)}
                      className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-textSecondary uppercase tracking-widest block mb-1">Alt Başlık</label>
                    <input
                      type="text"
                      value={coverSubtitle}
                      onChange={e => setCoverSubtitle(e.target.value)}
                      className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-textSecondary uppercase tracking-widest block mb-1">Kapak Üst Spot Yazı</label>
                  <input
                    type="text"
                    value={coverTopQuote}
                    onChange={e => setCoverTopQuote(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="text-[9px] text-textSecondary uppercase tracking-widest block mb-1">Yıl/Est.</label>
                    <input
                      type="text"
                      value={coverEst}
                      onChange={e => setCoverEst(e.target.value)}
                      className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] text-textSecondary uppercase tracking-widest block mb-1">Açıklama Metni</label>
                    <input
                      type="text"
                      value={coverDesc}
                      onChange={e => setCoverDesc(e.target.value)}
                      className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SAYFA ALTI (FOOTER) YAZILARI */}
            <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 space-y-4">
              <span className="font-bold text-secondary flex items-center space-x-1.5 uppercase text-[10px] tracking-wider mb-2">
                📄 SAYFA ALTI (FOOTER) AYARLARI
              </span>
              
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-textSecondary uppercase tracking-widest block mb-1">Sol Kısım Logo Metni</label>
                  <input
                    type="text"
                    value={footerLeftText}
                    onChange={e => setFooterLeftText(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-textSecondary uppercase tracking-widest block mb-1">Sağ Kısım Satır 1</label>
                  <input
                    type="text"
                    value={footerRightText1}
                    onChange={e => setFooterRightText1(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary font-bold"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-textSecondary uppercase tracking-widest block mb-1">Sağ Kısım Satır 2</label>
                  <input
                    type="text"
                    value={footerRightText2}
                    onChange={e => setFooterRightText2(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>
            </div>

            {/* Print Tips */}
            <div className="bg-[#1f1f1d] border border-[#8c6a2b]/20 rounded-xl p-4 text-xs text-[#d4cbb8] space-y-2 leading-relaxed">
              <span className="font-bold text-secondary flex items-center space-x-1.5 uppercase text-[10px] tracking-wider mb-1">
                💡 MATBAA & YAZDIRMA AYARI:
              </span>
              <p>• Sayfa kenarlıklarının sıfır olması için yazdırma menüsünde <strong>Kenar Boşluklarını (Margins) "Yok (None)"</strong> seçin.</p>
              <p>• Krem kağıt dokusu veya koyu rengin basılması için mutlaka <strong>"Arka Plan Grafikleri (Background graphics)"</strong> kutusunu işaretleyin.</p>
              <p>• A4 kitapçık yazdırırken matbaada <strong>Ön-Arka Çift Yönlü</strong> baskı tercih edebilirsiniz.</p>
            </div>

            {/* Reset Settings Button */}
            <button
              onClick={handleResetSettings}
              className="w-full bg-red-950/20 hover:bg-red-950/40 text-red-400 font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 border border-red-500/10 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-reverse" />
              <span>{lang === 'tr' ? 'TÜM AYARLARI SIFIRLA' : 'RESET ALL SETTINGS'}</span>
            </button>
          </div>
        )}

        {/* TAB 2: PRODUCT SELECTION */}
        {activeTab === 'categories' && (() => {
          // Sort categories in the sidebar by customCategoryOrder
          const sortedSidebarCategories = [...categories];
          if (customCategoryOrder.length > 0) {
            sortedSidebarCategories.sort((a, b) => {
              const indexA = customCategoryOrder.indexOf(a.id);
              const indexB = customCategoryOrder.indexOf(b.id);
              const posA = indexA === -1 ? 9999 : indexA;
              const posB = indexB === -1 ? 9999 : indexB;
              return posA - posB;
            });
          }

          return (
            <div className="space-y-4 flex-1 flex flex-col min-h-0 animate-fade-in">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-textSecondary" />
                <input
                  type="text"
                  placeholder="Ürün ismiyle ara..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-textSecondary focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                {sortedSidebarCategories.map(c => {
                  const filteredItems = c.items.filter(item => 
                    t(item.name).toLowerCase().includes(searchQuery.toLowerCase())
                  );

                  if (searchQuery && filteredItems.length === 0) return null;

                  const allChecked = c.items.every(item => selectedItems[item.id]);
                  const someChecked = c.items.some(item => selectedItems[item.id]) && !allChecked;
                  const catSelectedCount = c.items.filter(item => selectedItems[item.id]).length;
                  const isCatDragging = draggedCategory === c.id;

                  return (
                    <div 
                      key={c.id} 
                      draggable={categoryDragActive === c.id}
                      onDragStart={(e) => handleCategoryDragStart(e, c.id)}
                      onDragOver={(e) => handleCategoryDragOver(e, c.id)}
                      onDragEnd={handleCategoryDragEnd}
                      className={`bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden transition-all ${
                        isCatDragging ? 'opacity-40 bg-white/10' : ''
                      }`}
                    >
                      <div 
                        className="flex items-center justify-between p-3.5 hover:bg-white/5 transition-colors cursor-pointer select-none"
                        onClick={() => toggleCategoryExpand(c.id)}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                          
                          {/* Category Drag Handle */}
                          <div 
                            className="cursor-grab text-white/30 hover:text-secondary py-2 px-1 active:cursor-grabbing no-print"
                            onMouseEnter={() => setCategoryDragActive(c.id)}
                            onMouseLeave={() => setCategoryDragActive(null)}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCategoryAll(c.id, !allChecked);
                            }}
                            className="text-secondary hover:opacity-80 transition-opacity"
                          >
                            {allChecked ? (
                              <CheckSquare className="w-4.5 h-4.5 fill-secondary text-primary" />
                            ) : someChecked ? (
                              <div className="w-4.5 h-4.5 bg-secondary/20 border border-secondary rounded flex items-center justify-center">
                                <div className="w-2.5 h-[2px] bg-secondary" />
                              </div>
                            ) : (
                              <Square className="w-4.5 h-4.5" />
                            )}
                          </button>
                          
                          <div className="truncate">
                            <h4 className="text-xs font-serif font-black tracking-wider uppercase">{t(c.title)}</h4>
                            <span className="text-[9px] text-textSecondary font-mono">{catSelectedCount} / {c.items.length} Ürün</span>
                          </div>
                        </div>
                        <div>
                          {expandedCategories[c.id] ? <ChevronUp className="w-4 h-4 text-textSecondary" /> : <ChevronDown className="w-4 h-4 text-textSecondary" />}
                        </div>
                      </div>

                      {expandedCategories[c.id] && (
                        <div className="border-t border-white/5 bg-[#141414] divide-y divide-white/5 max-h-64 overflow-y-auto custom-scrollbar">
                          {(() => {
                            // Sort visible items in accordion by customOrder
                            const catOrder = customOrder[c.id];
                            const sortedFilteredItems = [...filteredItems];
                            if (catOrder) {
                              sortedFilteredItems.sort((a, b) => {
                                const indexA = catOrder.indexOf(a.id);
                                const indexB = catOrder.indexOf(b.id);
                                const posA = indexA === -1 ? 9999 : indexA;
                                const posB = indexB === -1 ? 9999 : indexB;
                                return posA - posB;
                              });
                            }

                            return sortedFilteredItems.map(item => {
                              const isChecked = !!selectedItems[item.id];
                              const isDragging = draggedItem?.itemId === item.id;
                              
                              return (
                                <div 
                                  key={item.id} 
                                  draggable={productDragActive === item.id}
                                  onDragStart={(e) => handleDragStart(e, c.id, item.id)}
                                  onDragOver={(e) => handleDragOver(e, c.id, item.id)}
                                  onDragEnd={handleDragEnd}
                                  className={`flex items-center justify-between px-4 py-2.5 hover:bg-white/5 cursor-pointer transition-colors select-none ${
                                    isDragging ? 'opacity-40 bg-white/10' : ''
                                  }`}
                                >
                                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                                    {/* Drag Handle */}
                                    <div 
                                      className="cursor-grab text-white/30 hover:text-secondary py-1 pr-1 active:cursor-grabbing no-print"
                                      onMouseEnter={() => setProductDragActive(item.id)}
                                      onMouseLeave={() => setProductDragActive(null)}
                                    >
                                      <GripVertical className="w-3.5 h-3.5" />
                                    </div>
                                    
                                    {/* Checkbox and Name Toggle */}
                                    <div 
                                      className="flex items-center space-x-2.5 min-w-0 flex-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleItem(item.id);
                                      }}
                                    >
                                      {isChecked ? (
                                        <CheckSquare className="w-4 h-4 text-secondary fill-secondary text-primary shrink-0" />
                                      ) : (
                                        <Square className="w-4 h-4 text-white/30 shrink-0" />
                                      )}
                                      <span className={`text-[11px] truncate ${isChecked ? 'text-white font-medium' : 'text-textSecondary font-light'}`}>
                                        {t(item.name)}
                                      </span>
                                    </div>
                                  </div>
                                <span className="text-[10px] font-mono text-secondary shrink-0 font-bold ml-2">
                                  {item.price} TL
                                </span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ); })()}

        {/* TAB 3: IMAGE PLACEMENT */}
        {activeTab === 'images' && (
          <div className="space-y-5 animate-fade-in text-xs font-light">
            <div className="bg-secondary/10 p-3.5 rounded-xl border border-secondary/20">
              <span className="font-bold text-secondary text-[10px] uppercase tracking-wider block mb-1">🖼️ GÖRSEL YERLEŞTİR (SÜRÜKLE & BIRAK)</span>
              <p className="text-[10px] text-textSecondary leading-relaxed font-light">
                {lang === 'tr' 
                  ? 'Görsel eklemek istediğiniz hedef sayfayı seçin. Ardından ürün görseli veya bilgisayarınızdan özel bir dosya ekleyin. Sayfa üzerindeki görseli fare ile dilediğiniz gibi sürükleyip konumlandırabilirsiniz.' 
                  : 'Select target page. Add product image or custom file. Drag image on page to position it.'}
              </p>
            </div>

            {/* Target Page Selection */}
            <div className="space-y-1.5">
              <label className="text-[9px] text-textSecondary uppercase tracking-widest block font-bold">1. Hedef Sayfa Seçin</label>
              <select 
                value={targetPageNum}
                onChange={(e) => setTargetPageNum(Number(e.target.value))}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2 text-white outline-none focus:border-secondary text-xs cursor-pointer"
              >
                {layout === 'booklet' ? (
                  <>
                    {showCover && <option value={1}>1. Sayfa (Kapak Sayfası)</option>}
                    <option value={2}>2. Sayfa (Mutfak)</option>
                    <option value={3}>3. Sayfa (Bar)</option>
                    <option value={4}>4. Sayfa (Tatlı & Kahve)</option>
                  </>
                ) : (
                  <option value={1}>Tek Sayfa (Servis Altlığı)</option>
                )}
              </select>
            </div>

            {/* Add Custom Image Upload */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-[9px] text-textSecondary uppercase tracking-widest block font-bold">2. Bilgisayardan Görsel Ekle</label>
              <label className="flex items-center justify-center gap-2 w-full bg-[#1a1a1a] border border-dashed border-white/20 hover:border-secondary/40 text-textSecondary hover:text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-all">
                <span>Özel Görsel Yükle</span>
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const newImg = {
                          id: `placed-${Date.now()}`,
                          pageNum: targetPageNum,
                          src: reader.result,
                          x: 35,
                          y: 35,
                          width: layout === 'placemat' ? 12 : 20,
                        };
                        setPlacedImages(prev => [...prev, newImg]);
                        setSelectedImageId(newImg.id);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            {/* Selected Image Editor Settings */}
            {selectedImageId && placedImages.find(img => img.id === selectedImageId) && (() => {
              const selectedImg = placedImages.find(img => img.id === selectedImageId);
              return (
                <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-3.5 space-y-4 pt-2">
                  <span className="font-bold text-secondary text-[9px] uppercase tracking-wider block border-b border-white/5 pb-1.5">GÖRSEL AYARLARI</span>
                  
                  {/* Size slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-textSecondary font-bold">
                      <span>GENİŞLİK (BOYUT)</span>
                      <span className="text-white font-mono">{selectedImg.width}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="80" 
                      value={selectedImg.width} 
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPlacedImages(prev => prev.map(img => 
                          img.id === selectedImageId ? { ...img, width: val } : img
                        ));
                      }}
                      className="w-full accent-secondary cursor-pointer"
                    />
                  </div>

                  {/* Shape Controls */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-textSecondary uppercase tracking-widest block font-bold">GÖRSEL ŞEKLİ</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['square', 'rounded', 'circle'].map(shapeType => (
                        <button
                          key={shapeType}
                          type="button"
                          onClick={() => {
                            setPlacedImages(prev => prev.map(img => 
                              img.id === selectedImageId ? { ...img, shape: shapeType } : img
                            ));
                          }}
                          className={`py-1 text-[9px] font-bold uppercase tracking-wider rounded border transition-colors cursor-pointer ${
                            selectedImg.shape === shapeType || (!selectedImg.shape && shapeType === 'square')
                              ? 'bg-secondary/15 text-secondary border-secondary/35'
                              : 'bg-dark/50 border-white/5 text-textSecondary hover:text-white'
                          }`}
                        >
                          {shapeType === 'square' ? 'Kare' : shapeType === 'rounded' ? 'Oval' : 'Daire'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frame Controls */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-textSecondary uppercase tracking-widest block font-bold">ÇERÇEVE STİLİ</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['none', 'thin', 'double'].map(frameType => (
                        <button
                          key={frameType}
                          type="button"
                          onClick={() => {
                            setPlacedImages(prev => prev.map(img => 
                              img.id === selectedImageId ? { ...img, frame: frameType } : img
                            ));
                          }}
                          className={`py-1 text-[9px] font-bold uppercase tracking-wider rounded border transition-colors cursor-pointer ${
                            selectedImg.frame === frameType || (!selectedImg.frame && frameType === 'none')
                              ? 'bg-secondary/15 text-secondary border-secondary/35'
                              : 'bg-dark/50 border-white/5 text-textSecondary hover:text-white'
                          }`}
                        >
                          {frameType === 'none' ? 'Yok' : frameType === 'thin' ? 'İnce' : 'Çift'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter Controls */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-textSecondary uppercase tracking-widest block font-bold">RENK FİLTRESİ</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['none', 'grayscale', 'sepia'].map(filterType => (
                        <button
                          key={filterType}
                          type="button"
                          onClick={() => {
                            setPlacedImages(prev => prev.map(img => 
                              img.id === selectedImageId ? { ...img, filter: filterType } : img
                            ));
                          }}
                          className={`py-1 text-[9px] font-bold uppercase tracking-wider rounded border transition-colors cursor-pointer ${
                            selectedImg.filter === filterType || (!selectedImg.filter && filterType === 'none')
                              ? 'bg-secondary/15 text-secondary border-secondary/35'
                              : 'bg-dark/50 border-white/5 text-textSecondary hover:text-white'
                          }`}
                        >
                          {filterType === 'none' ? 'Orijinal' : filterType === 'grayscale' ? 'S&B' : 'Sepya'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Blending Mode Controls */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-textSecondary uppercase tracking-widest block font-bold">HARMANLAMA (MULTIPLY)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['normal', 'multiply'].map(blendType => (
                        <button
                          key={blendType}
                          type="button"
                          onClick={() => {
                            setPlacedImages(prev => prev.map(img => 
                              img.id === selectedImageId ? { ...img, blendMode: blendType } : img
                            ));
                          }}
                          className={`py-1.5 text-[9px] font-bold uppercase tracking-wider rounded border transition-colors cursor-pointer ${
                            selectedImg.blendMode === blendType || (!selectedImg.blendMode && blendType === 'normal')
                              ? 'bg-secondary/15 text-secondary border-secondary/35'
                              : 'bg-dark/50 border-white/5 text-textSecondary hover:text-white'
                          }`}
                        >
                          {blendType === 'normal' ? 'Normal' : 'Kağıda Erit (Arkaplan Sil)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <button 
                      type="button"
                      onClick={() => {
                        setPlacedImages(prev => prev.filter(img => img.id !== selectedImageId));
                        setSelectedImageId(null);
                      }}
                      className="flex-1 py-2 bg-red-500/15 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 hover:border-red-500 text-[9px] font-bold rounded-lg uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Görseli Sil
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSelectedImageId(null)}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-[9px] font-bold rounded-lg uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Seçimi Kapat
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </aside>

      {/* ── PREVIEW SHEETS ── */}
      <main className="flex-1 bg-[#1d1d1d] p-4 sm:p-8 md:p-12 overflow-y-auto flex flex-col items-center space-y-12 lg:h-screen">
        
        {/* === LAYOUT A: A4 BOOKLET (MULTI-PAGE PREVIEW) === */}
        {layout === 'booklet' && (
          <div className="w-full max-w-[820px] space-y-12">
            
            {/* PAGE 1: COVER PAGE */}
            {showCover && (
              <div 
                ref={el => pageRefs.current[1] = el}
                key="cover-page"
                className={`print-sheet a4-page shadow-2xl rounded-2xl w-full aspect-[1/1.414] border ${themeStyles.containerBg} ${themeStyles.textColor} p-6 relative flex flex-col justify-between`}
                style={{ height: '297mm', maxHeight: '297mm' }}
              >
                {/* Decorative Borders */}
                <div className={`absolute inset-6 p-6 flex flex-col justify-between items-center`}>
                  <div className={`absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 ${themeStyles.border}`} />
                  <div className={`absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 ${themeStyles.border}`} />
                  <div className={`absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 ${themeStyles.border}`} />
                  <div className={`absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 ${themeStyles.border}`} />

                  {/* Top Quote */}
                  <div className={`text-[9px] uppercase tracking-[0.4em] font-bold ${themeStyles.accentColor} mt-12`}>
                    {coverTopQuote}
                  </div>

                  {/* Main Logo & Art */}
                  <div className="text-center space-y-4 flex-1 flex flex-col justify-center items-center">
                    {/* Double circles decoration */}
                    {logoImage ? (
                      <div className="w-32 h-32 flex items-center justify-center mb-6 overflow-hidden">
                        <img src={logoImage} alt="Custom Logo" className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className={`w-32 h-32 rounded-full border-2 border-double ${themeStyles.border} flex items-center justify-center mb-6`}>
                        <span className="text-3xl font-serif text-secondary font-black tracking-widest">{coverLogoText}</span>
                      </div>
                    )}
                    <h1 className={`text-5xl sm:text-6xl font-serif font-black tracking-[0.25em] ${themeStyles.titleColor}`}>
                      {coverTitle}
                    </h1>
                    <div className="flex items-center space-x-3 justify-center">
                      <div className={`w-12 h-[1px] bg-current ${themeStyles.textColor} opacity-30`} />
                      <span className={`text-[10px] font-black uppercase tracking-[0.6em] ${themeStyles.accentColor}`}>
                        {coverSubtitle}
                      </span>
                      <div className={`w-12 h-[1px] bg-current ${themeStyles.textColor} opacity-30`} />
                    </div>
                  </div>

                  {/* Bottom Year and Info */}
                  <div className="text-center space-y-2 mb-8">
                    <div className={`text-[9px] font-mono tracking-widest ${themeStyles.textColor} opacity-50`}>
                      {coverEst}
                    </div>
                    <div className={`w-4 h-[1.5px] bg-[#c9a861] mx-auto`} />
                    <p className={`text-[10px] italic font-light opacity-60 max-w-sm`}>
                      {coverDesc}
                    </p>
                  </div>
                </div>

                {/* Placed Images for Cover */}
                {placedImages.filter(img => img.pageNum === 1).map(img => {
                  const { style: imgStyle, classes: imgClasses } = getImageStyle(img);
                  const { classes: frameClasses, paddingStyle } = getFrameClasses(img);
                  return (
                    <div
                      key={img.id}
                      style={{
                        position: 'absolute',
                        left: `${img.x}%`,
                        top: `${img.y}%`,
                        width: `${img.width || 20}%`,
                        cursor: 'move',
                        zIndex: 50,
                        ...paddingStyle
                      }}
                      onMouseDown={(e) => handleImageMouseDown(e, img.id, 1)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageId(img.id);
                      }}
                      className={`group/placed relative print:ring-0 ${frameClasses} ${selectedImageId === img.id ? 'ring-2 ring-secondary' : 'hover:ring-1 hover:ring-secondary/50'}`}
                    >
                      <img src={img.src} alt="Placed Item" style={imgStyle} className={imgClasses} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlacedImages(prev => prev.filter(p => p.id !== img.id));
                          if (selectedImageId === img.id) setSelectedImageId(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-lg opacity-0 group-hover/placed:opacity-100 transition-opacity z-[60] print:hidden"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {/* CONTENT PAGES (Page 2, 3, 4) */}
            {paginatedBookletData.map((page) => (
              <div 
                ref={el => pageRefs.current[page.pageNum] = el}
                key={page.pageNum}
                className={`print-sheet a4-page shadow-2xl rounded-2xl w-full aspect-[1/1.414] border ${themeStyles.containerBg} ${themeStyles.textColor} p-6 relative flex flex-col justify-between`}
                style={{ height: '297mm', maxHeight: '297mm' }}
              >
                {/* Borders */}
                <div className={`absolute inset-6 pt-3 pb-4 px-6 flex flex-col overflow-hidden`}>
                  <div className={`absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 ${themeStyles.border}`} />
                  <div className={`absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 ${themeStyles.border}`} />
                  <div className={`absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 ${themeStyles.border}`} />
                  <div className={`absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 ${themeStyles.border}`} />

                  {/* Page header */}
                  <header className="text-center pt-1 pb-3 border-b border-dashed border-current/10 shrink-0">
                    <span className={`text-[9px] font-mono tracking-[0.4em] uppercase opacity-40 ${themeStyles.textColor}`}>
                      PENNYLANE — {page.name}
                    </span>
                  </header>

                  {/* Page content - Grid with two columns */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 items-start flex-1 min-h-0 py-2 overflow-hidden">
                    {page.categories.length === 0 ? (
                      <div className="col-span-2 text-center py-20 opacity-40 italic text-xs">
                        {lang === 'tr' ? 'Seçili ürün bulunmuyor' : 'No items selected for this page'}
                      </div>
                    ) : (
                      page.categories.map(cat => (
                        <div key={cat.id} className="space-y-3 avoid-break">
                          
                          {/* Category Header with Illustration Sketch */}
                          <div className="border-b border-current/30 pb-1.5 mb-2 flex items-center justify-between">
                            <h3 className={`text-[13px] font-serif font-black uppercase tracking-wider ${themeStyles.titleColor}`}>
                              {t(cat.title)}
                            </h3>
                            {showSketches && getSketchForCategory(cat.id, themeStyles.sketchColor) && (
                              <div className="scale-50 origin-right -my-6 h-10 w-10 flex items-center">
                                {getSketchForCategory(cat.id, themeStyles.sketchColor)}
                              </div>
                            )}
                          </div>

                          {/* Category Items */}
                          <div className="space-y-2">
                            {cat.subcategories && cat.subcategories.length > 0 ? (
                              cat.subcategories.map(sub => {
                                const subcatItems = cat.itemsBySubcat[sub.id] || [];
                                if (subcatItems.length === 0) return null;

                                return (
                                  <div key={sub.id} className="space-y-1.5 mt-2 first:mt-0 avoid-break">
                                    <h4 className={`text-[9.5px] uppercase font-black tracking-[0.2em] ${themeStyles.accentColor} mt-2.5 mb-1.5 block`}>
                                      — {t(sub.title)} —
                                    </h4>
                                    <div className="space-y-1.5">
                                      {subcatItems.map(item => (
                                        <div key={item.id} className="flex flex-col space-y-0.5">
                                          <div className="flex items-baseline justify-between w-full">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${themeStyles.titleColor}`}>
                                              {t(item.name)}
                                            </span>
                                            <div className={`flex-1 mx-1.5 border-b border-dotted ${themeStyles.dots} opacity-30`} />
                                            <span className={`text-[10px] font-mono ${themeStyles.priceColor}`}>
                                              {item.price} TL
                                            </span>
                                          </div>
                                          {item.description?.[lang] && (
                                            <p className={`text-[8.5px] italic font-light leading-normal pr-16 opacity-60`}>
                                              {item.description[lang]}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              (cat.itemsBySubcat['none'] || []).map(item => (
                                <div key={item.id} className="flex flex-col space-y-0.5">
                                  <div className="flex items-baseline justify-between w-full">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${themeStyles.titleColor}`}>
                                      {t(item.name)}
                                    </span>
                                    <div className={`flex-1 mx-1.5 border-b border-dotted ${themeStyles.dots} opacity-30`} />
                                    <span className={`text-[10px] font-mono ${themeStyles.priceColor}`}>
                                      {item.price} TL
                                    </span>
                                  </div>
                                  {item.description?.[lang] && (
                                    <p className={`text-[8.5px] italic font-light leading-normal pr-16 opacity-60`}>
                                      {item.description[lang]}
                                    </p>
                                  )}
                                </div>
                              ))
                            )}
                          </div>

                        </div>
                      ))
                    )}
                  </div>

                  {/* PAGE 4 SPECIAL: LARGE QR CODE & DISCLAIMER */}
                  {page.pageNum === 4 && (
                    <footer className={`mt-auto shrink-0 border-t border-dashed ${themeStyles.border}/50 pt-5 pb-1 flex items-center justify-between gap-6`}>
                      
                      {/* Left: Branding & Info */}
                      <div className="text-left space-y-0.5 max-w-[280px]">
                        <div className="flex items-center space-x-2 mb-1">
                          {logoImage ? (
                            <div className="w-5 h-5 flex items-center justify-center shrink-0 overflow-hidden">
                              <img src={logoImage} alt="Logo" className="max-w-full max-h-full object-contain" />
                            </div>
                          ) : (
                            <div className={`w-5 h-5 rounded-full border border-current flex items-center justify-center text-[7.5px] font-bold shrink-0 ${themeStyles.textColor}`}>
                              {coverLogoText}
                            </div>
                          )}
                          <h4 className={`text-[10px] font-serif font-black tracking-widest ${themeStyles.titleColor}`}>
                            {footerLeftText}
                          </h4>
                        </div>
                        <p className="text-[8px] font-light leading-relaxed opacity-60">
                          {lang === 'tr' 
                            ? 'Alerjisi olan misafirlerimizin sipariş vermeden önce garsonlarımıza danışmalarını önemle rica ederiz.'
                            : 'If you have any food allergies, please inform your server before placing your order.'}
                        </p>
                        <p className="text-[8px] opacity-40 font-mono">
                          {t(cmsData?.footer?.copyright) || `© ${currentYear} Pennylane. All rights reserved.`}
                        </p>
                      </div>

                      {/* Right: QR Code & Disclaimer */}
                      <div className={`flex items-center space-x-3 border ${themeStyles.border} ${themeStyles.qrBg} rounded-lg p-2 max-w-[340px]`}>
                        <div className="text-right space-y-0.5">
                          <h5 className={`text-[9.5px] font-serif font-black tracking-wider ${themeStyles.titleColor}`}>
                            {lang === 'tr' ? 'DİĞER ÜRÜNLER & ALKOLLER' : 'FULL SPIRITS LIBRARY'}
                          </h5>
                          <p className="text-[8px] font-bold leading-normal text-secondary uppercase tracking-wide">
                            {lang === 'tr' 
                              ? '600+ VİSKİ, KOKTEYL VE ALKOL ÇEŞİDİ İÇİN OKUTUN' 
                              : 'SCAN QR CODE FOR 600+ WHISKIES, COCKTAILS & SPIRITS'}
                          </p>
                          <p className="text-[7.5px] italic opacity-60">
                            {lang === 'tr' ? '* diğer ürünlerimiz için qr menüye bakınız' : '* scan for additional library items'}
                          </p>
                        </div>
                        <div className="bg-white p-1 rounded shrink-0 flex items-center justify-center shadow-md">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(menuUrl)}`}
                            alt="QR Code" 
                            className="w-11 h-11"
                          />
                        </div>
                      </div>

                    </footer>
                  )}

                  {/* Standard Page Footer for pages 2 and 3 */}
                  {page.pageNum !== 4 && (
                    <footer className="mt-auto shrink-0 border-t border-dashed border-current/10 pt-3 flex items-center justify-between text-[8px] opacity-40 font-mono">
                      <div className="flex items-center space-x-2">
                        {logoImage ? (
                          <div className="w-5 h-5 flex items-center justify-center shrink-0 overflow-hidden">
                            <img src={logoImage} alt="Logo" className="max-w-full max-h-full object-contain" />
                          </div>
                        ) : (
                          <div className={`w-4.5 h-4.5 rounded-full border border-current flex items-center justify-center text-[7px] font-bold shrink-0`}>
                            {coverLogoText}
                          </div>
                        )}
                        <span className="font-bold tracking-wider">{footerLeftText}</span>
                      </div>
                      
                      <div className="text-right flex flex-col space-y-0.5 leading-tight font-sans">
                        <span className="font-bold text-[7.5px] uppercase tracking-wide">{footerRightText1}</span>
                        {footerRightText2 && (
                          <span className="text-[7px] opacity-75 uppercase tracking-wider">{footerRightText2}</span>
                        )}
                      </div>
                    </footer>
                  )}

                </div>

                {/* Placed Images for Content Page */}
                {placedImages.filter(img => img.pageNum === page.pageNum).map(img => {
                  const { style: imgStyle, classes: imgClasses } = getImageStyle(img);
                  const { classes: frameClasses, paddingStyle } = getFrameClasses(img);
                  return (
                    <div
                      key={img.id}
                      style={{
                        position: 'absolute',
                        left: `${img.x}%`,
                        top: `${img.y}%`,
                        width: `${img.width || 20}%`,
                        cursor: 'move',
                        zIndex: 50,
                        ...paddingStyle
                      }}
                      onMouseDown={(e) => handleImageMouseDown(e, img.id, page.pageNum)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageId(img.id);
                      }}
                      className={`group/placed relative print:ring-0 ${frameClasses} ${selectedImageId === img.id ? 'ring-2 ring-secondary' : 'hover:ring-1 hover:ring-secondary/50'}`}
                    >
                      <img src={img.src} alt="Placed Item" style={imgStyle} className={imgClasses} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlacedImages(prev => prev.filter(p => p.id !== img.id));
                          if (selectedImageId === img.id) setSelectedImageId(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-lg opacity-0 group-hover/placed:opacity-100 transition-opacity z-[60] print:hidden"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}

          </div>
        )}

        {/* === LAYOUT C: EDITORIAL ("YENİ BASKIMENU") — The Date PDF Style === */}
        {layout === 'editorial' && (
          <div className="w-full max-w-[820px] space-y-12">

            {/* KAPAK SAYFASI (Sayfa 1) */}
            {showCover && (
              <div
                ref={el => pageRefs.current[1] = el}
                className={`print-sheet a4-page shadow-2xl rounded-2xl w-full border ${themeStyles.containerBg} ${themeStyles.textColor} relative overflow-hidden`}
                style={{ height: '297mm', maxHeight: '297mm', minHeight: '297mm' }}
              >
                {/* Köşe süslemeleri */}
                <div className={`absolute top-7 left-7 w-10 h-10 border-t-2 border-l-2 ${themeStyles.border}`} />
                <div className={`absolute top-7 right-7 w-10 h-10 border-t-2 border-r-2 ${themeStyles.border}`} />
                <div className={`absolute bottom-7 left-7 w-10 h-10 border-b-2 border-l-2 ${themeStyles.border}`} />
                <div className={`absolute bottom-7 right-7 w-10 h-10 border-b-2 border-r-2 ${themeStyles.border}`} />

                {/* İkinci iç çerçeve */}
                <div className={`absolute top-11 left-11 right-11 bottom-11 border ${themeStyles.border} opacity-30`} />

                <div className="absolute inset-0 flex flex-col items-center justify-between py-20 px-14">

                  {/* Üst alan */}
                  <div className="text-center space-y-3">
                    {coverTopQuote && (
                      <p className={`text-[9px] tracking-[0.5em] uppercase font-bold ${themeStyles.accentColor} opacity-70`}>
                        {coverTopQuote}
                      </p>
                    )}
                    <div className={`flex items-center gap-4 justify-center`}>
                      <div className={`flex-1 h-px ${themeStyles.border} opacity-40`} style={{borderTopWidth:'1px', borderTopStyle:'solid'}} />
                      <div className={`w-2 h-2 rotate-45 border ${themeStyles.border} opacity-60`} />
                      <div className={`flex-1 h-px ${themeStyles.border} opacity-40`} style={{borderTopWidth:'1px', borderTopStyle:'solid'}} />
                    </div>
                  </div>

                  {/* Orta alan — Logo ve Başlık */}
                  <div className="text-center space-y-6 flex-1 flex flex-col items-center justify-center">
                    {logoImage ? (
                      <img src={logoImage} alt="Logo" className="h-24 w-auto object-contain opacity-90 mx-auto" />
                    ) : (
                      <div className={`w-20 h-20 rounded-full border-2 ${themeStyles.border} flex items-center justify-center mx-auto`}>
                        <span className={`text-2xl font-black font-serif ${themeStyles.titleColor}`}>{coverLogoText}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h1 className={`text-[52px] font-serif font-black uppercase tracking-[0.18em] ${themeStyles.titleColor} leading-none`}>
                        {coverTitle}
                      </h1>
                      <div className={`flex items-center gap-3 justify-center`}>
                        <div className={`flex-1 max-w-16 h-px opacity-40`} style={{borderTop:`1px solid ${isPaper ? '#8c6a2b' : '#c9a861'}`}} />
                        <p className={`text-[13px] tracking-[0.4em] uppercase font-light ${themeStyles.accentColor}`}>
                          {coverSubtitle}
                        </p>
                        <div className={`flex-1 max-w-16 h-px opacity-40`} style={{borderTop:`1px solid ${isPaper ? '#8c6a2b' : '#c9a861'}`}} />
                      </div>
                    </div>

                    {coverEst && (
                      <p className={`text-[10px] font-mono tracking-[0.6em] uppercase opacity-50 ${themeStyles.textColor}`}>
                        {coverEst}
                      </p>
                    )}
                  </div>

                  {/* Alt alan */}
                  <div className="text-center space-y-3">
                    <div className={`flex items-center gap-4 justify-center`}>
                      <div className={`flex-1 h-px opacity-40`} style={{borderTop:`1px solid ${isPaper ? '#8c6a2b' : '#c9a861'}`}} />
                      <div className={`w-2 h-2 rotate-45 border opacity-60`} style={{borderColor: isPaper ? '#8c6a2b' : '#c9a861'}} />
                      <div className={`flex-1 h-px opacity-40`} style={{borderTop:`1px solid ${isPaper ? '#8c6a2b' : '#c9a861'}`}} />
                    </div>
                    {coverDesc && (
                      <p className={`text-[9px] tracking-[0.2em] italic font-light opacity-60 max-w-xs mx-auto ${themeStyles.textColor}`}>
                        {coverDesc}
                      </p>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* İÇERİK SAYFALARI — The Date Stili Çift Sütun Akış */}
            {paginatedEditorialData.map(({ pageNum, name, leftCats, rightCats, rightSketch, isLastPage }) => {
              return (
                <div
                  ref={el => pageRefs.current[pageNum] = el}
                  key={pageNum}
                  className={`print-sheet a4-page shadow-2xl rounded-2xl w-full border ${themeStyles.containerBg} ${themeStyles.textColor} relative overflow-hidden`}
                  style={{ height: '297mm', maxHeight: '297mm', minHeight: '297mm' }}
                >
                  {/* Köşe ornaments */}
                  <div className={`absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 ${themeStyles.border}`} />
                  <div className={`absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 ${themeStyles.border}`} />
                  <div className={`absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 ${themeStyles.border}`} />
                  <div className={`absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 ${themeStyles.border}`} />

                  <div className="absolute inset-10 flex flex-col justify-between">

                    {/* Running header */}
                    <div className={`flex items-center justify-between pb-2 mb-4 border-b ${themeStyles.border} shrink-0 opacity-50`}>
                      <span className={`text-[7.5px] tracking-[0.4em] uppercase font-bold ${themeStyles.accentColor}`}>
                        PENNYLANE GASTROPUB
                      </span>
                      <span className={`text-[7.5px] tracking-[0.4em] uppercase font-bold ${themeStyles.accentColor}`}>
                        {lang === 'tr' ? 'MENÜ' : 'MENU'} — {pageNum - (showCover ? 1 : 0)}
                      </span>
                    </div>

                    {/* 2-Column Content Grid */}
                    <div className="grid grid-cols-2 gap-8 items-stretch flex-1 min-h-0 py-2 overflow-hidden text-left">
                      
                      {/* Left Column */}
                      <div className="flex flex-col justify-start space-y-6 overflow-hidden pr-2">
                        {leftCats.map(cat => (
                          <div key={cat.id}>
                            {renderCategory(cat)}
                          </div>
                        ))}
                      </div>

                      {/* Right Column */}
                      <div className="flex flex-col justify-start overflow-hidden pl-2">
                        {isLastPage ? (
                          <div className="flex items-center justify-center h-full w-full py-4">
                            <WindowIllustration color={themeStyles.sketchColor} />
                          </div>
                        ) : (
                          <>
                            <div className="flex-1 space-y-6">
                              {rightCats.map(cat => (
                                <div key={cat.id}>
                                  {renderCategory(cat)}
                                </div>
                              ))}
                            </div>

                            {/* Corner or bottom sketch in right column */}
                            {rightSketch && showSketches && (
                              <div className="flex justify-center mt-6 opacity-40 shrink-0 select-none pb-4">
                                <div className="w-20 h-20">
                                  {rightSketch === 'burger' && <BurgerSketch color={themeStyles.sketchColor} />}
                                  {rightSketch === 'steak' && <SteakSketch color={themeStyles.sketchColor} />}
                                  {rightSketch === 'cocktail' && <CocktailSketch color={themeStyles.sketchColor} />}
                                  {rightSketch === 'wine' && <WineSketch color={themeStyles.sketchColor} />}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                    </div>

                    {/* Page Footer */}
                    {isLastPage ? (
                      <div className={`shrink-0 mt-3 pt-3 border-t ${themeStyles.border} flex items-center justify-between gap-4`}>
                        <div className="space-y-0.5">
                          <p className={`text-[7.5px] opacity-40 font-mono tracking-wider uppercase mb-1 ${themeStyles.textColor}`}>
                            Fiyatlar 02.01.2026 tarihinde düzenlenmiştir.
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className={`text-[12px] font-serif font-black tracking-widest ${themeStyles.titleColor}`}>
                              PENNYLANE
                            </span>
                            <span className={`text-[7.5px] tracking-wider uppercase font-bold opacity-60 ${themeStyles.accentColor}`}>
                              GASTRO & PUB
                            </span>
                          </div>
                          <p className="text-[6.5px] opacity-35 font-mono">
                            {t(cmsData?.footer?.copyright) || `© ${currentYear} Pennylane. All rights reserved.`}
                          </p>
                        </div>
                        <div className={`flex items-center gap-2 border ${themeStyles.border} ${themeStyles.qrBg} rounded-lg p-1.5 shrink-0`}>
                          <div className="text-right space-y-0.5">
                            <p className={`text-[8px] font-black tracking-wide ${themeStyles.accentColor} uppercase`}>
                              {lang === 'tr' ? 'DİJİTAL MENÜ' : 'DIGITAL MENU'}
                            </p>
                            <p className="text-[7px] opacity-55">
                              {lang === 'tr' ? 'Tüm ürünler için QR okutun' : 'Scan for full menu'}
                            </p>
                          </div>
                          <div className="bg-white p-1 rounded shrink-0 shadow-sm">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=52x52&data=${encodeURIComponent(menuUrl)}`}
                              alt="QR Code"
                              className="w-10 h-10"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`shrink-0 mt-2 pt-2 border-t ${themeStyles.border} opacity-40 flex items-center justify-between text-[7px] font-mono uppercase tracking-wider`}>
                        <span>{footerLeftText}</span>
                        <span>{footerRightText1}</span>
                      </div>
                    )}

                  </div>

                  {/* Yerleştirilen görseller */}
                  {placedImages.filter(img => img.pageNum === pageNum).map(img => {
                    const { style: imgStyle, classes: imgClasses } = getImageStyle(img);
                    const { classes: frameClasses, paddingStyle } = getFrameClasses(img);
                    return (
                      <div
                        key={img.id}
                        style={{ position: 'absolute', left: `${img.x}%`, top: `${img.y}%`, width: `${img.width || 20}%`, cursor: 'move', zIndex: 50, ...paddingStyle }}
                        onMouseDown={(e) => handleImageMouseDown(e, img.id, pageNum)}
                        onClick={(e) => { e.stopPropagation(); setSelectedImageId(img.id); }}
                        className={`group/placed relative print:ring-0 ${frameClasses} ${selectedImageId === img.id ? 'ring-2 ring-secondary' : 'hover:ring-1 hover:ring-secondary/50'}`}
                      >
                        <img src={img.src} alt="Placed Item" style={imgStyle} className={imgClasses} />
                        <button
                          onClick={(e) => { e.stopPropagation(); setPlacedImages(prev => prev.filter(p => p.id !== img.id)); if (selectedImageId === img.id) setSelectedImageId(null); }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-lg opacity-0 group-hover/placed:opacity-100 transition-opacity z-[60] print:hidden"
                        >✕</button>
                      </div>
                    );
                  })}
                </div>
              );
            })}

          </div>
        )}

        {/* === LAYOUT B: A3 PLACEMAT (LANDSCAPE 3-COLUMN PREVIEW) === */}
        {layout === 'placemat' && (
          <div 
            ref={el => pageRefs.current[1] = el}
            className={`print-sheet shadow-2xl rounded-2xl w-full border ${themeStyles.containerBg} ${themeStyles.textColor} transition-all duration-300 relative`}
            style={{
              maxWidth: '1120px',
              minHeight: '297mm', 
              padding: '24px'
            }}
          >
            <div className={`w-full h-full rounded-xl border-2 ${themeStyles.border} p-6 sm:p-10 relative flex flex-col justify-between`}>
              
              {/* Decorative Corners */}
              <div className={`absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 ${themeStyles.border}`} />
              <div className={`absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 ${themeStyles.border}`} />
              <div className={`absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 ${themeStyles.border}`} />
              <div className={`absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 ${themeStyles.border}`} />

              <div className={`w-full h-full p-2 flex flex-col overflow-hidden`}>
                
                {/* Header */}
                <header className="text-center mb-8 pt-4">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.6em] ${themeStyles.accentColor} block mb-1.5`}>
                    {lang === 'tr' ? 'HOŞ GELDİNİZ' : 'WELCOME'}
                  </span>
                  <h1 className={`text-4xl font-serif font-black tracking-[0.25em] ${themeStyles.titleColor} mb-1.5`}>
                    PENNYLANE
                  </h1>
                  <div className="flex items-center justify-center space-x-3">
                    <div className={`w-8 h-[1px] bg-current ${themeStyles.textColor} opacity-30`} />
                    <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${themeStyles.accentColor}`}>
                      {lang === 'tr' ? 'GASTROPUB FİZİKİ MENÜ' : 'GASTROPUB PRINTED MENU'}
                    </span>
                    <div className={`w-8 h-[1px] bg-current ${themeStyles.textColor} opacity-30`} />
                  </div>
                </header>

                {/* Categories - distributed automatically in 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8 items-start flex-1 min-h-0 overflow-hidden mb-8">
                  {processedCategories.map((cat) => (
                    <div key={cat.id} className="avoid-break space-y-3">
                      
                      {/* Category Header */}
                      <div className="border-b-2 border-current/30 pb-1.5 mb-2 flex items-center justify-between">
                        <h3 className={`text-[12.5px] font-serif font-black uppercase tracking-wider ${themeStyles.titleColor}`}>
                          {t(cat.title)}
                        </h3>
                        {showSketches && getSketchForCategory(cat.id, themeStyles.sketchColor) && (
                          <div className="scale-50 origin-right -my-6 h-10 w-10 flex items-center">
                            {getSketchForCategory(cat.id, themeStyles.sketchColor)}
                          </div>
                        )}
                      </div>

                      {/* Items */}
                      <div className="space-y-2.5">
                        {cat.subcategories && cat.subcategories.length > 0 ? (
                          cat.subcategories.map(sub => {
                            const subcatItems = cat.itemsBySubcat[sub.id] || [];
                            if (subcatItems.length === 0) return null;

                            return (
                              <div key={sub.id} className="space-y-1 mt-2.5 first:mt-0 avoid-break">
                                <h4 className={`text-[9.5px] uppercase font-black tracking-[0.2em] ${themeStyles.accentColor} mt-2.5 mb-1.5 block`}>
                                  — {t(sub.title)} —
                                </h4>
                                <div className="space-y-1.5">
                                  {subcatItems.map(item => (
                                    <div key={item.id} className="flex flex-col space-y-0.5">
                                      <div className="flex items-baseline justify-between w-full">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${themeStyles.titleColor}`}>
                                          {t(item.name)}
                                        </span>
                                        <div className={`flex-1 mx-1.5 border-b border-dotted ${themeStyles.dots} opacity-30`} />
                                        <span className={`text-[10px] font-mono ${themeStyles.priceColor}`}>
                                          {item.price} TL
                                        </span>
                                      </div>
                                      {item.description?.[lang] && (
                                        <p className={`text-[8.5px] italic font-light leading-normal pr-16 opacity-60`}>
                                          {item.description[lang]}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          (cat.itemsBySubcat['none'] || []).map(item => (
                            <div key={item.id} className="flex flex-col space-y-0.5">
                              <div className="flex items-baseline justify-between w-full">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${themeStyles.titleColor}`}>
                                  {t(item.name)}
                                </span>
                                <div className={`flex-1 mx-1.5 border-b border-dotted ${themeStyles.dots} opacity-30`} />
                                <span className={`text-[10px] font-mono ${themeStyles.priceColor}`}>
                                  {item.price} TL
                                </span>
                              </div>
                              {item.description?.[lang] && (
                                <p className={`text-[8.5px] italic font-light leading-normal pr-16 opacity-60`}>
                                  {item.description[lang]}
                                </p>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  ))}
                </div>

                {/* Footer with QR */}
                <footer className={`mt-auto shrink-0 border-t-2 border-dashed ${themeStyles.border}/50 pt-6 pb-2 flex flex-col md:flex-row items-center justify-between gap-6`}>
                  
                  <div className="text-center md:text-left space-y-0.5 md:max-w-md">
                    <div className="flex items-center justify-center md:justify-start space-x-2.5 mb-1.5">
                      {logoImage ? (
                        <div className="w-6 h-6 flex items-center justify-center shrink-0 overflow-hidden">
                          <img src={logoImage} alt="Logo" className="max-w-full max-h-full object-contain" />
                        </div>
                      ) : (
                        <div className={`w-6 h-6 rounded-full border border-current flex items-center justify-center text-[9px] font-bold shrink-0 ${themeStyles.textColor}`}>
                          {coverLogoText}
                        </div>
                      )}
                      <h4 className={`text-xs font-serif font-black tracking-widest ${themeStyles.titleColor}`}>
                        {footerLeftText}
                      </h4>
                    </div>
                    <p className="text-[9px] font-light leading-relaxed opacity-60">
                      {lang === 'tr' 
                        ? 'Ürünlerimizde kullanılan bazı bileşenler alerjen içerebilir. Lütfen sipariş vermeden önce garsonunuza danışınız.'
                        : 'Some ingredients used in our products may contain allergens. Please consult your server before ordering.'}
                    </p>
                    <p className="text-[8.5px] opacity-40 font-mono">
                      {t(cmsData?.footer?.copyright) || `© ${currentYear} Pennylane Gastropub. All rights reserved.`}
                    </p>
                  </div>

                  <div className={`flex items-center space-x-3 border ${themeStyles.border} ${themeStyles.qrBg} rounded-xl p-2.5 max-w-sm`}>
                    <div className="text-right space-y-0.5">
                      <h5 className={`text-[10px] font-serif font-black tracking-wider ${themeStyles.titleColor}`}>
                        {lang === 'tr' ? 'DİĞER ÜRÜNLER & ALKOLLER' : 'OUR EXTENSIVE BAR'}
                      </h5>
                      <p className="text-[8.5px] font-bold leading-normal text-secondary uppercase tracking-wider">
                        {lang === 'tr' 
                          ? '600+ VİSKİ, KOKTEYL VE ALKOL ÇEŞİDİ İÇİN OKUTUN' 
                          : 'SCAN QR CODE FOR 600+ WHISKIES, COCKTAILS & SPIRITS'}
                      </p>
                      <p className="text-[7.5px] italic opacity-60">
                        {lang === 'tr' ? '* diğer ürünlerimiz için qr menümüze bakınız' : '* scan for additional library items'}
                      </p>
                    </div>
                    <div className="bg-white p-1 rounded-lg shrink-0 flex items-center justify-center shadow-md">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${encodeURIComponent(menuUrl)}`}
                        alt="QR Code" 
                        className="w-13 h-13"
                      />
                    </div>
                  </div>

                </footer>

                {/* Placed Images for Placemat (pageNum 1) */}
                {placedImages.filter(img => img.pageNum === 1).map(img => {
                  const { style: imgStyle, classes: imgClasses } = getImageStyle(img);
                  const { classes: frameClasses, paddingStyle } = getFrameClasses(img);
                  return (
                    <div
                      key={img.id}
                      style={{
                        position: 'absolute',
                        left: `${img.x}%`,
                        top: `${img.y}%`,
                        width: `${img.width || 12}%`,
                        cursor: 'move',
                        zIndex: 50,
                        ...paddingStyle
                      }}
                      onMouseDown={(e) => handleImageMouseDown(e, img.id, 1)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageId(img.id);
                      }}
                      className={`group/placed relative print:ring-0 ${frameClasses} ${selectedImageId === img.id ? 'ring-2 ring-secondary' : 'hover:ring-1 hover:ring-secondary/50'}`}
                    >
                      <img src={img.src} alt="Placed Item" style={imgStyle} className={imgClasses} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlacedImages(prev => prev.filter(p => p.id !== img.id));
                          if (selectedImageId === img.id) setSelectedImageId(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-lg opacity-0 group-hover/placed:opacity-100 transition-opacity z-[60] print:hidden"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── Print-only CSS style overrides ── */}
      <style>{`
        @media print {
          .print-menu-container {
            display: block !important;
            height: auto !important;
            overflow: visible !important;
          }
          /* Hide all UI elements */
          .no-print {
            display: none !important;
          }
          
          /* Fullscreen print-sheet */
          body, html {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          main {
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            background: transparent !important;
            height: auto !important;
            overflow: visible !important;
          }

          main > * + * {
            margin-top: 0 !important;
          }

          .print-sheet {
            background-color: ${isPaper ? '#faf6ee' : '#1c2022'} !important;
            color: ${isPaper ? '#2c241b' : '#e5e0d8'} !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 100vh !important;
            max-height: 100vh !important;
            margin: 0 !important;
            padding: 10mm !important;
            page-break-after: always;
            page-break-before: avoid;
            page-break-inside: avoid;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }

          .a4-page {
            height: 100vh !important;
            max-height: 100vh !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
          }

          .avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          @page {
            size: ${layout === 'placemat' ? 'A3 landscape' : 'A4 portrait'};
            margin: 0;
          }
        }
      `}</style>

    </div>
  );
};

export default PrintMenuPage;
