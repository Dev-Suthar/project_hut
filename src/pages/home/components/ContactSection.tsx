import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ContactSection.css';

gsap.registerPlugin(ScrollTrigger);

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectRequirement: ''
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formFieldsRef = useRef<HTMLDivElement[]>([]);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle form submission, e.g. send to API
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      projectRequirement: ''
    });
    // Show success message or notification
    alert('Thank you for your message! We will get back to you soon.');
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    // Create animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      }
    });

    // Animate heading
    if (headingRef.current) {
      tl.fromTo(headingRef.current, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }

    // Animate form fields
    if (formFieldsRef.current.length) {
      tl.fromTo(formFieldsRef.current, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );
    }

    // Animate contact info
    if (contactInfoRef.current) {
      tl.fromTo(contactInfoRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.8'
      );
    }

    // Animate button
    if (buttonRef.current) {
      tl.fromTo(buttonRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );
    }

    return () => {
      // Clean up
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
  }, []);

  return (
    <section className="contact-section" ref={sectionRef} id="contact">
      <div className="container">
        <h2 className="contact-heading" ref={headingRef}>CONTACT</h2>
        
        <div className="contact-content">
          <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
            <div 
              className="form-group" 
              ref={el => {if (el) formFieldsRef.current[0] = el}}
            >
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div 
              className="form-group" 
              ref={el => {if (el) formFieldsRef.current[1] = el}}
            >
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="e.g Johndoe@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div 
              className="form-group" 
              ref={el => {if (el) formFieldsRef.current[2] = el}}
            >
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="e.g (123) - 456 - 789"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div 
              className="form-group" 
              ref={el => {if (el) formFieldsRef.current[3] = el}}
            >
              <label htmlFor="projectRequirement">Project Requirement</label>
              <textarea
                id="projectRequirement"
                name="projectRequirement"
                placeholder="Write your message here"
                value={formData.projectRequirement}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-button" 
              ref={buttonRef}
            >
              <span>GET IN TOUCH</span>
              <span className="arrow">→</span>
            </button>
          </form>
          
          <div className="contact-info" ref={contactInfoRef}>
            <div className="info-item">
              <div className="info-icon">
                <div className="circle"></div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="info-text">
                <h3>EMAIL</h3>
                <p>hello@agency.com</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <div className="circle"></div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4H9L11 9L8.5 10.5C9.57096 12.6715 11.3285 14.429 13.5 15.5L15 13L20 15V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21C14.0993 20.763 10.4202 19.1065 7.65683 16.3432C4.8935 13.5798 3.23705 9.90074 3 6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="info-text">
                <h3>PHONE</h3>
                <p>+123 456 789</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 