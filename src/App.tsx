import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initializePDFIndex } from './utils/initialize';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ChatHistory from './pages/ChatHistory';
import Chat from './pages/Chat';

function AppRoutes() {
  const location = useLocation();
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/history" element={<ChatHistory />} />
      </Routes>
      {location.pathname !== '/chat' && <Footer />}
    </>
  );
}

function App() {
  // Initialize smooth scrolling
  useSmoothScroll();

  // Register GSAP plugins
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Initialize animations
  useGSAP(() => {
    // Animate page elements on load
    gsap.fromTo(
      '.page-transition',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
    );
  });

  useEffect(() => {
    initializePDFIndex();
  }, []);

  return (
    <Router>
      <div className="min-h-screen overflow-x-hidden font-poppins bg-gradient-to-b from-purple-50 to-blue-50">
        <Header />
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;