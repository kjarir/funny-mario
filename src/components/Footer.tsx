import { BookOpen, Heart, MessageSquare, Github, Twitter } from 'lucide-react';

const Footer = () => {
  // Function to scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-gradient-to-r from-purple-900 to-blue-900 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `twinkle ${Math.random() * 4 + 3}s infinite alternate`,
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-white h-8 w-8" />
              <span className="font-heading text-2xl font-bold">FunnyMario</span>
            </div>
            <p className="text-purple-100 mb-6 max-w-sm">
              FunnyMario creates magical, personalized stories for kids of all ages, 
              making reading fun and interactive in the digital age.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white hover:text-purple-200 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-purple-200 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 font-heading">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="text-purple-200 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="text-purple-200 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#demo" className="text-purple-200 hover:text-white transition-colors">
                  Try Demo
                </a>
              </li>
              <li>
                <a href="#about" className="text-purple-200 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 font-heading">Get in Touch</h3>
            <ul className="space-y-2">
              <li className="text-purple-200">
                support@FunnyMario.example.com
              </li>
              <li className="text-purple-200">
                +91 9987840201
              </li>
              <li className="mt-4">
                <button 
                  className="bg-white text-purple-700 px-4 py-2 rounded-full font-bold hover:bg-purple-100 transition-colors flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-purple-300 text-sm mb-4 md:mb-0">
            &copy; 2025 FunnyMario. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-purple-300">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>

        {/* Scroll to top button */}
        <div className="flex justify-center mt-8">
          <button 
            onClick={scrollToTop}
            className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-3 transition-all duration-300 hover:-translate-y-1"
            aria-label="Scroll to top"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M18 15l-6-6-6 6"/>
              </svg>
            </div>
          </button>
        </div>

        {/* Made with love
        <div className="text-center mt-8 text-sm text-purple-300 flex items-center justify-center gap-1">
          Made with <Heart size={14} className="text-pink-400" /> for creative kids everywhere
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;