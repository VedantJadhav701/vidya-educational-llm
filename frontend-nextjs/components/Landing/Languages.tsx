'use client';

import { motion } from 'framer-motion';

export default function Languages() {
  const languages = [
    { name: 'English', script: 'English' },
    { name: 'Hindi', script: 'हिन्दी' },
    { name: 'Marathi', script: 'मराठी' },
    { name: 'Tamil', script: 'தமிழ்' },
    { name: 'Telugu', script: 'తెలుగు' },
    { name: 'Bengali', script: 'বাংলা' },
    { name: 'Gujarati', script: 'ગુજરાતી' },
    { name: 'Kannada', script: 'ಕನ್ನಡ' },
    { name: 'Malayalam', script: 'മലയാളം' },
    { name: 'Punjabi', script: 'ਪੰਜਾਬੀ' },
    { name: 'Maithili', script: 'मैथिली' },
    { name: 'Urdu', script: 'اردو' },
  ];

  return (
    <section className="py-20 bg-[#070a14]/60 border-t border-white/5 relative">
      <div className="absolute inset-0 bg-[#0b0f19]/25 pointer-events-none" />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Learn in Your Own Language
          </h2>
          <p className="text-base text-[#94a3b8] max-w-2xl mx-auto">
            Vidya supports asking questions in 11 Indian regional languages and English. Speak or type naturally, including regional Hinglish.
          </p>
        </div>

        {/* Languages Badge Grid */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
          {languages.map((lang, idx) => (
            <motion.div
              key={lang.name}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
              className="px-5 py-3 rounded-2xl bg-[#0b0f19] border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all text-sm font-semibold flex items-center gap-2.5 cursor-default shadow-md"
            >
              <span className="text-[#38bdf8] font-mono text-xs">{(idx + 1).toString().padStart(2, '0')}</span>
              <span className="text-white">{lang.script}</span>
              <span className="text-[10px] text-[#94a3b8] font-medium">({lang.name})</span>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer (Section 17 of plan: Do NOT falsely imply equal model performance across every language) */}
        <div className="mt-12 max-w-xl mx-auto p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-[11px] text-[#94a3b8] leading-normal italic">
            * Note: Response quality, speed, and accuracy may vary depending on the complexity of the query and the language selected, with English and Hindi offering the highest performance.
          </p>
        </div>
      </div>
    </section>
  );
}
