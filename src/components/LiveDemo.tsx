import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, User, Bot } from 'lucide-react';

// Sample bot messages for the demo
const botResponses = [
  "Hi there! I'm FunnyMario. What kind of story would you like today?",
  "I'd love to tell you a story about a magical dragon! What's the dragon's name?",
  "Once upon a time, in a land far away, there lived a friendly dragon named Sparky. Sparky had beautiful purple scales that shimmered in the sunlight and bright green eyes that could see for miles...",
  "Sparky loved to help the villagers by using his fire breath to bake bread and warm their homes during winter. Everyone in the village loved Sparky!",
  "One day, Sparky discovered a lost baby bird who couldn't find its family. Would you like to hear what Sparky did next?",
];

// Sample user messages for the demo
const userMessages = [
  "Hi FunnyMario! Can you tell me a story?",
  "I want a story about a friendly dragon!",
  "Let's call the dragon Sparky!",
  "That sounds amazing! What did Sparky do in the village?",
  "Yes, please tell me what happened with the baby bird!",
];

type Message = {
  text: string;
  sender: 'bot' | 'user';
};

const LiveDemo = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([{ text: botResponses[0], sender: 'bot' }]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current || !headingRef.current || !chatboxRef.current) return;

    // Animate heading
    gsap.fromTo(
      headingRef.current.children,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Animate chatbox
    gsap.fromTo(
      chatboxRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: chatboxRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Demo the conversation steps
  const handleSendMessage = () => {
    if (currentStep >= userMessages.length) return;
    
    // Add user message
    const userMessage = currentInput || userMessages[currentStep];
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setCurrentInput('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      setMessages(prev => [...prev, { text: botResponses[currentStep + 1], sender: 'bot' }]);
      setIsTyping(false);
      setCurrentStep(prev => prev + 1);
    }, 1500);
  };

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="py-20 bg-gradient-to-b from-purple-50 to-blue-50 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-20 left-0 w-full h-64 bg-blue-100 opacity-20 transform -rotate-3"></div>

      <div className="container mx-auto px-4">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 inline-block bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            See FunnyMario in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Try out a demo conversation with FunnyMario to see how it creates magical stories!
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div 
            ref={chatboxRef}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-purple-500 mr-3">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">FunnyMario</h3>
                  <p className="text-xs text-purple-100">Your magical storytelling friend</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 h-80 overflow-y-auto bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`rounded-2xl py-3 px-4 max-w-xs ${
                      message.sender === 'user'
                        ? 'bg-purple-500 text-white rounded-tr-none'
                        : 'bg-white text-gray-700 shadow-md rounded-tl-none'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white text-gray-700 rounded-2xl py-3 px-4 shadow-md rounded-tl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder={userMessages[currentStep] || "Type your message..."}
                  className="flex-1 border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded-r-full hover:opacity-90 transition-opacity"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center">
                Try asking for a story about dragons, space adventures, or magical forests!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;