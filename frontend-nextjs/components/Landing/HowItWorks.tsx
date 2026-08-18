'use client';

import { motion } from 'framer-motion';
import { HelpCircle, BrainCircuit, BookOpen, GraduationCap } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <HelpCircle className="w-6 h-6 text-[#38bdf8]" />,
      title: 'Ask Question',
      desc: 'Type any academic problem, draw a graph, or ask to explain a complex topic in your preferred language.',
      color: '#38bdf8',
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-[#a855f7]" />,
      title: 'Vidya Processes',
      desc: 'Our multilingual educational AI model analyzes the request, parsing mathematical notation and scientific context.',
      color: '#a855f7',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#ec4899]" />,
      title: 'Vidya Explains',
      desc: 'Vidya serves a detailed, step-by-step response, rendering equations, tables, and graphs in real-time.',
      color: '#ec4899',
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-[#10b981]" />,
      title: 'Student Learns',
      desc: 'Review clear explanations, visualize the interactive graphs, and revise effectively to clear concepts.',
      color: '#10b981',
    },
  ];

  return (
    <section className="py-20 bg-[#070a14] border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#a855f7]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            How Vidya Works
          </h2>
          <p className="text-base text-[#94a3b8]">
            An intuitive educational workflow built to assist student comprehension and logic building.
          </p>
        </div>

        {/* Steps Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <div key={step.title} className="relative flex flex-col items-center text-center group">
              {/* Connector line between steps (desktop only) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-gradient-to-r from-white/10 to-white/5 -z-10" />
              )}

              {/* Number Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="w-16 h-16 rounded-2xl bg-[#0b0f19] border border-white/10 flex items-center justify-center mb-6 relative z-10 shadow-xl group-hover:border-white/20 transition-all duration-300"
                style={{ boxShadow: `0 0 20px ${step.color}15` }}
              >
                {step.icon}
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#1e293b] border border-white/10 flex items-center justify-center text-[10px] font-bold text-white font-mono">
                  0{idx + 1}
                </span>
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 + 0.1, duration: 0.4 }}
              >
                <h3 className="text-lg font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed max-w-[250px] mx-auto">
                  {step.desc}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
