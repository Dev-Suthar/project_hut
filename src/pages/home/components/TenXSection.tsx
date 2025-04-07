import React, { useEffect, useRef } from "react";
import "./TenXSection.css";
import gsap from "gsap";
import tenXImage from "assets/10x.webp"; // Import the image directly

// Define interface for component props if needed
interface TenXSectionProps {
  // Add props here if needed in the future
}

const TenXSection: React.FC<TenXSectionProps> = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const benefitsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Animation for the 10X image - optimized for performance
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
        force3D: true,
        overwrite: "auto",
      }
    );

    // Animation for benefits - optimized for performance
    gsap.fromTo(
      ".benefit",
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.5,
        force3D: true,
        overwrite: "auto",
        onComplete: () => {
          // Reset willChange after animation completes to free resources
          gsap.set(".benefit", { clearProps: "willChange" });
        },
      }
    );

    // Optimize hover effect for 10X image
    let mouseTimeout: ReturnType<typeof setTimeout>;

    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;

      // Set willChange before animation starts
      gsap.set(imageRef.current, { willChange: "transform" });

      const { clientX, clientY } = e;
      const rect = imageRef.current.getBoundingClientRect();
      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;

      // Throttle the tilt effect to improve performance
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        // Subtle tilt effect with hardware acceleration
        gsap.to(imageRef.current, {
          rotationY: x * 0.01,
          rotationX: -y * 0.01,
          duration: 0.3,
          ease: "power2.out",
          force3D: true,
          overwrite: "auto",
        });
      }, 10); // Small delay for throttling
    };

    const handleMouseLeave = () => {
      if (!imageRef.current) return;

      gsap.to(imageRef.current, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.3,
        ease: "power2.out",
        force3D: true,
        overwrite: "auto",
        onComplete: () => {
          // Reset willChange after animation completes
          gsap.set(imageRef.current, { clearProps: "willChange" });
        },
      });
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener(
        "mousemove",
        handleMouseMove as unknown as EventListener
      );
      section.addEventListener(
        "mouseleave",
        handleMouseLeave as unknown as EventListener
      );

      return () => {
        clearTimeout(mouseTimeout);
        section.removeEventListener(
          "mousemove",
          handleMouseMove as unknown as EventListener
        );
        section.removeEventListener(
          "mouseleave",
          handleMouseLeave as unknown as EventListener
        );
      };
    }
  }, []);

  return (
    <div className="ten-x-section" ref={sectionRef}>
      <div className="container">
        <div className="ten-x-content">
          <div className="ten-x-svg">
            <img
              src={tenXImage}
              alt="10X"
              className="ten-x-image"
              ref={imageRef}
              style={{ willChange: "transform" }}
            />
          </div>
          <div className="ten-x-benefits" ref={benefitsRef}>
            <div className="benefit">Faster</div>
            <div className="benefit">Cheaper</div>
            <div className="benefit">Better</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenXSection;
