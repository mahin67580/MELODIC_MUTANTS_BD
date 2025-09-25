"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Guitar, Piano, Drum, Users, BookOpen, Trophy } from 'lucide-react';

// Use regular components instead of shadcn/ui typography if not available
const Heading = ({ level = 1, children, className = '', ...props }) => {
  const Tag = `h${level}`;
  return (
    <Tag className={`font-bold ${className}`} {...props}>
      {children}
    </Tag>
  );
};

const Text = ({ children, className = '', ...props }) => {
  return (
    <p className={`text-base ${className}`} {...props}>
      {children}
    </p>
  );
};

const Hero = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  const stats = [
    {
      id: 1,
      value: 10000,
      suffix: '+',
      label: 'Happy Students',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 2,
      value: 50,
      suffix: '+',
      label: 'Expert Instructors',
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      id: 3,
      value: 95,
      suffix: '%',
      label: 'Success Rate',
      icon: <Trophy className="h-4 w-4" />
    }
  ];

  const instruments = [
    { icon: <Guitar className="h-8 w-8" />, label: 'Guitar' },
    { icon: <Piano className="h-8 w-8" />, label: 'Piano' },
    { icon: <Drum className="h-8 w-8" />, label: 'Drums' },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToCourses = () => {
    const coursesSection = document.getElementById('courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
      aria-labelledby="hero-heading"
    >
      {/* Black and White Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Musical Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white"></div>
          <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-white"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-white"></div>
          <div className="absolute bottom-40 right-1/3 w-12 h-12 rounded-full bg-white"></div>
          {/* Music staff lines */}
          <div className="absolute top-1/4 left-0 right-0 h-px bg-white/10"></div>
          <div className="absolute top-1/4 left-0 right-0 h-16 flex flex-col justify-between">
            <div className="h-px bg-white/10"></div>
            <div className="h-px bg-white/10"></div>
            <div className="h-px bg-white/10"></div>
            <div className="h-px bg-white/10"></div>
            <div className="h-px bg-white/10"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10   mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className={`space-y-6 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            <Badge 
              variant="secondary" 
              className="mt-2 px-4 py-2 bg-white/20 text-white border-white/30 backdrop-blur-sm"
            >
              🎵 Start Your Musical Journey Today
            </Badge>

            <Heading
              id="hero-heading"
              level={1}
              className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight"
            >
              𝕸𝖆𝖘𝖙𝖊𝖗 𝖄𝖔𝖚𝖗 𝕴𝖓𝖘𝖙𝖗𝖚𝖒𝖊𝖓𝖙,{' '}
              <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                𝖀𝖓𝖑𝖊𝖆𝖘𝖍 𝖄𝖔𝖚𝖗 𝕮𝖗𝖊𝖆𝖙𝖎𝖛𝖎𝖙𝖞
              </span>
            </Heading>

            <Text className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Interactive music lessons for guitar, piano, drums, and more. Learn at your own pace with expert instructors.
            </Text>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={scrollToCourses}
                aria-label="Start learning for free"
              >
                Start Learning Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white bg-black  hover:bg-white hover:text-black px-8 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm"
                onClick={scrollToCourses}
                aria-label="Browse available courses"
              >
                Browse Courses
              </Button>
            </div>

            {/* Statistics */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-6 pt-8 pb-8"
            >
              {stats.map((stat) => (
                <div key={stat.id} className="text-center">
                  <div className="flex items-center justify-center gap-2 text-white font-bold text-xl md:text-2xl">
                    {stat.icon}
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <Text className="text-gray-300 text-sm mt-1">{stat.label}</Text>
                </div>
              ))}
            </div>
          </div>

     

          <div className={`transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 '
            }`}>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 rounded-3xl hidden lg:flex">
              <Text className="text-white text-center text-lg font-semibold mb-6">
                Popular Instruments
              </Text>

              <div className="grid grid-cols-3 gap-4">
                {instruments.map((instrument, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer"
                    aria-label={`Learn ${instrument.label}`}
                  >
                    <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:from-white/20 group-hover:to-white/10 border border-white/10 group-hover:border-white/30">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="text-white group-hover:text-gray-200 transition-colors duration-300">
                          {instrument.icon}
                        </div>
                        <Text className="text-white group-hover:text-gray-200 font-medium transition-colors duration-300">
                          {instrument.label}
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Featured Course Card */}
              <div className="mt-8 bg-gradient-to-r from-white/10 to-white/5 p-6 rounded-2xl border border-white/20">
                <Text className="text-white font-semibold text-center">
                  🎼 Beginner-friendly courses starting at $19.99
                </Text>
                <Text className="text-gray-300 text-sm text-center mt-2">
                  No prior experience required. Start from scratch!
                </Text>
              </div>
            </Card>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute z-10  bottom-13 lg:bottom-18 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-blue-700 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </div>

        {/* Wave divider at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-16"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V56.44Z" 
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
};

// Counter Component for Statistics Animation
const Counter = ({ target, suffix }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count < target) {
      const increment = target / 50;
      const timer = setTimeout(() => {
        setCount(prevCount => {
          const newCount = prevCount + increment;
          return newCount >= target ? target : newCount;
        });
      }, 30);

      return () => clearTimeout(timer);
    }
  }, [count, target]);

  return (
    <span>
      {Math.floor(count)}
      {suffix}
    </span>
  );
};

export default Hero;