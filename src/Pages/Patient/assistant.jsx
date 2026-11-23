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
  X,
  Trash2
} from 'lucide-react';
import { supabase } from '../../supabaseClient';


// Format time using Nigerian timezone
const formatNigeriaTime = (date) => {
  return new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(new Date(date));
};

// Format date and time using Nigerian timezone
const formatNigeriaDateTime = (date) => {
  return new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(date));
};


export default function AIAssistantPage() {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Conversation History
const [conversations, setConversations] = useState([]);
const [activeChatId, setActiveChatId] = useState(null);

const welcomeMessage = {
  sender: 'assistant',
  text: 'Hello! Welcome to MediTrack. I can help you manage your appointments, understand your reminders and navigate the application.\n\nWhat would you like help with today?',
  time: formatNigeriaTime(new Date())
};

const [currentMessages, setCurrentMessages] = useState([welcomeMessage]);
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



  // Load saved conversations from Supabase
useEffect(() => {
  const loadChatHistory = async () => {
    try {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError || !session) return;

      // Get this patient's conversations
      const { data: savedChats, error: chatError } = await supabase
        .from('ai_conversations')
        .select('id, title, created_at, updated_at')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false });

      if (chatError) throw chatError;

      if (!savedChats || savedChats.length === 0) return;

      // Get messages belonging to these conversations
      const chatIds = savedChats.map((chat) => chat.id);

      const { data: savedMessages, error: messageError } = await supabase
        .from('ai_messages')
        .select('id, conversation_id, sender, content, created_at')
        .in('conversation_id', chatIds)
        .order('created_at', { ascending: true });

      if (messageError) throw messageError;

      // Attach messages to their conversations
      const formattedChats = savedChats.map((chat) => {
        const chatMessages = (savedMessages || [])
          .filter((msg) => msg.conversation_id === chat.id)
          .map((msg) => ({
            sender: msg.sender,
            text: msg.content,
            time: formatNigeriaTime(msg.created_at)
          }));

        return {
          id: chat.id,
          title: chat.title,
          time: formatNigeriaDateTime(chat.updated_at),
          messages: chatMessages
        };
      });

      setConversations(formattedChats);

      // Open the most recent conversation
      if (formattedChats.length > 0) {
        setActiveChatId(formattedChats[0].id);
        setCurrentMessages(formattedChats[0].messages);
      }

    } catch (error) {
      console.error('Error loading AI chat history:', error.message);
    }
  };

  loadChatHistory();
}, []);


   // Handle Switching Conversations
const handleSelectConversation = (chat) => {
  setActiveChatId(chat.id);
  setCurrentMessages(chat.messages);
  setShowHistoryMobile(false);
};

// Handle New Chat
const handleNewChat = () => {
  setActiveChatId(null);
  setCurrentMessages([{
    sender: 'assistant',
    text: 'Hello! Welcome to MediTrack. I can help you manage your appointments, understand your reminders and navigate the application.\n\nWhat would you like help with today?',
    time: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }]);
  setInputMessage('');
  setShowHistoryMobile(false);
};


// Delete a conversation and its messages
const handleDeleteConversation = async (chatId) => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this conversation? This action cannot be undone.'
  );

  if (!confirmDelete) return;

  try {
    // Delete all messages in this conversation
    const { error: messagesError } = await supabase
      .from('ai_messages')
      .delete()
      .eq('conversation_id', chatId);

    if (messagesError) throw messagesError;

    // Delete the conversation
    const { error: chatError } = await supabase
      .from('ai_conversations')
      .delete()
      .eq('id', chatId);

    if (chatError) throw chatError;

    // Remove it from the sidebar
    setConversations((prev) =>
      prev.filter((chat) => chat.id !== chatId)
    );

    // If the deleted conversation was open, return to a new chat
    if (activeChatId === chatId) {
      handleNewChat();
    }

  } catch (error) {
    console.error('Error deleting conversation:', error.message);
    window.alert('Unable to delete this conversation. Please try again.');
  }
};

 
// Send Message to MediTrack AI and save chat history
const handleSendMessage = async (textToSend) => {
  const messageText = (textToSend || inputMessage).trim();

  if (!messageText || isTyping) return;

  setInputMessage('');
  setIsTyping(true);

  try {
    // Get the logged-in patient's Supabase session
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new Error('Please log in again to use the AI Assistant.');
    }

    let chatId = activeChatId;
    let chatTitle = messageText.length > 30
      ? messageText.substring(0, 30) + '...'
      : messageText;

    // Create a new conversation if this is a new chat
    if (!chatId) {
      const { data: newChat, error: createError } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: session.user.id,
          title: chatTitle
        })
        .select()
        .single();

      if (createError) throw createError;

      chatId = newChat.id;
      setActiveChatId(chatId);
    }

    const currentTime = new Date().toISOString();

    // Save the patient's message
    const { data: savedUserMessage, error: userMessageError } =
      await supabase
        .from('ai_messages')
        .insert({
          conversation_id: chatId,
          sender: 'user',
          content: messageText
        })
        .select()
        .single();

    if (userMessageError) throw userMessageError;

    const newUserMsg = {
      sender: 'user',
      text: savedUserMessage.content,
      time: new Date(savedUserMessage.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const messagesAfterUser = [...currentMessages, newUserMsg];

    setCurrentMessages(messagesAfterUser);

    // Update the conversation's last activity
    await supabase
      .from('ai_conversations')
      .update({ updated_at: currentTime })
      .eq('id', chatId);

    // Update the conversation list on screen
    setConversations((prev) => {
      const existingChat = prev.find((chat) => chat.id === chatId);

      if (existingChat) {
        return prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: messagesAfterUser,
                time: formatNigeriaDateTime(currentTime)
              }
            : chat
        );
      }

      return [
        {
          id: chatId,
          title: chatTitle,
          time: new Date(currentTime).toLocaleString(),
          messages: messagesAfterUser
        },
        ...prev
      ];
    });

    // Send the message to the Express backend
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/ai/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          message: messageText
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Unable to get an AI response.');
    }

    // Save Gemini's response
    const { data: savedAssistantMessage, error: assistantMessageError } =
      await supabase
        .from('ai_messages')
        .insert({
          conversation_id: chatId,
          sender: 'assistant',
          content: result.response
        })
        .select()
        .single();

    if (assistantMessageError) throw assistantMessageError;

    const newAssistantMsg = {
      sender: 'assistant',
      text: savedAssistantMessage.content,
      time: formatNigeriaTime(savedAssistantMessage.created_at)
    };

    const completedMessages = [...messagesAfterUser, newAssistantMsg];

    setCurrentMessages(completedMessages);

    setConversations((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: completedMessages }
          : chat
      )
    );

    // Update conversation activity time
    await supabase
      .from('ai_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chatId);

  } catch (error) {
    console.error('AI Assistant error:', error);

    const errorMessage = {
      sender: 'assistant',
      text: error.message || 'Something went wrong. Please try again.',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setCurrentMessages((prev) => [...prev, errorMessage]);

  } finally {
    setIsTyping(false);
  }
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

      <button
        type="button"
        className="conv-delete-btn"
        title="Delete conversation"
        aria-label={`Delete conversation: ${chat.title}`}
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteConversation(chat.id);
        }}
      >
        <Trash2 size={15} />
      </button>

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


