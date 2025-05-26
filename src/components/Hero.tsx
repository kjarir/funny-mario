import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MessageSquare, Sparkles, Stars } from 'lucide-react';

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const cloudElements = Array.from({ length: 5 }).map(() => useRef<HTMLDivElement>(null));
  const starElements = Array.from({ length: 8 }).map(() => useRef<HTMLDivElement>(null));

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Animate heading and text
    gsap.fromTo(
      '.hero-content > *',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)',
      }
    );

    // Animate robot mascot
    gsap.fromTo(
      robotRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.4)',
        delay: 0.5,
      }
    );

    // Floating animation for robot
    gsap.to(robotRef.current, {
      y: 15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    // Animate clouds
    cloudElements.forEach((cloud, index) => {
      if (!cloud.current) return;
      
      // Set random initial positions
      gsap.set(cloud.current, {
        x: -100 + Math.random() * 200,
        y: -50 + Math.random() * 100,
        opacity: 0.8,
        scale: 0.7 + Math.random() * 0.6,
      });
      
      // Animate clouds floating
      gsap.to(cloud.current, {
        x: '+=30',
        duration: 10 + index * 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Animate stars
    starElements.forEach((star, index) => {
      if (!star.current) return;
      
      // Set random initial positions
      gsap.set(star.current, {
        x: -150 + Math.random() * 300,
        y: -100 + Math.random() * 200,
        opacity: 0.1 + Math.random() * 0.7,
        scale: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * 360,
      });
      
      // Animate stars twinkling
      gsap.to(star.current, {
        opacity: 0.2 + Math.random() * 0.4,
        duration: 1 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Clouds */}
        {cloudElements.map((ref, index) => (
          <div 
            key={`cloud-${index}`}
            ref={ref}
            className="absolute opacity-70"
          >
            <div className="w-20 h-10 bg-white rounded-full filter blur-md"></div>
          </div>
        ))}
        
        {/* Stars */}
        {starElements.map((ref, index) => (
          <div 
            key={`star-${index}`}
            ref={ref}
            className="absolute text-yellow-300"
          >
            <Stars size={index % 2 === 0 ? 24 : 16} strokeWidth={1.5} />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between">
        {/* Hero Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0 hero-content">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent leading-tight">
            Magic Stories Come to Life with FunnyMario
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-lg mx-auto lg:mx-0">
            A fun AI friend that creates magical, personalized stories for kids, bringing imagination and learning together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
              <MessageSquare size={20} />
              Start Chatting
            </button>
            <button className="bg-white text-purple-600 font-bold py-3 px-8 border-2 border-purple-200 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
              <Sparkles size={20} />
              See Examples
            </button>
          </div>
        </div>

        {/* Robot Mascot */}
        <div 
          ref={robotRef}
          className="lg:w-1/2 flex justify-center items-center"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-lg">
            <img 
              src="https://images.pexels.com/photos/7386881/pexels-photo-7386881.jpeg?auto=compress&cs=tinysrgb&w=600" 
              alt="Cute Robot Mascot"
              className="w-56 h-56 md:w-72 md:h-72 object-cover rounded-full border-8 border-white"
            />
            <div className="absolute -top-4 -right-4 bg-yellow-300 text-white p-4 rounded-full shadow-md">
              <Sparkles size={24} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;