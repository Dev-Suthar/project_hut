// Modal.js - Handles modal functionality including scroll position preservation

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  // Store the current scroll position before opening modal
  const scrollY = window.scrollY;
  document.documentElement.style.setProperty('--scroll-position', `-${scrollY}px`);
  
  // Add modal-open class to body
  document.body.classList.add('modal-open');
  
  // Show the modal
  modal.style.display = 'flex';
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
 
  modal.style.display = 'none';
  

  const scrollY = Math.abs(parseInt(document.documentElement.style.getPropertyValue('--scroll-position') || '0px'));
  
  // Remove modal-open class and add modal-closed temporarily
  document.body.classList.remove('modal-open');
  document.body.classList.add('modal-closed');
  
  // Restore scroll position
  setTimeout(() => {
    window.scrollTo(0, scrollY);
    
    // Remove the temporary class after a short delay
    setTimeout(() => {
      document.body.classList.remove('modal-closed');
    }, 100);
  }, 10);
}

// You can also create a function to handle the modal toggle
export function toggleModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  if (modal.style.display === 'flex') {
    closeModal(modalId);
  } else {
    openModal(modalId);
  }
} 