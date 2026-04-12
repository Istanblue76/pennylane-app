import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin, Infinity } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = ({ data }) => {
  const { t } = useLanguage();
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

        {/* Brand Info — Sağ */}
        <div className="flex flex-col space-y-4 items-end text-right">
          <div className="flex items-center space-x-2 group cursor-pointer w-fit">
            {data?.company_info?.logo_url ? (
              <img src={data.company_info.logo_url} alt={t(data.company_info.name)} className="h-8 w-auto transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <>
                <Infinity className="w-7 h-7 text-secondary group-hover:rotate-180 transition-transform duration-700" />
                <span className="text-xl font-serif font-bold text-white tracking-widest">{t(data.company_info.name)}</span>
              </>
            )}
          </div>
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
          {data.legal_links?.map((link, idx) => (
            <a key={idx} href={link.href} className="hover:text-white transition-colors">{t(link.label)}</a>
          ))}
          <span>{t(data.design_credit)}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
