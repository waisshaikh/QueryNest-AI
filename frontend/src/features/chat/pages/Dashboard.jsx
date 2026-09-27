import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChat } from '../hooks/useChat';
import {
  Plus,
  Search,
  Sparkles,
  Send,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Trash2
} from 'lucide-react';

const Dashboard = () => {
  const {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleDeleteChat,
    handleNewChat,
    chats,
    currentChatId,
    isLoading
  } = useChat();

  // Socket initialization & Initial chat history fetch
  useEffect(() => {
    const cleanup = initializeSocketConnection();
    handleGetChats();
    return cleanup;
  }, []);

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);

  // Active chat & messages from Redux store via useChat
  const activeChat = currentChatId && chats ? chats[currentChatId] : null;
  const messages = activeChat?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const onSubmit = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const messageToSend = inputMessage;
    setInputMessage('');
    await handleSendMessage({ message: messageToSend, chatId: currentChatId });
  };

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Format timestamp helper
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Convert chats object into array sorted by last updated
  const chatList = Object.values(chats || {}).sort((a, b) => {
    const dateA = new Date(a.lastUpdated || 0);
    const dateB = new Date(b.lastUpdated || 0);
    return dateB - dateA;
  });

  const filteredHistory = chatList.filter((item) =>
    (item.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-full flex bg-[#f8f6f2] text-slate-800 overflow-hidden select-none font-sans">
      
      {/* ========================================================================= */}
      {/* CHAT HISTORY SIDEBAR DRAWER (Vibrant Deep Orange Theme)                    */}
      {/* ========================================================================= */}
      <section className="w-72 md:w-80 bg-gradient-to-b from-[#ff5100] via-[#f95700] to-[#e64a00] border-r border-orange-600/40 flex flex-col p-5 space-y-4 shrink-0 text-white shadow-2xl">
        
        {/* Header Title: QueryNest AI with updated logo */}
        <div className="flex items-center justify-between pb-3 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <img
              src="/QuerynestAI-logo.png"
              alt="QueryNest AI Logo"
              className="w-10 h-10 object-contain shrink-0"
            />
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide">
                QueryNest AI
              </h2>
              <p className="text-[11px] text-orange-100/90 font-medium">Smart AI Assistant</p>
            </div>
          </div>

          <button
            onClick={handleNewChat}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 shadow-md hover:scale-105 transition-all cursor-pointer"
            title="Start New Chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-white/70" />
          <input
            type="text"
            placeholder="Search chat history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/20 border border-white/30 focus:border-white focus:bg-white/30 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none transition-all placeholder:text-white/70 focus:ring-1 focus:ring-white/50 font-medium"
          />
        </div>

        {/* List of Chat Titles (White Cards with Black Text) */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 pr-1 py-1">
          <p className="text-[11px] font-extrabold text-white/90 uppercase tracking-wider px-1">
            Recent Conversations
          </p>

          {filteredHistory.length === 0 ? (
            <p className="text-xs text-white/80 text-center py-6 font-medium">
              {searchQuery ? 'No matching conversations' : 'No conversations yet'}
            </p>
          ) : (
            filteredHistory.map((item) => {
              const isActive = currentChatId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenChat(item.id)}
                  className={`group relative w-full p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between shadow-md ${
                    isActive
                      ? 'bg-white border-2 border-slate-900 text-slate-900 shadow-xl ring-2 ring-black/20 scale-[1.02]'
                      : 'bg-white/95 border border-white/80 text-slate-900 hover:bg-white hover:shadow-lg hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden flex-1 min-w-0">
                    <div className="truncate flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {item.title || 'New Chat'}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {item.messages && item.messages.length > 0
                          ? `${item.messages.length} messages`
                          : 'Click to load chat'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 ml-2">
                    <span className="text-[10px] text-slate-400 font-medium group-hover:hidden">
                      {formatTime(item.lastUpdated)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(item.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Delete Chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAIN WORKSPACE / CHAT CONTAINER (Light White Background Theme)            */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col h-full bg-[#f8f6f2] text-slate-800 relative overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-orange-200/60 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center space-x-3">
            <img
              src="/QuerynestAI-logo.png"
              alt="QueryNest AI Logo"
              className="w-7 h-7 object-contain shrink-0"
            />
            <h1 className="text-sm font-bold text-slate-900 tracking-wide">
              {activeChat ? activeChat.title : 'QueryNest AI'}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {currentChatId && (
              <button
                onClick={() => handleDeleteChat(currentChatId)}
                className="p-2 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all cursor-pointer shadow-sm"
                title="Delete Current Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Message Stream Scroll Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
          
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
              <img
                src="/QuerynestAI-logo.png"
                alt="QueryNest AI Logo"
                className="w-20 h-20 object-contain shrink-0 drop-shadow-md"
              />
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900">How can QueryNest AI help you today?</h2>
                <p className="text-xs text-slate-500 max-w-md">
                  Type a message below to start a clean, high-performance conversation powered by real-time AI.
                </p>
              </div>

              {/* Sample Prompt Pills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-6 w-full max-w-lg">
                {[
                  'Explain quantum computing in simple terms',
                  'Write a Python script for data processing',
                  'How do I build a REST API in Node.js?',
                  'Summarize the core concepts of Redux Toolkit'
                ].map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputMessage(promptText);
                    }}
                    className="p-3 text-left bg-white border border-orange-200/80 hover:border-orange-500/60 text-xs text-slate-700 rounded-xl hover:bg-orange-50/60 shadow-sm hover:shadow transition-all cursor-pointer font-medium"
                  >
                    "{promptText}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={msg.id || index} className="w-full space-y-4">
                
                {/* USER MESSAGE BUBBLE (Full Orange Shaded) */}
                {msg.role === 'user' && (
                  <div className="flex justify-end w-full">
                    <div className="max-w-xl bg-gradient-to-r from-orange-500 to-amber-600 border border-orange-400/40 text-white rounded-2xl rounded-tr-xs p-4 shadow-md shadow-orange-500/20 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-orange-100/90 pb-1 border-b border-orange-400/30 mb-1">
                        <span className="font-bold uppercase tracking-wider">You</span>
                        <span>{formatTime(msg.createdAt)}</span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                )}

                {/* AI MESSAGE CARD (White BG, ReactMarkdown Markdown Rendered) */}
                {msg.role === 'ai' && (
                  <div className="w-full flex justify-center my-4">
                    <div className="w-full bg-white border border-orange-200/80 rounded-2xl p-6 shadow-md shadow-orange-950/5 space-y-4 hover:border-orange-300 transition-all">
                      
                      {/* Header Badge */}
                      <div className="flex items-center justify-between border-b border-orange-100 pb-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src="/QuerynestAI-logo.png"
                            alt="QueryNest AI Logo"
                            className="w-8 h-8 object-contain shrink-0"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                              QueryNest AI
                            </h3>
                          </div>
                        </div>

                        <span className="text-xs text-slate-400 font-mono">{formatTime(msg.createdAt)}</span>
                      </div>

                      {/* AI Main Text Rendered with ReactMarkdown */}
                      <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed font-sans prose-headings:font-bold prose-headings:text-slate-900 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-xl prose-code:bg-orange-50 prose-code:text-orange-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs prose-code:before:content-none prose-code:after:content-none font-normal">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      {/* AI Message Action Bar */}
                      <div className="pt-3 border-t border-orange-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleCopyCode(msg.content, `txt-${index}`)}
                            className="hover:text-orange-600 transition-colors flex items-center space-x-1 cursor-pointer"
                            title="Copy message"
                          >
                            {copiedIndex === `txt-${index}` ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              const prevUserMsg = messages[index - 1];
                              if (prevUserMsg && prevUserMsg.role === 'user') {
                                handleSendMessage({ message: prevUserMsg.content, chatId: currentChatId });
                              }
                            }}
                            className="hover:text-orange-600 transition-colors cursor-pointer"
                            title="Regenerate"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button className="hover:text-emerald-500 transition-colors cursor-pointer" title="Good response">
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button className="hover:text-rose-500 transition-colors cursor-pointer" title="Bad response">
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            ))
          )}

          {isLoading && (
            <div className="w-full flex justify-center py-4">
              <div className="flex items-center space-x-3 bg-white border border-orange-300/70 px-5 py-3 rounded-2xl text-xs text-orange-600 shadow-md font-medium">
                <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                <span>QueryNest AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ========================================================================= */}
        {/* CHAT INPUT AREA (Light Theme Pill Input)                                  */}
        {/* ========================================================================= */}
        <footer className="p-4 md:p-6 bg-white/80 border-t border-orange-200/60 backdrop-blur-lg">
          <form
            onSubmit={onSubmit}
            className="max-w-3xl mx-auto bg-white border border-orange-300/80 hover:border-orange-500 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 rounded-2xl p-2.5 shadow-xl transition-all"
          >
            <div className="flex items-center space-x-3 px-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask QueryNest AI anything..."
                disabled={isLoading}
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm outline-none font-medium py-1.5"
              />

              {/* Submit Send Button */}
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-md ${
                  inputMessage.trim() && !isLoading
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-orange-500/30 hover:scale-105'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </footer>

      </main>

    </div>
  );
};

export default Dashboard;