import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';
import {
  Plus,
  Search,
  MessageSquare,
  Sparkles,
  Send,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Flame,
  Trash2,
  Bot
} from 'lucide-react';

const Dashboard = () => {
  const chat = useChat();
  const { user } = useSelector((state) => state.auth || {});

  // Socket initialization
  useEffect(() => {
    const cleanup = chat.initializeSocketConnection();
    return cleanup;
  }, []);

  // UI State
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messagesEndRef = useRef(null);

  // Chat Titles in the left drawer
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Chat title 1', subtitle: 'Recent conversation', time: '2m ago' },
    { id: 2, title: 'Chat title 2', subtitle: 'Recent conversation', time: '1h ago' },
    { id: 3, title: 'Chat title 3', subtitle: 'Recent conversation', time: '3h ago' },
    { id: 4, title: 'Chat title 4', subtitle: 'Recent conversation', time: '1d ago' },
    { id: 5, title: 'Chat title 5', subtitle: 'Recent conversation', time: '2d ago' },
    { id: 6, title: 'Chat title 6', subtitle: 'Recent conversation', time: '3d ago' },
  ]);

  // Clean initial messages
  const [messages, setMessages] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isSubmitting) return;

    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsSubmitting(true);

    // Simulate QueryNest AI response
    setTimeout(() => {
      const newAiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Here is the response for "${currentInput}". QueryNest AI has processed your request.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newAiMsg]);
      setIsSubmitting(false);
    }, 800);
  };

  const handleNewChat = () => {
    const newId = Date.now();
    const newTitle = {
      id: newId,
      title: `Chat title ${chatHistory.length + 1}`,
      subtitle: 'New AI Conversation',
      time: 'Just now',
    };
    setChatHistory([newTitle, ...chatHistory]);
    setSelectedChatId(newId);
    setMessages([]);
  };

  const handleDeleteChat = (e, id) => {
    e.stopPropagation();
    const updatedHistory = chatHistory.filter((chatItem) => chatItem.id !== id);
    setChatHistory(updatedHistory);
    
    // If deleted chat was active, select another chat or clear messages
    if (selectedChatId === id) {
      if (updatedHistory.length > 0) {
        setSelectedChatId(updatedHistory[0].id);
      } else {
        setSelectedChatId(null);
        setMessages([]);
      }
    }
  };

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredHistory = chatHistory.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-full flex bg-[#0c0804] text-white overflow-hidden select-none font-sans">
      
      {/* ========================================================================= */}
      {/* CHAT HISTORY SIDEBAR DRAWER (QueryNest AI Header & Chat title List)      */}
      {/* ========================================================================= */}
      <section className="w-72 md:w-80 bg-[#140c06] border-r border-orange-950/40 flex flex-col p-5 space-y-4 shrink-0">
        
        {/* Header Title: QueryNest AI */}
        <div className="flex items-center justify-between pb-3 border-b border-orange-900/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md shadow-orange-600/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                QueryNest AI
              </h2>
              <p className="text-[11px] text-orange-200/50">Smart AI Assistant</p>
            </div>
          </div>

          <button
            onClick={handleNewChat}
            className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-950/50 hover:scale-105 transition-all cursor-pointer"
            title="Start New Chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-orange-300/40" />
          <input
            type="text"
            placeholder="Search chat history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e1309] border border-orange-900/40 focus:border-orange-500 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none transition-all placeholder:text-orange-200/40 focus:ring-1 focus:ring-orange-500/30"
          />
        </div>

        {/* List of Chat Titles in Rounded Pill Containers (No Scrollbar) */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 pr-1 py-1">
          <p className="text-[11px] font-semibold text-orange-300/40 uppercase tracking-wider px-1">
            Recent Conversations
          </p>

          {filteredHistory.length === 0 ? (
            <p className="text-xs text-orange-200/30 text-center py-6">No conversations found</p>
          ) : (
            filteredHistory.map((item) => {
              const isActive = selectedChatId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedChatId(item.id)}
                  className={`group relative w-full p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/20 to-amber-600/10 border-orange-500 text-white shadow-lg shadow-orange-950/40 ring-1 ring-orange-500/30'
                      : 'bg-[#1b1007]/60 border-orange-950/40 text-orange-100 hover:border-orange-500/40 hover:bg-orange-500/10'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden flex-1 min-w-0">
                    <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-400' : 'text-orange-300/40 group-hover:text-orange-400'}`} />
                    <div className="truncate flex-1 min-w-0">
                      <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-orange-100/90 group-hover:text-white'}`}>
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-orange-200/40 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 ml-2">
                    <span className="text-[10px] text-orange-300/40 group-hover:hidden">
                      {item.time}
                    </span>
                    {/* Delete Icon on Hover / Active */}
                    <button
                      onClick={(e) => handleDeleteChat(e, item.id)}
                      className="p-1.5 rounded-lg text-orange-300/40 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
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
      {/* MAIN WORKSPACE / CHAT CONTAINER                                          */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col h-full bg-gradient-to-b from-[#0f0904] via-[#140c06] to-[#0c0804] relative overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-orange-950/40 px-6 flex items-center justify-between bg-[#150d06]/60 backdrop-blur-md z-10">
          <div className="flex items-center space-x-3">
            <h1 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              QueryNest AI
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="p-2 rounded-lg bg-[#1e1309] border border-orange-950/50 text-orange-300/70 hover:text-white hover:border-orange-500/40 transition-all cursor-pointer"
                title="Clear Messages"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Message Stream Scroll Area (No Scrollbar) */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
          
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
              <div className="p-4 rounded-3xl bg-gradient-to-br from-orange-500/20 to-amber-600/10 border border-orange-500/30 text-orange-400 shadow-xl shadow-orange-950/30">
                <Flame className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">How can QueryNest AI help you today?</h2>
                <p className="text-xs text-orange-200/50 max-w-md">
                  Type a message below to start a clean, high-performance conversation.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={msg.id} className="w-full space-y-4">
                
                {/* USER MESSAGE BUBBLE */}
                {msg.sender === 'user' && (
                  <div className="flex justify-end w-full">
                    <div className="max-w-xl bg-gradient-to-r from-orange-600 to-amber-600 border border-orange-400/40 text-white rounded-2xl rounded-tr-xs p-4 shadow-lg shadow-orange-950/40 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-orange-100/70 pb-1 border-b border-orange-400/20 mb-1">
                        <span className="font-semibold uppercase tracking-wider">You</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                )}

                {/* AI MESSAGE CARD */}
                {msg.sender === 'ai' && (
                  <div className="w-full flex justify-center my-4">
                    <div className="w-full bg-[#180f08]/80 border border-orange-500/30 rounded-2xl p-6 shadow-xl shadow-orange-950/40 backdrop-blur-xl space-y-4 hover:border-orange-500/50 transition-all">
                      
                      {/* Header Badge */}
                      <div className="flex items-center justify-between border-b border-orange-900/30 pb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md shadow-orange-600/30">
                            <Bot className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white tracking-tight">
                              QueryNest AI
                            </h3>
                          </div>
                        </div>

                        <span className="text-xs text-orange-300/40 font-mono">{msg.time}</span>
                      </div>

                      {/* AI Main Text */}
                      <div className="space-y-3 text-white text-sm leading-relaxed font-sans">
                        <p className="text-orange-50 font-normal">{msg.text}</p>
                      </div>

                      {/* AI Message Action Bar */}
                      <div className="pt-3 border-t border-orange-900/30 flex items-center justify-between text-xs text-orange-300/60">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleCopyCode(msg.text, `txt-${index}`)}
                            className="hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
                            title="Copy message"
                          >
                            {copiedIndex === `txt-${index}` ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button className="hover:text-white transition-colors cursor-pointer" title="Regenerate">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button className="hover:text-emerald-400 transition-colors cursor-pointer" title="Good response">
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button className="hover:text-rose-400 transition-colors cursor-pointer" title="Bad response">
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

          {isSubmitting && (
            <div className="w-full flex justify-center py-4">
              <div className="flex items-center space-x-3 bg-[#1c1209] border border-orange-500/30 px-5 py-3 rounded-2xl text-xs text-orange-300 shadow-lg">
                <Sparkles className="w-4 h-4 text-orange-400 animate-spin" />
                <span>QueryNest AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ========================================================================= */}
        {/* CHAT INPUT AREA (Clean Pill Container with only Input & Send Button)       */}
        {/* ========================================================================= */}
        <footer className="p-4 md:p-6 bg-[#120b05]/90 border-t border-orange-950/40 backdrop-blur-lg">
          <form
            onSubmit={handleSendMessage}
            className="max-w-3xl mx-auto bg-[#1b1109] border border-orange-500/30 hover:border-orange-500/60 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 rounded-2xl p-2.5 shadow-2xl transition-all"
          >
            <div className="flex items-center space-x-3 px-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask QueryNest AI anything..."
                className="w-full bg-transparent text-white placeholder-orange-200/40 text-sm outline-none font-medium py-1.5"
              />

              {/* Submit Send Button ONLY */}
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSubmitting}
                className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-lg ${
                  inputMessage.trim() && !isSubmitting
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-orange-600/40 hover:scale-105'
                    : 'bg-orange-950/40 text-orange-400/40 cursor-not-allowed border border-orange-950/60'
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