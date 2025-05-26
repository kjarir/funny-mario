import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Sparkles, Rocket, Star } from 'lucide-react';

const timelineEvents = [
  {
    year: "2025",
    title: "The Idea",
    description: "FunnyMario was born from a simple idea: make reading fun and interactive for kids in the digital age.",
    icon: Sparkles,
    color: "from-blue-400 to-blue-600",
  },
  {
    year: "2025",
    title: "Development",
    description: "Our team of educators and AI experts built FunnyMario to create engaging, educational stories for all ages.",
    icon: Rocket,
    color: "from-purple-400 to-purple-600",
  },
  {
    year: "2025",
    title: "Launch",
    description: "FunnyMario officially launched, bringing magical stories to thousands of excited kids around the world.",
    icon: Star,
    color: "from-pink-400 to-pink-600",
  },
  {
    year: "Beyond",
    title: "The Future",
    description: "FunnyMario continues to grow with new features, languages, and even more magical storytelling adventures!",
    icon: BookOpen,
    color: "from-yellow-400 to-yellow-600",
  },
];

const AboutBot = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current || !headingRef.current || !timelineRef.current) return;

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

    // Animate timeline
    const timelineItems = gsap.utils.toArray(".timeline-item");
    timelineItems.forEach((item, index) => {
      gsap.fromTo(
        item as HTMLElement,
        { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: item as HTMLElement,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Animate timeline line
    gsap.fromTo(
      ".timeline-line",
      { height: 0 },
      {
        height: "100%",
        duration: 1.5,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 70%",
          end: "bottom 70%",
          scrub: 0.5,
        },
      }
    );

    // Animate floating elements
    const floatingElements = gsap.utils.toArray(".floating-element");
    floatingElements.forEach((element) => {
      gsap.to(element as HTMLElement, {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        rotation: "random(-15, 15)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-20 relative overflow-hidden"
    >
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-element absolute top-20 left-10 text-purple-200">
          <BookOpen size={40} />
        </div>
        <div className="floating-element absolute top-40 right-20 text-blue-200">
          <Star size={30} />
        </div>
        <div className="floating-element absolute bottom-40 left-20 text-pink-200">
          <Sparkles size={36} />
        </div>
        <div className="floating-element absolute bottom-20 right-40 text-yellow-200">
          <Rocket size={32} />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 inline-block bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            The FunnyMario Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn how FunnyMario went from a simple idea to a magical storytelling friend.
          </p>
        </div>

        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          {/* Timeline Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2 z-0">
            <div className="timeline-line absolute top-0 left-0 w-full bg-gradient-to-b from-purple-400 to-blue-500"></div>
          </div>

          {/* Timeline Events */}
          {timelineEvents.map((event, index) => {
            const IconComponent = event.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`timeline-item relative z-10 flex mb-12 items-center ${
                  isEven ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Icon */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${event.color} text-white shadow-lg border-4 border-white`}>
                    <IconComponent size={20} />
                  </div>
                </div>

                {/* Content */}
                <div className={`w-5/12 ${isEven ? "text-right pr-8" : "pl-8"}`}>
                  <div className={`bg-white p-5 rounded-xl shadow-lg border border-gray-100 ${isEven ? "rounded-tr-none" : "rounded-tl-none"}`}>
                    <span className="text-sm font-bold text-purple-500">{event.year}</span>
                    <h3 className="text-xl font-bold mb-2 font-heading">{event.title}</h3>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                </div>

                {/* Spacer for other side */}
                <div className="w-5/12"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutBot;