import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Example } from './components/example/example.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Example label='testing' onClick={() => console.log("clicked")}/>
  </StrictMode>,
)
