import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import GLBViewer from './components/glb/GLBViewer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <GLBViewer glbUrl="https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb" />

  </StrictMode>,
)


/*
https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb

https://modelviewer.dev/shared-assets/models/Astronaut.glb

https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb

https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb

https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/2CylinderEngine/glTF-Binary/2CylinderEngine.glb

https://firebasestorage.googleapis.com/v0/b/mashroom-s-mvp.appspot.com/o/wallet2.glb?alt=media&token=77f083b3-c8ef-486e-a76f-31158f29d96c
*/