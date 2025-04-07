import React, { useEffect, useRef, forwardRef, ForwardedRef } from 'react';
import './RoadmapSection.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Ensure ScrollTrigger is registered
gsap.registerPlugin(ScrollTrigger);

interface RoadmapSectionProps {
  // Add any props if needed
}

const RoadmapSection = forwardRef<HTMLElement, RoadmapSectionProps>((props, ref) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const actionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const animationsRef = useRef<gsap.core.Tween[]>([]);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  
  // Combine refs
  const combinedRef = (node: HTMLElement | null) => {
    sectionRef.current = node;
    if (ref) {
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    }
  };

  // Function to immediately show all elements without animation
  const showAllElements = () => {
    const section = sectionRef.current;
    if (section) {
      gsap.set(section, { opacity: 1, y: 0, scale: 1, rotationX: 0 });
    }
    
    actionRefs.current.forEach(action => {
      if (action) {
        gsap.set(action, { opacity: 1, y: 0 });
      }
    });
    
    titleRefs.current.forEach(title => {
      if (title) {
        gsap.set(title, { opacity: 1, y: 0 });
      }
    });
  };

  useEffect(() => {
    // Store the refs to avoid the React hooks exhaustive-deps warning
    const steps = stepsRef.current;
    const titles = titleRefs.current;
    const actions = actionRefs.current;
    const section = sectionRef.current;
    const content = contentRef.current;
    
    if (!section || !content) return;
    
    // Create a unique ID for this roadmap section
    const roadmapId = 'roadmap-' + Date.now();
    
    // Make sure the section is visible initially in case scrolling is buggy
    setTimeout(showAllElements, 1000);
    
    // Create an observer to ensure visibility
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target === section) {
          showAllElements();
        }
      });
    }, { threshold: 0.05 }); // Reduced threshold to trigger earlier
    
    observer.observe(section);
    
    // Create a simple animation for the entire section
    const sectionAnimation = gsap.fromTo(
      section,
      { opacity: 0, y: 30, rotationX: 5 },
      { 
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "power2.out"
      }
    );
    
    animationsRef.current.push(sectionAnimation);
    
    // Animate each step with a simpler approach
    steps.forEach((step, index) => {
      if (!step) return;
      
      // Animate the action text with a delay based on index
      if (actions[index]) {
        const actionAnim = gsap.fromTo(
          actions[index],
          { opacity: 0, y: -20 },
          { 
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.3 + index * 0.15,
            ease: "power2.out"
          }
        );
        
        animationsRef.current.push(actionAnim);
      }
      
      // Animate the title with a delay based on index
      if (titles[index]) {
        const titleAnim = gsap.fromTo(
          titles[index],
          { opacity: 0, y: 20 },
          { 
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.45 + index * 0.15,
            ease: "power2.out"
          }
        );
        
        animationsRef.current.push(titleAnim);
      }
    });
    
    // Find the TeamSection element to use as a trigger for the transition effect
    const teamSection = document.querySelector('.team-section-container');
    
    if (teamSection && content) {
      // Create a ScrollTrigger for the transition effect
      const transitionTrigger = ScrollTrigger.create({
        id: `${roadmapId}-transition`,
        trigger: teamSection,
        start: "top bottom", // When the top of TeamSection reaches the bottom of viewport
        end: "top 40%", // When the top of TeamSection is 40% from the top of viewport
        scrub: 0.8, // Smooth animation tied to scroll position with slight delay for smoothness
        markers: false, // Set to true for debugging
        onUpdate: (self) => {
          // Calculate scale, opacity, and rotation based on scroll progress with smoother easing
          const progress = self.progress;
          const scale = gsap.utils.interpolate(1, 0.7, progress);
          const opacity = gsap.utils.interpolate(1, 0, progress);
          const rotation = gsap.utils.interpolate(0, -30, progress); // Add rotation from 0 to -30 degrees
          
          gsap.set(content, {
            scale: scale,
            opacity: opacity,
            rotationX: rotation, // Apply rotation around X axis for 3D effect
            transformOrigin: "center top",
            force3D: true,
            willChange: "transform, opacity"
          });
        }
      });
      
      triggersRef.current.push(transitionTrigger);
    }
    
    return () => {
      // Clean up all animations
      animationsRef.current.forEach(anim => anim.kill());
      
      // Clean up all ScrollTrigger instances
      triggersRef.current.forEach(trigger => trigger.kill());
      
      // Clean up observer
      observer.disconnect();
    };
  }, []);

  return (
    <section className="project-roadmap-section" ref={combinedRef}>
      <div className="container">
        <div className="roadmap-content" ref={contentRef}>
          <div className="roadmap-step" ref={el => stepsRef.current[0] = el}>
            <div className="step-action" ref={el => actionRefs.current[0] = el}>Share</div>
            <h2 className="step-title" ref={el => titleRefs.current[0] = el}>Requirements</h2>
          </div>
          
          <div className="roadmap-step" ref={el => stepsRef.current[1] = el}>
            <div className="step-action" ref={el => actionRefs.current[1] = el}>Agree on</div>
            <h2 className="step-title" ref={el => titleRefs.current[1] = el}>Scope & models</h2>
          </div>
          
          <div className="roadmap-step" ref={el => stepsRef.current[2] = el}>
            <div className="step-action" ref={el => actionRefs.current[2] = el}>Onboard</div>
            <h2 className="step-title" ref={el => titleRefs.current[2] = el}>The team</h2>
          </div>
        </div>
      </div>
    </section>
  );
});

// Add display name for better debugging
RoadmapSection.displayName = 'RoadmapSection';

export default RoadmapSection;