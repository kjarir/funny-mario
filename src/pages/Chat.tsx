import { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Split from 'split.js';
import { MessageSquare, Send, Bot, User, Clock, Plus, Search, ChevronRight, Mic, MicOff, Volume2, Pause } from 'lucide-react';
import { loadPDFs } from '../utils/pdf_reader';
import { buildIndex, searchSimilar } from '../utils/retriever';
import { getFunnyResponse } from '../services/gemini';
import { generateImage } from '../services/imageGenerator';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  image?: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  timestamp: string;
};

const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
    <span className="typing-dot" style={{
      width: 8, height: 8, borderRadius: '50%', background: '#a855f7', marginRight: 4, animation: 'blink 1s infinite alternate'
    }}></span>
    <span className="typing-dot" style={{
      width: 8, height: 8, borderRadius: '50%', background: '#a855f7', marginRight: 4, animation: 'blink 1s 0.2s infinite alternate'
    }}></span>
    <span className="typing-dot" style={{
      width: 8, height: 8, borderRadius: '50%', background: '#a855f7', animation: 'blink 1s 0.4s infinite alternate'
    }}></span>
    <style>{`
      @keyframes blink {
        0% { opacity: 0.2; }
        100% { opacity: 1; }
      }
    `}</style>
  </div>
);

function detectLanguage(text: string): string {
  // Simple heuristic: check for non-ASCII characters
  if (/[^\u0000-\u007F]+/.test(text)) return 'non-english';
  return 'english';
}

const followUpPrompts: Record<string, string[]> = {
  english: [
    "Can you tell me more?",
    "What happens next?",
    "Why is that important?",
    "How does that work?",
    "Can you give an example?"
  ],
  'non-english': [
    "¿Puedes contarme más?",
    "¿Qué pasa después?",
    "¿Por qué es importante eso?",
    "¿Cómo funciona eso?",
    "¿Puedes darme un ejemplo?"
  ]
};

const FollowUpSuggestion = ({ userMessage, aiMessage, onClick, disabled }: { userMessage: string, aiMessage: string, onClick: (q: string) => void, disabled: boolean }) => {
  const [suggestion, setSuggestion] = useState('');
  useEffect(() => {
    const lang = detectLanguage(userMessage);
    const prompts = followUpPrompts[lang] || followUpPrompts['english'];
    setSuggestion(prompts[Math.floor(Math.random() * prompts.length)]);
  }, [userMessage, aiMessage]);
  return (
    <div
      style={{
        marginTop: 12,
        background: disabled ? '#f3e8ff' : '#ede9fe',
        color: '#7c3aed',
        borderRadius: 6,
        padding: '8px 14px',
        fontSize: 15,
        fontWeight: 500,
        display: 'inline-block',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? undefined : '0 2px 8px #0001',
        opacity: disabled ? 0.6 : 1,
        transition: 'background 0.2s, box-shadow 0.2s, opacity 0.2s',
        border: '1px solid #c4b5fd',
      }}
      onClick={() => !disabled && onClick(suggestion)}
      onMouseOver={e => { if (!disabled) (e.currentTarget as HTMLDivElement).style.background = '#e0e7ff'; }}
      onMouseOut={e => { if (!disabled) (e.currentTarget as HTMLDivElement).style.background = '#ede9fe'; }}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      role="button"
    >
      <span style={{marginRight: 6}}>💡</span>Follow-up: <span style={{fontWeight: 400, textDecoration: disabled ? 'none' : 'underline'}}>{suggestion}</span>
      {disabled && <span style={{marginLeft: 8, fontSize: 13}} className="spinner"></span>}
    </div>
  );
};

