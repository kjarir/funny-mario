import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MessageSquare, User, Bot, Calendar, Clock, Star } from 'lucide-react';

const chatHistory = [
  {
    date: '2024-03-15',
    conversations: [
      {
        id: 1,
        time: '10:30 AM',
        messages: [
          { role: 'user', content: 'Tell me a story about a magical forest!' },
          { role: 'assistant', content: 'Deep in the heart of the Whispering Woods, there lived a tiny fairy named Sparkle...' },
        ],
      },
      {
        id: 2,
        time: '2:45 PM',
        messages: [
          { role: 'user', content: 'Can you tell me about space adventures?' },
          { role: 'assistant', content: 'Aboard the Starship Wonder, Captain Luna and her crew of brave space explorers...' },
        ],
      },
    ],
  },
  {
    date: '2024-03-14',
    conversations: [
      {
        id: 3,
        time: '3:15 PM',
        messages: [
          { role: 'user', content: 'I want to hear about underwater kingdoms!' },
          { role: 'assistant', content: 'In the crystal-clear waters of the Mermaid Bay, Princess Pearl discovered a magical shell...' },
        ],
      },
    ],
  },
];

const ChatHistory = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!pageRef.current || !headerRef.current) return;

    // Animate header
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    // Animate chat items
    gsap.fromTo(
      '.chat-date',
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
    );

    gsap.fromTo(
      '.chat-item',
      { opacity: 0, scale: 0.9, y: 30 },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1,
        ease: 'back.out(1.2)',
      }
    );
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div ref={headerRef} className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Your Story Adventures
          </h1>
          <p className="text-gray-600">Relive the magical stories we've created together!</p>
        </div>

        {chatHistory.map((day, index) => (
          <div key={index} className="mb-12">
            <div className="chat-date flex items-center gap-2 mb-6">
              <Calendar className="text-purple-500" />
              <span className="text-lg font-semibold text-gray-700">
                {new Date(day.date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            {day.conversations.map((conversation) => (
              <div 
                key={conversation.id}
                className="chat-item bg-white rounded-xl shadow-lg p-6 mb-6 transform hover:scale-102 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="text-blue-500" size={16} />
                  <span className="text-sm text-gray-500">{conversation.time}</span>
                  <Star className="text-yellow-400 ml-auto" size={16} />
                </div>

                {conversation.messages.map((message, mIndex) => (
                  <div
                    key={mIndex}
                    className={`flex items-start gap-4 mb-4 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                    </div>
                    <div className={`flex-1 p-4 rounded-xl ${
                      message.role === 'user'
                        ? 'bg-purple-50 rounded-tr-none'
                        : 'bg-blue-50 rounded-tl-none'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;