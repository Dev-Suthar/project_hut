import React, { useEffect, useRef, useState } from 'react';

const CTA: React.FC = () => {
  const workTogetherSectionRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseEnter = () => {
    if (workTogetherSectionRef.current) {
      workTogetherSectionRef.current.classList.add("animate-bg-cycle");
      workTogetherSectionRef.current.classList.remove("bg-white");
    }
  };

  const handleMouseLeave = () => {
    if (workTogetherSectionRef.current) {
      workTogetherSectionRef.current.classList.remove("animate-bg-cycle");
      workTogetherSectionRef.current.classList.add("bg-white");
    }
  };

  return (
    <div 
      ref={workTogetherSectionRef} 
      className="w-full py-24 flex flex-col items-center justify-center text-center bg-white"
    >
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-sm font-medium uppercase tracking-widest mb-8">
          START YOUR PROJECT
        </p>
        <div className="mb-16">
          <h2 className="font-light leading-tight mb-2 font-serif tracking-tight text-4xl md:text-7xl lg:text-8xl xl:text-9xl">
            LET'S WORK
          </h2>
          <h2 className="font-black leading-tight font-sans text-4xl md:text-7xl lg:text-8xl xl:text-9xl">
            TOGETHER
          </h2>
        </div>

        {/* Buttons and connecting line */}
        <div className="flex flex-col md:flex-row items-center justify-center">
          <a
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            href="#"
            className="relative inline-flex items-center justify-center 
              px-8 py-4 rounded-full min-w-[12rem] h-[3.25rem]
              text-sm font-medium uppercase tracking-wider
              border border-black bg-black text-white
              transition-all duration-300 ease-in-out
              overflow-hidden
              hover:bg-black hover:text-white hover:border-transparent
              group"
          >
            <div className="relative w-full text-center overflow-hidden">
              <span className="block transition-transform duration-300 group-hover:-translate-y-6">
                GET IN TOUCH
              </span>
              <span className="block absolute inset-0 transition-transform duration-300 translate-y-6 text-white group-hover:translate-y-0">
                GET IN TOUCH
              </span>
            </div>
          </a>

          {/* Connecting Line */}
          {!isMobile ? (
            <div className="bg-black h-px w-[6%] mx-0"></div>
          ) : (
            <div className="bg-black h-5 w-px mx-0 my-0"></div>
          )}

          <a
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            href="#"
            className="relative inline-flex items-center justify-center 
              px-8 py-4 rounded-full min-w-[12rem] h-[3.25rem]
              text-sm font-medium uppercase tracking-wider
              border border-black bg-white text-black
              transition-all duration-300 ease-in-out
              overflow-hidden
              hover:bg-black hover:text-white hover:border-transparent
              group"
          >
            <div className="relative w-full text-center overflow-hidden">
              <span className="block transition-transform duration-300 group-hover:-translate-y-6">
                OUR SERVICES
              </span>
              <span className="block absolute inset-0 transition-transform duration-300 translate-y-6 text-white group-hover:translate-y-0">
                OUR SERVICES
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CTA;