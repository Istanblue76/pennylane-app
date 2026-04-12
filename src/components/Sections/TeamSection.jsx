import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SectionHeading from '../Common/SectionHeading';

const TeamSection = ({ data }) => {
  const { t } = useLanguage();
  if (!data) return null;

  return (
    <section id="team" className="py-24 md:py-36 bg-dark">
      <div className="section-container">
        <SectionHeading title={data.section_title} subtitle="Sizin İçin En İyisini Hazırlayan Profesyoneller" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {data.members?.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="relative mb-8 mx-auto w-64 h-64 overflow-hidden rounded-full border-2 border-secondary/20 p-2 group-hover:border-secondary transition-colors duration-700">
                <img 
                   src={member.image_url} 
                   alt={t(member.name)} 
                   className="w-full h-full object-cover rounded-full transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Social Overlay */}
                <div className="absolute inset-0 bg-dark/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                  {member.instagram && (
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white p-2 border border-secondary rounded-full hover:bg-secondary hover:border-white transition-all">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white p-2 border border-secondary rounded-full hover:bg-secondary hover:border-white transition-all">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-1 tracking-widest uppercase">{t(member.name)}</h3>
              <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.3em]">{t(member.role)}</span>
              <p className="text-textSecondary text-xs mt-4 italic font-light max-w-[200px] mx-auto opacity-70 leading-relaxed border-t border-secondary/10 pt-4">
                "{t(member.bio)}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
