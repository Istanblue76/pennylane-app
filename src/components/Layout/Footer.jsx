import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin, Infinity, Map, Compass } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

const Footer = ({ data, onOpenPolicy }) => {
  const { t } = useLanguage();
  const [mapMode, setMapMode] = useState('map'); // 'map' or 'street'

  if (!data) return null;

  return (
    <footer className="bg-dark pt-12 pb-8 relative overflow-hidden border-t border-secondary/10 px-10">
      <div className="section-container flex flex-col md:flex-row items-start justify-between gap-10">

        {/* Contact Info — Sol */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-secondary font-bold uppercase tracking-widest text-xs mb-1">{t({ tr: 'İletişim', en: 'Contact' })}</h4>
          <div className="flex flex-col space-y-2 text-textSecondary text-xs font-semibold tracking-widest uppercase">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
              <span>{data.contact_info.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
              <span>{data.contact_info.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
              <span className="max-w-[240px]">{t(data.contact_info.address)}</span>
            </div>
          </div>
          <div className="pt-2 opacity-60 text-[10px] italic">
            <span className="text-secondary block mb-0.5 uppercase tracking-widest">{t({ tr: 'Açılış Saatleri', en: 'Opening Hours' })}</span>
            <p className="text-white">{t(data.opening_hours)}</p>
          </div>
        </div>

        {/* Map Column — Orta */}
        <div className="flex flex-col space-y-3 w-full md:max-w-xs xl:max-w-sm">
          <h4 className="text-secondary font-bold uppercase tracking-widest text-xs mb-1">{t({ tr: 'Konum', en: 'Location' })}</h4>
          <div className="relative border border-secondary/20 rounded-2xl overflow-hidden bg-primary/45 backdrop-blur-md shadow-lg w-full h-[180px]">
            {/* Map iframe */}
            <iframe
              src={
                mapMode === 'street'
                  ? "https://maps.google.com/maps?q=&layer=c&cbll=40.967639,29.067806&cbp=12,205,,0,0&hl=tr&output=embed"
                  : "https://maps.google.com/maps?q=40.967639,29.067806&hl=tr&z=17&output=embed"
              }
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Pennylane Map"
            />
            {/* Overlay Controls */}
            <div className="absolute top-2 left-2 flex space-x-1.5 z-10">
              <button
                onClick={() => setMapMode('map')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center space-x-1 ${
                  mapMode === 'map'
                    ? 'bg-secondary text-primary font-black shadow-md shadow-secondary/15'
                    : 'bg-dark/80 backdrop-blur-sm text-textSecondary hover:text-white border border-secondary/10'
                }`}
              >
                <Map className="w-2.5 h-2.5" />
                <span>{t({ tr: 'Harita', en: 'Map' })}</span>
              </button>
              <button
                onClick={() => setMapMode('street')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center space-x-1 ${
                  mapMode === 'street'
                    ? 'bg-secondary text-primary font-black shadow-md shadow-secondary/15'
                    : 'bg-dark/80 backdrop-blur-sm text-textSecondary hover:text-white border border-secondary/10'
                }`}
              >
                <Compass className="w-2.5 h-2.5" />
                <span>{t({ tr: 'Sokak', en: 'Street' })}</span>
              </button>
            </div>
            {/* Direct Google Maps Link Overlay on bottom-right for easier navigation */}
            <a
              href="https://www.google.com/maps/place/Pennylane/@40.9675792,29.0679455,18.75z/data=!4m12!1m5!3m4!2zNDDCsDU4JzAzLjUiTiAyOcKwMDQnMDQuMSJF!8m2!3d40.967639!4d29.067806!3m5!1s0x14cac7f3044c7a93:0x88e3fdcbaaa523de!8m2!3d40.9675086!4d29.0678569!16s%2Fg%2F11h92tq9_t?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 px-2.5 py-1 bg-dark/85 backdrop-blur-sm hover:bg-secondary hover:text-primary transition-all text-textSecondary text-[9px] font-black uppercase tracking-wider rounded-lg border border-secondary/10 flex items-center space-x-1 cursor-pointer"
            >
              <span>{t({ tr: 'YOL TARİFİ', en: 'DIRECTIONS' })}</span>
            </a>
          </div>
        </div>

        {/* Brand Info — Sağ */}
        <div className="flex flex-col space-y-4 items-end text-right">
          <Link 
            to="/" 
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center space-x-2 group cursor-pointer w-fit"
          >
            {data?.company_info?.logo_url ? (
              <img src={data.company_info.logo_url} alt={t(data.company_info.name)} className="h-8 w-auto transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <>
                <Infinity className="w-7 h-7 text-secondary group-hover:rotate-180 transition-transform duration-700" />
                <span className="text-xl font-serif font-bold text-white tracking-widest">{t(data.company_info.name)}</span>
              </>
            )}
          </Link>
          <p className="text-textSecondary text-sm font-light italic opacity-70 max-w-xs">
            "{t(data.company_info.description)}"
          </p>
          <div className="flex items-center space-x-4 text-secondary pt-2">
            <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
          </div>
        </div>

      </div>

      <div className="section-container border-t border-secondary/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase font-bold tracking-[0.5em] text-textSecondary opacity-40 text-center gap-4">
        <span>{t(data.copyright)}</span>
        <div className="flex space-x-8">
          <a
            href="#cerez"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenPolicy) onOpenPolicy('cookie');
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {t({ tr: 'Çerez Politikası', en: 'Cookie Policy' })}
          </a>
          <a
            href="#gizlilik"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenPolicy) onOpenPolicy('privacy');
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {t({ tr: 'Gizlilik Politikası', en: 'Privacy Policy' })}
          </a>
          <span>{t(data.design_credit)}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
