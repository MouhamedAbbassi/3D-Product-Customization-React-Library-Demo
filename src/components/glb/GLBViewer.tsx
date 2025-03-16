import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import LightingControls from "./LightingControls";
import CustomizationPanel from "./CustomizationPanel";

// Interface for component props
interface GLBViewerProps {
  glbUrl: string; // URL of the GLB model to be loaded
}

const GLBViewer: React.FC<GLBViewerProps> = ({ glbUrl }) => {
  const { scene } = useGLTF(glbUrl);
  const [customizableParts, setCustomizableParts] = useState<
    Record<string, THREE.Material[]>
  >({});
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] =
    useState<THREE.Material | null>(null);
  const [ambientLightIntensity, setAmbientLightIntensity] = useState<number>(2);
  const [directionalLightIntensity, setDirectionalLightIntensity] =
    useState<number>(2);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const viewerRef = useRef<HTMLDivElement | null>(null); // Ref for 3D viewer container

  // Function to create a material from a color string
  const createMaterialFromColor = (color: string) => {
    return new THREE.MeshStandardMaterial({ color: new THREE.Color(color) });
  };

  // Effect to extract customizable parts and additional materials from the model
  useEffect(() => {
    const parts: Record<string, THREE.Material[]> = {};

    if (scene) {
      scene.position.set(0, 0, 0); // Move model to (1/2 X, 0 Y, 0 Z)
    }

    // Log extras or userData for debugging
    console.log("Extras or UserData:", scene.children.map((child) => child.userData));

    scene.traverse((object: THREE.Object3D) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        const material = mesh.material;

        if (!parts[mesh.name]) {
          parts[mesh.name] = [];
        }

        // Add assigned materials
        if (Array.isArray(material)) {
          material.forEach((mat) => {
            if (!parts[mesh.name].includes(mat)) parts[mesh.name].push(mat);
          });
        } else {
          if (!parts[mesh.name].includes(material))
            parts[mesh.name].push(material);
        }

        // Add additional materials from extras or userData
        if (mesh.userData && mesh.userData.extra_colors) {
          try {
            // Parse extra_colors as JSON (if it's a JSON string)
            const extraColors = JSON.parse(mesh.userData.extra_colors);
            if (Array.isArray(extraColors)) {
              extraColors.forEach((color: string) => {
                const extraMaterial = createMaterialFromColor(color);
                if (!parts[mesh.name].includes(extraMaterial))
                  parts[mesh.name].push(extraMaterial);
              });
            } else {
              console.warn("extra_colors is not an array:", extraColors);
            }
          } catch (error) {
            console.error("Failed to parse extra_colors:", mesh.userData.extra_colors, error);
          }
        }
      }
    });

    setCustomizableParts(parts);
  }, [scene]);

  const handlePartSelect = (part: string) => {
    setSelectedPart(part);
    setSelectedMaterial(null); // Reset selected material when a new part is selected
  };

  const handleMaterialSelect = (material: THREE.Material) => {
    if (selectedPart) {
      scene.traverse((object: THREE.Object3D) => {
        if ((object as THREE.Mesh).isMesh && object.name === selectedPart) {
          (object as THREE.Mesh).material = material;
        }
      });
      setSelectedMaterial(material);
    }
  };

  const toggleFullscreen = () => {
    if (viewerRef.current) {
      if (!isFullscreen) {
        if (viewerRef.current.requestFullscreen) {
          viewerRef.current.requestFullscreen();
        } else if (viewerRef.current.requestFullscreen) {
          // Firefox
          viewerRef.current.requestFullscreen();
        } else if (viewerRef.current.requestFullscreen) {
          // Chrome, Safari
          viewerRef.current.requestFullscreen();
        } else if (viewerRef.current.requestFullscreen) {
          // IE/Edge
          viewerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        document.exitFullscreen(); // Exit full-screen mode
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="bg-white text-center text-[#1A4044] px-4 py-8">
      <h1 className="text-lg font-light">Some fun? Try our</h1>
      <h1 className="text-4xl font-semibold">
        <span className="hidden md:inline">3D <br /> Configurator</span>
      </h1>
      <h1 className="text-lg font-bold pb-5">
        <span className="md:hidden">3D Configurator</span>
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        <div className="w-full md:w-64 p-4 h-[460px] max-sm:h-[150px] max-sm:max-h-[200px] overflow-y-auto bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Example Models</h2>
          {/* Placeholder for example models */}
        </div>
        {/* 3D Viewer Section */}
        <div
          ref={viewerRef}
          className="relative w-full md:w-[600px] h-[400px] md:h-[500px] bg-gray-100 rounded-lg shadow-lg"
        >
          {/* Full Screen Button (SVG) */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-2 right-2 p-2 cursor-pointer "
            aria-label="Toggle Full Screen"
          >
            {/* SVG Icon */}
            <svg fill="#1A4044" viewBox="0 0 2020 2020" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
              <path d="M1146.616-.012V232.38h376.821L232.391 1523.309v-376.705H0V1920h773.629v-232.39H396.69L1687.737 396.68V773.5h232.275V-.011z" fillRule="evenodd"></path>
            </svg>
          </button>

          {/* Lighting Controls */}
          <LightingControls
            ambientLightIntensity={ambientLightIntensity}
            setAmbientLightIntensity={setAmbientLightIntensity}
            directionalLightIntensity={directionalLightIntensity}
            setDirectionalLightIntensity={setDirectionalLightIntensity}
          />
          {/* Render 3D canvas with model */}
          <Canvas camera={{ position: [3, 2, 6], fov: 50 }}>
            <ambientLight intensity={ambientLightIntensity} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={directionalLightIntensity}
            />
            <primitive object={scene} />
            <OrbitControls />
          </Canvas>
        </div>

        {/* Customization Panel */}
        <CustomizationPanel
          customizableParts={customizableParts}
          selectedPart={selectedPart}
          handlePartSelect={handlePartSelect}
          handleMaterialSelect={handleMaterialSelect}
        />
      </div>
    </div>
  );
};

export default GLBViewer;