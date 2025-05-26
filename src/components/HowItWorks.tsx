import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, Wand2, BookOpen, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    title: "Chat with FunnyMario",
    description: "Tell FunnyMario what kind of story you want - maybe about dinosaurs, space, or unicorns!",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: Wand2,
    title: "Magic Happens",
    description: "FunnyMario uses its imagination to create a unique story just for you!",
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: BookOpen,
    title: "Story Time",
    description: "Read along as your personalized story unfolds with fun characters and adventures.",
    color: "from-pink-400 to-pink-600",
  },
  {
    icon: Sparkles,
    title: "Learn & Grow",
    description: "Every story teaches something new and helps improve reading skills!",
    color: "from-yellow-400 to-yellow-600",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current || !stepsRef.current || !headingRef.current) return;

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

    // Animate steps
    gsap.fromTo(
      ".step-card",
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );

    // Animate connecting lines
    gsap.fromTo(
      ".connector",
      { width: 0 },
      {
        width: "100%",
        duration: 1.5,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 60%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-20 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-purple-400 filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-blue-400 filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 inline-block bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            How FunnyMario Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Creating magical stories is as easy as 1-2-3-4!
          </p>
        </div>

        <div ref={stepsRef} className="relative">
          {/* Desktop View (Horizontal Steps) */}
          <div className="hidden md:flex justify-between items-start relative mb-20">
            {/* Connector Line */}
            <div className="absolute top-16 left-0 w-full h-1 bg-gray-200 z-0">
              <div className="connector h-full bg-gradient-to-r from-purple-400 to-blue-500"></div>
            </div>

            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className="step-card relative z-10 flex flex-col items-center w-64"
                >
                  <div className={`w-16 h-16 rounded-full mb-6 flex items-center justify-center bg-gradient-to-r ${step.color} text-white shadow-lg`}>
                    <IconComponent size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-heading">{step.title}</h3>
                  <p className="text-center text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>

          {/* Mobile View (Vertical Steps) */}
          <div className="md:hidden space-y-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className="step-card flex items-start gap-4"
                >
                  <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r ${step.color} text-white shadow-lg`}>
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 font-heading">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;