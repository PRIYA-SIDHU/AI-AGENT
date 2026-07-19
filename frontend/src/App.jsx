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
import Home from './pages/home';
import Profile from './pages/profile';
import { initialChats, getMockResponse } from './data/dummyData';

export default function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deleteChatId, setDeleteChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Page navigation state — 'chat' is default, 'home' shows the Home landing page
  const [currentPage, setCurrentPage] = useState('home');
  const [profileInitials, setProfileInitials] = useState('?');

  // Settings, Help, About Modals State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // User Settings State (Mock)
  const [selectedModel, setSelectedModel] = useState("govassist-v1-fast");
  const [quickResponses, setQuickResponses] = useState(true);

  // Load history from FastAPI backend on mount
  React.useEffect(() => {
    // Fetch saved profile initials
    fetch('http://localhost:8000/profile')
      .then(r => r.json())
      .then(data => {
        if (data?.first_name) {
          setProfileInitials((data.first_name[0] + (data.surname?.[0] ?? '')).toUpperCase());
        }
      })
      .catch(() => {});

    const init = async () => {
      try {
        const res = await fetch("http://localhost:8000/history");
        if (res.ok) {
          const list = await res.json();
          setChats(list);
          if (list.length > 0) {
            // Load detail of the first active chat
            const firstId = list[0].id;
            const detailRes = await fetch(`http://localhost:8000/chat/${firstId}`);
            if (detailRes.ok) {
              const detail = await detailRes.json();
              setChats(prev => prev.map(c => c.id === firstId ? detail : c));
              setActiveChatId(firstId);
            }
          } else {
            // Auto-create a chat if history is empty
            await handleNewChat();
          }
        }
      } catch (e) {
        console.error("Backend offline. Falling back to local mock data.", e);
        setChats(initialChats);
        setActiveChatId("chat-1");
      }
    };
    init();
  }, []);

  // Find active chat object
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0] || null;

  // Create a new empty chat session
  const handleNewChat = async () => {
    try {
      const res = await fetch("http://localhost:8000/new-chat", { method: "POST" });
      if (res.ok) {
        const data = await res.json(); // { chat_id: "..." }
        const newChat = {
          id: data.chat_id,
          title: "New Assistant Chat",
          timestamp: "Today",
          isPinned: false,
          messages: []
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(data.chat_id);
      }
    } catch (e) {
      console.error("Failed to create new chat in backend:", e);
      // Local fallback
      const localId = `chat-${Date.now()}`;
      const localChat = {
        id: localId,
        title: "New Assistant Chat (Offline)",
        timestamp: "Today",
        isPinned: false,
        messages: []
      };
      setChats(prev => [localChat, ...prev]);
      setActiveChatId(localId);
    }
  };

  // Select a chat and fetch its message details from backend
  const handleSelectChat = async (id) => {
    // If we already have the messages list loaded, switch active instantly
    const chatObj = chats.find(c => c.id === id);
    if (chatObj && chatObj.messages) {
      setActiveChatId(id);
    }
    
    try {
      const res = await fetch(`http://localhost:8000/chat/${id}`);
      if (res.ok) {
        const detail = await res.json();
        setChats(prev => prev.map(c => c.id === id ? detail : c));
        setActiveChatId(id);
      }
    } catch (e) {
      console.error("Error loading chat details:", e);
      setActiveChatId(id); // Fallback to local state transition
    }
  };

  // Pin/Unpin a chat
  const handlePinChat = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/chat/${id}/pin`, { method: "POST" });
      if (res.ok) {
        const data = await res.json(); // { status: "success", isPinned: boolean }
        setChats(prev => {
          const updated = prev.map(c => c.id === id ? { ...c, isPinned: data.isPinned } : c);
          // Sort by pinned first, then by timestamp (or index)
          return updated;
        });
      }
    } catch (e) {
      console.error("Failed to toggle pin state in backend:", e);
      // Local fallback
      setChats(prev => prev.map(chat => {
        if (chat.id === id) {
          return { ...chat, isPinned: !chat.isPinned };
        }
        return chat;
      }));
    }
  };

  // Set chat up for deletion (opens modal)
  const handleDeleteChatRequest = (id) => {
    setDeleteChatId(id);
  };

  // Perform deletion after confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteChatId) return;

    try {
      const res = await fetch(`http://localhost:8000/chat/${deleteChatId}`, { method: "DELETE" });
      if (res.ok) {
        const remainingChats = chats.filter(chat => chat.id !== deleteChatId);
        setChats(remainingChats);

        // If we deleted the currently active chat
        if (activeChatId === deleteChatId) {
          if (remainingChats.length > 0) {
            await handleSelectChat(remainingChats[0].id);
          } else {
            await handleNewChat();
          }
        }
      }
    } catch (e) {
      console.error("Failed to delete chat in backend:", e);
      // Local fallback
      const remainingChats = chats.filter(chat => chat.id !== deleteChatId);
      setChats(remainingChats);
      if (activeChatId === deleteChatId) {
        if (remainingChats.length > 0) {
          setActiveChatId(remainingChats[0].id);
        } else {
          const freshId = `chat-${Date.now()}`;
          setChats([{ id: freshId, title: "New Assistant Chat", timestamp: "Today", isPinned: false, messages: [] }]);
          setActiveChatId(freshId);
        }
      }
    } finally {
      setDeleteChatId(null);
    }
  };

  // Handle message sending
  const handleSendMessage = async (text) => {
    if (isTyping) return; // ignore if AI is answering
    if (!text || !text.trim()) return;

    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = {
      sender: "user",
      text: text,
      timestamp: timestampStr
    };

    // Update active chat's messages locally (Instant feedback)
    setChats(prevChats => prevChats.map(c => {
      if (c.id === activeChatId) {
        let title = c.title;
        if (c.messages.length === 0) {
          title = text.length > 30 ? `${text.slice(0, 30)}...` : text;
        }
        return {
          ...c,
          title,
          messages: [...(c.messages || []), userMessage]
        };
      }
      return c;
    }));

    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: activeChatId,
          message: text
        })
      });

      if (res.ok) {
        const aiMessage = await res.json(); // { sender: "ai", text: "...", timestamp: "..." }
        
        // Fetch refreshed chat data to sync final title & full history from DB
        const detailRes = await fetch(`http://localhost:8000/chat/${activeChatId}`);
        if (detailRes.ok) {
          const updatedChat = await detailRes.json();
          setChats(prev => prev.map(c => c.id === activeChatId ? updatedChat : c));
        } else {
          // Fallback update if detail fetch fails
          setChats(prevChats => prevChats.map(c => {
            if (c.id === activeChatId) {
              return {
                ...c,
                messages: [...(c.messages || []), aiMessage]
              };
            }
            return c;
          }));
        }
      } else {
        const errMessage = {
          sender: "ai",
          text: "⚠️ Server Error: Failed to receive response from backend.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...(c.messages || []), errMessage] } : c));
      }
    } catch (e) {
      console.error("Failed to send chat message:", e);
      const errMessage = {
        sender: "ai",
        text: "⚠️ Connection Error: Cannot connect to GovAssist AI backend.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...(c.messages || []), errMessage] } : c));
    } finally {
      setIsTyping(false);
    }
  };

  // Reset database state to defaults
  const handleResetData = async () => {
    if (confirm("Reset chat history to default examples? (Note: This will clear local history and start fresh)")) {
      // Clear all chats in backend
      try {
        for (const chat of chats) {
          await fetch(`http://localhost:8000/chat/${chat.id}`, { method: "DELETE" });
        }
        await handleNewChat();
      } catch (e) {
        console.error(e);
        setChats(initialChats);
        setActiveChatId("chat-1");
      }
      setIsSettingsOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gov-bg text-slate-100 font-sans selection:bg-emerald-500/25 selection:text-gov-accent">

      {/* 1. Sidebar Component */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => { handleSelectChat(id); setCurrentPage('chat'); }}
        onNewChat={() => { handleNewChat(); setCurrentPage('chat'); }}
        onPinChat={handlePinChat}
        onDeleteChatRequest={handleDeleteChatRequest}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onNavigateHome={() => { setCurrentPage('home'); setIsSidebarOpen(false); }}
        onNavigateProfile={() => { setCurrentPage('profile'); setIsSidebarOpen(false); }}
      />

      {/* 2. Main Right-hand Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full overflow-hidden">
        {/* Header — always visible */}
        <Header
          activeChatTitle={currentPage === 'home' ? 'Home' : currentPage === 'profile' ? 'My Profile' : (activeChat ? activeChat.title : 'GovAssist Assistant')}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          initials={profileInitials}
        />

        {currentPage === 'home' ? (
          <Home />
        ) : currentPage === 'profile' ? (
          <Profile onProfileSaved={(data) => {
            setProfileInitials((data.first_name[0] + (data.surname?.[0] ?? '')).toUpperCase());
          }} />
        ) : (
          /* Chat Area */
          <>
            <ChatArea
              messages={activeChat ? activeChat.messages : []}
              isTyping={isTyping}
              onSelectSuggestion={handleSendMessage}
            />
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isTyping}
            />
          </>
        )}
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
