import React, { useState, useRef, useCallback } from 'react';
import { Plus, Trash2, Edit2, ImageIcon, Upload, Loader2, Move, Smartphone, Search, ChevronDown, Check, X } from 'lucide-react';
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
    return name.toLowerCase().includes(searchTerm.toLowerCase());
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
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-white/10 rounded shadow-xl overflow-hidden"
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
            <div className="max-h-48 overflow-y-auto custom-scrollbar">
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
   MAIN COMPONENT
───────────────────────────────────────────── */
const StoryMenuBuilder = ({ data, setData, setHasChanges }) => {
  const storyMenu = data.storyMenu || { pages: [] };
  const pages = storyMenu.pages || [];

  const [editingPageId, setEditingPageId] = useState(null);
  const [selectedLayoutId, setSelectedLayoutId] = useState(null);
  const [isBgUploading, setIsBgUploading] = useState(false);
  const [isProductUploading, setIsProductUploading] = useState(false);

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
  (data.menu?.categories || []).forEach(cat => (cat.items || []).forEach(item => allProducts.push(item)));

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
            <div className={`mb-6 flex gap-2 ${!hasBackground ? 'opacity-40 pointer-events-none' : ''}`}>
              <button onClick={() => handleAddMarker(page.id)} disabled={!hasBackground} className="flex-1 py-2 rounded-lg bg-dark/50 border border-secondary/20 hover:border-secondary/50 text-textSecondary hover:text-white transition-all flex flex-col items-center justify-center gap-1 group">
                <div className="w-6 h-6 rounded bg-black/50 border border-white/20 flex flex-col items-center justify-center shadow-md">
                  <span className="text-white text-[6px] font-bold">FİYAT</span>
                </div>
                <span className="text-[10px] font-medium">Serbest Etiket</span>
              </button>
              <label className="flex-1 py-2 rounded-lg bg-secondary/10 border border-secondary/30 hover:bg-secondary/20 hover:border-secondary/60 text-secondary transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group">
                <input type="file" accept="image/*" className="hidden" onChange={e => handleNewProductImageUpload(e, page.id)} disabled={isProductUploading || !hasBackground} />
                {isProductUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                ) : (
                  <div className="w-6 h-6 rounded border-2 border-dashed border-secondary/50 flex items-center justify-center group-hover:border-secondary transition-colors">
                    <ImageIcon className="w-3 h-3 text-secondary" />
                  </div>
                )}
                <span className="text-[10px] font-bold">Ürün Görseli Seç</span>
              </label>
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

                  {/* Step 3: Link product */}
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
                        });
                      }}
                      placeholder="-- Ürün Seçin --"
                    />
                  </div>

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
                  {(selectedLayout.label || selectedLayout.product_id || !selectedLayout.image_url) && (
                    <div>
                      <label className="text-[10px] text-textSecondary uppercase mb-1 block">🏷️ Etiket / Fiyat Boyutu</label>
                      <div className="grid grid-cols-4 gap-1">
                        {[{ v: 'sm', l: 'Küçük' }, { v: 'md', l: 'Orta' }, { v: 'lg', l: 'Büyük' }, { v: 'xl', l: 'XL' }].map(s => (
                          <button key={s.v} onClick={() => handleUpdateHotspot(page.id, selectedLayout.id, { label_size: s.v })} className={`py-1.5 rounded text-xs font-medium transition-all ${(selectedLayout.label_size || 'md') === s.v ? 'bg-secondary text-primary' : 'bg-dark/50 border border-white/10 text-textSecondary hover:border-secondary/40'}`}>
                            {s.l}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Label override */}
                  <div>
                    <label className="text-[10px] text-textSecondary uppercase mb-1 block">Etikette Görünecek İsim (Opsiyonel)</label>
                    <input type="text" value={selectedLayout.label || ''} onChange={e => handleUpdateHotspot(page.id, selectedLayout.id, { label: e.target.value })} placeholder="Otomatik isim gelsin" className="w-full bg-dark/50 border border-white/10 rounded p-2 text-white text-sm outline-none focus:border-secondary" />
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
                        {l.image_url ? <img src={l.image_url} alt="" className="max-w-full max-h-full object-contain" /> : <span className="text-[10px] text-white/30">Etiket</span>}
                      </div>
                      <span className="flex-1 text-xs text-white truncate">{l.label || `Alan ${l.number}`}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${l.product_id ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {l.product_id ? '✓' : 'Bağlı değil'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Canvas preview ── */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <p className="text-xs text-textSecondary mb-2 self-start">
              <span className="text-secondary font-bold">Önizleme:</span> Etiketleri sürükleyip yemeklerin yanına bırakın
            </p>
            <div
              data-canvas="true"
              className={`relative w-full max-w-[360px] ${hasBackground ? 'h-auto' : 'aspect-[9/16]'} bg-[#111] rounded-xl overflow-hidden border border-white/10 mx-auto`}
            >
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
                  
                  {/* Markers (no image) */}
                  {(page.layouts || []).filter(l => !l.image_url).map(layout => (
                    <DraggableMarker
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
