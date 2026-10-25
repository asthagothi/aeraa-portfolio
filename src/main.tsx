import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/fonts.ts'
import './index.css'
import App from './App.tsx'
import { initSmoothScroll } from './lib/smoothScroll.ts'

initSmoothScroll()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
