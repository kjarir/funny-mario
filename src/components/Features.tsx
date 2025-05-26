import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Palette, Volume2, Award, Bookmark, Zap } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "Smart Learning",
    description: "Stories adapt to your child's age and interests for personalized learning experiences.",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: Palette,
    title: "Colorful Illustrations",
    description: "Beautiful, age-appropriate illustrations bring stories to life for visual learners.",
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: Volume2,
    title: "Read Aloud",
    description: "FunnyMario can read stories aloud with different character voices and sound effects.",
    color: "from-pink-400 to-pink-600",
  },
  {
    icon: Award,
    title: "Educational Value",
    description: "Stories include educational themes aligned with school curriculum topics.",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    icon: Bookmark,
    title: "Story Library",
    description: "Save favorite stories to revisit and share with friends and family anytime.",
    color: "from-green-400 to-green-600",
  },
  {
    icon: Zap,
    title: "Interactive Choices",
    description: "Let kids make choices to guide the story in different exciting directions.",
    color: "from-red-400 to-red-600",
  },
];

const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current || !headingRef.current || !featuresRef.current) return;

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

    // Animate features
    gsap.fromTo(
      ".feature-card",
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-20 bg-gradient-to-b from-white to-purple-50 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="container mx-auto px-4">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 inline-block bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Magical Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            FunnyMario is packed with fun features to make storytelling magical and educational.
          </p>
        </div>

        <div
          ref={featuresRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="feature-card bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-full mb-6 flex items-center justify-center bg-gradient-to-r ${feature.color} text-white shadow-md`}>
                  <IconComponent size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 font-heading">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;