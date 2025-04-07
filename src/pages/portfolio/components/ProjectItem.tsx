import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ProjectItemProps {
  imageUrl: string;
  title?: string;
  index: any;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  imageUrl,
  title = "",
  index,
}) => {
  const bookRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Set up animations
  useEffect(() => {
    if (
      !bookRef.current ||
      !leftRef.current ||
      !rightRef.current ||
      !textRef.current
    )
      return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: bookRef.current,
        start: "top bottom", // When top of element hits bottom of viewport
        end: "bottom top", // When bottom of element hits top of viewport
        scrub: true,
        id: `book-anim-${index}`,
        onUpdate: (self) => {
          const element = bookRef.current;
          if (!element) return;

          const rect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const elementCenter = rect.top + rect.height / 2;

          // Calculate distance from viewport center (0 = centered, 1 = at top/bottom)
          const distanceFromCenter =
            Math.abs(elementCenter - viewportHeight / 2) / (viewportHeight / 2);

          // Adjust the center area (0.7 means 30% from top and bottom will be considered "center")
          const centerThreshold = 0.7;
          const centerProgress =
            distanceFromCenter < centerThreshold
              ? 1 // Full size in center area
              : 1 -
                (distanceFromCenter - centerThreshold) / (1 - centerThreshold); // Scale down outside center area

          // Scale based on how centered the element is
          const targetScale = isMobile
            ? 1 + centerProgress * 0.3 // 1 to 1.3 on mobile
            : 0.8 + centerProgress * 0.6; // 0.8 to 1.4 on desktop

          gsap.to(element, {
            scale: targetScale,
            duration: 0.1,
          });

          // Calculate flip progress with a wider center area
          const flipProgress = Math.min(
            1,
            Math.max(
              0,
              self.progress < 0.15
                ? self.progress * 6.67 // Faster initial flip
                : self.progress > 0.85
                ? (1 - self.progress) * 6.67 // Faster final flip
                : 1 // Full flip in center area
            )
          );

          const maxAngle = isMobile ? 30 : 60;

          gsap.to(leftRef.current, {
            rotationY: maxAngle - maxAngle * flipProgress,
            duration: 0.1,
          });

          gsap.to(rightRef.current, {
            rotationY: -maxAngle + maxAngle * flipProgress,
            duration: 0.1,
          });

          // Text opacity - appears sooner and stays longer
          gsap.to(textRef.current, {
            opacity: flipProgress > 0.3 ? 1 : flipProgress * 3.33,
            duration: 0.1,
          });
        },
      },
    });

    return () => {
      ScrollTrigger.getById(`book-anim-${index}`)?.kill();
    };
  }, [index, isMobile]);

  // Mouse move effect remains the same
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!bookRef.current) return;

    const rect = bookRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const relX = (x - centerX) / centerX;
    const relY = (y - centerY) / centerY;

    gsap.to(textRef.current, {
      x: relX * (isMobile ? 10 : 20),
      y: relY * (isMobile ? 10 : 20),
      duration: 0.3,
    });
  };

  return (
    <div
      ref={bookRef}
      className="relative mx-auto transition-all duration-100 ease-linear"
      style={{
        width: isMobile ? "70%" : "40%",
        aspectRatio: "3/2",
        perspective: "1000px",
        transformStyle: "preserve-3d",
        transform: isMobile ? "scale(1)" : "scale(0.8)",
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Left Page */}
      <div
        ref={leftRef}
        className="absolute left-0 h-full transition-transform duration-100 linear"
        style={{
          width: "50.5%",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "left center",
          transformOrigin: "right center",
          transform: `rotateY(${isMobile ? 30 : 60}deg)`,
          backfaceVisibility: "hidden",
          marginRight: "-1px",
        }}
      />

      {/* Right Page */}
      <div
        ref={rightRef}
        className="absolute right-0 h-full transition-transform duration-100 linear"
        style={{
          width: "50.5%",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "right center",
          transformOrigin: "left center",
          transform: `rotateY(${isMobile ? -30 : -60}deg)`,
          backfaceVisibility: "hidden",
          marginLeft: "-1px",
        }}
      />

      {/* Text Overlay */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 mix-blend-difference"
        style={{
          opacity: 0,
          fontFamily: "Aspekta-700",
        }}
      >
        <h2 className="text-center text-white font-aspekta-700 text-[clamp(1.2rem,4vw,3rem)] capitalize px-4">
          {title}
        </h2>
      </div>
    </div>
  );
};

export default ProjectItem;
