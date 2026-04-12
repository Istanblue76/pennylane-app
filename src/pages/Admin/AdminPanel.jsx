import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  Save, LogOut, Layout, Image as ImageIcon, Menu as MenuIcon, Info, 
  Settings, Users, Calendar, Mail, CheckCircle, Smartphone, Monitor, Upload, Download, X,
  List, LayoutGrid, Sun, Moon, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getVal, updateVal } from '../../utils/i18n';
import Button from '../../components/Common/Button';

const AdminPanel = ({ initialData }) => {
  const [data, setData] = useState(initialData);
  const { lang, setLang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminTab') || 'hero');
  const [saveStatus, setSaveStatus] = useState('idle');
  const [selectedCategoryAdmin, setSelectedCategoryAdmin] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [managementMode, setManagementMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.menu?.categories?.length > 0 && !selectedCategoryAdmin) {
      setSelectedCategoryAdmin(data.menu.categories[0].id);
    }
  }, [data, selectedCategoryAdmin]);

  useEffect(() => {
    localStorage.setItem('adminTab', activeTab);
    setManagementMode(false);
  }, [activeTab]);

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/login');
    }
  }, [navigate]);

  if (!data) return null;

  const exportToExcel = () => {
    const fileName = `pennylane_menu_${new Date().toISOString().split('T')[0]}.xlsx`;
    const rows = [];
    
    (data.menu?.categories || []).forEach(cat => {
      const catName = cat.title?.tr || cat.title || '';
      cat.items?.forEach(item => {
        // Look up subcategory name by its ID
        const subCat = cat.subcategories?.find(s => s.id === item.subcategory);
        const subCatName = subCat?.title?.tr || '';
        
        rows.push({
          'Kategori': catName,
          'Alt_Kategori': subCatName,
          'Urun_ID': item.id,
          'Urun_TR': item.name?.tr || item.name || '',
          'Urun_EN': item.name?.en || '',
          'Fiyat': item.price || '',
          'Aciklama_TR': item.description?.tr || item.description || '',
          'Aciklama_EN': item.description?.en || '',
          'Gorsel_URL': item.image_url || '',
          'Alerjenler': item.allergens?.join(',') || '',
          'Pasif': item.passive ? 'EVET' : 'HAYIR'
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pennylane Menu");
    XLSX.writeFile(workbook, fileName);
  };

  // Convert Turkish text to a URL-safe slug for internal IDs
  const toSlug = (str) => String(str)
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');


  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bstr = event.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws);
        
        if (rawData.length === 0) {
          alert("DOSYA BOŞ! Lütfen geçerli bir menü listesi seçin.");
          return;
        }

        const replaceMode = confirm(
          `Excel dosyasından ${rawData.length} ürün bulundu.\n\n` +
          `▶ TAMAM = Tüm mevcut menüyü SİL ve Excel'i sıfırdan yükle (tam değiştirme)\n` +
          `▶ İPTAL = Mevcut menüyü koru, sadece değişiklikler eklensin (birleştirme)`
        );

        if (replaceMode === null) return;

        const existing = data.menu?.categories || [];

        // Build category map keyed by normalized Turkish name
        const categoryMap = {};
        rawData.forEach(row => {
          // Support both new format (Kategori) and legacy (Kategori_TR)
          const catName = String(row.Kategori || row.Kategori_TR || '').trim();
          if (!catName) return;
          const key = catName.toLowerCase();
          if (!categoryMap[key]) {
            // Preserve existing category ID and subcategories if name matches
            const existingCat = existing.find(c =>
              (c.title?.tr || '').toLowerCase() === key
            );
            categoryMap[key] = {
              id: existingCat?.id || toSlug(catName) || `cat-${Math.random().toString(36).substr(2,6)}`,
              title: { tr: catName, en: existingCat?.title?.en || String(row.Kategori_EN || '') },
              subcategories: existingCat?.subcategories || [],
              items: []
            };
          }
        });

        // Build items into their categories
        rawData.forEach(row => {
          const catName = String(row.Kategori || row.Kategori_TR || '').trim();
          const urunTR = String(row.Urun_TR || '').trim();
          if (!catName || !urunTR) return;

          const cat = categoryMap[catName.toLowerCase()];
          if (!cat) return;

          const urunId = String(row.Urun_ID || '').trim() || `item-${Math.random().toString(36).substr(2, 9)}`;

          // Resolve subcategory by name (Alt_Kategori column or legacy Subcategori_ID)
          const subName = String(row.Alt_Kategori || row.Subcategori_ID || '').trim();
          let resolvedSubId = null;
          if (subName && cat.subcategories?.length) {
            const matchedSub = cat.subcategories.find(s =>
              (s.title?.tr || '').toLowerCase() === subName.toLowerCase()
            );
            resolvedSubId = matchedSub?.id || null;
          }

          cat.items.push({
            id: urunId,
            name: { tr: urunTR, en: String(row.Urun_EN || '') },
            price: String(row.Fiyat !== undefined ? row.Fiyat : '0'),
            description: { tr: String(row.Aciklama_TR || ''), en: String(row.Aciklama_EN || '') },
            image_url: String(row.Gorsel_URL || '/assets/img/pennylane-default.png'),
            allergens: row.Alerjenler ? String(row.Alerjenler).split(',').map(s => s.trim()).filter(Boolean) : [],
            passive: row.Pasif === 'EVET',
            subcategory: resolvedSubId
          });
        });

        let finalCategories;

        if (replaceMode) {
          finalCategories = Object.values(categoryMap);
          alert(`TAM AKTARMA TAMAMLANDI! ${finalCategories.length} kategori ve ${rawData.length} ürün yüklendi.`);
        } else {
          const mergedCategories = JSON.parse(JSON.stringify(existing));
          Object.values(categoryMap).forEach(excelCat => {
            let existingCat = mergedCategories.find(c => c.id === excelCat.id);
            if (!existingCat) {
              existingCat = { ...excelCat, items: [] };
              mergedCategories.push(existingCat);
            }
            excelCat.items.forEach(newItem => {
              const found = existingCat.items.find(i => i.id === newItem.id);
              if (found) {
                found.name = newItem.name;
                found.price = newItem.price;
                found.description = newItem.description;
                if (newItem.image_url) found.image_url = newItem.image_url;
                if (newItem.allergens.length) found.allergens = newItem.allergens;
                found.passive = newItem.passive;
                if (newItem.subcategory) found.subcategory = newItem.subcategory;
              } else {
                existingCat.items.push(newItem);
              }
            });
          });
          finalCategories = mergedCategories;
          alert("GÜVENLİ BİRLEŞTİRME TAMAMLANDI! Excel'deki değişiklikler mevcuda eklendi.");
        }

        setData({ ...data, menu: { ...data.menu, categories: finalCategories } });
        setHasChanges(true);
        if (finalCategories.length > 0) setSelectedCategoryAdmin(finalCategories[0].id);
      } catch (err) {
        alert("GEÇERSİZ DOSYA! Lütfen Pennylane menü formatına uygun bir Excel dosyası yükleyin.");
        console.error(err);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = null;
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const resp = await axios.post('/api/cms/update', data);
      if (resp.data.status === 'success') {
        setSaveStatus('success');
        setHasChanges(false);
        window.dispatchEvent(new Event('cms-update'));
        setTimeout(() => setSaveStatus('idle'), 1500);
      }
    } catch (err) {
      alert('Kaydetme hatası!');
      setSaveStatus('idle');
    }
  };

  const updateField = (section, field, value) => {
    setData({
      ...data,
      [section]: {
        ...data[section],
        [field]: value
      }
    });
    setHasChanges(true);
  };

  const handleAddItem = (section, collectionName, template) => {
    setData({
      ...data,
      [section]: {
        ...data[section],
        [collectionName]: [...data[section][collectionName], template]
      }
    });
    setHasChanges(true);
  };

  const handleRemoveItem = (section, collectionName, idx) => {
    const newArr = [...data[section][collectionName]];
    newArr.splice(idx, 1);
    setData({
      ...data,
      [section]: { ...data[section], [collectionName]: newArr }
    });
    setHasChanges(true);
  };

  const handleImageUpload = async (e, section, field, nestedPath = null, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const resp = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (resp.data.status === 'success') {
        if (nestedPath && index !== null) {
          const newArray = [...data[section][nestedPath]];
          newArray[index][field] = resp.data.url;
          setData({ ...data, [section]: { ...data[section], [nestedPath]: newArray }});
        } else {
          updateField(section, field, resp.data.url);
        }
      }
    } catch (err) {
      alert('Görsel yüklenemedi.');
    }
  };

  const navItems = [
    { id: 'hero', label: 'HERO', icon: Layout },
    { id: 'menu_showcase', label: 'Spesiyaller', icon: MenuIcon },
    { id: 'menu', label: 'Menü Yönetimi', icon: MenuIcon },
    { id: 'about', label: 'HAKKIMIZDA', icon: Info },
    { id: 'gallery', label: 'GALERİ', icon: ImageIcon },
    { id: 'events', label: 'ETKİNLİKLER', icon: Calendar },
    { id: 'team', label: 'EKİP', icon: Users },
    { id: 'newsletter', label: 'BÜLTEN', icon: Mail },
    { id: 'allergens', label: 'ALERJENLER', icon: Info },
    { id: 'footer', label: 'FOOTER', icon: Settings },
    { id: 'settings', label: 'MENÜ AYARLARI', icon: Settings },
    { id: 'print_menu', label: 'BASKI MENÜSÜ', icon: Download },
  ];

  const ImageUploader = ({ label, value, onChange }) => (
    <div className="space-y-4">
      <label className="text-xs uppercase font-bold text-secondary tracking-widest">{label}</label>
      <div className="flex items-center space-x-6">
        {value && <img src={value} className="w-24 h-24 object-cover rounded-xl border border-secondary/20" alt="Preview" />}
        <label className="cursor-pointer bg-dark/60 border border-secondary/20 rounded-xl px-4 py-3 flex items-center space-x-2 hover:border-secondary transition-all">
          <Upload className="w-4 h-4 text-secondary" />
          <span className="text-sm text-textSecondary uppercase font-bold tracking-widest">Görsel Seç</span>
          <input type="file" className="hidden" accept="image/*" onChange={onChange} />
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark flex flex-col md:flex-row p-4 md:p-10 space-y-6 md:space-y-0 md:space-x-10 text-white font-sans">
      <aside className="w-full md:w-80 bg-primary/40 backdrop-blur-xl border-2 border-secondary/20 p-6 rounded-3xl flex flex-col md:h-[calc(100vh-80px)] sticky top-10 overflow-hidden">
        <div className="flex flex-col items-center mb-6 border-b border-secondary/20 pb-6 text-center flex-shrink-0">
          <img src="/assets/img/pennylane_logo_white.png" alt="Logo" className="h-10 mb-4" />
          <span className="font-serif font-bold text-lg uppercase tracking-widest text-secondary">PENNYLANE CMS</span>
        </div>

        <nav className="flex flex-col space-y-2 pr-2 mb-6 overflow-y-auto custom-scrollbar flex-grow">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 text-xs font-semibold tracking-widest uppercase ${
                activeTab === item.id ? 'bg-secondary text-primary shadow-lg shadow-secondary/20 scale-[1.02]' : 'text-textSecondary hover:bg-secondary/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{t(item.label)}</span>
            </button>
          ))}
        </nav>

        {/* Global Language Toggle in Admin */}
        <div className="mb-6 px-4">
          <div className="flex items-center justify-between bg-dark/40 rounded-xl p-1.5 border border-secondary/20">
            <span className="text-[9px] font-bold text-textSecondary ml-2 uppercase tracking-widest">Yönetim Dili:</span>
            <div className="flex">
              <button 
                onClick={() => setLang('tr')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 ${lang === 'tr' ? 'bg-secondary text-primary shadow-lg shadow-secondary/10' : 'text-textSecondary hover:text-white'}`}
              >
                TR
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 ${lang === 'en' ? 'bg-secondary text-primary shadow-lg shadow-secondary/10' : 'text-textSecondary hover:text-white'}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-secondary/20 flex flex-col space-y-3 flex-shrink-0">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button 
              onClick={handleSave} 
              disabled={saveStatus === 'saving'} 
              className={`w-full flex items-center justify-center space-x-2 shadow-lg transition-all duration-500 py-2 rounded-lg text-xs font-black tracking-[0.2em] uppercase border-2 ${saveStatus === 'success' ? 'bg-green-600 border-green-400 text-white' : 'bg-secondary text-primary border-secondary ring-2 ring-secondary/10'}`}
            >
              {saveStatus === 'saving' ? 'KAYDEDİLİYOR...' : (saveStatus === 'success' ? <><CheckCircle className="w-3.5 h-3.5" /> <span>KAYDEDİLDİ</span></> : <><Save className="w-3.5 h-3.5" /> <span>KAYDET</span></>)}
            </button>
          </motion.div>
          <button 
            onClick={() => { localStorage.removeItem('adminToken'); navigate('/login'); }}
            className="text-textSecondary flex items-center justify-center space-x-2 py-3 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            <span>ÇIKIŞ YAP</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 space-y-10 max-w-5xl">
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-secondary/10">
          <div>
            <h2 className="text-3xl font-serif font-bold text-white uppercase tracking-tight mb-1">{(navItems.find(i => i.id === activeTab)?.label || 'AYARLAR')} YÖNETİMİ</h2>
            <p className="text-textSecondary text-sm font-light italic">Bu bölümdeki içerik ve görselleri anlık olarak değiştirebilirsiniz.</p>
          </div>
        </header>

        <section className="bg-primary/20 backdrop-blur-md p-8 md:p-12 border border-secondary/10 rounded-3xl shadow-2xl">
          <AnimatePresence mode="wait">
            
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                <div className="bg-secondary/5 p-8 rounded-3xl border border-secondary/10 space-y-8">
                   <div className="flex items-center space-x-4 mb-2">
                      <div className="w-10 h-10 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/20">
                         <LayoutGrid className="w-5 h-5" />
                      </div>
                      <div>
                         <h4 className="text-xl font-serif font-black text-white uppercase tracking-tight">QR MENÜ GÖRÜNÜM MODU</h4>
                         <p className="text-textSecondary text-xs font-light italic">Müşterilerin menünüzü nasıl keşfedeceğini buradan belirleyin.</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { id: 'all', label: 'HEPSİ (HİBRİT)', desc: 'Müşteri büyük veya küçük görünüm arasında seçim yapabilir.', icon: Layout },
                        { id: 'small', label: 'BÜYÜK (KATEGORİ)', desc: 'Önce dev kategori kartları gözükür, içine girince ürünler açılır.', icon: List },
                        { id: 'large', label: 'KÜÇÜK (TAM LİSTE)', desc: 'Tüm ürünler narin bir liste/grid akışında sergilenir.', icon: LayoutGrid }
                      ].map((mode) => {
                        const isActive = (data.settings?.menu_display_mode || 'all') === mode.id;
                        return (
                          <button 
                            key={mode.id}
                            onClick={() => {
                              setData({...data, settings: {...(data.settings || {}), menu_display_mode: mode.id}});
                              setHasChanges(true);
                            }}
                            className={`p-6 rounded-2xl border-2 text-left transition-all relative group ${isActive ? 'bg-secondary border-secondary text-primary shadow-xl shadow-secondary/10 scale-[1.02]' : 'bg-dark/40 border-secondary/10 text-white hover:border-secondary/30'}`}
                          >
                             <div className={`mb-4 w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-primary text-secondary' : 'bg-secondary/10 text-secondary'}`}>
                                <mode.icon className="w-5 h-5" />
                             </div>
                             <h5 className="font-black text-xs uppercase tracking-widest mb-2">{mode.label}</h5>
                             <p className={`text-[10px] leading-relaxed ${isActive ? 'text-primary' : 'text-textSecondary'}`}>{mode.desc}</p>
                             {isActive && <div className="absolute top-4 right-4 bg-primary rounded-full p-1"><CheckCircle className="w-3 h-3 text-secondary" /></div>}
                          </button>
                        );
                      })}
                   </div>
                </div>

                <div className="bg-dark/40 p-8 rounded-3xl border border-secondary/10">
                   <h5 className="text-secondary font-black text-xs uppercase tracking-widest mb-6 flex items-center space-x-2">
                      <Sun className="w-4 h-4" />
                      <span>MENÜ TEMASI (AÇIK / KOYU)</span>
                   </h5>
                   <div className="flex space-x-4">
                      {[
                        { id: 'dark', label: 'KOYU TEMA (NIGHT)', icon: Moon },
                        { id: 'light', label: 'AÇIK TEMA (DAY)', icon: Sun }
                      ].map((tMode) => {
                        const isActive = (data.settings?.theme || 'dark') === tMode.id;
                        return (
                          <button 
                            key={tMode.id}
                            onClick={() => {
                              setData({...data, settings: {...(data.settings || {}), theme: tMode.id}});
                              setHasChanges(true);
                            }}
                            className={`flex-1 p-5 rounded-2xl border-2 text-left transition-all ${isActive ? 'bg-secondary border-secondary text-primary shadow-xl shadow-secondary/10 scale-[1.02]' : 'bg-dark/40 border-secondary/10 text-white hover:border-secondary/30'}`}
                          >
                             <div className="flex items-center justify-between mb-3">
                                <tMode.icon className="w-5 h-5 text-secondary" />
                                {isActive && <CheckCircle className="w-4 h-4 text-primary" />}
                             </div>
                             <h6 className="font-black text-[11px] uppercase tracking-[0.2em]">{tMode.label}</h6>
                          </button>
                        );
                      })}
                   </div>
                   <p className="mt-6 text-textSecondary text-[10px] italic">Bu ayar QR Menü sayfasının arka plan ve yazı renklerini anında değiştirir. Pennylane atmosferini günün saatine göre optimize edin.</p>
                </div>

              </motion.div>
            )}
            {activeTab === 'hero' && (
              <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-secondary tracking-widest flex items-center space-x-2">
                      <span>ANA BAŞLIK</span>
                      <span className="bg-secondary/20 text-secondary px-1.5 py-0.5 rounded text-[8px]">{lang.toUpperCase()}</span>
                    </label>
                    <input type="text" className="w-full bg-dark/60 border border-secondary/20 rounded-xl px-6 py-4 text-white focus:border-secondary outline-none transition-all" value={getVal(data.hero.main_heading, lang)} onChange={e => {
                      setData({ ...data, hero: { ...data.hero, main_heading: updateVal(data.hero.main_heading, lang, e.target.value) } });
                      setHasChanges(true);
                    }} />
                    <div className="pt-2">
                       <label className="text-[10px] uppercase font-bold text-textSecondary tracking-widest mr-4">YAZI BOYUTU:</label>
                       <select className="bg-dark border border-secondary/20 rounded-lg px-3 py-1 text-xs text-white outline-none" value={data.hero.main_heading_size || 'buyuk'} onChange={e => updateField('hero', 'main_heading_size', e.target.value)}>
                          <option value="kucuk">Küçük</option>
                          <option value="orta">Orta</option>
                          <option value="buyuk">Büyük (Varsayılan)</option>
                          <option value="cok-buyuk">Devasa</option>
                       </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-secondary tracking-widest flex items-center space-x-2">
                      <span>ALT BAŞLIK</span>
                      <span className="bg-secondary/20 text-secondary px-1.5 py-0.5 rounded text-[8px]">{lang.toUpperCase()}</span>
                    </label>
                    <input type="text" className="w-full bg-dark/60 border border-secondary/20 rounded-xl px-6 py-4 text-white focus:border-secondary outline-none transition-all" value={getVal(data.hero.sub_heading, lang)} onChange={e => {
                      setData({ ...data, hero: { ...data.hero, sub_heading: updateVal(data.hero.sub_heading, lang, e.target.value) } });
                      setHasChanges(true);
                    }} />
                    <div className="pt-2">
                       <label className="text-[10px] uppercase font-bold text-textSecondary tracking-widest mr-4">YAZI BOYUTU:</label>
                       <select className="bg-dark border border-secondary/20 rounded-lg px-3 py-1 text-xs text-white outline-none" value={data.hero.sub_heading_size || 'orta'} onChange={e => updateField('hero', 'sub_heading_size', e.target.value)}>
                          <option value="kucuk">Küçük</option>
                          <option value="orta">Orta (Varsayılan)</option>
                          <option value="buyuk">Büyük</option>
                       </select>
                    </div>
                  </div>
                </div>
                <ImageUploader label="ARKA PLAN GÖRSELİ" value={data.hero.background_image_url} onChange={(e) => handleImageUpload(e, 'hero', 'background_image_url')} />
              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-secondary tracking-widest flex items-center space-x-2">
                    <span>BÖLÜM BAŞLIĞI</span>
                    <span className="bg-secondary/20 text-secondary px-1.5 py-0.5 rounded text-[8px]">{lang.toUpperCase()}</span>
                  </label>
                  <input type="text" className="w-full bg-dark/60 border border-secondary/20 rounded-xl px-6 py-4 text-white focus:border-secondary" value={getVal(data.about.section_title, lang)} onChange={e => {
                    setData({ ...data, about: { ...data.about, section_title: updateVal(data.about.section_title, lang, e.target.value) } });
                    setHasChanges(true);
                  }} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-secondary tracking-widest flex items-center space-x-2">
                    <span>ANA BAŞLIK</span>
                    <span className="bg-secondary/20 text-secondary px-1.5 py-0.5 rounded text-[8px]">{lang.toUpperCase()}</span>
                  </label>
                  <input type="text" className="w-full bg-dark/60 border border-secondary/20 rounded-xl px-6 py-4 text-white focus:border-secondary" value={getVal(data.about.main_heading, lang)} onChange={e => {
                    setData({ ...data, about: { ...data.about, main_heading: updateVal(data.about.main_heading, lang, e.target.value) } });
                    setHasChanges(true);
                  }} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                   <ImageUploader label="ANA GÖRSEL" value={data.about.main_image_url} onChange={(e) => handleImageUpload(e, 'about', 'main_image_url')} />
                   <ImageUploader label="İKİNCİ GÖRSEL (OPSİYONEL)" value={data.about.secondary_image_url} onChange={(e) => handleImageUpload(e, 'about', 'secondary_image_url')} />
                </div>
                
                <div className="bg-secondary/10 px-6 py-4 rounded-xl border border-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                   <div className="space-y-1 text-center sm:text-left">
                       <h5 className="text-secondary font-bold text-sm tracking-wide uppercase">Görsel Efekti Seçimi</h5>
                       <p className="text-textSecondary text-[10px] md:text-xs">Fotoğrafların stilini ve filtrelenmesini tek tuşla değiştirin.</p>
                   </div>
                   <select 
                       className="bg-dark border border-secondary/30 text-white px-4 py-2 rounded-lg text-sm font-bold tracking-widest outline-none pr-8 cursor-pointer focus:border-secondary"
                       value={data.about.image_effect || 'grayscale'}
                       onChange={e => setData({...data, about: {...data.about, image_effect: e.target.value}})}
                   >
                       <option value="">Orijinal (Renkleri Koru)</option>
                       <option value="grayscale">Siyah Beyaz (Grayscale)</option>
                       <option value="sepia">Eskitme (Sepia)</option>
                       <option value="saturate-200">Canlı Renkler (Saturated)</option>
                       <option value="contrast-125 saturate-50">Sinematik (Moody)</option>
                       <option value="blur-[2px] transition hover:blur-none">Hafif Bulanık (Hover: Net)</option>
                   </select>
                </div>
                
                <h4 className="text-secondary font-bold pt-6 border-t border-secondary/10 uppercase tracking-widest">Açıklama Metinleri</h4>
                {data.about.paragraphs.map((p, idx) => (
                  <textarea key={idx} className="w-full bg-dark/60 border border-secondary/20 rounded-xl px-6 py-4 text-white text-sm h-32 focus:border-secondary transition-all resize-none overflow-y-auto" value={getVal(p.text, lang)} onChange={e => {
                    const arr = [...data.about.paragraphs]; 
                    arr[idx].text = updateVal(arr[idx].text, lang, e.target.value); 
                    setData({...data, about: {...data.about, paragraphs: arr}});
                    setHasChanges(true);
                  }} />
                ))}

                <h4 className="text-secondary font-bold pt-6 border-t border-secondary/10 uppercase tracking-widest">Öne Çıkan Kutu (Biz Kimiz?)</h4>
                <div className="space-y-6 bg-dark/20 p-6 rounded-xl border border-secondary/10">
                   <div className="space-y-2">
                       <div className="flex items-center space-x-2">
                         <label className="text-xs uppercase font-bold text-secondary tracking-widest mb-1">Kutu Başlığı</label>
                         <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                       </div>
                       <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-5 py-4 text-white font-serif font-bold text-lg focus:border-secondary outline-none transition-colors" value={getVal(data.about.highlight_box?.title, lang)} onChange={e => {
                         setData({...data, about: {...data.about, highlight_box: {...data.about.highlight_box, title: updateVal(data.about.highlight_box?.title, lang, e.target.value)}}});
                         setHasChanges(true);
                       }} />
                   </div>
                   <div className="space-y-2">
                       <div className="flex items-center space-x-2">
                         <label className="text-xs uppercase font-bold text-secondary tracking-widest mb-1">Kutu Metni</label>
                         <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                       </div>
                       <textarea className="w-full bg-dark border border-secondary/20 rounded-lg px-5 py-4 text-white text-sm h-32 resize-none overflow-y-auto focus:border-secondary outline-none transition-colors leading-relaxed" value={getVal(data.about.highlight_box?.content, lang)} onChange={e => {
                         setData({...data, about: {...data.about, highlight_box: {...data.about.highlight_box, content: updateVal(data.about.highlight_box?.content, lang, e.target.value)}}});
                         setHasChanges(true);
                       }} />
                   </div>
                </div>

                <h4 className="text-secondary font-bold pt-6 border-t border-secondary/10 uppercase tracking-widest">İstatistikler</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {data.about.stats.map((stat, idx) => (
                        <div key={idx} className="bg-dark/40 p-4 rounded-lg border border-secondary/20 space-y-3">
                            <div className="space-y-1">
                                <label className="text-[10px] text-textSecondary uppercase font-bold">Değer (Örn: 15+)</label>
                                <input type="text" className="w-full bg-dark border border-secondary/10 rounded px-3 py-2 text-white font-serif font-bold text-xl text-center" value={stat.number} onChange={e => {
                                    const arr = [...data.about.stats]; arr[idx].number = e.target.value; setData({...data, about: {...data.about, stats: arr}});
                                    setHasChanges(true);
                                }} />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-center space-x-2">
                                 <label className="text-[10px] text-textSecondary uppercase font-bold">Etiket</label>
                                 <span className={`text-[7px] px-1 py-0.2 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                                </div>
                                <input type="text" className="w-full bg-dark border border-secondary/10 rounded px-3 py-2 text-white text-xs text-center uppercase tracking-widest" value={getVal(stat.label, lang)} onChange={e => {
                                    const arr = [...data.about.stats]; 
                                    arr[idx].label = updateVal(arr[idx].label, lang, e.target.value); 
                                    setData({...data, about: {...data.about, stats: arr}});
                                    setHasChanges(true);
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'gallery' && (
              <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <label className="text-xs uppercase font-bold text-secondary tracking-widest">BÖLÜM BAŞLIĞI</label>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                  </div>
                  <input type="text" className="w-full bg-dark/60 border border-secondary/20 rounded-xl px-6 py-4 text-white" value={getVal(data.gallery.section_title, lang)} onChange={e => {
                    setData({...data, gallery: {...data.gallery, section_title: updateVal(data.gallery.section_title, lang, e.target.value)}});
                    setHasChanges(true);
                  }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {data.gallery.images.map((img, idx) => (
                    <div key={idx} className="bg-dark/40 p-6 rounded-2xl border border-secondary/10 space-y-4 relative group">
                       <button onClick={() => handleRemoveItem('gallery', 'images', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-[10px] font-bold uppercase z-10 bg-dark px-2 py-1 rounded border border-red-500/20">SİL</button>
                       <ImageUploader label={`GÖRSEL ${idx+1}`} value={img.image_url} onChange={(e) => handleImageUpload(e, 'gallery', 'image_url', 'images', idx)} />
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <div className="flex items-center space-x-2">
                               <label className="text-[10px] uppercase font-bold text-secondary tracking-widest">Başlık</label>
                               <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                             </div>
                             <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-2 text-white text-xs outline-none focus:border-secondary transition-colors" value={getVal(img.caption, lang)} onChange={e => {
                                const arr = [...data.gallery.images]; arr[idx].caption = updateVal(img.caption, lang, e.target.value); setData({...data, gallery: {...data.gallery, images: arr}});
                                setHasChanges(true);
                             }} placeholder="Başlık / Açıklama" />
                          </div>
                          <div className="space-y-1">
                             <label className="text-[10px] uppercase font-bold text-secondary tracking-widest">Kategori</label>
                             <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-2 text-white text-xs outline-none focus:border-secondary transition-colors" value={img.category || ''} onChange={e => {
                                const arr = [...data.gallery.images]; arr[idx].category = e.target.value; setData({...data, gallery: {...data.gallery, images: arr}});
                                setHasChanges(true);
                             }} placeholder="ör: events, drinks" />
                          </div>
                       </div>
                    </div>
                  ))}
                  <button onClick={() => handleAddItem('gallery', 'images', { id: Date.now().toString(), image_url: '', category: 'all', caption: 'Yeni Görsel' })} className="border-2 border-dashed border-secondary/30 rounded-xl flex items-center justify-center p-8 text-secondary font-bold hover:bg-secondary/10 transition-all uppercase tracking-widest">+ YENİ GÖRSEL EKLE</button>
                </div>
              </motion.div>
            )}

            {activeTab === 'events' && (
              <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                {data.events.events.map((ev, idx) => (
                   <div key={idx} className="bg-dark/40 p-6 rounded-xl border border-secondary/10 relative">
                      <button onClick={() => handleRemoveItem('events', 'events', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest z-10 bg-dark px-3 py-1 rounded">SİL</button>
                      
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-2">
                         {/* Left: Image */}
                         <div className="xl:col-span-1 h-full">
                            <ImageUploader label="AFİŞ" value={ev.image_url} onChange={(e) => handleImageUpload(e, 'events', 'image_url', 'events', idx)} />
                         </div>

                         {/* Right: Settings */}
                         <div className="xl:col-span-2 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="relative group">
                                <span className={`absolute -top-2 left-2 z-10 text-[7px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                                <input type="text" className="w-full bg-dark border font-bold border-secondary/20 rounded-lg px-4 py-2.5 text-white" value={getVal(ev.title, lang)} onChange={e => {
                                     const arr = [...data.events.events]; arr[idx].title = updateVal(ev.title, lang, e.target.value); setData({...data, events: {...data.events, events: arr}});
                                     setHasChanges(true);
                                  }} placeholder="Etkinlik Adı" />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-2.5 text-white text-sm" value={ev.date} onChange={e => {
                                     const arr = [...data.events.events]; arr[idx].date = e.target.value; setData({...data, events: {...data.events, events: arr}});
                                     setHasChanges(true);
                                  }} placeholder="Tarih" />
                                <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-2.5 text-white text-sm" value={ev.time || ''} onChange={e => {
                                     const arr = [...data.events.events]; arr[idx].time = e.target.value; setData({...data, events: {...data.events, events: arr}});
                                     setHasChanges(true);
                                  }} placeholder="Saat" />
                              </div>
                            </div>
                            
                            <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-2.5 text-white text-sm" value={ev.location || ''} onChange={e => {
                                 const arr = [...data.events.events]; arr[idx].location = e.target.value; setData({...data, events: {...data.events, events: arr}});
                                 setHasChanges(true);
                              }} placeholder="Konum / Mekan (Örn: Lounge Bar)" />
                              
                            <div className="relative group">
                               <span className={`absolute -top-2 left-2 z-10 text-[7px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                               <textarea className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-3 text-white text-sm h-24 resize-none overflow-y-auto focus:border-secondary transition-all" value={getVal(ev.description, lang)} onChange={e => {
                                   const arr = [...data.events.events]; arr[idx].description = updateVal(ev.description, lang, e.target.value); setData({...data, events: {...data.events, events: arr}});
                                   setHasChanges(true);
                               }} placeholder="Etkinlik açıklaması..." />
                            </div>

                            {/* Popup Panel inline */}
                            <div className="bg-secondary/5 px-4 py-4 rounded-xl border border-secondary/20 space-y-3">
                                <label className="text-secondary font-bold uppercase tracking-widest text-[10px] flex items-center space-x-3 cursor-pointer select-none">
                                   <input type="checkbox" checked={ev.is_popup || false} onChange={e => {
                                       const arr = [...data.events.events]; arr[idx].is_popup = e.target.checked; setData({...data, events: {...data.events, events: arr}});
                                   }} className="w-4 h-4 accent-secondary" />
                                   <span>BU ETKİNLİĞİ POPUP YAP</span>
                                </label>

                                {ev.is_popup && (
                                    <div className="grid grid-cols-3 gap-3 pt-2 border-t border-secondary/10">
                                        <div className="flex flex-col space-y-1">
                                            <label className="text-textSecondary text-[9px] uppercase tracking-widest font-semibold">Başk. Tarihi</label>
                                            <input type="date" className="bg-dark border border-secondary/20 rounded text-white text-xs px-2 py-1.5 outline-none w-full" value={ev.popup_start_date || ''} onChange={e => {
                                                const arr = [...data.events.events]; arr[idx].popup_start_date = e.target.value; setData({...data, events: {...data.events, events: arr}});
                                            }} />
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <label className="text-textSecondary text-[9px] uppercase tracking-widest font-semibold">Bitiş Tarihi</label>
                                            <input type="date" className="bg-dark border border-secondary/20 rounded text-white text-xs px-2 py-1.5 outline-none w-full" value={ev.popup_end_date || ''} onChange={e => {
                                                const arr = [...data.events.events]; arr[idx].popup_end_date = e.target.value; setData({...data, events: {...data.events, events: arr}});
                                            }} />
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <label className="text-textSecondary text-[9px] uppercase tracking-widest font-semibold">Süre (Sny)</label>
                                            <input type="number" min="0" className="bg-dark border border-secondary/20 rounded text-white text-xs px-2 py-1.5 outline-none w-full text-center" value={ev.popup_duration || 0} onChange={e => {
                                                const arr = [...data.events.events]; arr[idx].popup_duration = Number(e.target.value); setData({...data, events: {...data.events, events: arr}});
                                            }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
                <button onClick={() => handleAddItem('events', 'events', { id: Date.now().toString(), title: 'Yeni Etkinlik', date: '', time: '', location: '', image_url: '', description: '', is_popup: false, popup_duration: 0 })} className="w-full border-2 border-dashed border-secondary/30 rounded-xl flex items-center justify-center p-6 text-secondary font-bold hover:bg-secondary/10 transition-all uppercase tracking-widest">+ YENİ ETKİNLİK EKLE</button>
              </motion.div>
            )}

            {activeTab === 'team' && (
              <motion.div key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                 {data.team.members.map((member, idx) => (
                   <div key={idx} className="bg-dark/40 p-6 rounded-xl border border-secondary/10 space-y-6 relative group/member">
                      <button onClick={() => handleRemoveItem('team', 'members', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest opacity-0 group/member:opacity-100 transition-opacity">SİL</button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-4">
                          <ImageUploader label="PROFİL FOTOĞRAFI" value={member.image_url} onChange={(e) => handleImageUpload(e, 'team', 'image_url', 'members', idx)} />
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                               <label className="text-[10px] uppercase font-bold text-secondary tracking-widest">İsim</label>
                               <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                              </div>
                              <input type="text" className="w-full bg-dark border font-bold border-secondary/20 rounded-lg px-4 py-2 text-white outline-none focus:border-secondary transition-colors" value={getVal(member.name, lang)} onChange={e => {
                                 const arr = [...data.team.members]; arr[idx].name = updateVal(member.name, lang, e.target.value); setData({...data, team: {...data.team, members: arr}});
                                 setHasChanges(true);
                              }} placeholder="İsim" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                               <label className="text-[10px] uppercase font-bold text-secondary tracking-widest">Pozisyon</label>
                               <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                              </div>
                              <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-2 text-white outline-none focus:border-secondary transition-colors" value={getVal(member.role, lang)} onChange={e => {
                                 const arr = [...data.team.members]; arr[idx].role = updateVal(member.role, lang, e.target.value); setData({...data, team: {...data.team, members: arr}});
                                 setHasChanges(true);
                              }} placeholder="Pozisyon" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <label className="text-[10px] uppercase font-bold text-secondary tracking-widest">Biyografi</label>
                              <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                            </div>
                            <textarea className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-2 text-white h-24 resize-none outline-none focus:border-secondary transition-colors italic text-sm" value={getVal(member.bio, lang)} onChange={e => {
                               const arr = [...data.team.members]; arr[idx].bio = updateVal(member.bio, lang, e.target.value); setData({...data, team: {...data.team, members: arr}});
                               setHasChanges(true);
                            }} placeholder="Kısa biyografi..." />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-secondary tracking-widest">Instagram URL</label>
                              <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-2 text-white text-xs outline-none focus:border-secondary transition-colors" value={member.instagram || ''} onChange={e => {
                                 const arr = [...data.team.members]; arr[idx].instagram = e.target.value; setData({...data, team: {...data.team, members: arr}});
                                 setHasChanges(true);
                              }} placeholder="https://instagram.com/..." />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-secondary tracking-widest">LinkedIn URL</label>
                              <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-2 text-white text-xs outline-none focus:border-secondary transition-colors" value={member.linkedin || ''} onChange={e => {
                                 const arr = [...data.team.members]; arr[idx].linkedin = e.target.value; setData({...data, team: {...data.team, members: arr}});
                                 setHasChanges(true);
                              }} placeholder="https://linkedin.com/in/..." />
                            </div>
                          </div>
                        </div>
                      </div>
                   </div>
                ))}
                <button onClick={() => handleAddItem('team', 'members', { id: Date.now().toString(), name: 'Yeni Üye', role: 'Görev', image_url: '', bio: '', instagram: '', linkedin: '' })} className="w-full border-2 border-dashed border-secondary/30 rounded-xl flex items-center justify-center p-6 text-secondary font-bold hover:bg-secondary/10 transition-all uppercase tracking-widest">+ EKİBE YENİ KİŞİ EKLE</button>
              </motion.div>
            )}

            {activeTab === 'menu' && (
              <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                {/* Safety-First Category Management */}
                <div className="flex flex-col space-y-4 pb-6 border-b border-secondary/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-sm font-bold text-secondary uppercase tracking-[0.2em] flex-shrink-0">Kategoriler</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <input 
                        type="text" 
                        placeholder="Şu anki kategoride ürün ara..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="bg-dark/80 border border-secondary/20 rounded-full px-4 py-1.5 text-xs text-secondary outline-none focus:border-secondary transition-all w-64 uppercase tracking-widest font-bold placeholder-secondary/30"
                      />
                      <button 
                        onClick={() => setManagementMode(!managementMode)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${managementMode ? 'bg-red-500/20 text-red-500 border-red-500/30 ring-2 ring-red-500/10' : 'bg-secondary/10 text-secondary border-secondary/30'}`}
                      >
                        {managementMode ? 'DÜZENLEMEYİ KAPAT' : 'KATEGORİLERİ DÜZENLE / SİL'}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    {(data?.menu?.categories || []).map((cat) => {
                      const isActive = selectedCategoryAdmin === cat.id;
                      return (
                        <div key={cat.id} className={`flex items-center rounded-lg transition-all border ${isActive ? 'bg-secondary text-primary border-secondary shadow-lg shadow-secondary/10' : 'bg-dark/50 border-secondary/20 hover:border-secondary/50'}`}>
                          {isActive && managementMode ? (
                            <>
                               <input
                                 type="text"
                                 className="bg-transparent border-none px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary outline-none min-w-[80px]"
                                 value={getVal(cat.title, lang)}
                                 autoFocus
                                 onChange={(e) => {
                                   const newCats = [...(data?.menu?.categories || [])];
                                   const cIdx = newCats.findIndex(c => c.id === cat.id);
                                   if (cIdx !== -1) {
                                     newCats[cIdx].title = updateVal(newCats[cIdx].title, lang, e.target.value.toUpperCase());
                                     setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                     setHasChanges(true);
                                   }
                                 }}
                                 onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                               />
                               <button
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   const newCats = [...(data?.menu?.categories || [])];
                                   const cIdx = newCats.findIndex(c => c.id === cat.id);
                                   if (cIdx > 0) {
                                     [newCats[cIdx - 1], newCats[cIdx]] = [newCats[cIdx], newCats[cIdx - 1]];
                                     setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                     setHasChanges(true);
                                   }
                                 }}
                                 title="Sola Taşı"
                                 className="px-1 text-primary/50 hover:text-primary transition-colors disabled:opacity-20 border-l border-primary/20 pl-2"
                                 disabled={(data?.menu?.categories || []).findIndex(c => c.id === cat.id) === 0}
                               >
                                 <ChevronLeft className="w-4 h-4" />
                               </button>
                               <button
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   const newCats = [...(data?.menu?.categories || [])];
                                   const cIdx = newCats.findIndex(c => c.id === cat.id);
                                   if (cIdx < newCats.length - 1) {
                                     [newCats[cIdx + 1], newCats[cIdx]] = [newCats[cIdx], newCats[cIdx + 1]];
                                     setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                     setHasChanges(true);
                                   }
                                 }}
                                 title="Sağa Taşı"
                                 className="px-1 text-primary/50 hover:text-primary transition-colors disabled:opacity-20"
                                 disabled={(data?.menu?.categories || []).findIndex(c => c.id === cat.id) === (data?.menu?.categories?.length || 1) - 1}
                               >
                                 <ChevronRight className="w-4 h-4" />
                               </button>
                               <button
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   if (confirm(`${getVal(cat.title, lang)} kategorisini ve içindeki tüm ürünleri silmek istediğinize emin misiniz?`)) {
                                     const newCats = (data?.menu?.categories || []).filter(c => c.id !== cat.id);
                                     setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                     setSelectedCategoryAdmin(newCats[0]?.id || '');
                                     setHasChanges(true);
                                   }
                                 }}
                                 className="pr-2 pl-1 text-primary/60 hover:text-primary transition-colors border-l border-primary/20"
                               >
                                 <X className="w-3 h-3" />
                               </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setSelectedCategoryAdmin(cat.id)}
                              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-primary' : 'text-textSecondary hover:text-white'}`}
                            >
                              {getVal(cat.title, lang)}
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {managementMode && (
                      <button onClick={() => {
                        const slugBase = `kategori-${Date.now().toString(36)}`;
                        const newCat = { id: slugBase, title: { tr: 'YENİ KATEGORİ', en: 'NEW CATEGORY' }, items: [] };
                        const currentMenu = data?.menu || { categories: [] };
                        setData({ ...data, menu: { ...currentMenu, categories: [...(currentMenu.categories || []), newCat] } });
                        setSelectedCategoryAdmin(newCat.id);
                        setHasChanges(true);
                      }} className="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-dashed border-secondary/50 text-secondary hover:bg-secondary/10">
                        + {t({tr: 'KATEGORİ EKLE', en: 'ADD CATEGORY'})}
                      </button>
                    )}
                  </div>
                </div>

                {/* SUBCATEGORY MANAGEMENT */}
                {(data?.menu?.categories?.find(c => c.id === selectedCategoryAdmin)?.subcategories?.length > 0 || managementMode) && (
                  <div className="flex flex-col space-y-3 pb-6 border-b border-secondary/10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-textSecondary uppercase tracking-[0.2em]">Alt Kategoriler</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      {((data?.menu?.categories?.find(c => c.id === selectedCategoryAdmin)?.subcategories) || []).map((sub, sIdx) => (
                           <div key={sub.id} className="flex items-center rounded bg-dark/50 border border-secondary/20 px-3 py-1">
                               {managementMode ? (
                                   <>
                                       <input
                                         type="text"
                                         className="bg-transparent border-none text-[9px] font-bold uppercase tracking-widest text-secondary outline-none w-20"
                                         value={getVal(sub.title, lang)}
                                         onChange={(e) => {
                                           const newCats = [...(data?.menu?.categories || [])];
                                           const cIdx = newCats.findIndex(c => c.id === selectedCategoryAdmin);
                                           newCats[cIdx].subcategories[sIdx].title = updateVal(newCats[cIdx].subcategories[sIdx].title, lang, e.target.value.toUpperCase());
                                           setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                           setHasChanges(true);
                                         }}
                                       />
                                       <button
                                         onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Bu alt kategoriyi silmek istediğinize emin misiniz? (Ürünler silinmeyecek)')) {
                                               const newCats = [...(data?.menu?.categories || [])];
                                               const cIdx = newCats.findIndex(c => c.id === selectedCategoryAdmin);
                                               newCats[cIdx].subcategories = newCats[cIdx].subcategories.filter((s, i) => i !== sIdx);
                                               if (newCats[cIdx].subcategories.length === 0) delete newCats[cIdx].subcategories;
                                               setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                               setHasChanges(true);
                                            }
                                         }}
                                         className="ml-2 pl-2 border-l border-secondary/20 text-secondary/50 hover:text-red-400"
                                       ><X className="w-3 h-3" /></button>
                                   </>
                               ) : (
                                   <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">{getVal(sub.title, lang)}</span>
                               )}
                           </div>
                      ))}
                      {managementMode && (
                           <button onClick={() => {
                               const newCats = [...(data?.menu?.categories || [])];
                               const cIdx = newCats.findIndex(c => c.id === selectedCategoryAdmin);
                               if (!newCats[cIdx].subcategories) newCats[cIdx].subcategories = [];
                               newCats[cIdx].subcategories.push({ id: `sub_${Date.now()}`, title: { tr: 'YENİ ALT', en: 'NEW SUB' } });
                               setData({ ...data, menu: { ...data.menu, categories: newCats } });
                               setHasChanges(true);
                           }} className="px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest border border-dashed border-secondary/50 text-secondary hover:bg-secondary/10">
                               + ALT KATEGORİ
                           </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(data?.menu?.categories?.find(c => c.id === selectedCategoryAdmin)?.items || [])
                      .map((item, originalIdx) => ({ item, originalIdx }))
                      .filter(({item}) => !searchQuery || (item.name?.tr || '').toLowerCase().includes(searchQuery.toLowerCase()) || (item.name?.en || '').toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(({item, originalIdx: idx}) => {
                      if (!item) return null;
                      return (
                        <div key={idx} className={`bg-dark/40 p-4 rounded-xl border space-y-4 group relative transition-opacity ${item.passive ? 'opacity-50 border-red-500/20' : 'border-secondary/10'}`}>
                          <div className="absolute top-2 right-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button 
                              onClick={() => {
                                const newCats = [...(data?.menu?.categories || [])];
                                const catIdx = newCats.findIndex(c => c.id === selectedCategoryAdmin);
                                if (catIdx !== -1) {
                                  newCats[catIdx].items[idx].passive = !newCats[catIdx].items[idx].passive;
                                  setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                  setHasChanges(true);
                                }
                              }}
                              className={`text-[10px] font-bold px-2 py-1 rounded border ${item.passive ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-green-500/20 text-green-500 border-green-500/30'}`}
                            >
                              {item.passive ? 'PASİF' : 'AKTİF'}
                            </button>
                            <button onClick={() => {
                              if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
                                const newCats = [...(data?.menu?.categories || [])];
                                const catIdx = newCats.findIndex(c => c.id === selectedCategoryAdmin);
                                if (catIdx !== -1) {
                                  newCats[catIdx].items.splice(idx, 1);
                                  setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                  setHasChanges(true);
                                }
                              }
                            }} className="text-red-500 p-1 hover:bg-red-500/10 rounded">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex space-x-4">
                            <div className="w-20 h-20 flex-shrink-0 relative">
                               <img src={item.image_url} alt="" className="w-full h-full object-cover rounded-lg border border-secondary/20" />
                               <label className="absolute inset-0 bg-dark/60 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity rounded-lg">
                                  <Upload className="w-4 h-4 text-white" />
                                  <input type="file" className="hidden" onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const formData = new FormData();
                                    formData.append('image', file);
                                    try {
                                      const resp = await axios.post('/api/upload', formData, {
                                        headers: { 'Content-Type': 'multipart/form-data' }
                                      });
                                      if (resp.data.status === 'success') {
                                        const newCats = [...(data?.menu?.categories || [])];
                                        const catIdx = newCats.findIndex(c => c.id === selectedCategoryAdmin);
                                        if (catIdx !== -1) {
                                          newCats[catIdx].items[idx].image_url = resp.data.url;
                                          setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                          setHasChanges(true);
                                        }
                                      }
                                    } catch (err) { alert('Görsel yüklenemedi.'); }
                                  }} />
                               </label>
                            </div>
                            <div className="flex-grow space-y-2">
                              <input
                                type="text"
                                className="w-full bg-dark border border-secondary/10 rounded px-2 py-1 text-sm text-white font-bold outline-none focus:border-secondary"
                                value={getVal(item.name, lang)}
                                placeholder="Ürün Adı"
                                onChange={(e) => {
                                  const newCats = [...(data?.menu?.categories || [])];
                                  const catIdx = newCats.findIndex(c => c.id === selectedCategoryAdmin);
                                  if (catIdx !== -1) {
                                    newCats[catIdx].items[idx].name = updateVal(newCats[catIdx].items[idx].name, lang, e.target.value);
                                    setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                    setHasChanges(true);
                                  }
                                }}
                              />
                              
                              {/* Parent Category Selector for Item */}
                              <select 
                                className="w-full bg-[#1c1410] border border-secondary/10 rounded px-2 py-1 text-xs text-[#c9a96e] outline-none focus:border-secondary mb-1 uppercase tracking-widest font-bold"
                                value={selectedCategoryAdmin}
                                onChange={(e) => {
                                  const targetCatId = e.target.value;
                                  if (targetCatId === selectedCategoryAdmin) return;
                                  
                                  const newCats = [...(data?.menu?.categories || [])];
                                  const sourceIdx = newCats.findIndex(c => c.id === selectedCategoryAdmin);
                                  const targetIdx = newCats.findIndex(c => c.id === targetCatId);
                                  
                                  if (sourceIdx !== -1 && targetIdx !== -1) {
                                    const [movedItem] = newCats[sourceIdx].items.splice(idx, 1);
                                    movedItem.subcategory = null; // reset subcat on category change
                                    
                                    if (!newCats[targetIdx].items) newCats[targetIdx].items = [];
                                    newCats[targetIdx].items.push(movedItem);
                                    
                                    setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                    setHasChanges(true);
                                    setSelectedCategoryAdmin(targetCatId); // Follow the moved item to its new category
                                  }
                                }}
                              >
                                {(data?.menu?.categories || []).map(cat => (
                                  <option key={cat.id} value={cat.id} className="bg-[#1c1410] text-[#c9a96e] font-bold">{getVal(cat.title, lang)}</option>
                                ))}
                              </select>

                              {/* Subcategory Selector for Item */}
                              {data?.menu?.categories?.find(c => c.id === selectedCategoryAdmin)?.subcategories?.length > 0 && (
                                <select 
                                  className="w-full bg-[#1c1410] border border-secondary/10 rounded px-2 py-1 text-xs text-gray-300 outline-none focus:border-secondary mb-1 uppercase tracking-widest font-bold"
                                  value={item.subcategory || ''}
                                  onChange={(e) => {
                                    const newCats = [...(data?.menu?.categories || [])];
                                    const catIdx = newCats.findIndex(c => c.id === selectedCategoryAdmin);
                                    if (catIdx !== -1) {
                                      newCats[catIdx].items[idx].subcategory = e.target.value || null;
                                      setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                      setHasChanges(true);
                                    }
                                  }}
                                >
                                  <option value="" className="bg-[#1c1410] text-gray-400">-- ALT KATEGORİ YOK --</option>
                                  {(data?.menu?.categories?.find(c => c.id === selectedCategoryAdmin)?.subcategories || []).map(sub => (
                                    <option key={sub.id} value={sub.id} className="bg-[#1c1410] text-white font-bold">{getVal(sub.title, lang)}</option>
                                  ))}
                                </select>
                              )}
                              
                              {/* Allergen Selector for Item */}
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(data.allergens || []).map(allg => {
                                  const isSelected = (item.allergens || []).includes(allg.id);
                                  return (
                                    <button 
                                      key={allg.id}
                                      onClick={() => {
                                        const newCats = [...(data?.menu?.categories || [])];
                                        const catIdx = newCats.findIndex(c => c.id === selectedCategoryAdmin);
                                        if (catIdx !== -1) {
                                          const currentItemAllergens = item.allergens || [];
                                          if (isSelected) {
                                            newCats[catIdx].items[idx].allergens = currentItemAllergens.filter(id => id !== allg.id);
                                          } else {
                                            newCats[catIdx].items[idx].allergens = [...currentItemAllergens, allg.id];
                                          }
                                          setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                          setHasChanges(true);
                                        }
                                      }}
                                      title={allg.name}
                                      className={`w-6 h-6 rounded flex items-center justify-center border transition-all ${isSelected ? 'bg-secondary border-secondary shadow-sm shadow-secondary/20' : 'bg-dark/40 border-secondary/10 opacity-40 hover:opacity-100'}`}
                                    >
                                      {allg.icon_url ? <img src={allg.icon_url} className={`w-4 h-4 ${isSelected ? 'opacity-100' : 'opacity-40'}`} alt="" /> : <Info className="w-3 h-3" />}
                                    </button>
                                  );
                                })}
                              </div>
                              <input
                                type="text"
                                className="w-full bg-dark border border-secondary/10 rounded px-2 py-1 text-xs text-secondary font-bold outline-none focus:border-secondary transition-all"
                                value={item.price || ''}
                                placeholder="Fiyat (Örn: 150)"
                                onFocus={(e) => {
                                  if (item.price === '0' || item.price === '0 TL') {
                                    const newCats = [...(data?.menu?.categories || [])];
                                    const catIdx = newCats.findIndex(c => c.id === selectedCategoryAdmin);
                                    if (catIdx !== -1) {
                                      newCats[catIdx].items[idx].price = '';
                                      setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                    }
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSave();
                                  }
                                }}
                                onChange={(e) => {
                                  const newCats = [...(data?.menu?.categories || [])];
                                  const catIdx = newCats.findIndex(c => c.id === selectedCategoryAdmin);
                                  if (catIdx !== -1) {
                                    newCats[catIdx].items[idx].price = e.target.value;
                                    setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                    setHasChanges(true);
                                  }
                                }}
                              />
                            </div>
                          </div>
                          
                          <textarea
                            className="w-full bg-dark border border-secondary/10 rounded px-2 py-1 text-[10px] text-textSecondary h-12 resize-none outline-none focus:border-secondary font-light"
                            value={getVal(item.description, lang)}
                            placeholder="Açıklama / İçerik"
                            onChange={(e) => {
                              const newCats = [...(data?.menu?.categories || [])];
                              const catIdx = newCats.findIndex(c => c.id === selectedCategoryAdmin);
                              if (catIdx !== -1) {
                                newCats[catIdx].items[idx].description = updateVal(newCats[catIdx].items[idx].description, lang, e.target.value);
                                setData({ ...data, menu: { ...data.menu, categories: newCats } });
                                setHasChanges(true);
                              }
                            }}
                          ></textarea>
                        </div>
                      );})}
                    
                    <button onClick={() => {
                      const newCats = [...(data?.menu?.categories || [])];
                      const catIdx = newCats.findIndex(c => c.id === selectedCategoryAdmin);
                      if (catIdx !== -1) {
                        newCats[catIdx].items.push({ id: Date.now().toString(), name: 'YENİ ÜRÜN', description: '', price: '0 TL', image_url: '/assets/img/pennylane-default.png', tags: [], passive: false });
                        setData({ ...data, menu: { ...data.menu, categories: newCats } });
                        setHasChanges(true);
                        setSearchQuery(''); // Ensure new item is visible by clearing search
                      }
                    }} className="border-2 border-dashed border-secondary/20 rounded-xl flex items-center justify-center p-8 text-secondary/60 hover:text-secondary hover:bg-secondary/5 transition-all text-sm font-bold uppercase tracking-widest">
                      + ÜRÜN EKLE
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2 border-t border-secondary/20 pt-4">
                    <button 
                      onClick={exportToExcel}
                      className="flex items-center space-x-2 bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all"
                      title="Menüyü Excel (.xlsx) olarak indir"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Excel'e Aktar</span>
                    </button>
                    
                    <label className="flex items-center space-x-2 bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Excel'den Yükle</span>
                      <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleImportExcel} />
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'footer' && (
              <motion.div key="footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">

                {/* Şirket Bilgisi */}
                <div className="space-y-4 bg-dark/20 p-6 rounded-xl border border-secondary/10">
                  <h4 className="text-secondary font-bold uppercase tracking-widest text-sm border-b border-secondary/10 pb-3">Şirket Bilgisi</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="text-xs uppercase font-bold text-secondary tracking-widest">Marka Adı</label>
                        <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                      </div>
                      <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-3 text-white font-serif font-bold text-lg focus:border-secondary outline-none transition-colors"
                        value={getVal(data.footer.company_info?.name, lang)} onChange={e => {
                          setData({...data, footer: {...data.footer, company_info: {...data.footer.company_info, name: updateVal(data.footer.company_info?.name, lang, e.target.value)}}});
                          setHasChanges(true);
                        }} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="text-xs uppercase font-bold text-secondary tracking-widest">Kısa Açıklama</label>
                        <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                      </div>
                      <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none transition-colors"
                        value={getVal(data.footer.company_info?.description, lang)} onChange={e => {
                          setData({...data, footer: {...data.footer, company_info: {...data.footer.company_info, description: updateVal(data.footer.company_info?.description, lang, e.target.value)}}});
                          setHasChanges(true);
                        }} />
                    </div>
                  </div>
                </div>

                {/* İletişim Bilgileri */}
                <div className="space-y-4 bg-dark/20 p-6 rounded-xl border border-secondary/10">
                  <h4 className="text-secondary font-bold uppercase tracking-widest text-sm border-b border-secondary/10 pb-3">İletişim Bilgileri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-secondary tracking-widest">Telefon</label>
                      <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none transition-colors"
                        value={data.footer.contact_info?.phone || ''} onChange={e => { setData({...data, footer: {...data.footer, contact_info: {...data.footer.contact_info, phone: e.target.value}}}); setHasChanges(true); }} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-secondary tracking-widest">E-posta</label>
                      <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none transition-colors"
                        value={data.footer.contact_info?.email || ''} onChange={e => { setData({...data, footer: {...data.footer, contact_info: {...data.footer.contact_info, email: e.target.value}}}); setHasChanges(true); }} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="text-xs uppercase font-bold text-secondary tracking-widest">Çalışma Saatleri</label>
                        <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                      </div>
                      <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none transition-colors"
                        value={getVal(data.footer.opening_hours, lang)} onChange={e => { setData({...data, footer: {...data.footer, opening_hours: updateVal(data.footer.opening_hours, lang, e.target.value)}}); setHasChanges(true); }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <label className="text-xs uppercase font-bold text-secondary tracking-widest">Adres</label>
                      <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                    </div>
                    <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none transition-colors"
                      value={getVal(data.footer.contact_info?.address, lang)} onChange={e => { setData({...data, footer: {...data.footer, contact_info: {...data.footer.contact_info, address: updateVal(data.footer.contact_info?.address, lang, e.target.value)}}}); setHasChanges(true); }} />
                  </div>
                </div>

                {/* Copyright & Tasarım */}
                <div className="space-y-4 bg-dark/20 p-6 rounded-xl border border-secondary/10">
                  <h4 className="text-secondary font-bold uppercase tracking-widest text-sm border-b border-secondary/10 pb-3">Alt Satır Bilgileri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="text-xs uppercase font-bold text-secondary tracking-widest">Telif Hakkı Metni</label>
                        <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                      </div>
                      <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none transition-colors"
                        value={getVal(data.footer.copyright, lang)} onChange={e => { setData({...data, footer: {...data.footer, copyright: updateVal(data.footer.copyright, lang, e.target.value)}}); setHasChanges(true); }} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="text-xs uppercase font-bold text-secondary tracking-widest">Tasarım Kredisi</label>
                        <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                      </div>
                      <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none transition-colors"
                        value={getVal(data.footer.design_credit, lang)} onChange={e => { setData({...data, footer: {...data.footer, design_credit: updateVal(data.footer.design_credit, lang, e.target.value)}}); setHasChanges(true); }} />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-secondary/10">
                    <label className="text-xs uppercase font-bold text-secondary tracking-widest">Yasal Linkler</label>
                    {(data.footer.legal_links || []).map((link, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input type="text" className="flex-1 bg-dark border border-secondary/10 rounded-lg px-3 py-2 text-white text-sm focus:border-secondary outline-none"
                          value={link.label} placeholder="Link Metni"
                          onChange={e => {
                            const links = [...data.footer.legal_links]; links[idx].label = e.target.value;
                            setData({...data, footer: {...data.footer, legal_links: links}});
                          }} />
                        <input type="text" className="flex-1 bg-dark border border-secondary/10 rounded-lg px-3 py-2 text-textSecondary text-sm focus:border-secondary outline-none"
                          value={link.href} placeholder="#link"
                          onChange={e => {
                            const links = [...data.footer.legal_links]; links[idx].href = e.target.value;
                            setData({...data, footer: {...data.footer, legal_links: links}});
                          }} />
                        <button onClick={() => {
                          const links = data.footer.legal_links.filter((_, i) => i !== idx);
                          setData({...data, footer: {...data.footer, legal_links: links}});
                        }} className="text-red-500 hover:text-red-400 text-[10px] font-bold uppercase px-2 py-2 bg-dark rounded border border-red-500/20">SİL</button>
                      </div>
                    ))}
                    <button onClick={() => {
                      const links = [...(data.footer.legal_links || []), { label: 'Yeni Link', href: '#' }];
                      setData({...data, footer: {...data.footer, legal_links: links}});
                    }} className="text-secondary text-xs font-bold uppercase tracking-widest hover:text-white transition-colors border border-secondary/20 rounded-lg px-4 py-2 hover:bg-secondary/10">
                      + Link Ekle
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'menu_showcase' && (
              <motion.div key="menu_showcase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <label className="text-xs uppercase font-bold text-secondary tracking-widest">Bölüm Başlığı</label>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                  </div>
                  <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-3 text-white font-serif font-bold text-xl focus:border-secondary outline-none transition-colors"
                    value={getVal(data.menu_showcase.section_title, lang)} onChange={e => { setData({...data, menu_showcase: {...data.menu_showcase, section_title: updateVal(data.menu_showcase.section_title, lang, e.target.value)}}); setHasChanges(true); }} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <label className="text-xs uppercase font-bold text-secondary tracking-widest">Alt Başlık</label>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                  </div>
                  <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none transition-colors"
                    value={getVal(data.menu_showcase.section_subtitle, lang)} onChange={e => { setData({...data, menu_showcase: {...data.menu_showcase, section_subtitle: updateVal(data.menu_showcase.section_subtitle, lang, e.target.value)}}); setHasChanges(true); }} />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-secondary/10">
                  <h4 className="text-secondary font-bold uppercase tracking-widest text-sm">Spesiyal Ürünler</h4>
                  <button onClick={() => {
                    const newId = Date.now().toString();
                    const arr = [...data.menu_showcase.categories, { 
                      id: newId, 
                      title: 'Yeni Ürün', 
                      description: 'Ürün açıklaması buraya gelecek.', 
                      image_url: '/assets/img/placeholder.png',
                      link: '#'
                    }];
                    setData({...data, menu_showcase: {...data.menu_showcase, categories: arr}});
                  }} className="text-secondary text-xs font-bold uppercase tracking-widest hover:text-white transition-colors border border-secondary/20 rounded-lg px-4 py-2 hover:bg-secondary/10">
                    + Ürün Ekle
                  </button>
                </div>

                {data.menu_showcase.categories.map((cat, idx) => (
                  <div key={idx} className="bg-dark/40 p-5 rounded-xl border border-secondary/10 relative group-admin">
                    <button onClick={() => {
                      const arr = data.menu_showcase.categories.filter((_, i) => i !== idx);
                      setData({...data, menu_showcase: {...data.menu_showcase, categories: arr}});
                    }} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-[10px] font-bold uppercase px-2 py-1 bg-dark rounded border border-red-500/20 opacity-0 group-admin:opacity-100 transition-opacity">
                      SİL
                    </button>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                      <div className="xl:col-span-1">
                        <ImageUploader label="GÖRSEL" value={cat.image_url} onChange={(e) => handleImageUpload(e, 'menu_showcase', 'image_url', 'categories', idx)} />
                      </div>
                      <div className="xl:col-span-2 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <label className="text-[10px] uppercase font-bold text-secondary tracking-widest">Başlık</label>
                              <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                            </div>
                            <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-2.5 text-white font-bold focus:border-secondary outline-none"
                              value={getVal(cat.title, lang)} onChange={e => {
                                const arr = [...data.menu_showcase.categories]; arr[idx].title = updateVal(cat.title, lang, e.target.value);
                                setData({...data, menu_showcase: {...data.menu_showcase, categories: arr}});
                                setHasChanges(true);
                              }} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-secondary tracking-widest">Link</label>
                            <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-2.5 text-textSecondary text-sm focus:border-secondary outline-none"
                              value={cat.link || ''} onChange={e => {
                                const arr = [...data.menu_showcase.categories]; arr[idx].link = e.target.value;
                                setData({...data, menu_showcase: {...data.menu_showcase, categories: arr}});
                                setHasChanges(true);
                              }} placeholder="/menu/..." />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <label className="text-[10px] uppercase font-bold text-secondary tracking-widest">Açıklama</label>
                            <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                          </div>
                          <textarea className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-2.5 text-white text-sm h-20 resize-none overflow-y-auto focus:border-secondary outline-none"
                            value={getVal(cat.description, lang)} onChange={e => {
                              const arr = [...data.menu_showcase.categories]; arr[idx].description = updateVal(cat.description, lang, e.target.value);
                              setData({...data, menu_showcase: {...data.menu_showcase, categories: arr}});
                              setHasChanges(true);
                            }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'allergens' && (
              <motion.div key="allergens" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20 mb-8">
                  <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-2">ALERJEN YÖNETİMİ</h4>
                  <p className="text-textSecondary text-xs">Menüdeki tüm ürünlerde seçebileceğiniz ana alerjen listesini buradan düzenleyin.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(data.allergens || []).map((allg, idx) => (
                    <div key={allg.id} className="bg-dark/40 p-6 rounded-xl border border-secondary/10 relative group">
                      <button onClick={() => {
                        if (confirm(`${allg.name} silinsin mi? Ürünlerde seçili olan bu uyarı da kalkacaktır.`)) {
                          const newAllergens = data.allergens.filter((_, i) => i !== idx);
                          setData({ ...data, allergens: newAllergens });
                          setHasChanges(true);
                        }
                      }} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-[10px] font-bold uppercase group-hover:opacity-100 opacity-0 transition-opacity">SİL</button>
                      
                      <div className="space-y-4 pt-2">
                        <ImageUploader label="İKON (Seçmeli)" value={allg.icon_url} onChange={(e) => handleImageUpload(e, 'allergens', 'icon_url', null, idx)} />
                        <div className="space-y-1">
                           <div className="flex items-center space-x-2">
                            <label className="text-[10px] uppercase font-bold text-secondary tracking-widest">Alerjen Adı</label>
                            <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold ${lang === 'tr' ? 'bg-secondary text-primary' : 'bg-dark/60 text-textSecondary border border-secondary/20'}`}>{lang === 'tr' ? 'TR' : 'EN'}</span>
                           </div>
                           <input type="text" className="w-full bg-dark border border-secondary/20 rounded-lg px-4 py-2 text-white outline-none focus:border-secondary transition-colors" 
                             value={getVal(allg.name, lang)} onChange={e => {
                               const arr = [...data.allergens]; arr[idx].name = updateVal(allg.name, lang, e.target.value);
                               setData({ ...data, allergens: arr });
                               setHasChanges(true);
                             }} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => {
                    const newAllg = { id: `allg-${Date.now()}`, name: 'Yeni Alerjen', icon_url: '' };
                    setData({ ...data, allergens: [...(data.allergens || []), newAllg] });
                    setHasChanges(true);
                  }} className="border-2 border-dashed border-secondary/30 rounded-xl flex items-center justify-center p-8 text-secondary font-bold hover:bg-secondary/10 transition-all uppercase tracking-widest">+ YENİ ALERJEN EKLE</button>
                </div>
              </motion.div>
            )}

            {['newsletter'].includes(activeTab) && (
              <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <p className="text-textSecondary italic text-sm">Bu bölüm ({activeTab}) için gelişmiş görsel editör yapım aşamasındadır. Şimdilik metinleri JSON üzerinden düzenleyebilirsiniz:</p>
                <textarea 
                  className="w-full bg-dark/60 border border-secondary/20 rounded-xl px-6 py-4 text-white font-mono text-xs h-96 focus:border-secondary outline-none transition-all resize-none overflow-y-auto"
                  value={JSON.stringify(data[activeTab], null, 2)}
                  onChange={e => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setData({ ...data, [activeTab]: parsed });
                    } catch(err) { /* invalid json */ }
                  }}
                />
              </motion.div>
            )}

            {activeTab === 'print_menu' && (
              <motion.div key="print_menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold uppercase tracking-widest text-sm">Baskı Menüsü Yönetimi</h3>
                    <p className="text-textSecondary text-xs font-light mt-1">
                      Fiyatları, görselleri ve Happy Hour bilgilerini aşağıdan düzenleyin. Değiştir butonuna basın, ardından önizleyerek PDF olarak kaydedin.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href="/menu-pdf/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-secondary/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Önizle / PDF İndir
                    </a>
                    <a
                      href="/menu-pdf/admin.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-dark/60 border border-secondary/30 text-secondary px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-secondary/10 transition-all"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      Tam Ekran Aç
                    </a>
                  </div>
                </div>

                <div className="bg-dark/40 rounded-2xl border border-secondary/10 overflow-hidden" style={{ height: '75vh' }}>
                  <iframe
                    src="/menu-pdf/admin.html"
                    className="w-full h-full border-0"
                    title="Baskı Menüsü Yönetim Paneli"
                    style={{ minHeight: '600px' }}
                  />
                </div>

                <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4 flex items-start gap-3">
                  <Info className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-textSecondary space-y-1">
                    <p><strong className="text-secondary">Nasıl çalışır?</strong> Yukarıdaki panelde değişikliklerinizi yapıp "Kaydet" butonuna tıklayın.</p>
                    <p>Ardından <strong className="text-white">Önizle / PDF İndir</strong> butonuyla menüyü açın → tarayıcının yazdır menüsünden <strong className="text-white">PDF olarak kaydet</strong> seçeneğini kullanın.</p>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </section>
        <footer className="text-center text-textSecondary text-[10px] uppercase font-bold tracking-[0.5em] opacity-30 pt-10">
           PENNYLANE ADMIN v1.2
        </footer>

        {/* Floating Success Notification */}
        <AnimatePresence>
          {saveStatus === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-green-600 text-white px-8 py-3 rounded-full shadow-2xl flex items-center space-x-3 border border-green-400/30 backdrop-blur-md"
            >
              <CheckCircle className="w-5 h-5 text-white" />
              <span className="font-bold uppercase tracking-widest text-xs">Değişiklikler Kaydedildi</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminPanel;
