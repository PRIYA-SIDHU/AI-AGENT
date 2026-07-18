import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Mic, ArrowUp } from 'lucide-react';

export default function ChatInput({ onSendMessage, disabled = false }) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-grow text area logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    // Set height based on content scrollHeight, capped at 140px (about 5-6 lines)
    const nextHeight = Math.min(textarea.scrollHeight, 140);
    textarea.style.height = `${nextHeight}px`;
  }, [text]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setText("");

    // Restore text area focus
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock alert to show attachment functionality
      alert(`File attached: ${file.name} (Simulation Only)`);
    }
  };

  const handleMicClick = () => {
    alert("Voice recognition activated. (Simulation Only)");
  };

  return (
    <div className="fixed bottom-0 left-0 lg:left-[280px] right-0 bg-gradient-to-t from-gov-bg via-gov-bg/95 to-transparent px-4 pb-6 pt-10 z-20">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto relative"
      >
        {/* Input Bar Container */}
        <div
          className={`flex items-end gap-3 p-3 bg-slate-900/90 border rounded-3xl transition-all duration-300 shadow-2xl backdrop-blur-md ${
            isFocused
              ? 'border-emerald-500/50 ring-4 ring-emerald-500/10 shadow-emerald-950/10'
              : 'border-slate-800/80 shadow-black/30'
          }`}
        >
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />

          {/* Attachment Button */}
          <button
            type="button"
            onClick={handleAttachmentClick}
            className="p-2.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-2xl transition-all cursor-pointer shrink-0 mb-0.5 active:scale-95"
            title="Attach Document"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask about any government scheme..."
            disabled={disabled}
            className="flex-1 bg-transparent border-0 outline-none text-slate-200 placeholder-slate-500 text-sm py-2 px-1 resize-none max-h-[140px] overflow-y-auto leading-relaxed focus:ring-0 scrollbar-none"
            style={{ minHeight: '36px' }}
          />

          {/* Action buttons (Right side) */}
          <div className="flex items-center gap-1.5 shrink-0 mb-0.5">
            {/* Microphone Button */}
            <button
              type="button"
              onClick={handleMicClick}
              className="p-2.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-2xl transition-all cursor-pointer active:scale-95"
              title="Voice Search"
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Emerald Send Button */}
            <motion.button
              type="submit"
              disabled={!text.trim() || disabled}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 rounded-2xl flex items-center justify-center transition-all ${
                text.trim() && !disabled
                  ? 'bg-gov-accent hover:bg-emerald-500 text-white cursor-pointer shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
              title="Send Message"
            >
              <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            </motion.button>
          </div>
        </div>

        {/* Small Disclaimer Footer */}
        <p className="text-[10px] text-slate-500 text-center mt-2 font-medium tracking-wide">
          GovAssist AI can make mistakes. Please verify official terms with relevant ministries.
        </p>
      </form>
    </div>
  );
}
