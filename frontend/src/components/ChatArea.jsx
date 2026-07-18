import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Sprout,
  Briefcase,
  HeartPulse,
  Building
} from 'lucide-react';
import Avatar from './Avatar';

// ----------------------------------------------------
// 1. SuggestionCard Sub-component
// ----------------------------------------------------
function SuggestionCard({ title, description, icon: Icon, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="flex flex-col text-left p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500/30 hover:bg-slate-900/80 rounded-2xl cursor-pointer transition-all duration-300 shadow-md hover:shadow-emerald-950/5 relative group overflow-hidden select-none"
    >
      {/* Decorative top-right green glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all duration-300" />

      {/* Glowing icon container */}
      <div className="p-3 bg-slate-800/80 group-hover:bg-emerald-950/20 border border-slate-700/60 group-hover:border-emerald-500/20 text-slate-400 group-hover:text-gov-accent rounded-xl w-fit transition-all duration-300 mb-4 shadow-sm">
        <Icon className="w-5 h-5" />
      </div>

      <h3 className="text-sm font-semibold text-slate-200 group-hover:text-slate-100 mb-1 transition-colors">
        {title}
      </h3>
      <p className="text-xs text-slate-400 group-hover:text-slate-300 leading-relaxed transition-colors">
        {description}
      </p>
    </motion.button>
  );
}

