import React, { useEffect, useRef } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Position modal below the section and handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // Find the IntegratedSections element
      const section = document.getElementById('integrated-sections-container') || 
                      document.querySelector('.integrated-sections');
      
      if (section && modalRef.current) {
        // Calculate the exact position where the bottom of the section is
        const sectionRect = section.getBoundingClientRect();
        const sectionBottomPosition = sectionRect.bottom + window.scrollY;
        
        // Position the modal exactly at the bottom of the section
        modalRef.current.style.top = `${sectionBottomPosition}px`;
        
        // Scroll to make sure the top of the modal is visible
        window.scrollTo({
          top: sectionBottomPosition - 20, // Small offset to see a bit of the section
          behavior: 'auto'
        });
      }
    } else {
      // Restore scrolling
      document.body.style.overflow = '';
    }
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      ref={overlayRef}
      className="modal-overlay" 
      onClick={(e) => { e.stopPropagation(); onClose(); }}
    >
      <div 
        ref={modalRef}
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button 
            className="modal-close-button" 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          >
            ×
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 