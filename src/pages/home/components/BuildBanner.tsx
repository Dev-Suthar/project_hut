import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./BuildBanner.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import arrowSvg from "assets/arrow.svg"; // Import the arrow SVG

gsap.registerPlugin(ScrollTrigger);

type BuildBannerProps = {
  // Add any props here if needed
};

const BuildBanner = forwardRef<HTMLDivElement, BuildBannerProps>(
  (props, ref) => {
    const bannerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Use imperative handle to expose the containerRef to the parent
    useImperativeHandle(ref, () => containerRef.current!, []);

    useEffect(() => {
      // Create a scroll trigger for the banner with smoother animation
      if (containerRef.current && bannerRef.current) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            // Make the banner move slightly faster than scroll for a parallax effect
            gsap.to(bannerRef.current, {
              y: self.progress * -10,
              duration: 1.5,
              ease: "power1.out",
            });
          },
        });
      }

      return () => {
        // Clean up
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }, []);

    return (
      <div className="build-banner-container" ref={containerRef}>
        <div className="roadmap-banner" ref={bannerRef}>
          <div className="banner-text">
            <span>LETS BUILD SOMETHING COOL</span>
            <span className="arrow-icon">
              <img src={arrowSvg} alt="arrow" />
            </span>
            <span>LETS BUILD SOMETHING COOL</span>
            <span className="arrow-icon">
              <img src={arrowSvg} alt="arrow" />
            </span>
            <span>LETS BUILD SOMETHING COOL</span>
            <span className="arrow-icon">
              <img src={arrowSvg} alt="arrow" />
            </span>
            <span>LETS BUILD SOMETHING COOL</span>
            <span className="arrow-icon">
              <img src={arrowSvg} alt="arrow" />
            </span>
            <span>LETS BUILD SOMETHING COOL</span>
            <span className="arrow-icon">
              <img src={arrowSvg} alt="arrow" />
            </span>
            <span>LETS BUILD SOMETHING COOL</span>
            <span className="arrow-icon">
              <img src={arrowSvg} alt="arrow" />
            </span>
          </div>

          <div className="banner-text reverse">
            <span>LETS BUILD SOMETHING COOL</span>
            <span className="arrow-icon">
              <img src={arrowSvg} alt="arrow" />
            </span>
            <span>LETS BUILD SOMETHING COOL</span>
            <span className="arrow-icon">
              <img src={arrowSvg} alt="arrow" />
            </span>
            <span>LETS BUILD SOMETHING COOL</span>
            <span className="arrow-icon">
              <img src={arrowSvg} alt="arrow" />
            </span>
            <span>LETS BUILD SOMETHING COOL</span>
            <span className="arrow-icon">
              <img src={arrowSvg} alt="arrow" />
            </span>
            <span>LETS BUILD SOMETHING COOL</span>
            <span className="arrow-icon">
              <img src={arrowSvg} alt="arrow" />
            </span>
            <span>LETS</span>
          </div>
        </div>
      </div>
    );
  }
);

export default BuildBanner;