const Chat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const [pendingFollowUp, setPendingFollowUp] = useState(false);

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeConv = conversations.find(conv => conv.id === activeConversation);

  useEffect(() => {
    if (chatContainerRef.current) {
      Split(['.sidebar', '.chat-main'], {
        sizes: [25, 75],
        minSize: [200, 400],
        gutterSize: 8,
        cursor: 'col-resize'
      });
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      '.conversation-item',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );

    gsap.fromTo(
      '.message',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.2)' }
    );
  }, [activeConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isProcessing) return;

    setIsProcessing(true);
    setIsBotTyping(true);
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user message
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            messages: [...conv.messages, userMessage]
          };
        }
        return conv;
      });
      return updated;
    });

    setNewMessage('');

    try {
      // 1. Get the bot's funny response from the backend
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.content })
      });
      if (!response.ok) {
        throw new Error('Backend error');
      }
      const data = await response.json();
      const botText = data.answer;

      // 2. Add bot message with text only (no image yet)
      const botMessageId = (Date.now() + 1).toString();
      const botMessage = {
        id: botMessageId,
        role: 'assistant' as const,
        content: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        image: ''
      };
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            messages: [...conv.messages, botMessage]
          };
        }
        return conv;
      }));

      // 3. Get the generated image from the backend
      let imageBase64 = '';
      try {
        const imgResponse = await fetch('/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: botText })
        });
        if (imgResponse.ok) {
          const imgData = await imgResponse.json();
          imageBase64 = imgData.image_base64 || '';
        }
      } catch (imgErr) {
        // Ignore image errors, just don't show an image
      }

      // 4. Update the last bot message to include the image
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            messages: conv.messages.map((msg, idx) =>
              idx === conv.messages.length - 1 && msg.id === botMessageId
                ? { ...msg, image: imageBase64 }
                : msg
            )
          };
        }
        return conv;
      }));
    } catch (error) {
      alert('Could not connect to backend. Please make sure the backend is running on http://localhost:5050');
    } finally {
      setIsProcessing(false);
      setIsBotTyping(false);
    }
  };

  const createNewChat = () => {
    const newChat: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => [...prev, newChat]);
    setActiveConversation(newChat.id);
  };

  // Text-to-Speech for AI responses
  const speak = (text: string, id: string) => {
    if (!window.speechSynthesis) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }
    // If already speaking this message, stop it (toggle)
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    setSpeakingId(id);
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
  };

  // Ensure there is always an active conversation
  useEffect(() => {
    if (conversations.length === 0) {
      const newChat: Conversation = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setConversations([newChat]);
      setActiveConversation(newChat.id);
    } else if (!activeConversation) {
      setActiveConversation(conversations[0].id);
    }
  }, [conversations, activeConversation]);

  const handleFollowUpClick = async (followUp: string) => {
    if (isProcessing || pendingFollowUp) return;
    setPendingFollowUp(true);
    setNewMessage('');
    // Simulate sending the follow-up as a user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: followUp,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            messages: [...conv.messages, userMessage]
          };
        }
        return conv;
      });
      return updated;
    });
    try {
      // 1. Get the bot's funny response from the backend
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: followUp })
      });
      if (!response.ok) {
        throw new Error('Backend error');
      }
      const data = await response.json();
      const botText = data.answer;
      // 2. Add bot message with text only (no image yet)
      const botMessageId = (Date.now() + 1).toString();
      const botMessage = {
        id: botMessageId,
        role: 'assistant' as const,
        content: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        image: ''
      };
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            messages: [...conv.messages, botMessage]
          };
        }
        return conv;
      }));
      // 3. Get the generated image from the backend
      let imageBase64 = '';
      try {
        const imgResponse = await fetch('/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: botText })
        });
        if (imgResponse.ok) {
          const imgData = await imgResponse.json();
          imageBase64 = imgData.image_base64 || '';
        }
      } catch (imgErr) {}
      // 4. Update the last bot message to include the image
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            messages: conv.messages.map((msg, idx) =>
              idx === conv.messages.length - 1 && msg.id === botMessageId
                ? { ...msg, image: imageBase64 }
                : msg
            )
          };
        }
        return conv;
      }));
    } catch (error) {
      alert('Could not connect to backend. Please make sure the backend is running on http://localhost:5050');
    } finally {
      setPendingFollowUp(false);
      setIsProcessing(false);
      setIsBotTyping(false);
    }
  };

  return (
    <div ref={chatContainerRef} className="h-screen pt-16 flex">
      {/* Sidebar */}
      <div className="sidebar bg-gray-50 border-r border-gray-200 overflow-hidden">
        <div className="p-4">
          <button
            onClick={createNewChat}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
          >
            <Plus size={20} />
            <span>New Chat</span>
          </button>

          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white rounded-lg py-2 pl-10 pr-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-180px)]">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`conversation-item cursor-pointer p-4 hover:bg-gray-100 transition-colors duration-200 ${
                activeConversation === conv.id ? 'bg-purple-50 border-r-4 border-purple-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 truncate">{conv.title}</h3>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={14} />
                <span>{conv.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main flex flex-col bg-white pr-6">
        {activeConv ? (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              {activeConv.messages.map((message, idx) => (
                <div
                  key={message.id}
                  className={`message flex items-start gap-4 mb-6 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  } ${speakingId === message.id ? 'ring-2 ring-purple-400' : ''} mr-2`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div
                    className={`flex-1 p-4 rounded-xl ${
                      message.role === 'user'
                        ? 'bg-purple-50 rounded-tr-none'
                        : 'bg-blue-50 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {message.role === 'user' ? 'You' : 'FunnyMario'}
                      </span>
                      <span className="text-sm text-gray-500">{message.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 mb-0">{message.content}</p>
                      {message.role === 'assistant' && (
                        <button
                          aria-label="Listen to response"
                          className={`ml-2 p-1 rounded transition-colors ${speakingId === message.id ? 'bg-purple-200' : 'hover:bg-purple-100'}`}
                          onClick={() => speak(message.content, message.id)}
                          disabled={isProcessing}
                        >
                          {speakingId === message.id ? (
                            <Pause size={18} className="text-purple-600 animate-pulse" />
                          ) : (
                            <Volume2 size={18} className="text-purple-500" />
                          )}
                        </button>
                      )}
                    </div>
                    {message.image && message.image.length > 0 && (
                      <img
                        src={`data:image/png;base64,${message.image}`}
                        alt="Generated illustration"
                        className="mt-4 rounded-lg max-w-full"
                        style={{ display: 'block', margin: '0 auto', border: '2px solid #a855f7', background: '#eee', minHeight: 200, minWidth: 200 }}
                        onError={e => {
                          e.currentTarget.style.display = 'none';
                          const errorMsg = document.createElement('div');
                          errorMsg.textContent = 'Image failed to load.';
                          errorMsg.style.color = 'red';
                          errorMsg.style.textAlign = 'center';
                          e.currentTarget.parentNode?.appendChild(errorMsg);
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
              {isBotTyping && (
                <div className="message flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100 text-blue-600">
                    <Bot size={20} />
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-blue-50 rounded-tl-none">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4">
              <div className="max-w-4xl mx-auto relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message here..."
                  className="w-full bg-gray-50 rounded-lg py-3 pl-4 pr-24 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isProcessing}
                />
                <div className="absolute right-2 top-2 flex gap-2">
                  <button
                    onClick={toggleListening}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      isListening
                        ? 'bg-red-100 text-red-600'
                        : 'text-purple-600 hover:bg-purple-50'
                    }`}
                    disabled={isProcessing}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                    disabled={isProcessing}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to FunnyMario Chat!</h2>
              <p className="text-gray-600">Start a new chat to begin your adventure!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;