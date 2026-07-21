import React from 'react';
import { motion } from 'framer-motion';
import heroSvg from '../assets/img2.png';
import {
  MessageSquare,
  LayoutGrid,
  GraduationCap,
  Wheat,
  HeartPulse,
  Baby,
  Briefcase,
  Home as HomeIcon,
  Sparkles,
  Database,
  Users,
  Bot,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: 'easeOut' },
  }),
};

const CATEGORIES = [
  { icon: GraduationCap, label: 'Education', count: '280+ Schemes', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { icon: Wheat, label: 'Agriculture', count: '200+ Schemes', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { icon: HeartPulse, label: 'Healthcare', count: '150+ Schemes', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { icon: Baby, label: 'Women & Child', count: '120+ Schemes', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  { icon: Briefcase, label: 'Employment', count: '90+ Schemes', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { icon: HomeIcon, label: 'Housing', count: '75+ Schemes', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
];

function HeroIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-emerald-500/8 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 32 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
  className="hidden lg:flex flex-1 items-center justify-center relative"
>
  <img src={heroSvg} alt="Government scheme illustration" className="w-full max-w-[560px] object-contain" />
      </motion.div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gov-bg text-slate-100">
      {/* Hero - compact, pulled up so features show on one screen */}
      <section className="flex items-center px-6 sm:px-10 lg:px-16 py-6 max-w-7xl mx-auto w-full gap-8 lg:gap-12">
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap items-center gap-2">
            {['AI Powered', 'RAG Based', 'Trusted Information'].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-[11px] font-semibold text-gov-accent tracking-wide">
                <Sparkles className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp} className="text-4xl sm:text-5xl lg:text-[48px] font-extrabold leading-tight text-slate-100">
            Find Government Schemes
            <br />
            That You&apos;re <span className="text-gov-accent">Eligible For</span>
          </motion.h1>

          <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="text-base text-slate-400 max-w-lg">
            Get personalized scheme recommendations, complete scheme details, and required documents — all in one place.
          </motion.p>

          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <button type="button" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg transition-all duration-200">
              <MessageSquare className="w-4 h-4" />
              Start Chat with AI
            </button>
            <button type="button" className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-slate-100 text-sm font-semibold rounded-xl transition-all duration-200">
              <LayoutGrid className="w-4 h-4" />
              Explore Schemes
            </button>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }} className="hidden lg:flex flex-1 items-center justify-center relative">
          <HeroIllustration />
        </motion.div>
      </section>

      {/* Popular categories - no "View All" and slightly pulled up so borders remain visible */}
      <section className="px-6 sm:px-10 lg:px-16 -mt-4 pb-4 max-w-7xl mx-auto w-full">
        <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-3">
          <h2 className="text-lg font-bold text-slate-200 tracking-wide">Popular Categories</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.label}
              type="button"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border ${cat.border} ${cat.bg} transition-all duration-200 cursor-pointer text-center group`}
            >
              <div className={`p-2.5 rounded-xl ${cat.bg} border ${cat.border}`}>
                <cat.icon className={`w-5 h-5 ${cat.color}`} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-slate-300 group-hover:text-slate-100">{cat.label}</span>
                <span className="text-[10px] text-slate-500">{cat.count}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Features - keep visible borders by overlapping slightly upward */}
      <section className="px-6 sm:px-10 lg:px-16 -mt-0 pb-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Bot,
              title: 'AI-Powered Matching',
              desc: 'Our assistant analyses your profile and surfaces the most relevant schemes.',
              color: 'text-gov-accent',
              bg: 'bg-emerald-500/10',
              border: 'border-emerald-500/20',
            },
            {
              icon: Database,
              title: 'Complete Scheme Details',
              desc: 'Eligibility criteria, required documents, and official links in one place.',
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
              border: 'border-blue-500/20',
            },
            {
              icon: Users,
              title: 'For Every Indian Citizen',
              desc: 'Central and state schemes for farmers, students, women, seniors, and more.',
              color: 'text-purple-400',
              bg: 'bg-purple-500/10',
              border: 'border-purple-500/20',
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className={`flex flex-col gap-4 p-5 rounded-2xl border ${f.border} bg-gov-card/70`}
            >
              <div className={`p-3 w-fit rounded-xl ${f.bg} border ${f.border}`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-bold text-slate-200">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}