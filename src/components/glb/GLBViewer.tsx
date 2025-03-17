import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import LightingControls from "./LightingControls";
import CustomizationPanel from "./CustomizationPanel";

// Interface for component props
interface GLBViewerProps {
  glbUrl: string;
}

const GLBViewer: React.FC<GLBViewerProps> = ({ glbUrl }) => {
  const { scene } = useGLTF(glbUrl);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  // State for customizable parts and selected part
  const [customizableParts, setCustomizableParts] = useState<
    Record<string, THREE.Material[]>
  >({});
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  // State for lighting controls
  const [ambientLightIntensity, setAmbientLightIntensity] = useState<number>(2);
  const [directionalLightIntensity, setDirectionalLightIntensity] =
    useState<number>(2);

  // Fullscreen toggle state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // State to store material definitions
  const [materialDefinitions, setMaterialDefinitions] = useState<
    Record<string, any>
  >({});

  // Load material definitions from JSON file
  useEffect(() => {
    fetch("/material.data.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("Loaded material definitions:", data);
        setMaterialDefinitions(data.materials); // Set materials after fetching
      })
      .catch((error) =>
        console.error("Failed to load material definitions:", error)
      );
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
    const parts: Record<string, THREE.Material[]> = {};

    scene.traverse((object: THREE.Object3D) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        const material = mesh.material;

        // Initialize empty array for materials if not already present
        if (!parts[mesh.name]) parts[mesh.name] = [];

        // Function to add material to the part
        const addMaterial = (mat: THREE.Material) => {
          if (!parts[mesh.name].includes(mat)) parts[mesh.name].push(mat);
        };

        // Add the materials (if an array, iterate through them)
        Array.isArray(material)
          ? material.forEach(addMaterial)
          : addMaterial(material);

        // Check for material references in mesh user data
        if (mesh.userData) {
          console.log("mesh.userData", mesh.userData);
          // Iterate over all properties in userData
          Object.entries(mesh.userData).forEach(([key, materialRef]) => {
            if (key.startsWith("material") && typeof materialRef === "string") {
              // If materialDefinitions is an array, find the material by ID
              if (Array.isArray(materialDefinitions)) {
                const materialDefinition = materialDefinitions.find(
                  (material) => material.id === materialRef
                );
                // Create the material and add it to the mesh
                const extraMaterial = createMaterialFromDefinition(
                  materialDefinition.data
                );
                console.log("extraMaterial", extraMaterial);
                addMaterial(extraMaterial);
              }
            }
          });
        }
      }
    });

    setCustomizableParts(parts); // Update customizable parts after processing the model
  }, [scene, materialDefinitions]);

  // Handle selection of a part
  const handlePartSelect = (part: string) => {
    setSelectedPart(part);
  };

  // Apply selected material to the selected part
  const handleMaterialSelect = (material: THREE.Material) => {
    if (selectedPart) {
      scene.traverse((object: THREE.Object3D) => {
        if ((object as THREE.Mesh).isMesh && object.name === selectedPart) {
          (object as THREE.Mesh).material = material;
        }
      });
    }
  };

  // Toggle fullscreen mode
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
    <div className="bg-white text-center text-[#1A4044] px-4 py-8">
      <h1 className="text-lg font-light">Some fun? Try our</h1>
      <h1 className="text-4xl font-semibold mb-4">3D Configurator</h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        {/* Example Models Section */}
        <div className="w-full md:w-64 p-4 h-[460px] max-sm:h-[150px] overflow-y-auto bg-white rounded-lg shadow-sm">
          <div className="flex justify-center items-center flex-col  mb-2">
            {/* Image 1 */}
            <img
              src="/public/sofa3.png"
              alt="Example Model 1"
              className="w-36 h-32 rounded mb-2 cursor-pointer"
            />
            {/* Image 2 */}
            <img
              src="/public/sofa2.png"
              alt="Example Model 2"
              className="w-36 h-32 rounded mb-2 cursor-pointer"
            />
            {/* Image 3 */}
            <img
              src="/public/sofa1.png"
              alt="Example Model 3"
              className="w-36 h-32 rounded mb-2 cursor-pointer"
            />
          </div>
        </div>

        {/* 3D Viewer Section */}
        <div
          ref={viewerRef}
          className="relative w-full md:w-[600px] h-[500px] bg-gray-100 rounded-lg shadow-lg"
        >
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-2 right-2 p-2 cursor-pointer"
          >
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
