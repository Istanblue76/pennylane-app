import React, { useState, useRef, useCallback } from 'react';
import { Plus, Trash2, Edit2, ImageIcon, Upload, Loader2, Move, Smartphone, Search, ChevronDown, Check, X, Sparkles, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

/* ─────────────────────────────────────────────
   DRAGGABLE PRODUCT IMAGE on canvas
───────────────────────────────────────────── */
const DraggableProductImage = ({ layout, isSelected, onSelect, onDragEnd, allProducts }) => {
  const imgRef = useRef(null);
  const dragStartPos = useRef(null);
  const hasDragged = useRef(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    hasDragged.current = false;
    const parent = imgRef.current?.closest('[data-canvas]');
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    dragStartPos.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: layout.x,
      startY: layout.y,
      rectW: rect.width,
      rectH: rect.height,
    };
    const onMouseMove = (ev) => {
      if (!dragStartPos.current) return;
      const { startMouseX, startMouseY, startX, startY, rectW, rectH } = dragStartPos.current;
      const dx = ((ev.clientX - startMouseX) / rectW) * 100;
      const dy = ((ev.clientY - startMouseY) / rectH) * 100;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) hasDragged.current = true;
      const newX = Math.max(2, Math.min(98, startX + dx));
      const newY = Math.max(2, Math.min(98, startY + dy));
      onDragEnd(parseFloat(newX.toFixed(2)), parseFloat(newY.toFixed(2)));
    };
    const onMouseUp = () => {
      if (!hasDragged.current) onSelect(); // click without drag → select
      dragStartPos.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const sizeMap = { sm: '16%', md: '26%', lg: '40%', xl: '56%' };
  const w = layout.custom_scale ? `${layout.custom_scale}%` : sizeMap[layout.size || 'md'];

  const product = allProducts?.find(p => p.id === layout.product_id);
  const name = product ? (product.name?.tr || product.name) : layout.label;
  const price = product ? product.price : null;
  const isSpicy = product?.tags?.includes('spicy');

  return (
    <div
      ref={imgRef}
      onMouseDown={handleMouseDown}
      className={`absolute flex flex-col items-center cursor-grab active:cursor-grabbing select-none ${isSelected ? 'ring-2 ring-secondary ring-offset-transparent ring-offset-2 rounded-xl' : ''}`}
      style={{ left: `${layout.x}%`, top: `${layout.y}%`, transform: 'translate(-50%,-50%)', width: w, zIndex: layout.zIndex || 10 }}
    >
      <div className="relative w-full flex justify-center">
        <img src={layout.image_url} alt={name || ''} className="w-full h-auto object-contain pointer-events-none select-none drop-shadow-2xl" draggable={false} />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   DRAGGABLE MARKER (Free-floating Price Tag)
───────────────────────────────────────────── */
const DraggableMarker = ({ layout, isSelected, onSelect, onDragEnd, allProducts, isImageLabel }) => {
  const ref = useRef(null);
  const dragStartPos = useRef(null);
  const hasDragged = useRef(false);

  const posX = isImageLabel ? (layout.labelX ?? layout.x) : layout.x;
  const posY = isImageLabel ? (layout.labelY ?? (layout.y + 15)) : layout.y;

  const handleMouseDown = (e) => {
    e.stopPropagation();
    hasDragged.current = false;
    const parent = ref.current?.closest('[data-canvas]');
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    dragStartPos.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: posX,
      startY: posY,
      rectW: rect.width,
      rectH: rect.height,
    };
    const onMouseMove = (ev) => {
      if (!dragStartPos.current) return;
      const { startMouseX, startMouseY, startX, startY, rectW, rectH } = dragStartPos.current;
      const dx = ((ev.clientX - startMouseX) / rectW) * 100;
      const dy = ((ev.clientY - startMouseY) / rectH) * 100;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) hasDragged.current = true;
      const newX = Math.max(2, Math.min(98, startX + dx));
      const newY = Math.max(2, Math.min(98, startY + dy));
      onDragEnd(parseFloat(newX.toFixed(2)), parseFloat(newY.toFixed(2)));
    };
    const onMouseUp = () => {
      if (!hasDragged.current) onSelect();
      dragStartPos.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const product = allProducts?.find(p => p.id === layout.product_id);
  const name = product ? (product.name?.tr || product.name) : layout.label;
  const price = product ? product.price : null;
  const isSpicy = product?.tags?.includes('spicy');

  const labelScaleMap = { sm: 0.8, md: 1, lg: 1.25, xl: 1.6 };
  const scale = labelScaleMap[layout.label_size || 'md'];

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      className={`absolute z-20 cursor-grab active:cursor-grabbing p-1 ${isSelected ? 'ring-2 ring-secondary rounded-lg ring-offset-2 ring-offset-[#111]' : ''}`}
      style={{ left: `${posX}%`, top: `${posY}%`, transform: `translate(-50%, -50%) scale(${scale})` }}
    >
      <div className="flex flex-col items-center bg-black/50 backdrop-blur-md px-3 py-2 rounded shadow-2xl min-w-max border border-white/10 pointer-events-auto transition-transform hover:scale-105">
        {isSpicy && (
          <span className="text-red-500 text-[10px] mb-0.5">🌶️</span>
        )}
        <span className="text-white text-[9px] font-medium tracking-wide text-center leading-tight max-w-[140px] break-words">
          {name || (isImageLabel ? 'Ürün İsmi' : 'İsimsiz Etiket')}
        </span>
        {price && (
          <span className="text-white font-bold text-[10px] mt-1 tracking-wider">
            {price} TL
          </span>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   DRAGGABLE TEXT (Free Text without background)
───────────────────────────────────────────── */
const DraggableText = ({ layout, isSelected, onSelect, onDragEnd }) => {
  const ref = useRef(null);
  const dragStartPos = useRef(null);
  const hasDragged = useRef(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    hasDragged.current = false;
    const parent = ref.current?.closest('[data-canvas]');
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    dragStartPos.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: layout.x,
      startY: layout.y,
      rectW: rect.width,
      rectH: rect.height,
    };
    const onMouseMove = (ev) => {
      if (!dragStartPos.current) return;
      const { startMouseX, startMouseY, startX, startY, rectW, rectH } = dragStartPos.current;
      const dx = ((ev.clientX - startMouseX) / rectW) * 100;
      const dy = ((ev.clientY - startMouseY) / rectH) * 100;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) hasDragged.current = true;
      const newX = Math.max(2, Math.min(98, startX + dx));
      const newY = Math.max(2, Math.min(98, startY + dy));
      onDragEnd(parseFloat(newX.toFixed(2)), parseFloat(newY.toFixed(2)));
    };
    const onMouseUp = () => {
      if (!hasDragged.current) onSelect();
      dragStartPos.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const labelScaleMap = { sm: 0.8, md: 1, lg: 1.5, xl: 2, '2xl': 2.5, '3xl': 3 };
  const scale = labelScaleMap[layout.label_size || 'md'];

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      className={`absolute z-20 cursor-grab active:cursor-grabbing p-1 ${isSelected ? 'ring-2 ring-secondary rounded-lg ring-offset-2 ring-offset-[#111]' : ''}`}
      style={{ left: `${layout.x}%`, top: `${layout.y}%`, transform: `translate(-50%, -50%) scale(${scale})` }}
    >
      <div className="font-serif font-black text-white tracking-widest uppercase drop-shadow-lg leading-tight pointer-events-auto whitespace-nowrap">
        {layout.label || 'YENİ YAZI'}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   DRAGGABLE LIST BLOCK (Menu-style list layout)
───────────────────────────────────────────── */
const DraggableListBlock = ({ layout, isSelected, onSelect, onDragEnd, allProducts }) => {
  const ref = useRef(null);
  const dragStartPos = useRef(null);
  const hasDragged = useRef(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    hasDragged.current = false;
    const parent = ref.current?.closest('[data-canvas]');
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    dragStartPos.current = {
      startMouseY: e.clientY,
      startY: layout.y,
      rectH: rect.height,
    };
    const onMouseMove = (ev) => {
      if (!dragStartPos.current) return;
      const { startMouseY, startY, rectH } = dragStartPos.current;
      const dy = ((ev.clientY - startMouseY) / rectH) * 100;
      if (Math.abs(dy) > 0.5) hasDragged.current = true;
      const newY = Math.max(2, Math.min(98, startY + dy));
      // Keep x fixed at 50, only update y
      onDragEnd(50, parseFloat(newY.toFixed(2)));
    };
    const onMouseUp = () => {
      if (!hasDragged.current) onSelect();
      dragStartPos.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const items = layout.listItems || [];

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      className={`absolute z-20 cursor-ns-resize select-none ${isSelected ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-transparent rounded' : ''}`}
      style={{ left: '4%', right: '4%', top: `${layout.y}%`, transform: 'translateY(-50%)' }}
    >
      {items.length === 0 ? (
        <div className={`px-3 py-2 rounded border border-dashed text-center ${isSelected ? 'border-blue-400 bg-blue-400/10' : 'border-white/20 bg-black/40'}`}>
          <span className="text-white/40 text-[9px]">Liste Boş — Sol panelden Öğe Ekle</span>
        </div>
      ) : (
        <div className="flex flex-col gap-[10px] px-1 py-1 w-full">
          {items.map((item) => {
            const prod = allProducts?.find(p => p.id === item.product_id);
            const name = prod ? (prod.name?.tr || prod.name) : item.label;
            const price = prod ? prod.price : item.price;
            return (
              <div key={item.id} className="flex items-baseline gap-3 w-full">
                <span className="text-white font-bold text-[13px] leading-tight whitespace-nowrap shrink-0">{name || 'Ürün Adı'}</span>
                <span className="flex-1 border-b border-dotted border-white/40 mb-[4px]" style={{ minWidth: '8px' }} />
                <span className="text-white font-bold text-[11px] whitespace-nowrap shrink-0">{price ? `${price} TL` : '— TL'}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   PRODUCT SEARCH DROPDOWN
───────────────────────────────────────────── */
const ProductSearchDropdown = ({ allProducts, value, onChange, placeholder = "— Ürün Seçin —" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = allProducts.filter(p => {
    const name = p.name?.tr || p.name || '';
    const catName = p.category_name || '';
    const term = searchTerm.toLowerCase();
    return name.toLowerCase().includes(term) || catName.toLowerCase().includes(term);
  });

  const selectedProduct = allProducts.find(p => p.id === value);
  const selectedName = selectedProduct ? (selectedProduct.name?.tr || selectedProduct.name) : placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-dark/50 border border-white/10 rounded p-2 text-white text-sm outline-none focus:border-secondary hover:bg-white/5 transition-colors"
      >
        <span className="truncate pr-2">{selectedName}</span>
        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>


      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-1 z-50 w-full bg-[#1a1a1a] border border-white/10 rounded shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-white/10 flex items-center gap-2">
              <Search className="w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                autoFocus
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm('')}>
                  <X className="w-4 h-4 text-white/40 hover:text-white transition-colors" />
                </button>
              )}
            </div>
            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${!value ? 'bg-secondary/20 text-secondary' : 'text-white/70 hover:bg-white/5'}`}
              >
                {placeholder}
              </button>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(prod => {
                  const pName = prod.name?.tr || prod.name;
                  const isSelected = prod.id === value;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => {
                        onChange(prod.id);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${isSelected ? 'bg-secondary/20 text-secondary' : 'text-white hover:bg-white/5'}`}
                    >
                      <span className="truncate pr-2">{pName}</span>
                      {isSelected && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-3 text-sm text-white/40 text-center">Sonuç bulunamadı</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MULTI PRODUCT SEARCH DROPDOWN (For List Block)
───────────────────────────────────────────── */
const MultiProductSearchDropdown = ({ allProducts, onSelectProducts, placeholder = "Toplu Ekle" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const dropdownRef = useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = allProducts.filter(p => {
    const name = p.name?.tr || p.name || '';
    const catName = p.category_name || '';
    const term = searchTerm.toLowerCase();
    return name.toLowerCase().includes(term) || catName.toLowerCase().includes(term);
  });

  const handleToggleProduct = (productId) => {
    if (selectedIds.includes(productId)) {
      setSelectedIds(selectedIds.filter(id => id !== productId));
    } else {
      setSelectedIds([...selectedIds, productId]);
    }
  };

  const handleApply = () => {
    const products = allProducts.filter(p => selectedIds.includes(p.id));
    onSelectProducts(products);
    setSelectedIds([]);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-1.5 rounded-lg border border-dashed border-blue-500/50 text-blue-400 text-[10px] hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-1"
      >
        <Plus className="w-3 h-3" /> {placeholder}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-1 right-0 z-[60] w-[260px] bg-[#1a1a1a] border border-white/10 rounded shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-white/10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Kategori / Ürün ara..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                  autoFocus
                />
                {searchTerm && (
                  <button type="button" onClick={() => setSearchTerm('')}>
                    <X className="w-4 h-4 text-white/40 hover:text-white transition-colors" />
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-white/40">{selectedIds.length} seçildi</span>
                {selectedIds.length > 0 && (
                  <button onClick={handleApply} className="bg-blue-500 text-white hover:bg-blue-600 text-[10px] px-2 py-0.5 rounded font-bold transition-colors">
                    EKLE
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
              {filteredProducts.map(p => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <label key={p.id} className="flex items-center gap-2 w-full text-left p-2 hover:bg-white/5 rounded cursor-pointer transition-colors group">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => handleToggleProduct(p.id)}
                      className="w-3 h-3 rounded border-white/20 text-blue-500 bg-black/50"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-white text-xs truncate group-hover:text-blue-400 transition-colors">{p.name?.tr || p.name}</span>
                      <span className="text-white/30 text-[9px] truncate">{p.category_name}</span>
                    </div>
                  </label>
                );
              })}
              {filteredProducts.length === 0 && (
                <div className="p-4 text-center text-white/40 text-xs">Sonuç bulunamadı</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const getImageBase64 = async (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url.startsWith('/') 
      ? window.location.origin + url 
      : url + (url.includes('?') ? '&' : '?') + 't=' + Date.now();
      
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 512, 512);
      try {
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataURL.split(',')[1];
        resolve(base64);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Görsel yüklenemedi. CORS engeline takılmış olabilir.'));
  });
};

const AutoLayoutWizardModal = ({ isOpen, onClose, allProducts, onApply, backgroundImageUrl }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [layoutStyle, setLayoutStyle] = useState('ai-vision'); // 'ai-vision', 'classic-zigzag', 'classic-list', 'classic-list-block'
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingStep, setLoadingStep] = useState('');

  if (!isOpen) return null;

  const filtered = allProducts.filter(p => {
    const name = p.name?.tr || p.name || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleToggleProduct = (id) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const visibleIds = filtered.map(p => p.id);
    const allSelected = visibleIds.every(id => selectedProductIds.includes(id));
    if (allSelected) {
      setSelectedProductIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedProductIds(prev => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const handleApply = async () => {
    if (selectedProductIds.length === 0) {
      setErrorMsg('Lütfen en az bir ürün seçin.');
      return;
    }

    const selectedProducts = allProducts.filter(p => selectedProductIds.includes(p.id));

    if (layoutStyle === 'ai-vision') {
      if (!geminiKey.trim()) {
        setErrorMsg('Lütfen Google Gemini API Anahtarınızı girin.');
        return;
      }
      if (!backgroundImageUrl) {
        setErrorMsg('Arka plan görseli bulunamadı. Lütfen önce bir arka plan yükleyin.');
        return;
      }

      localStorage.setItem('gemini_api_key', geminiKey.trim());
      setIsLoading(true);
      setErrorMsg('');
      
      try {
        setLoadingStep('Görsel analiz için optimize ediliyor...');
        const base64Image = await getImageBase64(backgroundImageUrl);
        
        setLoadingStep('Yapay zeka görseli ve boş alanları analiz ediyor...');
        
        const promptText = `Aşağıdaki görseli incele. Bu görsel bir telefon ekranına uygun menü arka planıdır.

Bu sayfaya ${selectedProducts.length} adet tabak/ürün görseli (PNG) ve bunların yazı etiketleri (isim + fiyat) yerleştirilecektir. En büyük sorunumuz ürünlerin BİRBİRİNİN ÜSTÜNE BİNMESİDİR (Overlap). Bunu kesin olarak engellemek için şu "Hücre (Cell)" mantığını kullan:

ÇOK ÖNEMLİ KURALLAR (ÜST ÜSTE BİNMEYİ ENGELLE):
1. HAYALİ IZGARA (VIRTUAL GRID): Ekranı görünmez bir ızgaraya (örneğin 3 sütun x 4 satır) böldüğünü hayal et.
2. HER ÜRÜNE FARKLI HÜCRE: Her bir ürünü KESİNLİKLE farklı bir hücrenin (bölgenin) içine yerleştir. İki ürün asla aynı veya komşu X,Y koordinatlarına sahip olmasın.
3. HÜCRE İÇİNDE RASTGELELİK (ORGANİK GÖRÜNÜM): Ürünleri dümdüz hizalamak yerine, seçtiğin hücrenin içinde X ve Y ekseninde ufak rastgele sapmalar yap. Kimi biraz sağda, kimi biraz solda dursun ama asla kendi hücresinin dışına taşıp diğer ürünle çakışmasın.
4. ETİKET KONUMU: Her bir ürün görselinin (x, y) hemen altında (y + 10) kendi etiketini (labelX, labelY) yerleştir. Görsel ile etiketi birbiriyle bütünleşik dursun.
5. Sadece SAĞ ÜST KÖŞEYİ tamamen boş bırak (oraya büyük bir kategori başlığı gelecek).

Yerleştirilecek ürünler:
${selectedProducts.map((p, idx) => `${idx + 1}. ${p.name?.tr || p.name || ''} (${p.price || 0} TL) - product_id: ${p.id}`).join('\n')}

Her ürün için görselin merkez konumu (x, y) ve etiketinin merkez konumu (labelX, labelY) için 0-100 arasında yüzdesel koordinatlar belirle.
Çıktıyı SADECE ve SADECE aşağıdaki gibi geçerli bir JSON array formatında ver, başka hiçbir metin ekleme:

[
  {
    "product_id": "seçilen_ürün_id",
    "label": "ürün_adı",
    "x": 25,
    "y": 25,
    "labelX": 25,
    "labelY": 40
  }
]`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey.trim()}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: promptText },
                  {
                    inlineData: {
                      mimeType: 'image/jpeg',
                      data: base64Image
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error("Gemini Error:", errText);
          let errMsg = response.statusText;
          try {
            const errJson = JSON.parse(errText);
            if (errJson.error && errJson.error.message) {
              errMsg = errJson.error.message;
            }
          } catch(e) {}
          throw new Error(errMsg);
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          throw new Error('Yapay zekadan geçerli bir yanıt alınamadı.');
        }

        let parsedLayouts = [];
        try {
          parsedLayouts = JSON.parse(text);
        } catch (e) {
          const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
          parsedLayouts = JSON.parse(cleanedText);
        }

        if (!Array.isArray(parsedLayouts)) {
          throw new Error('Yapay zeka yanıtı liste formatında değil.');
        }

        const dynamicSize = selectedProducts.length <= 3 ? 'xl' : (selectedProducts.length <= 6 ? 'lg' : 'md');
        const dynamicLabelSize = selectedProducts.length <= 4 ? 'md' : 'sm';
        const labelYOffset = dynamicSize === 'xl' ? 18 : (dynamicSize === 'lg' ? 14 : 10);

        const generatedLayouts = parsedLayouts.map((l, idx) => {
          const product = selectedProducts.find(p => p.id === l.product_id);
          const xPos = typeof l.x === 'number' ? l.x : 50;
          const yPos = typeof l.y === 'number' ? l.y : 30 + idx * 15;
          return {
            id: crypto.randomUUID(),
            x: xPos,
            y: yPos,
            product_id: l.product_id || '',
            label: l.label || '',
            image_url: product?.story_image_url || product?.image_url || null,
            size: dynamicSize,
            label_size: dynamicLabelSize,
            zIndex: 10,
            labelX: xPos,
            labelY: Math.min(yPos + labelYOffset, 98)
          };
        });

        onApply(generatedLayouts);
        onClose();
      } catch (err) {
        console.error(err);
        setErrorMsg('Yapay zeka analizi başarısız oldu: ' + err.message + '\\nLütfen API anahtarınızı kontrol edin veya Klasik şablonları deneyin.');
      } finally {
        setIsLoading(false);
      }
    } else {
      let generatedLayouts = [];
      if (layoutStyle === 'classic-list-block') {
        generatedLayouts = [{
          id: crypto.randomUUID(),
          x: 50,
          y: 50,
          listBlock: true,
          product_id: '',
          label: '',
          size: 'md',
          zIndex: 20,
          listItems: selectedProducts.map(p => ({
            id: crypto.randomUUID(),
            product_id: p.id,
            label: p.name?.tr || p.name || '',
            price: p.price
          }))
        }];
      } else if (layoutStyle === 'classic-list') {
        const dynamicSize = selectedProducts.length <= 3 ? 'xl' : (selectedProducts.length <= 6 ? 'lg' : 'md');
        const dynamicLabelSize = selectedProducts.length <= 4 ? 'md' : 'sm';
        const startY = 25;
        const endY = 85;
        const stepY = selectedProducts.length > 1 ? (endY - startY) / (selectedProducts.length - 1) : 0;
        generatedLayouts = selectedProducts.map((p, idx) => {
          const y = startY + idx * stepY;
          return {
            id: crypto.randomUUID(),
            x: 50,
            y: parseFloat(y.toFixed(2)),
            product_id: p.id,
            label: p.name?.tr || p.name || '',
            image_url: p.story_image_url || p.image_url || null,
            size: dynamicSize,
            label_size: dynamicLabelSize,
            zIndex: 20
          };
        });
      } else if (layoutStyle === 'classic-zigzag') {
        const dynamicSize = selectedProducts.length <= 3 ? 'xl' : (selectedProducts.length <= 6 ? 'lg' : 'md');
        const dynamicLabelSize = selectedProducts.length <= 4 ? 'md' : 'sm';
        const labelYOffset = dynamicSize === 'xl' ? 18 : (dynamicSize === 'lg' ? 14 : 10);
        const startY = 30;
        const endY = 80;
        const stepY = selectedProducts.length > 1 ? (endY - startY) / (selectedProducts.length - 1) : 0;
        generatedLayouts = selectedProducts.map((p, idx) => {
          const y = startY + idx * stepY;
          const isLeft = idx % 2 === 0;
          const x = isLeft ? 30 : 70;
          return {
            id: crypto.randomUUID(),
            x: x,
            y: parseFloat(y.toFixed(2)),
            product_id: p.id,
            label: p.name?.tr || p.name || '',
            image_url: p.story_image_url || p.image_url || null,
            size: dynamicSize,
            label_size: dynamicLabelSize,
            zIndex: 20,
            labelX: x,
            labelY: parseFloat((Math.min(y + labelYOffset, 98)).toFixed(2))
          };
        });
      }

      onApply(generatedLayouts);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Otomatik Ürün Yerleştirme Sihirbazı</h3>
          </div>
          <button onClick={onClose} className="p-1 text-white/50 hover:text-white rounded hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 flex-1">
            <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-white font-medium text-sm">Yapay Zeka Sihirbazı Çalışıyor</p>
              <p className="text-indigo-400/80 text-xs animate-pulse">{loadingStep}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10 overflow-hidden flex-1">
            
            {/* Left Column: Product Selection */}
            <div className="flex-1 p-4 flex flex-col overflow-hidden max-h-[45vh] md:max-h-none">
              <div className="flex items-center justify-between mb-3 gap-2">
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">1. Ürün Seçimi ({selectedProductIds.length} Seçili)</span>
                <button type="button" onClick={handleSelectAll} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase">
                  {filtered.every(id => selectedProductIds.includes(id.id)) ? 'Seçimi Kaldır' : 'Tümünü Seç'}
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-3 shrink-0">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Ürün ismi ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-dark/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-white text-sm outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Products List Scroll */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 min-h-0">
                {filtered.map(p => {
                  const isChecked = selectedProductIds.includes(p.id);
                  const pName = p.name?.tr || p.name || '';
                  return (
                    <label key={p.id} className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer select-none transition-colors ${isChecked ? 'bg-indigo-500/10 border-indigo-500/30 text-white' : 'bg-dark/20 border-white/5 text-white/70 hover:bg-white/5'}`}>
                      <div className="flex items-center gap-2 truncate pr-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleProduct(p.id)}
                          className="rounded border-white/20 bg-dark text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs truncate">{pName}</span>
                      </div>
                      <span className="text-[10px] font-bold text-white/50 shrink-0">{p.price} TL</span>
                    </label>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="text-center py-8 text-white/40 text-xs">Aradığınız kriterde ürün bulunamadı.</div>
                )}
              </div>
            </div>

            {/* Right Column: Settings & Templates */}
            <div className="w-full md:w-80 p-4 space-y-4 overflow-y-auto shrink-0 bg-black/10">
              
              {/* Placement Method Selection */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider block">2. Yerleşim Modu</span>
                
                <div className="space-y-2">
                  <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${layoutStyle === 'ai-vision' ? 'bg-indigo-500/10 border-indigo-500/40' : 'bg-dark/30 border-white/5 hover:bg-white/5'}`}>
                    <input
                      type="radio"
                      name="layoutStyle"
                      checked={layoutStyle === 'ai-vision'}
                      onChange={() => setLayoutStyle('ai-vision')}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        Yapay Zeka (AI Vision)
                      </span>
                      <p className="text-[10px] text-white/50 leading-relaxed">
                        Arka planı analiz eder, süslemeleri ve yazıları kapatmadan akıllı yerleşim planı yapar.
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${layoutStyle === 'classic-zigzag' ? 'bg-indigo-500/10 border-indigo-500/40' : 'bg-dark/30 border-white/5 hover:bg-white/5'}`}>
                    <input
                      type="radio"
                      name="layoutStyle"
                      checked={layoutStyle === 'classic-zigzag'}
                      onChange={() => setLayoutStyle('classic-zigzag')}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white">Çapraz Grid (Zikzak)</span>
                      <p className="text-[10px] text-white/50 leading-relaxed">
                        Ürünleri dikeyde simetrik, yatayda bir sağa bir sola zikzak çizerek hizalar (Klasik).
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${layoutStyle === 'classic-list' ? 'bg-indigo-500/10 border-indigo-500/40' : 'bg-dark/30 border-white/5 hover:bg-white/5'}`}>
                    <input
                      type="radio"
                      name="layoutStyle"
                      checked={layoutStyle === 'classic-list'}
                      onChange={() => setLayoutStyle('classic-list')}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white">Tek Sütun / Dikey Liste</span>
                      <p className="text-[10px] text-white/50 leading-relaxed">
                        Etiketleri tek bir dikey hizada, yukarıdan aşağıya eşit boşluklarla yerleştirir (Klasik).
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${layoutStyle === 'classic-list-block' ? 'bg-indigo-500/10 border-indigo-500/40' : 'bg-dark/30 border-white/5 hover:bg-white/5'}`}>
                    <input
                      type="radio"
                      name="layoutStyle"
                      checked={layoutStyle === 'classic-list-block'}
                      onChange={() => setLayoutStyle('classic-list-block')}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white">Fiyat Çizgili Birleşik Liste</span>
                      <p className="text-[10px] text-white/50 leading-relaxed">
                        Tüm ürünleri tek bir kapsayıcı blok içinde (Adı ..... Fiyat şeklinde) birleştirir (Klasik).
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Gemini API Key input */}
              {layoutStyle === 'ai-vision' && (
                <div className="space-y-2 border-t border-white/10 pt-3">
                  <span className="text-xs font-bold text-white/60 uppercase tracking-wider block">3. Gemini API Anahtarı</span>
                  <input
                    type="password"
                    placeholder="AI API Anahtarınızı girin..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="w-full bg-dark/50 border border-white/10 rounded-lg p-2 text-white text-xs outline-none focus:border-indigo-500 transition-colors"
                  />
                  <p className="text-[9px] text-white/40 leading-relaxed">
                    API anahtarınız yerel tarayıcınızda güvenle saklanır, sunucuya aktarılmaz. Google AI Studio'dan edinebilirsiniz.
                  </p>
                </div>
              )}

              {/* Error Box */}
              {errorMsg && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs leading-relaxed whitespace-pre-line">
                  {errorMsg}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Footer Buttons */}
        {!isLoading && (
          <div className="flex items-center justify-end gap-2 border-t border-white/10 p-4 shrink-0 bg-dark/30">
            <button onClick={onClose} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-bold text-white hover:bg-white/5 transition-colors">
              İptal
            </button>
            <button onClick={handleApply} className="px-5 py-2 bg-indigo-500 text-white rounded-lg text-xs font-bold hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Sihirbazı Çalıştır
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

const StoryMenuBuilder = ({ data, setData, setHasChanges }) => {
  const storyMenu = data.storyMenu || { pages: [] };
  const pages = storyMenu.pages || [];

  const [editingPageId, setEditingPageId] = useState(null);
  const [selectedLayoutId, setSelectedLayoutId] = useState(null);
  const [isBgUploading, setIsBgUploading] = useState(false);
  const [isProductUploading, setIsProductUploading] = useState(false);
  const [showGridLines, setShowGridLines] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [targetPageForProductSelect, setTargetPageForProductSelect] = useState(null);
  const [productSelectSearchTerm, setProductSelectSearchTerm] = useState('');

  /* ── upload helper ── */
  const uploadFile = async (file, category) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);
    const resp = await axios.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    if (resp.data.status === 'success' || resp.data.url) return resp.data.url;
    throw new Error('Sunucu yanıtı geçersiz');
  };

  const handleUpdatePage = useCallback((pageId, updates) => {
    setData(prev => {
      const newPages = prev.storyMenu?.pages?.map(p => p.id === pageId ? { ...p, ...updates } : p);
      return { ...prev, storyMenu: { ...prev.storyMenu, pages: newPages } };
    });
    setHasChanges(true);
  }, [setData, setHasChanges]);

  const handleUpdateHotspot = useCallback((pageId, layoutId, updates) => {
    setData(prev => {
      const newPages = prev.storyMenu?.pages?.map(p => {
        if (p.id !== pageId) return p;
        return { ...p, layouts: p.layouts.map(l => l.id === layoutId ? { ...l, ...updates } : l) };
      });
      return { ...prev, storyMenu: { ...prev.storyMenu, pages: newPages } };
    });
    setHasChanges(true);
  }, [setData, setHasChanges]);

  /* ── background upload ── */
  const handleBgUpload = async (e, pageId) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsBgUploading(true);
      const url = await uploadFile(file, 'story-menu-bg');
      handleUpdatePage(pageId, { hero_image_url: url });
    } catch (err) {
      alert('Arka plan yüklenemedi: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsBgUploading(false);
      e.target.value = null;
    }
  };

  /* ── welcome screen uploads ── */
  const [isWelcomeBgUploading, setIsWelcomeBgUploading] = useState(false);
  const [isLogoUploading, setIsLogoUploading] = useState(false);

  const handleWelcomeUpload = async (e, field, setUploading) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadFile(file, 'welcome-screen');
      const current = data.welcome_screen || {};
      setData(prev => ({
        ...prev,
        welcome_screen: { ...current, [field]: url }
      }));
      setHasChanges(true);
    } catch (err) {
      alert('Yüklenemedi: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const handleWelcomeFieldChange = (field, value) => {
    const current = data.welcome_screen || {};
    setData(prev => ({
      ...prev,
      welcome_screen: { ...current, [field]: value }
    }));
    setHasChanges(true);
  };

  /* ── NEW: Upload product image → immediately creates a new layout ── */
  const handleNewProductImageUpload = async (e, pageId) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProductUploading(true);
      const url = await uploadFile(file, 'story-menu-products');
      // Create a new layout entry with this image, centered on canvas
      const page = pages.find(p => p.id === pageId);
      const newLayout = {
        id: crypto.randomUUID(),
        x: 50, y: 50,
        product_id: '',
        number: (page.layouts?.length || 0) + 1,
        label: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        image_url: url,
        size: 'md',
        zIndex: 10,
      };
      handleUpdatePage(pageId, { layouts: [...(page.layouts || []), newLayout] });
      setSelectedLayoutId(newLayout.id); // auto-select so user can immediately link product
    } catch (err) {
      alert('Ürün görseli yüklenemedi: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsProductUploading(false);
      e.target.value = null;
    }
  };

  /* ── Replace product image for existing layout ── */
  const handleReplaceProductImage = async (e, pageId, layoutId) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProductUploading(true);
      const url = await uploadFile(file, 'story-menu-products');
      handleUpdateHotspot(pageId, layoutId, { image_url: url });
    } catch (err) {
      alert('Görsel değiştirilemedi: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsProductUploading(false);
      e.target.value = null;
    }
  };

  /* ── NEW: Add an empty marker (Price Tag) without uploading an image ── */
  const handleAddMarker = (pageId) => {
    const page = pages.find(p => p.id === pageId);
    const newLayout = {
      id: crypto.randomUUID(),
      x: 50, y: 50,
      product_id: '',
      number: (page.layouts?.length || 0) + 1,
      label: 'Yeni Etiket',
      size: 'md',
      zIndex: 20,
    };
    handleUpdatePage(pageId, { layouts: [...(page.layouts || []), newLayout] });
    setSelectedLayoutId(newLayout.id);
  };

  /* ── NEW: Add a free text block ── */
  const handleAddText = (pageId) => {
    const page = pages.find(p => p.id === pageId);
    const newLayout = {
      id: crypto.randomUUID(),
      x: 50, y: 50,
      isTextOnly: true,
      number: (page.layouts?.length || 0) + 1,
      label: 'YENİ YAZI',
      label_size: 'lg',
      zIndex: 20,
    };
    handleUpdatePage(pageId, { layouts: [...(page.layouts || []), newLayout] });
    setSelectedLayoutId(newLayout.id);
  };

  /* ── NEW: Add a list block (menu list layout) ── */
  const handleAddListBlock = (pageId) => {
    const page = pages.find(p => p.id === pageId);
    const newLayout = {
      id: crypto.randomUUID(),
      x: 50, y: 50,
      listBlock: true,
      product_id: '',
      number: (page.layouts?.length || 0) + 1,
      label: '',
      size: 'md',
      zIndex: 20,
      listItems: [], // array of { id, product_id, label, price }
    };
    handleUpdatePage(pageId, { layouts: [...(page.layouts || []), newLayout] });
    setSelectedLayoutId(newLayout.id);
  };

  const handleApplyAutoLayout = (newLayouts) => {
    if (!editingPageId) return;
    const page = pages.find(p => p.id === editingPageId);
    if (!page) return;
    const currentLayouts = page.layouts || [];
    
    // Assign proper numbers to the new layouts
    const numberedLayouts = newLayouts.map((l, idx) => ({
      ...l,
      number: currentLayouts.length + idx + 1
    }));

    handleUpdatePage(editingPageId, { layouts: [...currentLayouts, ...numberedLayouts] });
    if (numberedLayouts.length > 0) {
      setSelectedLayoutId(numberedLayouts[0].id);
    }
  };

  /* ── page actions ── */
  const handleAddPage = () => {
    const newPage = {
      id: crypto.randomUUID(),
      title: { tr: '', en: '' },
      hero_image_url: '',
      sort_order: pages.length,
      active: true,
      layouts: [],
    };
    setData(prev => ({ ...prev, storyMenu: { ...prev.storyMenu, pages: [...(prev.storyMenu?.pages || []), newPage] } }));
    setHasChanges(true);
  };

  const handleDeletePage = (pageId) => {
    if (!window.confirm('Bu sayfayı silmek istediğinize emin misiniz?')) return;
    setData(prev => ({ ...prev, storyMenu: { ...prev.storyMenu, pages: prev.storyMenu?.pages?.filter(p => p.id !== pageId) } }));
    setHasChanges(true);
    if (editingPageId === pageId) setEditingPageId(null);
  };

  const handleDeleteHotspot = (pageId, layoutId) => {
    const page = pages.find(p => p.id === pageId);
    handleUpdatePage(pageId, { layouts: page.layouts.filter(l => l.id !== layoutId) });
    if (selectedLayoutId === layoutId) setSelectedLayoutId(null);
  };

  const allProducts = [];
  (data.menu?.categories || []).forEach(cat => {
    const catName = cat.title?.tr || cat.title || '';
    (cat.items || []).forEach(item => {
      const subCat = cat.subcategories?.find(s => s.id === item.subcategory);
      const subCatName = subCat?.title?.tr || subCat?.title || '';
      const fullCategoryName = subCatName ? `${catName} / ${subCatName}` : catName;
      allProducts.push({ ...item, category_name: fullCategoryName });
    });
  });

  /* ════════════════════════════════════════
     EDITOR VIEW
  ════════════════════════════════════════ */
  if (editingPageId) {
    const page = pages.find(p => p.id === editingPageId);
    if (!page) return null;
    const selectedLayout = page.layouts?.find(l => l.id === selectedLayoutId);
    const hasBackground = !!page.hero_image_url;

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => { setEditingPageId(null); setSelectedLayoutId(null); }} className="text-textSecondary hover:text-white transition-colors flex items-center gap-1 text-sm shrink-0">
            ← Geri Dön
          </button>
          <div className="w-px h-6 bg-white/10 mx-2 shrink-0"></div>
          <input 
            type="text" 
            value={page.title?.tr || ''} 
            onChange={e => handleUpdatePage(page.id, { title: { ...page.title, tr: e.target.value } })} 
            className="text-xl font-serif font-bold text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-secondary outline-none px-1 py-0.5 w-full"
            placeholder="Kategori İsmi (örn: Breakfast)"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left panel ── */}
          <div className="lg:col-span-1 space-y-4">

            {/* 1. Page & Background */}
            <div className="bg-dark border border-white/10 rounded-xl p-4 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">1</span>
                Arka Plan Yükle
              </h4>
              <p className="text-[10px] text-textSecondary">Photoshop'ta hazırladığınız 1080x1920 tasarımı yükleyin.</p>
              <div>
                <div className="flex gap-2">
                  <input type="text" value={page.hero_image_url || ''} onChange={e => handleUpdatePage(page.id, { hero_image_url: e.target.value })} placeholder="URL yapıştır veya →" className="flex-1 bg-dark/50 border border-white/10 rounded p-2 text-white text-sm outline-none focus:border-secondary" />
                  <label className="flex items-center justify-center w-10 h-10 bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 rounded cursor-pointer transition-colors shrink-0" title="Bilgisayardan yükle">
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleBgUpload(e, page.id)} disabled={isBgUploading} />
                    {isBgUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </label>
                </div>
              </div>
            </div>

            {/* 2. Add Elements */}
            {/* Add Hotspot tools */}
            <div className={`mb-6 grid grid-cols-2 gap-2 ${!hasBackground ? 'opacity-40 pointer-events-none' : ''}`}>
              <button onClick={() => handleAddMarker(page.id)} disabled={!hasBackground} className="py-2.5 rounded-lg bg-dark/50 border border-secondary/20 hover:border-secondary/50 text-textSecondary hover:text-white transition-all flex flex-col items-center justify-center gap-1 group">
                <div className="w-6 h-6 rounded bg-black/50 border border-white/20 flex flex-col items-center justify-center shadow-md">
                  <span className="text-white text-[6px] font-bold">FİYAT</span>
                </div>
                <span className="text-[10px] font-medium">Serbest Etiket</span>
              </button>
              <button onClick={() => handleAddListBlock(page.id)} disabled={!hasBackground} className="py-2.5 rounded-lg bg-dark/50 border border-blue-400/20 hover:border-blue-400/50 text-textSecondary hover:text-blue-300 transition-all flex flex-col items-center justify-center gap-1 group">
                <div className="w-6 h-6 rounded bg-black/50 border border-white/20 flex flex-col items-center justify-center shadow-md gap-[2px]">
                  <div className="w-4 h-[2px] bg-white/60 rounded" />
                  <div className="w-4 h-[2px] bg-white/40 rounded" />
                  <div className="w-4 h-[2px] bg-white/20 rounded" />
                </div>
                <span className="text-[10px] font-medium">Liste Düz.</span>
              </button>
              <button onClick={() => setTargetPageForProductSelect(page.id)} disabled={!hasBackground} className="py-2.5 rounded-lg bg-secondary/10 border border-secondary/30 hover:bg-secondary/20 hover:border-secondary/60 text-secondary transition-all flex flex-col items-center justify-center gap-1 group">
                <div className="w-6 h-6 rounded border-2 border-dashed border-secondary/50 flex items-center justify-center group-hover:border-secondary transition-colors">
                  <ImageIcon className="w-3 h-3 text-secondary" />
                </div>
                <span className="text-[10px] font-bold">Ürün Görseli Seç</span>
              </button>
              <button onClick={() => handleAddText(page.id)} disabled={!hasBackground} className="py-2.5 rounded-lg bg-dark/50 border border-green-400/20 hover:border-green-400/50 text-textSecondary hover:text-green-300 transition-all flex flex-col items-center justify-center gap-1 group">
                <div className="w-6 h-6 rounded bg-black/50 border border-green-400/20 flex flex-col items-center justify-center shadow-md">
                  <Type className="w-3.5 h-3.5 text-green-400" />
                </div>
                <span className="text-[10px] font-medium">Serbest Yazı</span>
              </button>
              <button onClick={() => setIsWizardOpen(true)} disabled={!hasBackground} className="py-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 hover:border-indigo-500/60 text-indigo-400 hover:text-indigo-300 transition-all flex flex-col items-center justify-center gap-1 group">
                <div className="w-6 h-6 rounded bg-black/50 border border-indigo-500/30 flex flex-col items-center justify-center shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                </div>
                <span className="text-[10px] font-bold">Oto Yerleşim</span>
              </button>
            </div>

            {/* 3. Selected hotspot settings */}
            <AnimatePresence mode="wait">
              {selectedLayout ? (
                <motion.div
                  key={selectedLayout.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="bg-dark border border-secondary/30 rounded-xl p-4 space-y-3 relative"
                >
                  <button onClick={() => handleDeleteHotspot(page.id, selectedLayout.id)} className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <h4 className="font-bold text-secondary text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-secondary text-primary flex items-center justify-center text-[10px]">{selectedLayout.number}</span>
                    Seçili Alan Ayarları
                  </h4>

                  {/* Product image thumbnail + replace */}
                  {selectedLayout.image_url && (
                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-2">
                      <div className="w-14 h-14 shrink-0 rounded flex items-center justify-center overflow-hidden">
                        <img src={selectedLayout.image_url} alt="" className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate mb-1">{selectedLayout.label}</p>
                        <label className="inline-flex items-center gap-1 text-[10px] text-secondary cursor-pointer hover:underline">
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleReplaceProductImage(e, page.id, selectedLayout.id)} disabled={isProductUploading} />
                          <Upload className="w-3 h-3" /> Görseli Değiştir
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Link product OR list block management */}
                  {selectedLayout.listBlock ? (
                    <div className="space-y-2">
                      <label className="text-[10px] text-textSecondary uppercase mb-1 block">📋 Liste Öğeleri</label>
                      <div className="space-y-2 pr-1">
                        {(selectedLayout.listItems || []).map((item, idx) => {
                          const prod = allProducts.find(p => p.id === item.product_id);
                          const itemName = prod ? (prod.name?.tr || prod.name) : item.label;
                          const itemPrice = prod ? prod.price : item.price;
                          return (
                            <div key={item.id} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                              <span className="text-[10px] text-white/40 w-4 shrink-0">{idx + 1}.</span>
                              <div className="flex-1 min-w-0">
                                <ProductSearchDropdown
                                  allProducts={allProducts}
                                  value={item.product_id || ''}
                                  onChange={val => {
                                    const p2 = allProducts.find(p => p.id === val);
                                    const newItems = (selectedLayout.listItems || []).map((it, i) =>
                                      i === idx ? { ...it, product_id: val, label: p2 ? (p2.name?.tr || p2.name) : it.label, price: p2 ? p2.price : it.price } : it
                                    );
                                    handleUpdateHotspot(page.id, selectedLayout.id, { listItems: newItems });
                                  }}
                                  placeholder={`Öğe ${idx + 1}`}
                                />
                              </div>
                              <button onClick={() => {
                                const newItems = (selectedLayout.listItems || []).filter((_, i) => i !== idx);
                                handleUpdateHotspot(page.id, selectedLayout.id, { listItems: newItems });
                              }} className="p-1 text-red-400 hover:text-red-300 shrink-0">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newItem = { id: crypto.randomUUID(), product_id: '', label: '', price: '' };
                            handleUpdateHotspot(page.id, selectedLayout.id, { listItems: [...(selectedLayout.listItems || []), newItem] });
                          }}
                          className="flex-1 py-1.5 rounded-lg border border-dashed border-blue-400/30 text-blue-400 text-[10px] hover:bg-blue-400/10 transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> 1 Öğe Ekle
                        </button>
                        <div className="flex-1">
                          <MultiProductSearchDropdown 
                            allProducts={allProducts}
                            onSelectProducts={(products) => {
                              const newItems = products.map(p => ({
                                id: crypto.randomUUID(),
                                product_id: p.id,
                                label: p.name?.tr || p.name,
                                price: p.price
                              }));
                              handleUpdateHotspot(page.id, selectedLayout.id, { listItems: [...(selectedLayout.listItems || []), ...newItems] });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : selectedLayout.isTextOnly ? null : (
                  <div>
                    <label className="text-[10px] text-textSecondary uppercase mb-1 block">🔗 Veritabanından Ürün Seç</label>
                    <ProductSearchDropdown
                      allProducts={allProducts}
                      value={selectedLayout.product_id || ''}
                      onChange={val => {
                        const prod = allProducts.find(p => p.id === val);
                        handleUpdateHotspot(page.id, selectedLayout.id, {
                          product_id: val,
                          label: prod ? (prod.name?.tr || prod.name) : selectedLayout.label,
                          image_url: prod ? (prod.story_image_url || prod.image_url) : selectedLayout.image_url
                        });
                      }}
                      placeholder="-- Ürün Seçin --"
                    />
                  </div>
                  )}

                  {/* Size (only for images) */}
                  {selectedLayout.image_url && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-textSecondary uppercase mb-1 block">📐 Görsel Boyutu</label>
                        <div className="grid grid-cols-4 gap-1">
                          {[{ v: 'sm', l: 'Küçük' }, { v: 'md', l: 'Orta' }, { v: 'lg', l: 'Büyük' }, { v: 'xl', l: 'XL' }].map(s => (
                            <button key={s.v} onClick={() => handleUpdateHotspot(page.id, selectedLayout.id, { size: s.v, custom_scale: null })} className={`py-1.5 rounded text-xs font-medium transition-all ${((selectedLayout.size || 'md') === s.v && !selectedLayout.custom_scale) ? 'bg-secondary text-primary' : 'bg-dark/50 border border-white/10 text-textSecondary hover:border-secondary/40'}`}>
                              {s.l}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-textSecondary uppercase mb-1 flex items-center justify-between">
                          <span>Manuel Görsel Boyutu (Özel)</span>
                          {selectedLayout.custom_scale && <span className="text-secondary">{selectedLayout.custom_scale}%</span>}
                        </label>
                        <input type="range" min="10" max="150" step="1" 
                          value={selectedLayout.custom_scale || parseInt({ sm: '16', md: '26', lg: '40', xl: '56' }[selectedLayout.size || 'md']) || 26} 
                          onChange={e => handleUpdateHotspot(page.id, selectedLayout.id, { custom_scale: parseInt(e.target.value) })} 
                          className="w-full accent-secondary" />
                      </div>
                    </div>
                  )}

                  {/* Label size (for both image labels and markers) */}
                  {(selectedLayout.label !== undefined || selectedLayout.product_id || !selectedLayout.image_url) && (
                    <div>
                      <label className="text-[10px] text-textSecondary uppercase mb-1 block">🏷️ {selectedLayout.isTextOnly ? 'Yazı Boyutu' : 'Etiket / Fiyat Boyutu'}</label>
                      <div className={`grid ${selectedLayout.isTextOnly ? 'grid-cols-6' : 'grid-cols-4'} gap-1`}>
                        {(() => {
                          const sizes = selectedLayout.isTextOnly
                            ? [{ v: 'sm', l: 'Küçük' }, { v: 'md', l: 'Orta' }, { v: 'lg', l: 'Büyük' }, { v: 'xl', l: 'XL' }, { v: '2xl', l: '2XL' }, { v: '3xl', l: '3XL' }]
                            : [{ v: 'sm', l: 'Küçük' }, { v: 'md', l: 'Orta' }, { v: 'lg', l: 'Büyük' }, { v: 'xl', l: 'XL' }];
                          return sizes.map(s => (
                            <button key={s.v} onClick={() => handleUpdateHotspot(page.id, selectedLayout.id, { label_size: s.v })} className={`py-1.5 rounded text-xs font-medium transition-all ${(selectedLayout.label_size || 'md') === s.v ? 'bg-secondary text-primary' : 'bg-dark/50 border border-white/10 text-textSecondary hover:border-secondary/40'}`}>
                              {s.l}
                            </button>
                          ));
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Label override */}
                  <div>
                    <label className="text-[10px] text-textSecondary uppercase mb-1 block">{selectedLayout.isTextOnly ? 'Yazı İçeriği' : 'Etikette Görünecek İsim (Opsiyonel)'}</label>
                    <input type="text" value={selectedLayout.label || ''} onChange={e => handleUpdateHotspot(page.id, selectedLayout.id, { label: e.target.value })} placeholder={selectedLayout.isTextOnly ? 'Bir metin yazın' : 'Otomatik isim gelsin'} className="w-full bg-dark/50 border border-white/10 rounded p-2 text-white text-sm outline-none focus:border-secondary" />
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-dark/50 border border-white/5 rounded-xl p-4 text-center">
                  <Move className="w-6 h-6 text-white/20 mx-auto mb-2" />
                  <p className="text-textSecondary text-xs">Tuvalden bir etiket veya görsel seçerek ürün bağlayın.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product list */}
            {page.layouts?.length > 0 && (
              <div className="bg-dark border border-white/10 rounded-xl p-4">
                <h4 className="font-bold text-white text-xs uppercase mb-2 tracking-wider">Eklenen Alanlar ({page.layouts.length})</h4>
                <div className="space-y-1.5">
                  {page.layouts.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setSelectedLayoutId(l.id === selectedLayoutId ? null : l.id)}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all ${l.id === selectedLayoutId ? 'bg-secondary/20 border border-secondary/40' : 'bg-white/5 border border-white/5 hover:border-white/20'}`}
                    >
                      <div className="w-8 h-8 shrink-0 rounded overflow-hidden bg-white/5 flex items-center justify-center">
                        {l.image_url ? (
                          <img src={l.image_url} alt="" className="max-w-full max-h-full object-contain" />
                        ) : l.listBlock ? (
                          <span className="text-[10px] text-blue-400 font-medium">Liste</span>
                        ) : (
                          <span className="text-[10px] text-white/30">Etiket</span>
                        )}
                      </div>
                      <span className="flex-1 text-xs text-white truncate">
                        {l.listBlock ? (l.label || `Liste ${l.number}`) : (l.label || `Alan ${l.number}`)}
                      </span>
                      {l.listBlock ? (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${(l.listItems && l.listItems.length > 0) ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {(l.listItems && l.listItems.length > 0) ? `${l.listItems.length} Ürün` : 'Öğe Yok'}
                        </span>
                      ) : (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${l.product_id ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {l.product_id ? '✓' : 'Bağlı değil'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Canvas preview ── */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="flex justify-between items-center w-full max-w-[360px] mb-2 self-start">
              <p className="text-xs text-textSecondary">
                <span className="text-secondary font-bold">Önizleme:</span> Etiketleri sürükleyip yemeklerin yanına bırakın
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-[10px] text-textSecondary">Kılavuz Çizgiler</span>
                <input type="checkbox" className="sr-only peer" checked={showGridLines} onChange={e => setShowGridLines(e.target.checked)} />
                <div className="w-7 h-4 bg-dark/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-textSecondary peer-checked:after:bg-secondary after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-secondary/20 relative"></div>
              </label>
            </div>
            <div
              data-canvas="true"
              className={`relative w-full max-w-[360px] ${hasBackground ? 'h-auto' : 'aspect-[9/16]'} bg-[#111] rounded-xl overflow-hidden border border-white/10 mx-auto`}
            >
              {showGridLines && (
                <div className="absolute inset-0 pointer-events-none z-50" style={{
                  backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '10% 5%'
                }} />
              )}
              {hasBackground ? (
                <>
                  <div className="relative w-full">
                    <img src={page.hero_image_url} alt="BG" className="w-full h-auto object-cover pointer-events-none select-none block opacity-90" draggable={false} />
                    <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                  </div>

                  {/* Title overlay - Right aligned (matches frontend) */}
                  <div className="absolute top-6 left-6 right-6 z-10 pointer-events-none text-right">
                    <h1 className="text-[clamp(1.1rem,4vw,1.4rem)] font-serif font-black text-white tracking-widest uppercase drop-shadow-lg leading-tight">
                      {page.title?.tr || 'KATEGORİ'}
                    </h1>
                  </div>

                  {/* Draggable product images AND their attached labels */}
                  {(page.layouts || []).filter(l => l.image_url).map(layout => (
                    <React.Fragment key={`group-${layout.id}`}>
                      <DraggableProductImage
                        layout={layout}
                        isSelected={selectedLayoutId === layout.id}
                        onSelect={() => setSelectedLayoutId(layout.id)}
                        onDragEnd={(x, y) => handleUpdateHotspot(page.id, layout.id, { x, y })}
                        allProducts={allProducts}
                      />
                      {(layout.product_id || layout.label) && (
                        <DraggableMarker
                          layout={layout}
                          isImageLabel={true}
                          isSelected={selectedLayoutId === layout.id}
                          onSelect={() => setSelectedLayoutId(layout.id)}
                          onDragEnd={(x, y) => handleUpdateHotspot(page.id, layout.id, { labelX: x, labelY: y })}
                          allProducts={allProducts}
                        />
                      )}
                    </React.Fragment>
                  ))}
                  
                  {/* Free Text Blocks */}
                  {(page.layouts || []).filter(l => l.isTextOnly).map(layout => (
                    <DraggableText
                      key={layout.id}
                      layout={layout}
                      isSelected={selectedLayoutId === layout.id}
                      onSelect={() => setSelectedLayoutId(layout.id)}
                      onDragEnd={(x, y) => handleUpdateHotspot(page.id, layout.id, { x, y })}
                    />
                  ))}

                  {/* Markers (no image, no listBlock, no textOnly) */}
                  {(page.layouts || []).filter(l => !l.image_url && !l.listBlock && !l.isTextOnly).map(layout => (
                    <DraggableMarker
                      key={layout.id}
                      layout={layout}
                      isSelected={selectedLayoutId === layout.id}
                      onSelect={() => setSelectedLayoutId(layout.id)}
                      onDragEnd={(x, y) => handleUpdateHotspot(page.id, layout.id, { x, y })}
                      allProducts={allProducts}
                    />
                  ))}

                  {/* List Blocks */}
                  {(page.layouts || []).filter(l => l.listBlock).map(layout => (
                    <DraggableListBlock
                      key={layout.id}
                      layout={layout}
                      isSelected={selectedLayoutId === layout.id}
                      onSelect={() => setSelectedLayoutId(layout.id)}
                      onDragEnd={(x, y) => handleUpdateHotspot(page.id, layout.id, { x, y })}
                      allProducts={allProducts}
                    />
                  ))}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30">
                  <ImageIcon className="w-12 h-12 mb-2 opacity-40" />
                  <p className="text-xs text-center px-4">Önce Photoshop tasarımınızı yükleyin</p>
                </div>
              )}
            </div>

            {/* Step hint */}
            {hasBackground && (
              <div className="mt-4 flex items-start gap-3 bg-dark/80 border border-white/5 rounded-xl p-3 max-w-[360px] w-full">
                <div className="text-secondary text-lg">💡</div>
                <div className="text-[11px] text-textSecondary leading-relaxed">
                  <strong className="text-white">Nasıl kullanılır?</strong><br />
                  1. Sol panelden <strong className="text-secondary">Ürün Görseli Seç</strong> → PNG yükle<br />
                  2. Görsel tuvalde belirir → sürükle, konumlandır<br />
                  3. Üstündeki listeden tıkla → ürün bağla
                </div>
              </div>
            )}
          </div>
        </div>

        <AutoLayoutWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          allProducts={allProducts}
          onApply={handleApplyAutoLayout}
          backgroundImageUrl={page.hero_image_url}
        />

        {/* PRODUCT IMAGE SELECT MODAL */}
        <AnimatePresence>
          {targetPageForProductSelect && (
            <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-dark border border-white/10 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-secondary" />
                    Veritabanından Ürün Seç
                  </h3>
                  <button onClick={() => setTargetPageForProductSelect(null)} className="text-textSecondary hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 flex-1 flex flex-col min-h-0">
                  <p className="text-sm text-textSecondary mb-4 shrink-0">Tuvale eklenecek ürünün görselini seçmek için aşağıdaki listeden ürün arayın.</p>
                  
                  <div className="mb-4 relative shrink-0">
                    <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ürün ara..."
                      value={productSelectSearchTerm}
                      onChange={e => setProductSelectSearchTerm(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-secondary outline-none transition-colors"
                    />
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-1 max-h-[300px]">
                    {allProducts
                      .filter(p => (p.name?.tr || p.name || '').toLowerCase().includes(productSelectSearchTerm.toLowerCase()))
                      .map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            const page = pages.find(pg => pg.id === targetPageForProductSelect);
                            if (page) {
                              const newLayout = {
                                id: crypto.randomUUID(),
                                x: 50, y: 50,
                                product_id: p.id,
                                label: p.name?.tr || p.name || '',
                                image_url: p.story_image_url || p.image_url || null,
                                size: 'md',
                                label_size: 'md',
                                zIndex: 20
                              };
                              handleUpdatePage(targetPageForProductSelect, { layouts: [...(page.layouts || []), newLayout] });
                              setSelectedLayoutId(newLayout.id);
                            }
                            setTargetPageForProductSelect(null);
                            setProductSelectSearchTerm('');
                          }}
                          className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded transition-colors text-left group border border-transparent hover:border-white/5"
                        >
                          <div className="flex items-center gap-3">
                            {p.story_image_url || p.image_url ? (
                              <img src={p.story_image_url || p.image_url} alt="" className="w-8 h-8 rounded object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                                <ImageIcon className="w-4 h-4 text-white/20" />
                              </div>
                            )}
                            <span className="text-sm text-white/80 group-hover:text-white transition-colors truncate max-w-[200px]">
                              {p.name?.tr || p.name}
                            </span>
                          </div>
                          <span className="text-xs text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                            Seç
                          </span>
                        </button>
                      ))}
                    {allProducts.filter(p => (p.name?.tr || p.name || '').toLowerCase().includes(productSelectSearchTerm.toLowerCase())).length === 0 && (
                      <div className="text-center py-4 text-textSecondary text-sm">
                        Eşleşen ürün bulunamadı.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ════════════════════════════════════════
     PAGE LIST VIEW
  ════════════════════════════════════════ */
  const ws = data.welcome_screen || {};

  return (
    <div className="space-y-6">

      {/* ── Welcome Screen Configuration ── */}
      <div className="bg-dark/50 border border-secondary/15 rounded-2xl p-6 flex flex-col gap-6">
        <div>
          <h3 className="text-white font-serif font-bold text-lg uppercase tracking-tight flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-secondary" />
            Karşılama Ekranı (İlk Sayfa)
          </h3>
          <p className="text-textSecondary text-xs mt-1 leading-relaxed">
            Menünün en başında çıkan şık açılış ekranını (Welcome Screen) buradan düzenleyebilirsiniz. Bu sayfa görsel menünün ilk slaytıdır.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Görseller */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-textSecondary uppercase mb-1 block">Arka Plan Görseli / Videosu</label>
              <div className="flex gap-2">
                <input type="text" value={ws.background_image_url || ''} onChange={e => handleWelcomeFieldChange('background_image_url', e.target.value)} placeholder="URL yapıştır veya yükle →" className="flex-1 bg-dark border border-white/10 rounded p-2 text-white text-sm" />
                <label className="flex items-center justify-center w-10 h-10 bg-secondary/20 hover:bg-secondary/30 text-secondary rounded cursor-pointer">
                  <input type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={e => handleWelcomeUpload(e, 'background_image_url', setIsWelcomeBgUploading)} disabled={isWelcomeBgUploading} />
                  {isWelcomeBgUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </label>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-textSecondary uppercase mb-1 block">Logo (Ortadaki Daire)</label>
              <div className="flex gap-2">
                <input type="text" value={ws.logo_url || ''} onChange={e => handleWelcomeFieldChange('logo_url', e.target.value)} placeholder="Logo URL" className="flex-1 bg-dark border border-white/10 rounded p-2 text-white text-sm" />
                <label className="flex items-center justify-center w-10 h-10 bg-secondary/20 hover:bg-secondary/30 text-secondary rounded cursor-pointer">
                  <input type="file" className="hidden" onChange={e => handleWelcomeUpload(e, 'logo_url', setIsLogoUploading)} disabled={isLogoUploading} />
                  {isLogoUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </label>
              </div>
            </div>
          </div>

          {/* Metinler */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-textSecondary uppercase mb-1 block">Büyük Başlık 1</label>
              <input type="text" value={ws.title1 !== undefined ? ws.title1 : 'PENNYLANE'} onChange={e => handleWelcomeFieldChange('title1', e.target.value)} placeholder="örn. PENNYLANE" className="w-full bg-dark border border-white/10 rounded p-2 text-white text-sm" />
            </div>
            <div>
              <label className="text-[10px] text-textSecondary uppercase mb-1 block">Büyük Başlık 2</label>
              <input type="text" value={ws.title2 !== undefined ? ws.title2 : 'GASTROPUB'} onChange={e => handleWelcomeFieldChange('title2', e.target.value)} placeholder="örn. GASTROPUB" className="w-full bg-dark border border-white/10 rounded p-2 text-white text-sm" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-textSecondary uppercase mb-1 block">Alt Başlık (Ufak)</label>
              <input type="text" value={ws.tagline !== undefined ? ws.tagline : 'GASTROPUB & EATERY'} onChange={e => handleWelcomeFieldChange('tagline', e.target.value)} placeholder="örn. GASTROPUB & EATERY" className="w-full bg-dark border border-white/10 rounded p-2 text-white text-sm" />
            </div>
            <div>
              <label className="text-[10px] text-textSecondary uppercase mb-1 block">Buton Yazısı</label>
              <input type="text" value={ws.cta_text !== undefined ? ws.cta_text : "LET'S START"} onChange={e => handleWelcomeFieldChange('cta_text', e.target.value)} placeholder="örn. Let's Start" className="w-full bg-dark border border-white/10 rounded p-2 text-white text-sm" />
            </div>
            <div>
              <label className="text-[10px] text-textSecondary uppercase mb-1 block">Fiyat Güncelleme Yazısı</label>
              <input type="text" value={ws.price_update_date || ''} onChange={e => handleWelcomeFieldChange('price_update_date', e.target.value)} placeholder="örn. Fiyat Güncelleme Tarihi: 06/05/2026" className="w-full bg-dark border border-white/10 rounded p-2 text-white text-sm" />
            </div>
          </div>

          {/* Arka Plan Görünüm Ayarları */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-textSecondary uppercase mb-1 block">Video Görünürlüğü (Saydamlık)</label>
              <div className="flex items-center gap-2">
                <input type="range" min="0" max="1" step="0.1" value={ws.bg_opacity !== undefined ? ws.bg_opacity : 0.6} onChange={e => handleWelcomeFieldChange('bg_opacity', parseFloat(e.target.value))} className="w-full accent-secondary" />
                <span className="text-white text-xs w-6 text-right">{ws.bg_opacity !== undefined ? ws.bg_opacity : 0.6}</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-textSecondary uppercase mb-1 block">Video Bulanıklığı (Blur)</label>
              <div className="flex items-center gap-2">
                <input type="range" min="0" max="20" step="1" value={ws.bg_blur !== undefined ? ws.bg_blur : 0} onChange={e => handleWelcomeFieldChange('bg_blur', parseInt(e.target.value))} className="w-full accent-secondary" />
                <span className="text-white text-xs w-6 text-right">{ws.bg_blur !== undefined ? ws.bg_blur : 0}px</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-textSecondary uppercase mb-1 block">Örtü Rengi (Filtre Rengi)</label>
              <div className="flex items-center gap-2">
                <input type="color" value={ws.overlay_color || '#000000'} onChange={e => handleWelcomeFieldChange('overlay_color', e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-dark border border-white/10 p-0" />
                <span className="text-white text-xs uppercase">{ws.overlay_color || '#000000'}</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-textSecondary uppercase mb-1 block">Örtü Yoğunluğu</label>
              <div className="flex items-center gap-2">
                <input type="range" min="0" max="1" step="0.1" value={ws.overlay_opacity !== undefined ? ws.overlay_opacity : 0.4} onChange={e => handleWelcomeFieldChange('overlay_opacity', parseFloat(e.target.value))} className="w-full accent-secondary" />
                <span className="text-white text-xs w-6 text-right">{ws.overlay_opacity !== undefined ? ws.overlay_opacity : 0.4}</span>
              </div>
            </div>
          </div>
        </div>



      </div>

      <div className="flex items-center justify-between mb-4 mt-8 pt-4 border-t border-white/5">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-secondary" />
          Görsel Menü Sayfaları
        </h3>
        <button onClick={handleAddPage} className="btn-primary py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Sayfa Ekle
        </button>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-20 bg-dark/50 border border-white/5 rounded-2xl">
          <ImageIcon className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <p className="text-textSecondary text-lg mb-6">Henüz bir görsel menü sayfası eklenmemiş.</p>
          <button onClick={handleAddPage} className="btn-outline">İlk Sayfayı Ekle</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...pages].sort((a, b) => a.sort_order - b.sort_order).map(page => (
            <div key={page.id} className="bg-dark border border-white/10 rounded-xl overflow-hidden group hover:border-secondary/50 transition-all">
              <div className="aspect-video bg-[#111] relative overflow-hidden">
                {page.hero_image_url
                  ? <img src={page.hero_image_url} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                  : <div className="absolute inset-0 flex items-center justify-center"><ImageIcon className="w-8 h-8 text-white/20" /></div>}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded text-xs border ${page.active ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                    {page.active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-base font-bold text-white mb-1">{page.title?.tr || 'İsimsiz Sayfa'}</h4>
                <p className="text-xs text-textSecondary mb-3">{page.layouts?.length || 0} ürün noktası</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingPageId(page.id); setSelectedLayoutId(null); }} className="flex-1 bg-secondary text-primary py-2 rounded font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-sm">
                    <Edit2 className="w-4 h-4" /> Düzenle
                  </button>
                  <button onClick={() => handleDeletePage(page.id)} className="p-2 border border-red-500/30 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryMenuBuilder;
