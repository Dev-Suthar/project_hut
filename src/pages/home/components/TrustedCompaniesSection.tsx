import React, { useEffect, useRef } from 'react';
import './TrustedCompaniesSection.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TrustedCompaniesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Set initial state
    gsap.set([headingRef.current, descriptionRef.current, buttonRef.current], {
      opacity: 0,
      y: 30
    });

    // Create scroll trigger for the section
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      onEnter: () => {
        // Animate heading, description and button
        gsap.to(headingRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        });

        gsap.to(descriptionRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out"
        });

        gsap.to(buttonRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.4,
          ease: "power2.out"
        });

        // Animate stats with counter effect
        if (statsRef.current) {
          const stats = statsRef.current.querySelectorAll('.stat-number');
          stats.forEach(stat => {
            const value = parseInt(stat.getAttribute('data-value') || '0', 10);
            const prefix = stat.getAttribute('data-prefix') || '';
            const suffix = stat.getAttribute('data-suffix') || '';
            
            // Set initial static text to prevent NaN from showing
            stat.textContent = value + (prefix || suffix);
            
            gsap.from(stat, {
              textContent: 0,
              duration: 2,
              ease: "power2.out",
              snap: { textContent: 1 },
              stagger: 0.3,
              onUpdate: function() {
                const currentValue = Math.ceil(Number(this.targets()[0].textContent));
                if (isNaN(currentValue)) return; // Skip if NaN
                
                // Always place symbols after the number
                if (prefix === "+") {
                  this.targets()[0].textContent = `${currentValue}+`;
                } else if (suffix === "%") {
                  this.targets()[0].textContent = `${currentValue}%`;
                } else {
                  this.targets()[0].textContent = `${currentValue}`;
                }
              }
            });
          });
        }
      },
      once: true
    });

    // Remove hover effects entirely to maintain consistent appearance
    const button = buttonRef.current;
    if (button) {
      // Empty event handlers to satisfy TypeScript
      const mouseEnterHandler = () => {};
      const mouseLeaveHandler = () => {};

      // Remove hover listeners to ensure button always looks the same
      button.addEventListener('mouseenter', mouseEnterHandler);
      button.addEventListener('mouseleave', mouseLeaveHandler);

      return () => {
        // Clean up
        if (button) {
          button.removeEventListener('mouseenter', mouseEnterHandler);
          button.removeEventListener('mouseleave', mouseLeaveHandler);
        }
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }

    return () => {
      // Fallback cleanup if button wasn't defined
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="trusted-companies-section" ref={sectionRef}>
      <div className="trusted-container">
        <div className="trusted-content">
          <div className="trusted-left">
            <h2 className="trusted-heading" ref={headingRef}>
              Trusted by<br />Companies<br />Worldwide
            </h2>
          </div>
          <div className="trusted-right">
            <p className="trusted-description" ref={descriptionRef}>
              Lorem ipsum is placeholder text commonly used in design and publishing to fill spaces
              where real content will eventually be placed. It allows designers to focus.
            </p>
            <div className="trusted-cta" ref={buttonRef}>
              <a href="#contact" className="trusted-button">
                GET IN TOUCH
                <span className="button-arrow">↗</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="trusted-stats" ref={statsRef}>
          <div className="stat-item">
            <h3 className="stat-number" data-value="200" data-prefix="+">200+</h3>
            <p className="stat-label">Active Team Members</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number" data-value="95" data-suffix="%">95%</h3>
            <p className="stat-label">Client Retention</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number" data-value="12" data-prefix="+">12+</h3>
            <p className="stat-label">Projects Delivered</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedCompaniesSection;