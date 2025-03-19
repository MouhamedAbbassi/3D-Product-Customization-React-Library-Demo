import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import LightingControls from "./LightingControls";
import CustomizationPanel from "./CustomizationPanel";

// Interface for component props
interface GLBViewerProps {
  glbUrl: string; // URL of the GLB model to be viewed
}

const GLBViewer: React.FC<GLBViewerProps> = ({ glbUrl }) => {
  const { scene } = useGLTF(glbUrl); // Load the 3D model using useGLTF
  const viewerRef = useRef<HTMLDivElement | null>(null); // Reference for the viewer container
  const [customizableParts, setCustomizableParts] = useState<Record<string, THREE.Material[]>>({}); // State to store customizable parts
  const [selectedPart, setSelectedPart] = useState<string | null>(null); // State to store the selected part
  const [ambientLightIntensity, setAmbientLightIntensity] = useState<number>(2); // Ambient light intensity
  const [directionalLightIntensity, setDirectionalLightIntensity] = useState<number>(2); // Directional light intensity
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false); // Fullscreen state
  const [materialDefinitions, setMaterialDefinitions] = useState<Record<string, any>>({}); // Material definitions from JSON

  // Load material definitions from a JSON file
  useEffect(() => {
    fetch("/material.data.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("Loaded material definitions:", data);
        setMaterialDefinitions(data.materials); // Set the materials after fetching
      })
      .catch((error) => console.error("Failed to load material definitions:", error));
  }, []);

  // Helper function to create a THREE.js material from a definition
  const createMaterialFromDefinition = (definition: any) => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(definition.color),
      roughness: definition.roughness,
      emissive: definition.emissive,
    });
  };

  // Extract customizable parts and materials from the loaded model
  useEffect(() => {
    const parts: Record<string, THREE.Material[]> = {}; // Store parts and materials
    scene.traverse((object: THREE.Object3D) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        const material = mesh.material;
        if (!parts[mesh.name]) parts[mesh.name] = []; // Initialize empty array for materials if not present
        const addMaterial = (mat: THREE.Material) => {
          if (!parts[mesh.name].includes(mat)) parts[mesh.name].push(mat);
        };
        // Add materials to the part
        Array.isArray(material) ? material.forEach(addMaterial) : addMaterial(material);
        
        // Handle material references in mesh user data
        if (mesh.userData) {
          console.log("mesh.userData", mesh.userData);
          Object.entries(mesh.userData).forEach(([key, materialRef]) => {
            if (key.startsWith("material") && typeof materialRef === "string") {
              if (Array.isArray(materialDefinitions)) {
                const materialDefinition = materialDefinitions.find(
                  (material) => material.id === materialRef
                );
                const extraMaterial = createMaterialFromDefinition(materialDefinition.data);
                console.log("extraMaterial", extraMaterial);
                addMaterial(extraMaterial);
              }
            }
          });
        }
      }
    });
    setCustomizableParts(parts); // Update the customizable parts
  }, [scene, materialDefinitions]);

  // Handle part selection
  const handlePartSelect = (part: string) => {
    setSelectedPart(part); // Set the selected part
  };

  // Apply selected material to the part
  const handleMaterialSelect = (material: THREE.Material) => {
    if (selectedPart) {
      scene.traverse((object: THREE.Object3D) => {
        if ((object as THREE.Mesh).isMesh && object.name === selectedPart) {
          (object as THREE.Mesh).material = material;
        }
      });
    }
  };

  // Toggle fullscreen mode for the viewer
  const toggleFullscreen = () => {
    if (viewerRef.current) {
      if (!isFullscreen) {
        viewerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <div className="bg-white text-center text-[#1A4044] px-4 py-4">
      <h1 className="text-lg font-light">Some fun? Try our</h1>
      <h1 className="text-4xl font-semibold mb-4">3D Configurator</h1>
      <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
        {/* Example Models Section */}
        <div className="w-72 max-sm:w-full max-lg:w-full p-6 h-[460px] max-h-[460px] overflow-y-auto max-sm:overflow-x-auto max-lg:h-[180px] bg-white rounded-lg shadow-sm">
          {/* Display example models */}
          <div className="flex flex-col    max-lg:flex-row sm:justify-center sm:items-center mb-2 ">
          <img src="/public/sofa1.png" alt="Example Model 1" className="w-28 sm:w-32 md:w-36 h-28 md:h-32 rounded cursor-pointer transition-transform duration-300 hover:scale-125" />
          <img src="/public/sofa2.png" alt="Example Model 2" className="w-28 sm:w-32 md:w-36 h-28 md:h-32 rounded cursor-pointer transition-transform duration-300 hover:scale-125" />
          <img src="/public/sofa3.png" alt="Example Model 3" className="w-28 sm:w-32 md:w-36 h-28 md:h-32 rounded cursor-pointer transition-transform duration-300 hover:scale-125" />
        </div>
        </div>
        
        {/* 3D Viewer Section */}
        <div ref={viewerRef} className="relative w-full md:w-[700px] h-[500px] max-sm:h-[400px] bg-[#f1f1f1] rounded-lg shadow-lg cursor-grab">
          {/* Fullscreen Button */}
          <button onClick={toggleFullscreen} className="absolute top-2 right-2 p-2 max-sm:p-0 cursor-pointer">
            <svg fill="#1A4044" viewBox="0 0 2020 2020" width="32" height="32">
              <path d="M1146.616-.012V232.38h376.821L232.391 1523.309v-376.705H0V1920h773.629v-232.39H396.69L1687.737 396.68V773.5h232.275V-.011z" />
            </svg>
          </button>
          {/* Lighting Controls */}
          <LightingControls
            ambientLightIntensity={ambientLightIntensity}
            setAmbientLightIntensity={setAmbientLightIntensity}
            directionalLightIntensity={directionalLightIntensity}
            setDirectionalLightIntensity={setDirectionalLightIntensity}
          />
          {/* 3D Canvas */}
 
          <Canvas camera={{ position: [3, 2, 6], fov: 50 }}>
            <ambientLight intensity={ambientLightIntensity} />
            <directionalLight intensity={directionalLightIntensity} position={[2.5, 8, 5]} />

            <primitive object={scene} />
            <OrbitControls  minDistance={2.5} maxDistance={5} enablePan={false} minZoom={2} maxZoom={6}  />
          </Canvas>
        </div>
        
        {/* Customization Panel */}
        <CustomizationPanel
          customizableParts={customizableParts}
          handlePartSelect={handlePartSelect}
          handleMaterialSelect={handleMaterialSelect}
        />
      </div>
    </div>
  );
};

export default GLBViewer;
