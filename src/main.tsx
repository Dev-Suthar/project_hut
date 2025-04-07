import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Register the smoothscroll polyfill for cross-browser compatibility
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

// Create a custom scroll behavior for smoother scrolling
if (typeof window !== 'undefined') {
  // Smooth scrolling for all internal links
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (anchor && anchor.hash && anchor.href.includes(window.location.origin)) {
      e.preventDefault();
      const element = document.querySelector(anchor.hash);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // Update URL hash without a page jump
        window.history.pushState(null, '', anchor.hash);
      }
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
