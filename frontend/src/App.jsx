import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Settings,
  HelpCircle,
  Info,
  ShieldAlert,
  Check,
  User,
  Sparkles,
  RefreshCw
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import DeleteDialog from './components/DeleteDialog';
import { initialChats, getMockResponse } from './data/dummyData';

export default function App() {
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState("chat-1");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deleteChatId, setDeleteChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Settings, Help, About Modals State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // User Settings State (Mock)
  const [selectedModel, setSelectedModel] = useState("govassist-v1-fast");
  const [quickResponses, setQuickResponses] = useState(true);

  // Find active chat object
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0] || null;

  // Create a new empty chat
  const handleNewChat = () => {
    const newId = `chat-${Date.now()}`;
    const newChat = {
      id: newId,
      title: "New Assistant Chat",
      timestamp: "Today",
      isPinned: false,
      messages: []
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newId);
  };

  // Select a chat
  const handleSelectChat = (id) => {
    setActiveChatId(id);
  };

  // Pin/Unpin a chat
  const handlePinChat = (id) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === id) {
        return { ...chat, isPinned: !chat.isPinned };
      }
      return chat;
    }));
  };

  // Set chat up for deletion (opens modal)
  const handleDeleteChatRequest = (id) => {
    setDeleteChatId(id);
  };

  // Perform deletion after confirmation
  const handleDeleteConfirm = () => {
    if (!deleteChatId) return;

    const remainingChats = chats.filter(chat => chat.id !== deleteChatId);
    setChats(remainingChats);

    // If we deleted the currently active chat
    if (activeChatId === deleteChatId) {
      if (remainingChats.length > 0) {
        setActiveChatId(remainingChats[0].id);
      } else {
        // No chats left, auto create one
        const freshId = `chat-${Date.now()}`;
        const freshChat = {
          id: freshId,
          title: "New Assistant Chat",
          timestamp: "Today",
          isPinned: false,
          messages: []
        };
        setChats([freshChat]);
        setActiveChatId(freshId);
      }
    }
    setDeleteChatId(null);
  };

  // Handle message sending
  const handleSendMessage = (text) => {
    if (isTyping) return; // ignore if AI is answering

    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text: text,
      timestamp: timestampStr
    };

    // Update active chat's messages
    setChats(prevChats => prevChats.map(c => {
      if (c.id === activeChatId) {
        // If it's a new empty chat, update title dynamically from query
        let title = c.title;
        if (c.messages.length === 0) {
          title = text.length > 30 ? `${text.slice(0, 30)}...` : text;
        }
        return {
          ...c,
          title,
          messages: [...c.messages, userMessage]
        };
      }
      return c;
    }));

    // Trigger AI Typing Animation
    setIsTyping(true);

    // Simulate AI response after 1.2s delay
    setTimeout(() => {
      const response = getMockResponse(text);
      const aiMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: "ai",
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChats(prevChats => prevChats.map(c => {
        if (c.id === activeChatId) {
          let title = c.title;
          // Set final title if this is the first complete conversation cycle
          if (c.messages.length === 1) { // just has userMsg
            title = response.title || (text.length > 30 ? `${text.slice(0, 30)}...` : text);
          }
          return {
            ...c,
            title,
            messages: [...c.messages, aiMessage]
          };
        }
        return c;
      }));
      setIsTyping(false);
    }, 1200);
  };

  // Reset database state to defaults (Helper in settings)
  const handleResetData = () => {
    if (confirm("Reset chat history to default examples?")) {
      setChats(initialChats);
      setActiveChatId("chat-1");
      setIsSettingsOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gov-bg text-slate-100 font-sans selection:bg-emerald-500/25 selection:text-gov-accent">

      {/* 1. Sidebar Component */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onPinChat={handlePinChat}
        onDeleteChatRequest={handleDeleteChatRequest}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* 2. Main Right-hand Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Header */}
        <Header
          activeChatTitle={activeChat ? activeChat.title : "GovAssist Assistant"}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Chat Area containing Message List or Empty State */}
        <ChatArea
          messages={activeChat ? activeChat.messages : []}
          isTyping={isTyping}
          onSelectSuggestion={handleSendMessage}
        />

        {/* Bottom Input Field */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
        />
      </div>

      {/* 3. Delete Confirmation Dialog Modal */}
      <DeleteDialog
        isOpen={deleteChatId !== null}
        onClose={() => setDeleteChatId(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* 4. Settings Dialog Modal */}
      <ModalWrapper isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="System Settings">
        <div className="space-y-5">
          {/* AI Model selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">AI Inference Model</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedModel("govassist-v1-fast")}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${selectedModel === "govassist-v1-fast"
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-gov-accent'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
              >
                <div>
                  <div className="text-xs font-bold">GovAssist-V1 (Default)</div>
                  <div className="text-[10px] text-slate-500">Fast, optimized for local search</div>
                </div>
                {selectedModel === "govassist-v1-fast" && <Check className="w-4 h-4 text-gov-accent" />}
              </button>
              <button
                onClick={() => setSelectedModel("govassist-pro-deep")}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${selectedModel === "govassist-pro-deep"
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-gov-accent'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
              >
                <div>
                  <div className="text-xs font-bold">GovAssist-Pro (Reasoning)</div>
                  <div className="text-[10px] text-slate-500">Deeper checks and documentation</div>
                </div>
                {selectedModel === "govassist-pro-deep" && <Check className="w-4 h-4 text-gov-accent" />}
              </button>
            </div>
          </div>

          {/* Quick response toggles */}
          <div className="flex items-center justify-between bg-slate-950/30 p-3 rounded-xl border border-slate-800/80">
            <div>
              <div className="text-xs font-bold text-slate-200">Interactive Suggestions</div>
              <p className="text-[10px] text-slate-500">Show suggestion cards on empty chat screens</p>
            </div>
            <button
              onClick={() => setQuickResponses(!quickResponses)}
              className={`w-9 h-5 rounded-full transition-all relative ${quickResponses ? 'bg-gov-accent' : 'bg-slate-800'
                }`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all ${quickResponses ? 'right-0.5' : 'left-0.5'
                }`} />
            </button>
          </div>

          {/* Reset database button */}
          <div className="border-t border-slate-800/80 pt-4 flex justify-between items-center gap-3">
            <button
              onClick={handleResetData}
              className="flex items-center gap-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 border border-red-500/20 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Chat Data</span>
            </button>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium shadow-md transition-all cursor-pointer"
            >
              Save & Close
            </button>
          </div>
        </div>
      </ModalWrapper>

      {/* 5. Help Dialog Modal */}
      <ModalWrapper isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Help & Frequently Asked Questions">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl">
            <h4 className="text-xs font-bold text-slate-200 mb-1">What can GovAssist AI do?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              We process text guidelines, income limits, eligible documents, and websites for Indian state and national schemes. You can ask queries related to student scholarships, farming credits, loans, and health schemes.
            </p>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl">
            <h4 className="text-xs font-bold text-slate-200 mb-1">Is this an official government app?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              No. GovAssist AI is an intelligent assistant designed to summarize official government schemes into easy-to-read guides. Always verify final terms on official websites (usually ending in `.gov.in`).
            </p>
          </div>
          <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl">
            <h4 className="text-xs font-bold text-slate-200 mb-1">How do I search for a specific scheme?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Type the scheme name (e.g., "PM Kisan" or "Post Matric SC") directly into the bottom chatbar. The assistant will display criteria, links, and documents.
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsHelpOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700/60 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </ModalWrapper>

      {/* 6. About Dialog Modal */}
      <ModalWrapper isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} title="About GovAssist AI">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-emerald-950/10 border border-emerald-500/20 rounded-xl">
            <div className="p-3 bg-emerald-950/30 text-gov-accent rounded-xl border border-emerald-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">GovAssist AI Platform</h4>
              <span className="text-[10px] text-slate-500">Secure. Smart. Access for All.</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            GovAssist AI is built using React, Tailwind CSS, Lucide icons, and Framer Motion. The UI is designed to feel fast, accessible, and premium.
          </p>

          <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Framework</span>
              <span className="text-slate-300 font-mono">React v19.0 / Vite</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Styling Library</span>
              <span className="text-slate-300 font-mono">Tailwind CSS v4.0</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Animation Engine</span>
              <span className="text-slate-300 font-mono">Framer Motion v11.0</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsAboutOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700/60 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </ModalWrapper>

    </div>
  );
}

// Reuseable Modal Wrapper Component using Framer Motion
function ModalWrapper({ isOpen, onClose, title, children }) {
  // ESC handler inside modal wrapper too
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Dialog frame */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5 mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inner Content */}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
