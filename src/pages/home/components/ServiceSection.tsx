import React, { useEffect, useRef, useState } from 'react';
import './ServiceSection.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Ensure ScrollTrigger is registered
gsap.registerPlugin(ScrollTrigger);

// Define interface for component props if needed
interface ServiceSectionProps {
  // Add props here if needed in the future
}

const ServiceSection: React.FC<ServiceSectionProps> = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const pillsRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const pillsTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [animationPlayed, setAnimationPlayed] = useState<boolean>(false);
  
  useEffect(() => {
    // Function to handle window resize
    const handleResize = (): void => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    
    // Add resize event listener with throttling for better performance
    let resizeTimer: number;
    const throttledResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(handleResize, 100);
    };
    window.addEventListener('resize', throttledResize);
    
    // Create master timeline for smoother coordinated animations
    const masterTimeline = gsap.timeline({
      defaults: { 
        ease: 'power2.out',
        force3D: true, // Force 3D transformations for smoother animations
      }
    });
    
    // Animation for the section title
    masterTimeline.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5 }
    );
    
    // Animation for the description text - updated to come from left
    masterTimeline.fromTo(
      descriptionRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.5 },
      "-=0.3" // Overlap with previous animation for smoother flow
    );
    
    // Animation for the service card
    masterTimeline.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.5 },
      "-=0.3" // Overlap with previous animation
    );
    
    // Register ScrollTrigger to optimize animations
    ScrollTrigger.config({ 
      limitCallbacks: true, // Limit callbacks for better performance
      ignoreMobileResize: true, // Ignore some mobile resizing events
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load" // Reduce refresh events
    });
    
    // Initialize the pills animations
    initializePillsAnimation();
    
    // Set initial visibility and positions based on screen size
    adjustPillsForScreenSize();
    
    // Clean up function
    return () => {
      // Clean up event listeners
      window.removeEventListener('resize', throttledResize);
      clearTimeout(resizeTimer);
      
      // Kill animations and ScrollTrigger instances
      masterTimeline.kill();
      if (pillsTimelineRef.current) {
        pillsTimelineRef.current.kill();
      }
      
      // Kill all ScrollTrigger instances for this component
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);
  
  // Function to initialize pills animation with falling effect
  const initializePillsAnimation = (): void => {
    // Get all the service pills
    const pills = document.querySelectorAll('.service-pill');
    
    // Exit if no pills found
    if (!pills.length) return;
    
    // If animation has already played, keep pills visible
    if (animationPlayed) {
      gsap.set(pills, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: (i) => {
          const pill = pills[i] as HTMLElement;
          const styles = getComputedStyle(pill);
          return styles.getPropertyValue('--final-rotation') || '0deg';
        }
      });
      return;
    }
    
    // Set the initial state for all pills - they start above their final position and invisible
    gsap.set(pills, {
      opacity: 0,
      y: -300, // Start much higher above for a more dramatic fall
      scale: 0.8
    });
    
    // Create a new timeline for the pills animation
    pillsTimelineRef.current = gsap.timeline({
      paused: true, // Start paused to be controlled by ScrollTrigger
      defaults: {
        ease: "bounce.out", // Add a bounce effect as pills land
        force3D: true // Better performance
      },
      // Keep end state after animation completes - no reverse on scroll up
      onComplete: () => {
        if (pillsTimelineRef.current) {
          // Force the timeline to stay at the end state
          pillsTimelineRef.current.progress(1);
          // Mark animation as played
          setAnimationPlayed(true);
        }
      }
    });
    
    // Add each pill to the timeline with staggered timing
    pills.forEach((pill, index) => {
      if (pill instanceof HTMLElement) {
        const styles = getComputedStyle(pill);
        const finalRotation = styles.getPropertyValue('--final-rotation') || '0deg';
        
        // Add a slight random delay for a more natural, cascade effect
        const randomDelay = index * 0.15 + Math.random() * 0.1;
        
        // Create a separate timeline for each pill for more control
        const pillTL = gsap.timeline();
        
        // Add dramatic falling animation for each pill
        pillTL.to(pill, {
          opacity: 1,
          y: -50, // Overshoot a bit
          duration: 0.5,
          rotation: "random(-15, 15)", // Random rotation during fall
        })
        .to(pill, {
          y: 0, // Land at the final position
          rotation: finalRotation.trim(), // Final rotation from CSS
          scale: 1,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)", // Elastic bounce when landing
        });
        
        // Add this pill's timeline to the main timeline with the random delay
        pillsTimelineRef.current?.add(pillTL, randomDelay);
      }
    });
    
    // Add hover effects for pills
    pills.forEach(pill => {
      if (pill instanceof HTMLElement) {
        const styles = getComputedStyle(pill);
        const finalRotation = styles.getPropertyValue('--final-rotation') || '0deg';
        
        const hoverTween = gsap.to(pill, {
          scale: 1.05,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          y: -5, // Slight lift on hover
          duration: 0.25,
          paused: true,
          overwrite: "auto",
          rotation: finalRotation.trim()
        });
        
        pill.addEventListener('mouseenter', () => hoverTween.play());
        pill.addEventListener('mouseleave', () => hoverTween.reverse());
      }
    });
    
    // Create a ScrollTrigger to control the animation
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 60%", // Start when the top of the section is 60% down the viewport
      end: "bottom bottom",
      markers: false,
      onEnter: () => {
        // Only play the animation if it hasn't been played before
        if (pillsTimelineRef.current && !animationPlayed) {
          pillsTimelineRef.current.restart();
        }
      },
      onEnterBack: () => {
        // Keep the pills visible when scrolling back up
        // No animation restart on scroll up - this removes the scroll up animation
      },
      onLeave: () => {
        // Optional: Do something when leaving the section
      },
      onLeaveBack: () => {
        // Don't reset animation if scrolling back up before it completes
        // This keeps the pills visible instead of resetting them
      }
    });
  };
  
  // Use effect to readjust pills when window size changes
  useEffect(() => {
    adjustPillsForScreenSize();
    
    // Force a refresh after a short delay to ensure proper positioning
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh(true); // Force a complete refresh
      
      // Reinitialize pills animation after resize
      initializePillsAnimation();
    }, 200);
    
    return () => clearTimeout(refreshTimer);
  }, [windowWidth, windowHeight]);
  
  // Function to adjust pills based on screen size
  const adjustPillsForScreenSize = (): void => {
    const pills = document.querySelectorAll('.service-pill');
    
    // Calculate aspect ratio factor to compensate for different browser sizes
    const aspectRatioFactor = Math.min(Math.max(window.innerWidth / window.innerHeight, 1.2), 2.0);
    
    // Immediately refresh ScrollTrigger to ensure proper positioning
    ScrollTrigger.refresh();
    
    // Reset any inline styles that might interfere with CSS media queries
    if (window.innerWidth < 768) {
      // For mobile screens, handle with CSS grid layout
      pills.forEach(pill => {
        if (pill instanceof HTMLElement) {
          // Clear position styles to allow CSS to control layout
          pill.style.position = 'relative';
          pill.style.top = 'auto';
          pill.style.left = 'auto';
          pill.style.right = 'auto';
          pill.style.bottom = 'auto';
          pill.style.transform = 'none';
          
          // Set opacity to 1 for mobile view
          gsap.set(pill, { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            rotation: 0
          });
        }
      });
    } else {
      // For larger screens, use absolute positioning with proportional scaling
      pills.forEach(pill => {
        if (pill instanceof HTMLElement) {
          // Set position to absolute to allow precise positioning
          pill.style.position = 'absolute';
          
          // Get the computed rotation value from CSS custom property
          const styles = getComputedStyle(pill);
          const finalRotation = styles.getPropertyValue('--final-rotation') || '0deg';
          
          // Apply different visual states based on whether animation has played
          if (!animationPlayed) {
            // If animation hasn't played yet, set initial state
            gsap.set(pill, { 
              rotation: 0, // Start with no rotation - will be animated
              opacity: 0, // Start invisible
              y: -300, // Start above - will be animated
              scale: 0.8 // Start smaller - will be animated
            });
          } else {
            // If animation has already played, show pills in final state
            gsap.set(pill, { 
              rotation: finalRotation.trim(), 
              opacity: 1, 
              y: 0, 
              scale: 1
            });
          }
          
          // Ensure consistent sizes across various viewport ratios
          if (window.innerWidth >= 1600) {
            // Calculate consistent size based on viewport ratio for ultra-wide screens
            const aspectAdjustment = aspectRatioFactor > 1.8 ? 0.85 : 1;
            pill.style.minWidth = `${12 * aspectAdjustment}vw`;
            pill.style.maxWidth = `${18 * aspectAdjustment}vw`;
            pill.style.height = `${7 * aspectAdjustment}vh`;
          } else if (window.innerWidth >= 1200) {
            // Large screens
            const aspectAdjustment = aspectRatioFactor > 1.6 ? 0.9 : 1;
            pill.style.minWidth = `${13 * aspectAdjustment}vw`;
            pill.style.maxWidth = `${19 * aspectAdjustment}vw`;
            pill.style.height = `${7.5 * aspectAdjustment}vh`;
          } else if (window.innerWidth >= 992) {
            // Medium-large screens
            const aspectAdjustment = aspectRatioFactor > 1.5 ? 0.95 : 1;
            pill.style.minWidth = `${14 * aspectAdjustment}vw`;
            pill.style.maxWidth = `${20 * aspectAdjustment}vw`;
            pill.style.height = `${7.5 * aspectAdjustment}vh`;
          } else {
            // Medium screens
            pill.style.minWidth = `${17}vw`;
            pill.style.maxWidth = `${24}vw`;
            pill.style.height = `${7.5}vh`;
          }
        }
      });
      
      // Apply proportional container sizing to maintain consistency
      scalePillsContainer(aspectRatioFactor);
    }
  };
  
  // Function to scale the pills container proportionally based on aspect ratio
  const scalePillsContainer = (aspectRatioFactor: number): void => {
    if (pillsRef.current) {
      // Base container height in vh units, adjusted for aspect ratio
      let containerHeight: number;
      
      if (window.innerWidth >= 1600) {
        containerHeight = 50 * (2.0 / aspectRatioFactor);
      } else if (window.innerWidth >= 1200) {
        containerHeight = 45 * (1.8 / aspectRatioFactor); 
      } else if (window.innerWidth >= 992) {
        containerHeight = 40 * (1.6 / aspectRatioFactor);
      } else {
        containerHeight = 45 * (1.5 / aspectRatioFactor);
      }
      
      // Enforce min/max values for sanity
      containerHeight = Math.max(Math.min(containerHeight, 60), 35);
      
      // Apply the calculated height
      pillsRef.current.style.height = `${containerHeight}vh`;
    }
  };
  
  return (
    <section className="service-section" ref={sectionRef}>
      <div className="container">
        <div className="service-title-wrapper">
          <h2 className="section-title" ref={titleRef} style={{ color: '#FFFFFF', textAlign: 'left' }}>
            Services in very brief<br />
            Specify some
          </h2>
          
        </div>
        <div className="service-wrap">
          <div className="service-card" ref={cardRef}>
            <div className="service-description" ref={descriptionRef}>
              <p>I transform ideas into compelling visuals that leave a lasting impact. From bold graphic designs to intricate 3D modeling, my work bridges creativity and functionality.</p>
            </div>
            
            <div className="service-pill-wrappar" ref={pillsRef}>
              <div className="service-pill pill-web-design">
                <div className="service-pill-text" style={{ color: '#4CD3A9' }}>Web Design</div>
              </div>
              <div className="service-pill pill-motion-graphic">
                <div className="service-pill-text" style={{ color: '#E05D5D' }}>Motion Graphics</div>
              </div>
              <div className="service-pill pill-graphic-design">
                <div className="service-pill-text" style={{ color: '#5D7CE0' }}>Graphic Design</div>
              </div>
              <div className="service-pill pill-digital-manipulation">
                <div className="service-pill-text" style={{ color: '#F0D15F' }}>Digital Manipulation</div>
              </div>
              <div className="service-pill pill-visual-effect">
                <div className="service-pill-text" style={{ color: '#4CD3A9' }}>Visual Effects</div>
              </div>
              <div className="service-pill pill-development">
                <div className="service-pill-text" style={{ color: '#4CD3A9' }}>Development</div>
              </div>
              <div className="service-pill pill-product">
                <div className="service-pill-text" style={{ color: '#F0D15F' }}>Product</div>
              </div>
              <div className="service-pill pill-management">
                <div className="service-pill-text" style={{ color: '#E05D5D' }}>Management</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;