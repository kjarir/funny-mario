import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, History, MessageSquare } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isChat = location.pathname === '/chat';

  if (isChat) {
    return (
      <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="text-purple-600 h-6 w-6" />
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              FunnyMario
            </span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white bg-opacity-80 backdrop-blur-md shadow-md py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="text-purple-600 h-8 w-8" />
          <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            FunnyMario
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`font-medium transition-colors ${
              location.pathname === '/'
                ? 'text-purple-600'
                : 'text-gray-700 hover:text-purple-600'
            }`}
          >
            Home
          </Link>
          <Link
            to="/chat"
            className={`font-medium transition-colors ${
              location.pathname === '/chat'
                ? 'text-purple-600'
                : 'text-gray-700 hover:text-purple-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={18} />
              <span>Chat</span>
            </div>
          </Link>
          <Link
            to="/chat-history"
            className={`font-medium transition-colors ${
              location.pathname === '/chat-history'
                ? 'text-purple-600'
                : 'text-gray-700 hover:text-purple-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <History size={18} />
              <span>History</span>
            </div>
          </Link>
          <button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-2 px-6 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            Get Started
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-xl mt-2 py-4 px-6 absolute w-full">
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-purple-600'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/chat"
              className={`font-medium transition-colors ${
                location.pathname === '/chat'
                  ? 'text-purple-600'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={18} />
                <span>Chat</span>
              </div>
            </Link>
            <Link
              to="/chat-history"
              className={`font-medium transition-colors ${
                location.pathname === '/chat-history'
                  ? 'text-purple-600'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                <History size={18} />
                <span>History</span>
              </div>
            </Link>
            <button
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-2 px-6 rounded-full w-full mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;