// ----------------------------------------------------
// 2. EmptyState Sub-component
// ----------------------------------------------------
function EmptyState({ onSelectSuggestion }) {
  const suggestions = [
    {
      title: "Find Student Scholarships",
      description: "Discover NSP post-matric, degree schemes, and girl child grants.",
      icon: GraduationCap,
      query: "What are the latest scholarships for students on the National Scholarship Portal?"
    },
    {
      title: "Farmer Welfare Schemes",
      description: "Explore income support (PM Kisan), crop insurance, and subsidies.",
      icon: Sprout,
      query: "Show me government schemes for farmers like PM Kisan and insurance."
    },
    {
      title: "Business Loans",
      description: "Apply for Mudra loans, Startup Seed Fund, and MSME credit lines.",
      icon: Briefcase,
      query: "Explain business loans and startup credit schemes like Mudra loan."
    },
    {
      title: "Healthcare Benefits",
      description: "Check eligibility for Ayushman Bharat cashless cover and cards.",
      icon: HeartPulse,
      query: "How can I apply for an Ayushman Bharat Card and check eligibility?"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-8 select-none">
      {/* Central Premium Graphic Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative flex items-center justify-center w-28 h-28 mb-8"
      >
        {/* Concentric rings */}
        <div className="absolute inset-0 border border-dashed border-emerald-500/10 rounded-full animate-[spin_60s_linear_infinite]" />
        <div className="absolute inset-2 border border-slate-800 rounded-full" />
        <div className="absolute inset-4 bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/5" />

        {/* Emblem Building inside shield */}
        <div className="relative z-10 p-4 bg-emerald-950/20 border border-emerald-500/30 text-gov-accent rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.15)]">
          <Building className="w-9 h-9" />
        </div>

        {/* Small orbital dots */}
        <span className="absolute top-1 left-3 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
        <span className="absolute bottom-4 right-1 w-2 h-2 bg-emerald-500/30 rounded-full" />
      </motion.div>

      {/* Main headings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center space-y-3 mb-10"
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Welcome to <span className="text-gov-accent">GovAssist AI</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          Discover scholarships, subsidies, loans, and healthcare schemes. Ask a query or pick one of the suggestions below to get started.
        </p>
      </motion.div>

      {/* Suggestion cards grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
      >
        {suggestions.map((sug, idx) => (
          <SuggestionCard
            key={idx}
            title={sug.title}
            description={sug.description}
            icon={sug.icon}
            onClick={() => onSelectSuggestion(sug.query)}
          />
        ))}
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------
// 3. MessageBubble Sub-component
// ----------------------------------------------------
const parseInlineMarkdown = (text) => {
  let tokens = [{ type: 'text', content: text }];

  // Parse links: [label](url)
  tokens = tokens.flatMap(t => {
    if (t.type !== 'text') return t;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const result = [];
    let lastIndex = 0;
    let match;
    while ((match = linkRegex.exec(t.content)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: 'text', content: t.content.substring(lastIndex, match.index) });
      }
      result.push({ type: 'link', label: match[1], url: match[2] });
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < t.content.length) {
      result.push({ type: 'text', content: t.content.substring(lastIndex) });
    }
    return result;
  });

  // Parse bold: **text**
  tokens = tokens.flatMap(t => {
    if (t.type !== 'text') return t;
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const result = [];
    let lastIndex = 0;
    let match;
    while ((match = boldRegex.exec(t.content)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: 'text', content: t.content.substring(lastIndex, match.index) });
      }
      result.push({ type: 'bold', content: match[1] });
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < t.content.length) {
      result.push({ type: 'text', content: t.content.substring(lastIndex) });
    }
    return result;
  });

  // Parse inline code: `code`
  tokens = tokens.flatMap(t => {
    if (t.type !== 'text') return t;
    const codeRegex = /`([^`]+)`/g;
    const result = [];
    let lastIndex = 0;
    let match;
    while ((match = codeRegex.exec(t.content)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: 'text', content: t.content.substring(lastIndex, match.index) });
      }
      result.push({ type: 'code', content: match[1] });
      lastIndex = codeRegex.lastIndex;
    }
    if (lastIndex < t.content.length) {
      result.push({ type: 'text', content: t.content.substring(lastIndex) });
    }
    return result;
  });

  return tokens.map((token, i) => {
    if (token.type === 'link') {
      return (
        <a
          key={i}
          href={token.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gov-accent hover:underline font-semibold"
          onClick={(e) => e.stopPropagation()}
        >
          {token.label}
        </a>
      );
    }
    if (token.type === 'bold') {
      return <strong key={i} className="font-bold text-slate-100">{token.content}</strong>;
    }
    if (token.type === 'code') {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800">
          {token.content}
        </code>
      );
    }
    return token.content;
  });
};

const MarkdownBlockRenderer = ({ content }) => {
  const lines = content.split('\n');
  const renderedElements = [];

  let currentList = [];
  let listType = null; // 'ul' or 'ol'

  const flushList = (key) => {
    if (currentList.length === 0) return;

    if (listType === 'ul') {
      renderedElements.push(
        <ul key={`ul-${key}`} className="list-disc pl-6 mb-4 space-y-1.5 text-slate-300">
          {currentList}
        </ul>
      );
    } else if (listType === 'ol') {
      renderedElements.push(
        <ol key={`ol-${key}`} className="list-decimal pl-6 mb-4 space-y-1.5 text-slate-300">
          {currentList}
        </ol>
      );
    }
    currentList = [];
    listType = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Unordered lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (listType !== 'ul') {
        flushList(index);
        listType = 'ul';
      }
      currentList.push(
        <li key={index} className="text-sm leading-relaxed">
          {parseInlineMarkdown(line.substring(2))}
        </li>
      );
      return;
    }

    // Ordered lists
    const orderedMatch = line.match(/^(\d+)\.\s(.*)/);
    if (orderedMatch) {
      if (listType !== 'ol') {
        flushList(index);
        listType = 'ol';
      }
      currentList.push(
        <li key={index} className="text-sm leading-relaxed" value={parseInt(orderedMatch[1], 10)}>
          {parseInlineMarkdown(orderedMatch[2])}
        </li>
      );
      return;
    }

    // Flush active list
    if (listType) {
      flushList(index);
    }

    // Headings
    if (line.startsWith('### ')) {
      renderedElements.push(
        <h3 key={index} className="text-base font-bold text-slate-100 mt-5 mb-2.5 first:mt-0 tracking-wide">
          {parseInlineMarkdown(line.slice(4))}
        </h3>
      );
      return;
    }
    if (line.startsWith('#### ')) {
      renderedElements.push(
        <h4 key={index} className="text-sm font-semibold text-slate-200 mt-4 mb-2">
          {parseInlineMarkdown(line.slice(5))}
        </h4>
      );
      return;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      renderedElements.push(
        <blockquote key={index} className="border-l-4 border-emerald-500 bg-emerald-950/10 px-4 py-2.5 rounded-r-xl text-slate-300 text-xs italic my-4 border-dashed">
          {parseInlineMarkdown(line.slice(2))}
        </blockquote>
      );
      return;
    }

    // Divider
    if (trimmed === '---') {
      renderedElements.push(<hr key={index} className="border-slate-800/80 my-4" />);
      return;
    }

    // Empty space
    if (trimmed === '') {
      renderedElements.push(<div key={index} className="h-2.5" />);
      return;
    }

    // Standard text
    renderedElements.push(
      <p key={index} className="text-sm leading-relaxed text-slate-300 mb-3 last:mb-0">
        {parseInlineMarkdown(line)}
      </p>
    );
  });

  if (listType) {
    flushList(lines.length);
  }

  return <div className="space-y-1">{renderedElements}</div>;
};

function MessageBubble({ message }) {
  const isAI = message.sender === "ai";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-4 mb-6 ${isAI ? 'justify-start' : 'justify-end flex-row-reverse'
        }`}
    >
      <Avatar role={isAI ? "ai" : "user"} className="w-8 h-8 select-none" />

      <div className="flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[70%]">
        <div
          className={`px-4.5 py-3 rounded-2xl shadow-lg border relative ${isAI
            ? 'bg-slate-900 border-slate-800/80 text-slate-200 rounded-tl-none shadow-black/5'
            : 'bg-emerald-950/25 border-emerald-500/25 text-slate-100 rounded-tr-none shadow-emerald-950/5'
            }`}
        >
          {isAI ? (
            <MarkdownBlockRenderer content={message.text} />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
          )}
        </div>

        <span className={`text-[10px] text-slate-500 mt-1 px-1 font-mono ${isAI ? 'text-left' : 'text-right'
          }`}>
          {message.timestamp}
        </span>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------
// 4. Main ChatArea Component (Default Export)
// ----------------------------------------------------
export default function ChatArea({
  messages = [],
  isTyping = false,
  onSelectSuggestion
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 bg-gov-bg">
      {messages.length === 0 ? (
        <div className="min-h-[70vh] flex items-center justify-center">
          <EmptyState onSelectSuggestion={onSelectSuggestion} />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto pb-32">
          {/* Messages list */}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-4 mb-6 justify-start">
              <Avatar role="ai" className="w-8 h-8 select-none" />
              <div className="flex flex-col">
                <div className="bg-slate-900 border border-slate-800/80 rounded-2xl rounded-tl-none px-4.5 py-3.5 shadow-lg shadow-black/5 flex items-center gap-1.5 w-fit">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
                  Typing...
                </span>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
