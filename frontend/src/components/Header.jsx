import React, { useState } from 'react';
import { Menu, Bell, Sparkles, AlertCircle } from 'lucide-react';
import Avatar from './Avatar';

export default function Header({
  activeChatTitle,
  onToggleSidebar,
  initials = "?",
  onOpenNotifications
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock list of notifications to make the interface premium & functional
  const notifications = [
    { id: 1, text: "PM Kisan 18th installment date announced!", isNew: true },
    { id: 2, text: "NSP Scholarship portal closing in 5 days.", isNew: true },
    { id: 3, text: "Startup Seed Fund budget increased for 2026.", isNew: false }
  ];

  return (
    <header className="h-[70px] bg-gov-bg/85 border-b border-slate-800/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 w-full select-none">
      {/* Left side: Hamburger (mobile/tablet only) + Titles */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-all cursor-pointer shrink-0"
          aria-label="Toggle Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <h2 className="text-sm font-semibold text-slate-200 truncate tracking-wide">
            {activeChatTitle || "GovAssist Assistant"}
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden xs:block">
            Ask about government schemes, scholarships, subsidies and benefits.
          </p>
        </div>
      </div>

      {/* Right side: Quick stats/actions */}
      <div className="flex items-center gap-3">
        {/* Dark Theme Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800/60 rounded-xl text-slate-400 hover:text-slate-300 transition-colors select-none text-[10px] font-semibold tracking-wider uppercase font-mono">
          <Sparkles className="w-3.5 h-3.5 text-gov-accent" />
          <span className="hidden sm:inline">Dark Theme Active</span>
        </div>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800/80 rounded-xl text-slate-400 hover:text-slate-200 transition-all cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            {/* Green Notification Dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-gov-accent rounded-full border border-slate-900 animate-pulse" />
          </button>

          {/* Simple Dropdown for Notifications */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2.5 w-72 bg-slate-950/95 border border-slate-800 rounded-xl p-3 shadow-2xl backdrop-blur-md z-50 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 mb-1.5">
                  <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Updates & Notifications</span>
                  <AlertCircle className="w-3.5 h-3.5 text-gov-accent" />
                </div>
                <div className="space-y-2">
                  {notifications.map(notif => (
                    <div key={notif.id} className="text-xs leading-relaxed text-slate-400 hover:text-slate-200 transition-colors py-1 cursor-pointer">
                      <div className="flex items-start gap-1.5">
                        {notif.isNew && <span className="w-1.5 h-1.5 bg-gov-accent rounded-full mt-1.5 shrink-0" />}
                        <span>{notif.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-[1px] bg-slate-800" />

        {/* User avatar */}
        <Avatar role="user" initials={initials} className="w-8 h-8 cursor-pointer ring-2 ring-slate-800/60 hover:ring-gov-accent/30 transition-all" />
      </div>
    </header>
  );
}
