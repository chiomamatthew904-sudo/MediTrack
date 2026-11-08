import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Plus,
  MessageSquare,
  Send,
  Sparkles,
  Calendar,
  PlusCircle,
  Bell,
  History,
  ChevronRight,
  Info,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

export default function AIAssistantPage() {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Initial Sample Conversations for History Sidebar
  const [conversations, setConversations] = useState([
    {
      id: 1,
      title: 'My next appointment?',
      time: 'Nov 4, 2026 • 2:30 PM',
      messages: [
        {
          sender: 'assistant',
          text: 'Hello! Welcome to MediTrack. I can help you manage your appointments, understand your reminders and navigate the application.\n\nWhat would you like help with today?',
          time: '2:30 PM'
        },
        {
          sender: 'user',
          text: 'When is my next appointment?',
          time: '2:31 PM'
        },
        {
          sender: 'assistant',
          text: 'You have an upcoming appointment for a Follow-up Checkup at General Hospital scheduled for tomorrow at 10:30 AM.',
          actionBtn: { label: 'View Calendar', route: '/dashboard/calendar' },
          time: '2:31 PM'
        }
      ]
    },
    {
      id: 2,
      title: 'Reminder settings',
      time: 'Nov 3, 2026 • 11:15 AM',
      messages: [
        {
          sender: 'assistant',
          text: 'Hello! How can I assist you with your notification preferences today?',
          time: '11:15 AM'
        },
        {
          sender: 'user',
          text: 'How can I manage my reminders?',
          time: '11:16 AM'
        },
        {
          sender: 'assistant',
          text: 'You can enable or disable appointment alerts, change lead times (e.g., 1 day before), and toggle channels (In-app, Email, Browser) under Notifications & Reminders.',
          actionBtn: { label: 'Go to Reminder Settings', route: '/dashboard/notifications' },
          time: '11:16 AM'
        }
      ]
    },
    {
      id: 3,
      title: 'Appointment history',
      time: 'Nov 2, 2026 • 9:20 AM',
      messages: [
        {
          sender: 'assistant',
          text: 'Welcome back! Looking for your past medical visit records?',
          time: '9:20 AM'
        },
        {
          sender: 'user',
          text: 'Where can I find my appointment history?',
          time: '9:21 AM'
        },
        {
          sender: 'assistant',
          text: 'All your completed, missed, and cancelled visit records are organized chronologically on the Appointment History page.',
          actionBtn: { label: 'View Appointment History', route: '/dashboard/history' },
          time: '9:21 AM'
        }
      ]
    },
    {
      id: 4,
      title: 'Update my profile',
      time: 'Oct 31, 2026 • 4:10 PM',
      messages: [
        {
          sender: 'assistant',
          text: 'Hi there! Need help modifying your profile details?',
          time: '4:10 PM'
        }
      ]
    }
  ]);

  // Current Active Conversation State
  const [activeChatId, setActiveChatId] = useState(1);
  const [currentMessages, setCurrentMessages] = useState(conversations[0].messages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistoryMobile, setShowHistoryMobile] = useState(false);

  // Auto-scroll chat to latest message
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isTyping]);

  // Handle Switching Conversations
  const handleSelectConversation = (chat) => {
    setActiveChatId(chat.id);
    setCurrentMessages(chat.messages);
    setShowHistoryMobile(false);
  };

  // Handle New Chat Reset
  const handleNewChat = () => {
    setActiveChatId(null);
    setCurrentMessages([
      {
        sender: 'assistant',
        text: 'Hello! Welcome to MediTrack. I can help you manage your appointments, understand your reminders and navigate the application.\n\nWhat would you like help with today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setShowHistoryMobile(false);
  };

  // Demo Response Logic for Standard Questions
  const getDemoResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('next appointment') || q.includes('when is my next')) {
      return {
        text: 'You can view all your upcoming hospital appointments, dates, and times directly on your Appointments or Calendar page.',
        actionBtn: { label: 'Go to My Appointments', route: '/dashboard/my-appointment' }
      };
    }
    if (q.includes('add an appointment') || q.includes('how do i add')) {
      return {
        text: 'To add an appointment, navigate to "My Appointments" and click the "+ Add New Appointment" button at the top right of the page.',
        actionBtn: { label: 'Add New Appointment', route: '/dashboard/my-appointment' }
      };
    }
    if (q.includes('manage my reminders') || q.includes('reminder settings') || q.includes('reminders')) {
      return {
        text: 'You can easily configure your reminder lead time and toggle channel preferences (In-app, Email, Browser) on the Notifications & Reminders page.',
        actionBtn: { label: 'Open Reminder Settings', route: '/dashboard/notifications' }
      };
    }
    if (q.includes('history') || q.includes('past appointment') || q.includes('where can i find my appointment history')) {
      return {
        text: 'Your complete visit history, including completed, missed, and cancelled appointments, is available on the Appointment History page.',
        actionBtn: { label: 'View Appointment History', route: '/dashboard/history' }
      };
    }

    return {
      text: "I'm currently in demo mode. I'll be able to provide more detailed assistance when the MediTrack AI service is connected."
    };
  };

  // Send Message Logic
  const handleSendMessage = (textToSend) => {
    const messageText = textToSend || inputMessage;
    if (!messageText.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append User Message
    const newUserMsg = {
      sender: 'user',
      text: messageText,
      time: currentTime
    };

    setCurrentMessages((prev) => [...prev, newUserMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const demoReply = getDemoResponse(messageText);
      const newAssistantMsg = {
        sender: 'assistant',
        text: demoReply.text,
        actionBtn: demoReply.actionBtn,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setCurrentMessages((prev) => [...prev, newAssistantMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="assistant-page-container">
      
      {/* 1. PAGE HEADER */}
      <div className="page-header-section">
        <div className="header-title-left">
          <div className="assistant-avatar-head">
            <Bot size={28} />
          </div>
          <div>
            <h1 className="page-title">AI Assistant</h1>
            <p className="page-description">
              Your personal guide to managing appointments and navigating MediTrack.
            </p>
          </div>
        </div>

        <div className="header-status-badge">
          <Info size={15} />
          <span>Demo Mode</span>
        </div>
      </div>

      {/* MOBILE TOGGLE FOR HISTORY */}
      <button
        className="mobile-history-toggle-btn"
        onClick={() => setShowHistoryMobile(!showHistoryMobile)}
      >
        {showHistoryMobile ? <X size={18} /> : <Menu size={18} />}
        <span>{showHistoryMobile ? 'Close Conversations' : 'Your Conversations'}</span>
      </button>

      {/* 2. MAIN WORKSPACE SPLIT (HISTORY + CHAT) */}
      <div className="assistant-workspace-grid">
        
        {/* LEFT PANEL: CONVERSATION HISTORY */}
        <aside className={`conversations-panel ${showHistoryMobile ? 'mobile-show' : ''}`}>
          <div className="panel-header">
            <div className="panel-title">
              <MessageSquare size={18} className="text-teal" />
              <h3>Your Conversations</h3>
            </div>
            <button onClick={handleNewChat} className="btn-new-chat">
              <Plus size={16} /> New Chat
            </button>
          </div>

          <div className="conversations-list">
            {conversations.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectConversation(chat)}
                className={`conversation-item ${activeChatId === chat.id ? 'active' : ''}`}
              >
                <div className="conv-icon-box">
                  <MessageSquare size={16} />
                </div>
                <div className="conv-info">
                  <h4>{chat.title}</h4>
                  <span>{chat.time}</span>
                </div>
                <ChevronRight size={16} className="conv-arrow" />
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT PANEL: CHAT WORKSPACE */}
        <main className="chat-workspace-card">
          
          {/* CHAT MESSAGES SCROLL AREA */}
          <div className="chat-messages-area">
            
            {/* ASSISTANT BRANDING TOP ROW */}
            <div className="assistant-status-row">
              <div className="bot-status-avatar">
                <Bot size={20} />
              </div>
              <span className="bot-name">MediTrack Assistant</span>
              <span className="neutral-status-dot">●</span>
            </div>

            {/* MESSAGES LIST */}
            {currentMessages.map((msg, index) => (
              <div
                key={index}
                className={`message-wrapper ${msg.sender === 'user' ? 'user-wrapper' : 'assistant-wrapper'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="message-avatar">
                    <Bot size={18} />
                  </div>
                )}

                <div className="message-bubble-group">
                  <div className={`message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'assistant-bubble'}`}>
                    <p>{msg.text}</p>

                    {/* Action Navigation Link if available */}
                    {msg.actionBtn && (
                      <button
                        onClick={() => navigate(msg.actionBtn.route)}
                        className="btn-chat-action"
                      >
                        {msg.actionBtn.label} <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* SUGGESTED QUESTIONS (Shown if conversation has only welcome message) */}
            {currentMessages.length <= 1 && (
              <div className="suggested-questions-block">
                <div className="suggested-header">
                  <Sparkles size={16} className="text-teal" />
                  <span>Suggested Questions</span>
                </div>

                <div className="suggested-grid">
                  <button
                    onClick={() => handleSendMessage('When is my next appointment?')}
                    className="suggested-btn"
                  >
                    <div className="suggested-btn-left">
                      <Calendar size={16} className="text-teal" />
                      <span>When is my next appointment?</span>
                    </div>
                    <ChevronRight size={16} className="suggested-arrow" />
                  </button>

                  <button
                    onClick={() => handleSendMessage('How do I add an appointment?')}
                    className="suggested-btn"
                  >
                    <div className="suggested-btn-left">
                      <PlusCircle size={16} className="text-teal" />
                      <span>How do I add an appointment?</span>
                    </div>
                    <ChevronRight size={16} className="suggested-arrow" />
                  </button>

                  <button
                    onClick={() => handleSendMessage('How can I manage my reminders?')}
                    className="suggested-btn"
                  >
                    <div className="suggested-btn-left">
                      <Bell size={16} className="text-teal" />
                      <span>How can I manage my reminders?</span>
                    </div>
                    <ChevronRight size={16} className="suggested-arrow" />
                  </button>

                  <button
                    onClick={() => handleSendMessage('Where can I find my appointment history?')}
                    className="suggested-btn"
                  >
                    <div className="suggested-btn-left">
                      <History size={16} className="text-teal" />
                      <span>Where can I find my appointment history?</span>
                    </div>
                    <ChevronRight size={16} className="suggested-arrow" />
                  </button>
                </div>
              </div>
            )}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className="message-wrapper assistant-wrapper">
                <div className="message-avatar">
                  <Bot size={18} />
                </div>
                <div className="typing-indicator-bubble">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* CHAT INPUT AREA */}
          <div className="chat-input-container">
            <div className="input-box-wrapper">
              <MessageSquare size={18} className="input-prefix-icon" />
              <input
                type="text"
                placeholder="Ask me anything about MediTrack..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="chat-text-input"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="btn-send-message"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>

            {/* MEDICAL DISCLAIMER FOOTER */}
            <div className="medical-disclaimer-text">
              <Info size={14} />
              <span>
                MediTrack Assistant provides app guidance and general information. It does not replace professional medical advice.
              </span>
            </div>
          </div>

        </main>
      </div>

      {/* COMPONENT STYLES */}
      <style>{`
        .assistant-page-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 1300px;
          margin: 0 auto;
        }

        /* PAGE HEADER */
        .page-header-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFFFFF;
          padding: 24px 32px;
          border-radius: 20px;
          border: 1px solid #E1F0EE;
          box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05);
        }

        .header-title-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .assistant-avatar-head {
          width: 52px;
          height: 52px;
          background: #E8F8F5;
          color: #087F6E;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .page-title {
          font-size: 26px;
          font-weight: 800;
          color: #0F2926;
          margin-bottom: 2px;
          letter-spacing: -0.02em;
        }

        .page-description {
          font-size: 14px;
          color: #4A6360;
        }

        .header-status-badge {
          background: #E8F8F5;
          color: #087F6E;
          border: 1px solid #C1EBE5;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* MOBILE HISTORY TOGGLE */
        .mobile-history-toggle-btn {
          display: none;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          color: #0F2926;
          cursor: pointer;
        }

        /* WORKSPACE GRID */
        .assistant-workspace-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 20px;
          min-height: 600px;
        }

        /* CONVERSATIONS SIDEBAR PANEL */
        .conversations-panel {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #E1F0EE;
          box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .panel-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid #F1F5F9;
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .panel-title h3 {
          font-size: 16px;
          font-weight: 800;
          color: #0F2926;
        }
        .text-teal { color: #087F6E; }

        .btn-new-chat {
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-new-chat:hover {
          background: #066658;
        }

        .conversations-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
          max-height: 500px;
        }

        .conversation-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          background: #F8FCFC;
          border: 1px solid #E2E8F0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .conversation-item:hover, .conversation-item.active {
          background: #E8F8F5;
          border-color: #A3E2D9;
        }

        .conv-icon-box {
          color: #087F6E;
          flex-shrink: 0;
        }

        .conv-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .conv-info h4 {
          font-size: 13px;
          font-weight: 700;
          color: #0F2926;
        }
        .conv-info span {
          font-size: 11px;
          color: #64748B;
        }

        .conv-arrow {
          color: #CBD5E1;
        }

        /* CHAT WORKSPACE CARD */
        .chat-workspace-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #E1F0EE;
          box-shadow: 0 4px 20px rgba(8, 127, 110, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }

        .chat-messages-area {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
          max-height: 520px;
          flex: 1;
        }

        .assistant-status-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 12px;
          border-bottom: 1px solid #F1F5F9;
        }
        .bot-status-avatar {
          width: 32px;
          height: 32px;
          background: #E8F8F5;
          color: #087F6E;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bot-name {
          font-size: 14px;
          font-weight: 800;
          color: #0F2926;
        }
        .neutral-status-dot {
          color: #94A3B8;
          font-size: 12px;
        }

        /* MESSAGE WRAPPERS & BUBBLES */
        .message-wrapper {
          display: flex;
          gap: 12px;
          max-width: 80%;
        }
        .assistant-wrapper {
          align-self: flex-start;
        }
        .user-wrapper {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          background: #E8F8F5;
          color: #087F6E;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message-bubble-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .user-wrapper .message-bubble-group {
          align-items: flex-end;
        }

        .message-bubble {
          padding: 14px 18px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.5;
        }

        .assistant-bubble {
          background: #E8F8F5;
          color: #0F2926;
          border-top-left-radius: 4px;
          white-space: pre-line;
        }

        .user-bubble {
          background: #087F6E;
          color: #FFFFFF;
          border-top-right-radius: 4px;
        }

        .message-time {
          font-size: 11px;
          color: #94A3B8;
        }

        .btn-chat-action {
          margin-top: 10px;
          background: #FFFFFF;
          color: #087F6E;
          border: 1px solid #A3E2D9;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-chat-action:hover {
          background: #F4FAF9;
        }

        /* SUGGESTED QUESTIONS BLOCK */
        .suggested-questions-block {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .suggested-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #0F2926;
        }

        .suggested-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .suggested-btn {
          background: #FFFFFF;
          border: 1px solid #E1F0EE;
          padding: 14px 16px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(8, 127, 110, 0.03);
          text-align: left;
        }
        .suggested-btn:hover {
          background: #F4FAF9;
          border-color: #087F6E;
        }

        .suggested-btn-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .suggested-btn-left span {
          font-size: 13px;
          font-weight: 700;
          color: #0F2926;
        }

        .suggested-arrow {
          color: #94A3B8;
        }

        /* TYPING INDICATOR */
        .typing-indicator-bubble {
          background: #E8F8F5;
          padding: 12px 18px;
          border-radius: 18px;
          border-top-left-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .dot {
          width: 6px;
          height: 6px;
          background: #087F6E;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out both;
        }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        /* CHAT INPUT CONTAINER */
        .chat-input-container {
          padding: 16px 24px;
          background: #FFFFFF;
          border-top: 1px solid #F1F5F9;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .input-box-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-prefix-icon {
          position: absolute;
          left: 16px;
          color: #94A3B8;
        }

        .chat-text-input {
          width: 100%;
          padding: 14px 50px 14px 46px;
          border: 1px solid #CBD5E1;
          border-radius: 24px;
          font-size: 14px;
          color: #0F2926;
          outline: none;
          background: #F8FCFC;
          transition: border-color 0.2s ease;
        }
        .chat-text-input:focus {
          border-color: #087F6E;
          background: #FFFFFF;
        }

        .btn-send-message {
          position: absolute;
          right: 8px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #087F6E;
          color: #FFFFFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-send-message:hover:not(:disabled) {
          background: #066658;
        }
        .btn-send-message:disabled {
          background: #CBD5E1;
          cursor: not-allowed;
        }

        /* MEDICAL DISCLAIMER */
        .medical-disclaimer-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          color: #64748B;
          text-align: center;
        }

        /* RESPONSIVE MEDIA QUERIES */
        @media (max-width: 992px) {
          .mobile-history-toggle-btn {
            display: flex;
          }

          .assistant-workspace-grid {
            grid-template-columns: 1fr;
          }

          .conversations-panel {
            display: none;
          }
          .conversations-panel.mobile-show {
            display: flex;
          }

          .suggested-grid {
            grid-template-columns: 1fr;
          }

          .page-header-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .message-wrapper {
            max-width: 90%;
          }
        }
      `}</style>
    </div>
  );
}