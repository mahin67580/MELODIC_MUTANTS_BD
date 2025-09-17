// src/components/hero/Hero.js
import Image from 'next/image';
import Link from 'next/link';
import bannerimage from "../../assets/Gemini_Generated_Image_qnyi6yqnyi6yqnyi.png"
export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-purple-900 to-blue-800 text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={bannerimage} // You'll need to add this image to your public folder
          alt="Music learning platform background"
          fill
          style={{ objectFit: 'cover' }}
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-4 py-24 relative  ">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Master Your Instrument
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-blue-200">
              Learn guitar, piano, drums and more with world-class instructors
            </p>
            <p className="text-lg mb-8">
              Join thousands of students who have transformed their musical journey with our expert-guided lessons and personalized learning paths.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/signup" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300"
              >
                Start Learning Now
              </Link>
              <Link 
                href="/courses" 
                className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300"
              >
                Browse Courses
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-red-400 rounded-full opacity-20 animate-pulse delay-300"></div>
              
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-2xl">
                <Image
                  src={bannerimage}// You'll need to add this image
                  alt="Guitar, piano, and drums"
                  width={500}
                  height={350}
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg">
                🎵 Live Lessons
              </div>
              <div className="absolute -top-4 -right-4 bg-red-500 text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg">
                🎸 Expert Teachers
              </div>
            </div>
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
}