.conv-delete-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.conversation-item:hover .conv-delete-btn {
  opacity: 1;
}

.conv-delete-btn:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.conv-delete-btn:focus-visible {
  opacity: 1;
  outline: 2px solid #0d9488;
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .conv-delete-btn {
    opacity: 1;
  }
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


/* ==================================
   DARK MODE - AI ASSISTANT
================================== */

html[data-theme="dark"] .assistant-page-container {
  color: #E2E8F0;
}

/* Page header */
html[data-theme="dark"] .page-header-section,
html[data-theme="dark"] .conversations-panel,
html[data-theme="dark"] .chat-workspace-card {
  background: #172B2B;
  border-color: #294343;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

html[data-theme="dark"] .page-title,
html[data-theme="dark"] .panel-title h3,
html[data-theme="dark"] .bot-name,
html[data-theme="dark"] .suggested-header {
  color: #F1F5F9;
}

html[data-theme="dark"] .page-description {
  color: #A7B8B8;
}

html[data-theme="dark"] .assistant-avatar-head,
html[data-theme="dark"] .bot-status-avatar,
html[data-theme="dark"] .message-avatar {
  background: #203F3B;
  color: #5EEAD4;
}

html[data-theme="dark"] .header-status-badge {
  background: #164E45;
  border-color: #285B53;
  color: #5EEAD4;
}

/* Mobile history toggle */
html[data-theme="dark"] .mobile-history-toggle-btn {
  background: #172B2B;
  border-color: #345050;
  color: #E2E8F0;
}

/* Conversation history */
html[data-theme="dark"] .panel-header,
html[data-theme="dark"] .assistant-status-row {
  border-bottom-color: #345050;
}

html[data-theme="dark"] .conversation-item {
  background: #203838;
  border-color: #345050;
}

html[data-theme="dark"] .conversation-item:hover,
html[data-theme="dark"] .conversation-item.active {
  background: #164E45;
  border-color: #0D9488;
}

html[data-theme="dark"] .conv-info h4 {
  color: #F1F5F9;
}

html[data-theme="dark"] .conv-info span {
  color: #A7B8B8;
}

html[data-theme="dark"] .conv-arrow,
html[data-theme="dark"] .neutral-status-dot {
  color: #64748B;
}

/* Chat messages */
html[data-theme="dark"] .assistant-bubble,
html[data-theme="dark"] .typing-indicator-bubble {
  background: #203F3B;
  color: #E2E8F0;
}

html[data-theme="dark"] .message-time {
  color: #94A3B8;
}

html[data-theme="dark"] .btn-chat-action {
  background: #203838;
  border-color: #0D9488;
  color: #5EEAD4;
}

html[data-theme="dark"] .btn-chat-action:hover {
  background: #294343;
}

/* Suggested questions */
html[data-theme="dark"] .suggested-btn {
  background: #203838;
  border-color: #345050;
  box-shadow: none;
}

html[data-theme="dark"] .suggested-btn:hover {
  background: #294343;
  border-color: #0D9488;
}

html[data-theme="dark"] .suggested-btn-left span {
  color: #E2E8F0;
}

html[data-theme="dark"] .suggested-arrow {
  color: #A7B8B8;
}

/* Chat input */
html[data-theme="dark"] .chat-input-container {
  background: #172B2B;
  border-top-color: #345050;
}

html[data-theme="dark"] .chat-text-input {
  background: #203838;
  border-color: #345050;
  color: #E2E8F0;
}

html[data-theme="dark"] .chat-text-input::placeholder {
  color: #94A3B8;
}

html[data-theme="dark"] .chat-text-input:focus {
  background: #294343;
  border-color: #0D9488;
}

html[data-theme="dark"] .medical-disclaimer-text {
  color: #A7B8B8;
}

/* Preserve teal buttons, user message bubbles and typing animation */


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