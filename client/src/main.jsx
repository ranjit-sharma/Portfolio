import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Apply saved theme before React mounts to prevent flash
const savedTheme = localStorage.getItem('portfolio-theme');
const prefersDark = !savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute(
  'data-theme',
  savedTheme || (prefersDark ? 'dark' : 'light')
);

// One listener drives the spotlight glow on every .card-spotlight card
document.addEventListener(
  'pointermove',
  (e) => {
    const card = e.target.closest?.('.card-spotlight');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  },
  { passive: true }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
