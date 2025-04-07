import React, { useEffect, useRef, useState } from 'react';
import './ServicesDetailSection.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ServiceCardProps {
  id: string;
  name: string;
  tags: string[];
  heading: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  tagColor?: string;
}

const ServicesDetailSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationsRef = useRef<gsap.core.Tween[]>([]);
  
  useEffect(() => {
    // Create a unique ID for this section's ScrollTrigger instances
    const sectionId = 'services-detail-' + Date.now();
    
    // Animation for the section title
    const titleAnimation = gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.5, 
        ease: 'power3.out', 
        delay: 0.2 
      }
    );
    
    animationsRef.current.push(titleAnimation);
    
    // Function to make all cards visible immediately without animation
    const showAllCards = () => {
      cardsRef.current.forEach(card => {
        if (card) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.classList.add('visible');
        }
      });
    };
    
    // Set all cards to visible with a staggered delay
    const revealAllCards = () => {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          // Set initial state
          gsap.set(card, { opacity: 0, scale: 0.95 });
          
          // Animate to visible state with delay
          const cardAnimation = gsap.to(card, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: 0.3 + index * 0.15,
            ease: 'power2.out',
            onComplete: () => {
              card.classList.add('visible');
            }
          });
          
          animationsRef.current.push(cardAnimation);
        }
      });
    };
    
    // Create a trigger specific to the last card (card-5)
    // This will detect when we're at the last card and connect to the next section
    const lastCardIndex = cardsRef.current.length - 1;
    const lastCard = cardsRef.current[lastCardIndex];
    
    if (lastCard) {
      // Create a ScrollTrigger for the bottom of the last card
      ScrollTrigger.create({
        id: `${sectionId}-last-card-bottom`,
        trigger: lastCard,
        start: "bottom 80%", // When bottom of last card is near top of viewport
        onEnter: () => {
          // Find the roadmap section and make sure it's visible
          const roadmapSection = document.querySelector('.project-roadmap-section');
          if (roadmapSection) {
            gsap.to(roadmapSection, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out'
            });
          }
        }
      });

      ScrollTrigger.create({
        id: `${sectionId}-last-card`,
        trigger: lastCard,
        start: "top 20%",
        end: "bottom -20%",
        onLeaveBack: () => {
          // When scrolling back up from the bottom of the last card
          if (lastCard) {
            gsap.to(lastCard, {
              opacity: 1,
              scale: 1,
              duration: 0.3
            });
          }
        }
      });
    }
    
    // Create a ScrollTrigger for this section that doesn't interfere with other sections
    ScrollTrigger.create({
      id: sectionId,
      trigger: sectionRef.current,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: revealAllCards,
      once: true // Only trigger once
    });
    
    // Make sure cards are visible if user scrolls past them quickly
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target === sectionRef.current) {
          // If section is visible but cards aren't, show them
          setTimeout(() => {
            const anyCardHidden = cardsRef.current.some(card => 
              card && !card.classList.contains('visible')
            );
            
            if (anyCardHidden) {
              showAllCards();
            }
          }, 1000);
        }
      });
    }, { threshold: 0.1 });
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    // Clean up
    return () => {
      // Kill all animations
      animationsRef.current.forEach(anim => anim.kill());
      
      // Kill ScrollTrigger instance
      ScrollTrigger.getById(sectionId)?.kill();
      
      // Clean up observer
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Service card data
  const serviceCards: ServiceCardProps[] = [
    {
      id: "card-1",
      name: "Artificial Intelligence",
      tags: ["Agentic AI", "Gen AI Prototyping & Integration", "Enterprise AI Strategy", "Natural Language Processing Solutions"],
      heading: "INNOVATIVE BRANDING SOLUTIONS",
      description: "Lorem ipsum\" is placeholder text commonly where used in design and where publishing to fill spaces where real where where content will where eventually where be where placed ontent will where eventually placeholder text commonly where",
      imageSrc: "https://cdn.prod.website-files.com/6778f2275176730ce836c9ed/677b53579465aca5167ac280_glosi%20image.webp",
      imageAlt: "AI technology visualization"
    },
    {
      id: "card-2",
      name: "Application Services",
      tags: ["Digital Process Automation", "Legacy System Modernization", "Enterprise Architecture Modernization"],
      heading: "INNOVATIVE BRANDING SOLUTIONS",
      description: "Lorem ipsum\" is placeholder text commonly where used in design and where publishing to fill spaces where real where where content will where eventually where be where placed ontent will where eventually placeholder text commonly where",
      imageSrc: "https://cdn.prod.website-files.com/6778f2275176730ce836c9ed/677b53579465aca5167ac280_glosi%20image.webp",
      imageAlt: "Web development team collaborating",
      tagColor: "teal-tag"
    },
    {
      id: "card-3",
      name: "Visual Design",
      tags: ["UI/UX Design", "Branding", "Visual Identity", "Graphic Design"],
      heading: "STUNNING VISUAL DESIGN",
      description: "Lorem ipsum\" is placeholder text commonly where used in design and where publishing to fill spaces where real where where content will where eventually where be where placed ontent will where eventually placeholder text commonly where",
      imageSrc: "https://cdn.prod.website-files.com/6778f2275176730ce836c9ed/677b53579465aca5167ac280_glosi%20image.webp",
      imageAlt: "Visual design elements"
    },
    {
      id: "card-4",
      name: "Cloud Services",
      tags: ["Cloud Migration", "DevOps Implementation", "Containerization", "CI/CD Pipeline Integration"],
      heading: "SEAMLESS CLOUD INTEGRATION",
      description: "Lorem ipsum\" is placeholder text commonly where used in design and where publishing to fill spaces where real where where content will where eventually where be where placed ontent will where eventually placeholder text commonly where",
      imageSrc: "https://cdn.prod.website-files.com/6778f2275176730ce836c9ed/677b53579465aca5167ac280_glosi%20image.webp",
      imageAlt: "Cloud technology representation"
    },
    {
      id: "card-5",
      name: "Data Services",
      tags: ["Data Analytics", "Business Intelligence", "Predictive Modeling", "Data Visualization"],
      heading: "ADVANCED DATA SOLUTIONS",
      description: "Lorem ipsum\" is placeholder text commonly where used in design and where publishing to fill spaces where real where where content will where eventually where be where placed ontent will where eventually placeholder text commonly where",
      imageSrc: "https://cdn.prod.website-files.com/6778f2275176730ce836c9ed/677b53579465aca5167ac280_glosi%20image.webp",
      imageAlt: "Data visualization interface"
    }
  ];
  
  return (
    <section className="services-detail-section" ref={sectionRef}>
      <div className="container" ref={containerRef}>
        <h2 className="services-detail-title" ref={titleRef} style={{ textAlign: 'left' }}>Service in Detail</h2>
        
        <div className="services-detail-cards-stack">
          {serviceCards.map((card, index) => (
            <div 
              key={card.id}
              className="service-detail-card" 
              id={card.id} 
              ref={el => cardsRef.current[index] = el}
            >
              <div className="service-detail-content">
                <div className="service-tags">
                  {card.tags.map((tag, tagIndex) => (
                    <span key={`${card.id}-tag-${tagIndex}`} className={`service-tag ${card.tagColor || ''}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="service-detail-name">{card.name}</h3>
                <div className="service-detail-body">
                  <div className="service-detail-image">
                    <img src={card.imageSrc} alt={card.imageAlt} />
                  </div>
                  <div className="service-detail-text">
                    <h4 className="service-detail-heading">{card.heading}</h4>
                    <p className="service-detail-description">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesDetailSection;