import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MoreVertical,
  Pin,
  Trash2,
  Settings,
  HelpCircle,
  Info,
  MessageSquare,
  X,
  PinOff
} from 'lucide-react';
import Logo from './Logo';

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onPinChat,
  onDeleteChatRequest,
  isOpen,
  onClose,
  onOpenSettings,
  onOpenHelp,
  onOpenAbout
}) {
  const [activeMenuChatId, setActiveMenuChatId] = useState(null);
  const menuRef = useRef(null);

  // Close context menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuChatId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sort chats: Pinned ones at the top, then others
  const sortedChats = [...chats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0; // maintain relative order
  });

  // Group chats by time period for display
  const groupChats = (chatList) => {
    const pinned = chatList.filter(c => c.isPinned);
    const today = chatList.filter(c => !c.isPinned && c.timestamp === 'Today');
    const yesterday = chatList.filter(c => !c.isPinned && c.timestamp === 'Yesterday');
    const older = chatList.filter(c => !c.isPinned && c.timestamp !== 'Today' && c.timestamp !== 'Yesterday');

    return { pinned, today, yesterday, older };
  };

  const grouped = groupChats(sortedChats);

  const handleMenuClick = (e, chatId) => {
    e.stopPropagation();
    if (activeMenuChatId === chatId) {
      setActiveMenuChatId(null);
    } else {
      setActiveMenuChatId(chatId);
    }
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-gov-sidebar border-r border-slate-800 text-slate-300 w-[280px]">
      {/* Sidebar Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Logo className="w-9 h-9" />
          <div className="flex flex-col">
            <h1 className="text-md font-bold text-slate-100 tracking-wide flex items-center gap-1.5">
              GovAssist AI
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-gov-accent px-1.5 py-0.5 rounded-md font-semibold font-mono">
                BETA
              </span>
            </h1>
            <span className="text-[10px] text-slate-400 font-medium">Government Scheme Assistant</span>
          </div>
        </div>

        {/* Close Button on Mobile Drawer */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            onNewChat();
            onClose(); // close mobile sidebar drawer
          }}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 hover:shadow-emerald-500/10 transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </motion.button>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-5 pb-4">
        {sortedChats.length === 0 ? (
          <div className="text-center py-10 px-4">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-slate-500">No conversations yet</p>
          </div>
        ) : (
          <>
            {/* Pinned Section */}
            {grouped.pinned.length > 0 && (
              <div className="space-y-1">
                <div className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Pin className="w-3 h-3 text-emerald-500/80 fill-emerald-500/20 rotate-45" />
                  <span>Pinned Chats</span>
                </div>
                {grouped.pinned.map(chat => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    activeChatId={activeChatId}
                    activeMenuChatId={activeMenuChatId}
                    onSelectChat={onSelectChat}
                    onMenuClick={handleMenuClick}
                    onPinChat={onPinChat}
                    onDeleteChatRequest={onDeleteChatRequest}
                    onCloseMenu={() => setActiveMenuChatId(null)}
                    menuRef={activeMenuChatId === chat.id ? menuRef : null}
                    onCloseMobileDrawer={onClose}
                  />
                ))}
              </div>
            )}

            {/* Today Section */}
            {grouped.today.length > 0 && (
              <div className="space-y-1">
                <div className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Today
                </div>
                {grouped.today.map(chat => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    activeChatId={activeChatId}
                    activeMenuChatId={activeMenuChatId}
                    onSelectChat={onSelectChat}
                    onMenuClick={handleMenuClick}
                    onPinChat={onPinChat}
                    onDeleteChatRequest={onDeleteChatRequest}
                    onCloseMenu={() => setActiveMenuChatId(null)}
                    menuRef={activeMenuChatId === chat.id ? menuRef : null}
                    onCloseMobileDrawer={onClose}
                  />
                ))}
              </div>
            )}

            {/* Yesterday Section */}
            {grouped.yesterday.length > 0 && (
              <div className="space-y-1">
                <div className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Yesterday
                </div>
                {grouped.yesterday.map(chat => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    activeChatId={activeChatId}
                    activeMenuChatId={activeMenuChatId}
                    onSelectChat={onSelectChat}
                    onMenuClick={handleMenuClick}
                    onPinChat={onPinChat}
                    onDeleteChatRequest={onDeleteChatRequest}
                    onCloseMenu={() => setActiveMenuChatId(null)}
                    menuRef={activeMenuChatId === chat.id ? menuRef : null}
                    onCloseMobileDrawer={onClose}
                  />
                ))}
              </div>
            )}

            {/* Older Section */}
            {grouped.older.length > 0 && (
              <div className="space-y-1">
                <div className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Previous Chats
                </div>
                {grouped.older.map(chat => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    activeChatId={activeChatId}
                    activeMenuChatId={activeMenuChatId}
                    onSelectChat={onSelectChat}
                    onMenuClick={handleMenuClick}
                    onPinChat={onPinChat}
                    onDeleteChatRequest={onDeleteChatRequest}
                    onCloseMenu={() => setActiveMenuChatId(null)}
                    menuRef={activeMenuChatId === chat.id ? menuRef : null}
                    onCloseMobileDrawer={onClose}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Sidebar Bottom Controls */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 space-y-1.5">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button
          onClick={onOpenHelp}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-all cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help & FAQs</span>
        </button>
        <button
          onClick={onOpenAbout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-all cursor-pointer"
        >
          <Info className="w-4 h-4" />
          <span>About GovAssist</span>
        </button>

        {/* Version label */}
        <div className="pt-2 text-center">
          <span className="text-[10px] text-slate-600 font-mono tracking-wider">v1.0.0 (Production Mock)</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Sidebar always visible */}
      <aside className="hidden lg:block h-screen w-[280px] shrink-0 sticky top-0 left-0">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop and Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sidebar drawer itself */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative z-50 h-full w-[280px]"
            >
              {SidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// Chat List Item Component to clean up main Sidebar render
function ChatListItem({
  chat,
  activeChatId,
  activeMenuChatId,
  onSelectChat,
  onMenuClick,
  onPinChat,
  onDeleteChatRequest,
  onCloseMenu,
  menuRef,
  onCloseMobileDrawer
}) {
  const isActive = activeChatId === chat.id;
  const isMenuOpen = activeMenuChatId === chat.id;

  return (
    <div
      onClick={() => {
        onSelectChat(chat.id);
        onCloseMobileDrawer();
      }}
      className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer select-none transition-all duration-200 ${isActive
          ? 'bg-slate-800 text-slate-100 border border-slate-700/50 shadow-md shadow-black/10'
          : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-transparent'
        }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-6">
        <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-gov-accent' : 'text-slate-500'}`} />
        <span className="text-sm truncate font-medium">{chat.title}</span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {/* Pin icon on normal view if pinned */}
        {chat.isPinned && (
          <Pin className="w-3.5 h-3.5 text-gov-accent fill-gov-accent/20 rotate-45 shrink-0" />
        )}

        {/* Action three dots menu - visible on hover or when menu is active */}
        <button
          onClick={(e) => onMenuClick(e, chat.id)}
          className={`p-1 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer shrink-0 ${isMenuOpen ? 'opacity-100 bg-slate-700' : ''
            }`}
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Menu Popover */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-2 top-9 z-50 min-w-[140px] bg-slate-900/95 border border-slate-800 rounded-xl p-1.5 shadow-xl backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pin / Unpin Action */}
            <button
              onClick={() => {
                onPinChat(chat.id);
                onCloseMenu();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-left"
            >
              {chat.isPinned ? (
                <>
                  <PinOff className="w-3.5 h-3.5 text-slate-400 rotate-45" />
                  <span>Unpin Chat</span>
                </>
              ) : (
                <>
                  <Pin className="w-3.5 h-3.5 text-gov-accent rotate-45" />
                  <span>Pin Chat</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="h-[1px] bg-slate-800 my-1" />

            {/* Delete Action */}
            <button
              onClick={() => {
                onDeleteChatRequest(chat.id);
                onCloseMenu();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer text-left font-medium"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Delete Chat</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
