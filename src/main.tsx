import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import './index.css'

// Prevent default touch behaviors that might interfere with the app
document.addEventListener('touchmove', (e) => {
  if (document.querySelector('.no-bounce') && e.target !== document.querySelector('.scrollable')) {
    e.preventDefault();
  }
}, { passive: false });

// Disable double-tap to zoom
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - (window.lastTouch || 0) < 300) {
    e.preventDefault();
  }
  window.lastTouch = now;
}, { passive: false });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
