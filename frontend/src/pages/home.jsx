import React from 'react';
import { motion } from 'framer-motion';
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
  ShieldCheck,
  Database,
  Users,
  Bot,
  FileText,
  Star,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const CATEGORIES = [
  { icon: GraduationCap, label: 'Education',     count: '280+ Schemes', color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20'   },
  { icon: Wheat,         label: 'Agriculture',   count: '200+ Schemes', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { icon: HeartPulse,    label: 'Healthcare',    count: '150+ Schemes', color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20'    },
  { icon: Baby,          label: 'Women & Child', count: '120+ Schemes', color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20'   },
  { icon: Briefcase,     label: 'Employment',    count: '90+ Schemes',  color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { icon: HomeIcon,      label: 'Housing',       count: '75+ Schemes',  color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
];

const STATS = [
  { value: '1200+', label: 'Government Schemes'   },
  { value: '28',    label: 'States & UTs Covered' },
  { value: '50K+',  label: 'Happy Users'           },
  { value: '24/7',  label: 'AI Assistant Available'},
];

function HeroIllustration() {
  const schemeItems = [
    { icon: GraduationCap, label: 'Education Scholarship', color: 'text-blue-400',   bg: 'bg-blue-500/15'   },
    { icon: Wheat,         label: 'PM-KISAN Benefits',     color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
    { icon: HeartPulse,    label: 'Health Coverage',       color: 'text-red-400',    bg: 'bg-red-500/15'    },
    { icon: HomeIcon,      label: 'Housing Subsidy',       color: 'text-orange-400', bg: 'bg-orange-500/15' },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 w-[280px] sm:w-[300px] bg-gov-card border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-3 bg-slate-900/60">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Bot className="w-4 h-4 text-gov-accent" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200">Government Schemes</p>
            <p className="text-[10px] text-slate-500">AI-Powered Assistant</p>
          </div>
          <span className="ml-auto flex items-center gap-1 text-[10px] text-gov-accent font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-gov-accent animate-pulse inline-block" />
            Live
          </span>
        </div>

        <div className="p-4 space-y-2.5">
          {schemeItems.map((item, i) => (
            <motion.div
              key={item.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-700/40 hover:border-slate-600/60 transition-colors"
            >
              <div className={`p-1.5 rounded-lg ${item.bg} shrink-0`}>
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
              </div>
              <span className="text-xs text-slate-300 font-medium flex-1 truncate">{item.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            </motion.div>
          ))}
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-600/10 border border-emerald-500/20">
            <FileText className="w-3.5 h-3.5 text-gov-accent shrink-0" />
            <p className="text-[11px] text-emerald-400 font-medium">Check your eligibility instantly</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute top-8 left-4 z-20 flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700/60 rounded-xl shadow-lg"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-gov-accent" />
        <span className="text-[10px] font-semibold text-slate-300">Trusted &amp; Verified</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="absolute bottom-10 right-2 z-20 flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700/60 rounded-xl shadow-lg"
      >
        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/30" />
        <span className="text-[10px] font-semibold text-slate-300">4.9 / 5 Rating</span>
      </motion.div>

      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-gov-bg text-slate-100">

      {/* Hero Section */}
      <section className="flex items-center px-6 sm:px-10 lg:px-16 py-12 lg:py-20 max-w-7xl mx-auto w-full gap-12">

        {/* Left Hero Content */}
        <div className="flex-1 flex flex-col gap-7 min-w-0">

          {/* Badge pills */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap items-center gap-2">
            {['AI Powered', 'RAG Based', 'Trusted Information'].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-[11px] font-semibold text-gov-accent tracking-wide">
                <Sparkles className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Heading */}
          <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold leading-tight tracking-tight text-slate-100"
          >
            Find Government Schemes<br />
            That You&apos;re{' '}
            <span className="text-gov-accent relative">
              Eligible For
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-gov-accent to-transparent rounded-full" />
            </span>
          </motion.h1>

          {/* Supporting text */}
          <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="text-base text-slate-400 leading-relaxed max-w-lg"
          >
            Get personalized scheme recommendations, complete scheme details, and a list of required
            documents — all in one place.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <button type="button"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-950/30 hover:shadow-emerald-500/20 transition-all duration-200 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              Start Chat with AI
            </button>
            <button type="button"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-slate-100 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4" />
              Explore Schemes
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5 px-4 py-3 bg-gov-card border border-slate-700/50 rounded-xl min-w-[100px]">
                <span className="text-xl font-extrabold text-slate-100 tracking-tight">{stat.value}</span>
                <span className="text-[11px] text-slate-500 font-medium">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="hidden lg:flex flex-1 items-center justify-center min-h-[420px] relative"
        >
          <HeroIllustration />
        </motion.div>
      </section>

      {/* Popular Categories */}
      <section className="px-6 sm:px-10 lg:px-16 pb-14 max-w-7xl mx-auto w-full">
        <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="flex items-center justify-between mb-5"
        >
          <h2 className="text-lg font-bold text-slate-200 tracking-wide">Popular Categories</h2>
          <button type="button" className="inline-flex items-center gap-1 text-sm text-gov-accent hover:text-emerald-400 font-medium transition-colors cursor-pointer">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.label} type="button" custom={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border ${cat.border} ${cat.bg} hover:brightness-125 transition-all duration-200 cursor-pointer text-center group`}
            >
              <div className={`p-2.5 rounded-xl ${cat.bg} border ${cat.border}`}>
                <cat.icon className={`w-5 h-5 ${cat.color}`} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-slate-300 group-hover:text-slate-100 transition-colors">{cat.label}</span>
                <span className="text-[10px] text-slate-500">{cat.count}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Features Strip */}
      <section className="px-6 sm:px-10 lg:px-16 pb-14 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Bot, title: 'AI-Powered Matching',
              desc: 'Our assistant analyses your profile and instantly surfaces the most relevant government schemes.',
              color: 'text-gov-accent', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
            },
            {
              icon: Database, title: 'Complete Scheme Details',
              desc: 'Access eligibility criteria, required documents, and official application links in one place.',
              color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20',
            },
            {
              icon: Users, title: 'For Every Indian Citizen',
              desc: 'Covering central and state schemes for farmers, students, women, seniors, and more.',
              color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20',
            },
          ].map((f, i) => (
            <motion.div key={f.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className={`flex flex-col gap-4 p-5 rounded-2xl border ${f.border} bg-gov-card/60 backdrop-blur-sm`}
            >
              <div className={`p-3 w-fit rounded-xl ${f.bg} border ${f.border}`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-bold text-slate-200">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
