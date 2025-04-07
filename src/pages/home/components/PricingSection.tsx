import React, { useEffect, useRef, useState } from 'react';
import './PricingSection.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Ensure ScrollTrigger is registered
gsap.registerPlugin(ScrollTrigger);

// Define interface for component props if needed
interface PricingSectionProps {
  isModal?: boolean; // Add flag to indicate if this is displayed in a modal
  onContactClick?: () => void; // Optional callback for contact button clicks
}

// Enum for plan types to ensure consistency
enum PricingPlan {
  POC = "POC",
  MVP = "MVP",
  GROWTH = "GROWTH"
}

const PricingSection: React.FC<PricingSectionProps> = ({ isModal = false, onContactClick }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  
  // State to track which card is selected - set default based on modal
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(isModal ? PricingPlan.GROWTH : PricingPlan.GROWTH);
  
  // Handler for card selection - simplified to just change state, no animations
  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
  };
  
  // Handle contact button click
  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick();
    }
    // Default behavior for standalone component (not in modal)
  };
  
  useEffect(() => {
    // Don't initialize scroll animations if in modal
    if (isModal) return;
    
    // Initial render only - no animations for standalone mode
    // Clean up function
    return () => {
      // No animations to clean up
    };
  }, [isModal]);
  
  // Use a more compact layout when in modal mode
  const getCompactLayout = () => {
    return isModal ? { 
      className: "pricing-modal compact-layout",
      style: { 
        padding: 0, 
        margin: 0, 
        height: '100%', 
        overflow: 'auto',
        backgroundColor: 'transparent' 
      }
    } : {};
  };
  
  return (
    <section 
      className={`pricing-section ${isModal ? 'pricing-modal compact-layout' : ''}`} 
      ref={sectionRef}
      style={isModal ? { padding: 0, margin: 0 } : {}}
    >
      <div className={`container ${isModal ? 'modal-container-override' : ''}`}>
        {!isModal && (
          <div className="pricing-title-wrapper">
            <h2 className="section-title" ref={titleRef}>
              Choose your plan
            </h2>
          </div>
        )}
        
        <div 
          className={`pricing-cards-wrapper ${isModal ? 'modal-cards-wrapper' : ''}`} 
          ref={cardsRef}
          style={isModal ? { overflowX: 'auto', display: 'flex', justifyContent: 'center' } : {}}
        >
          {/* POC Card */}
          <div 
            className={`pricing-card poc ${selectedPlan === PricingPlan.POC ? 'active' : ''}`}
            onClick={() => handleSelectPlan(PricingPlan.POC)}
            style={isModal ? { minWidth: '300px', maxWidth: '340px', margin: '0 5px' } : {}}
          >
            <div className="pricing-card-header">
              <div className="pricing-plan">POC</div>
              <div className="pricing-amount">
                <span className="price">$3.6</span>
                <span className="price-suffix">K /MONTH</span>
              </div>
            </div>
            
            <div className="pricing-divider"></div>
            
            <div className="pricing-content">
              <h3 className="pricing-subtitle">Here's What You Get</h3>
              
              <div className="resource-item">
                <span className="resource-role">Quarter Time Software Engineer</span>
                <span className="resource-hours">60h / 160h</span>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '37.5%' }}></div>
                </div>
              </div>
              
              <div className="resource-item">
                <span className="resource-role">Product Manager</span>
                <span className="resource-hours">60h / 160h</span>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '37.5%' }}></div>
                </div>
              </div>
              
              <div className="pricing-ai-section">
                <div className="ai-assistance-label">
                  <span className="sparkle-icon">✦</span>
                  <span>AI Assistance Included</span>
                </div>
                
                <div className="ai-benefits">
                  <div className="ai-benefit-item">
                    <div className="check-circle"></div>
                    <span>AI Designer</span>
                  </div>
                  <div className="ai-benefit-item">
                    <div className="check-circle"></div>
                    <span>AI Programmer</span>
                  </div>
                  <div className="ai-benefit-item">
                    <div className="check-circle"></div>
                    <span>AI Product Intelligence</span>
                  </div>
                </div>
              </div>
              
              <div className="pricing-benefits">
                <div className="benefit-row">
                  <span className="benefit-label">Average Rate</span>
                  <span className="benefit-value">$30/hr</span>
                </div>
                <div className="benefit-row">
                  <span className="benefit-label">Market Rate</span>
                  <span className="benefit-value">$18.0k/mo</span>
                </div>
                <div className="benefit-row">
                  <span className="benefit-label">Your Savings</span>
                  <span className="benefit-value savings">$10,800/mo</span>
                </div>
              </div>
              
              <div className="pricing-button-container">
                <button 
                  className={`contact-us-btn ${selectedPlan === PricingPlan.POC ? 'active' : ''}`}
                  onClick={handleContactClick}
                >
                  CONTACT US
                </button>
                <div className="pricing-footnote">Validate your proof of concept</div>
              </div>
            </div>
          </div>
          
          {/* MVP Card */}
          <div 
            className={`pricing-card mvp ${selectedPlan === PricingPlan.MVP ? 'active' : ''}`}
            onClick={() => handleSelectPlan(PricingPlan.MVP)}
            style={isModal ? { minWidth: '300px', maxWidth: '340px', margin: '0 5px' } : {}}
          >
            <div className="pricing-card-header">
              <div className="pricing-plan">MVP</div>
              <div className="pricing-amount">
                <span className="price">$7.8</span>
                <span className="price-suffix">K /MONTH</span>
              </div>
            </div>
            
            <div className="pricing-divider"></div>
            
            <div className="pricing-content">
              <h3 className="pricing-subtitle">Here's What You Get</h3>
              
              <div className="resource-item">
                <span className="resource-role">Quarter Time Software Engineer</span>
                <span className="resource-hours">100h / 160h</span>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '62.5%' }}></div>
                </div>
              </div>
              
              <div className="resource-item">
                <span className="resource-role">Half Time Product Designer</span>
                <span className="resource-hours">50h / 160h</span>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '31.25%' }}></div>
                </div>
              </div>
              
              <div className="resource-item">
                <span className="resource-role">Full Time Product Manager</span>
                <span className="resource-hours">60h / 160h</span>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '37.5%' }}></div>
                </div>
              </div>
              
              <div className="pricing-ai-section">
                <div className="ai-assistance-label">
                  <span className="sparkle-icon">✦</span>
                  <span>AI Assistance Included</span>
                </div>
                
                <div className="ai-benefits">
                  <div className="ai-benefit-item">
                    <div className="check-circle"></div>
                    <span>AI Designer</span>
                  </div>
                  <div className="ai-benefit-item">
                    <div className="check-circle"></div>
                    <span>AI Programmer</span>
                  </div>
                  <div className="ai-benefit-item">
                    <div className="check-circle"></div>
                    <span>AI Product Intelligence</span>
                  </div>
                </div>
              </div>
              
              <div className="pricing-benefits">
                <div className="benefit-row">
                  <span className="benefit-label">Average Rate</span>
                  <span className="benefit-value">$37/hr</span>
                </div>
                <div className="benefit-row">
                  <span className="benefit-label">Market Rate</span>
                  <span className="benefit-value">$21.4k/mo</span>
                </div>
                <div className="benefit-row">
                  <span className="benefit-label">Your Savings</span>
                  <span className="benefit-value savings">$12,800/mo</span>
                </div>
              </div>
              
              <div className="pricing-button-container">
                <button 
                  className={`contact-us-btn ${selectedPlan === PricingPlan.MVP ? 'active' : ''}`}
                  onClick={handleContactClick}
                >
                  CONTACT US
                </button>
                <div className="pricing-footnote">Perfect for validating your product idea</div>
              </div>
            </div>
          </div>
          
          {/* GROWTH Card */}
          <div 
            className={`pricing-card growth ${selectedPlan === PricingPlan.GROWTH ? 'active' : ''}`}
            onClick={() => handleSelectPlan(PricingPlan.GROWTH)}
            style={isModal ? { minWidth: '300px', maxWidth: '340px', margin: '0 5px' } : {}}
          >
            <div className="pricing-card-header">
              <div className="pricing-plan">GROWTH</div>
              <div className="pricing-amount">
                <span className="price">$16.0</span>
                <span className="price-suffix">K /MONTH</span>
              </div>
            </div>
            
            <div className="pricing-divider"></div>
            
            <div className="pricing-content">
              <h3 className="pricing-subtitle">Here's What You Get</h3>
              
              <div className="resource-item">
                <span className="resource-role">Full Time System Architect</span>
                <span className="resource-hours">160h / 160h</span>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div className="resource-item">
                <span className="resource-role">Full Time Senior Engineer</span>
                <span className="resource-hours">160h / 160h</span>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div className="resource-item">
                <span className="resource-role">Full Time Software Engineer</span>
                <span className="resource-hours">160h / 160h</span>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div className="resource-item">
                <span className="resource-role">Quarter Time SPM</span>
                <span className="resource-hours">40h / 160h</span>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '25%' }}></div>
                </div>
              </div>
              
              <div className="pricing-ai-section">
                <div className="ai-assistance-label">
                  <span className="sparkle-icon">✦</span>
                  <span>AI Assistance Included</span>
                </div>
                
                <div className="ai-benefits">
                  <div className="ai-benefit-item">
                    <div className="check-circle"></div>
                    <span>AI Designer</span>
                  </div>
                  <div className="ai-benefit-item">
                    <div className="check-circle"></div>
                    <span>AI Programmer</span>
                  </div>
                  <div className="ai-benefit-item">
                    <div className="check-circle"></div>
                    <span>AI Product Intelligence</span>
                  </div>
                </div>
              </div>
              
              <div className="pricing-benefits">
                <div className="benefit-row">
                  <span className="benefit-label">Average Rate</span>
                  <span className="benefit-value">$39/hr</span>
                </div>
                <div className="benefit-row">
                  <span className="benefit-label">Market Rate</span>
                  <span className="benefit-value">$44.0k/mo</span>
                </div>
                <div className="benefit-row">
                  <span className="benefit-label">Your Savings</span>
                  <span className="benefit-value savings">$15,000/mo</span>
                </div>
              </div>
              
              <div className="pricing-button-container">
                <button 
                  className={`contact-us-btn ${selectedPlan === PricingPlan.GROWTH ? 'active' : ''}`}
                  onClick={handleContactClick}
                >
                  CONTACT US
                </button>
                <div className="pricing-footnote">Validate your proof of concept</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 