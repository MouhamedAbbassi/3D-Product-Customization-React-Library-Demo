import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Define interface for component props
interface GLBViewerProps {
  glbUrl: string;
}

 const GLBViewer: React.FC<GLBViewerProps> = ({ glbUrl }) => {
  // Load the GLB model from the provided URL
  const { scene } = useGLTF(glbUrl);

  // State to store customizable parts of the model
  const [customizableParts, setCustomizableParts] = useState<
    Record<string, THREE.Material[]>
  >({});

  // State to track the selected part of the model
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  // State to track the selected material
  const [selectedMaterial, setSelectedMaterial] =
    useState<THREE.Material | null>(null);
    console.log(selectedMaterial);
  // Effect to extract customizable parts from the model on load
  useEffect(() => {
    const parts: Record<string, THREE.Material[]> = {};
    scene.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        
        const mesh = object as THREE.Mesh;
        const material = mesh.material;
        console.log(`Mesh: ${mesh.name}`, mesh.material); // Debugging Log

        // Initialize array for the part if not already created
        if (!parts[mesh.name]) {
          parts[mesh.name] = [];
        }

        // Handle multiple materials
        if (Array.isArray(material)) {
          material.forEach((mat) => {
            if (!parts[mesh.name].includes(mat)) parts[mesh.name].push(mat);
          });
        } else {
          if (!parts[mesh.name].includes(material))
            parts[mesh.name].push(material);
        }
      }
    });
    console.log("Customizable Parts:", parts); // Debugging Log

    // Update state with extracted parts
    setCustomizableParts(parts);
  }, [scene]);

  // Function to handle selecting a model part
  const handlePartSelect = (part: string) => {
    setSelectedPart(part);
    setSelectedMaterial(null);
  };

  // Function to handle selecting a material for the chosen part
  const handleMaterialSelect = (material: THREE.Material) => {
    if (selectedPart) {
      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh && object.name === selectedPart) {
          (object as THREE.Mesh).material = material;
        }
      });
      setSelectedMaterial(material);
    }
  };

  return (
    <div className="bg-white text-center px-4 py-8">
      {/* Header Section */}
      <h1 className="text-lg font-light">Some fun? Try our</h1>
      <h1 className="text-4xl font-bold pb-5">
        3D <br />
        Configurator
      </h1>

      {/* Main Layout Wrapper */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        {/* Example Models Section (Placeholder) */}
        <div className="w-full md:w-64 p-4 h-[460px] bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-3">Example Models</h2>
        </div>

        {/* 3D Viewer Canvas */}
        <div className="w-full md:w-[600px] h-[400px] md:h-[500px] bg-gray-100 rounded-lg shadow-lg">
          <Canvas camera={{ position: [3, 3, 5], fov: 45 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <primitive object={scene} />
            <OrbitControls />
          </Canvas>
        </div>

        {/* Customization Panel */}
        <div className="w-full md:w-64 h-[460px] p-4 bg-white rounded-lg shadow-lg max-h-[460px] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">Customize Model</h2>

          {/* Select Model Part */}
          <div>
            <h3 className="font-medium">Parts:</h3>
            <div className="flex flex-col gap-2 mt-2">
              {Object.keys(customizableParts).map((part, index) => (
                <div key={index} className="flex flex-col gap-1">
                  {/* Part Selection Button */}
                  <button
                    onClick={() => handlePartSelect(part)}
                    className={`px-4 py-2 rounded-lg text-left transition ${
                      selectedPart === part
                        ? "bg-gray-400"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {part || `Part ${index + 1}`}
                  </button>

                  {/* Show Materials Only for the Selected Part */}
                  {selectedPart === part && (
                    <div className="flex flex-wrap gap-2 mt-2 pl-4">
                      {customizableParts[part].map((material, matIndex) => (
                        <button
                          key={matIndex}
                          onClick={() => handleMaterialSelect(material)}
                          className="w-10 h-10 rounded-full border-2"
                          style={{
                            backgroundColor: (
                              material as THREE.MeshStandardMaterial
                            ).color.getStyle(),
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GLBViewer;