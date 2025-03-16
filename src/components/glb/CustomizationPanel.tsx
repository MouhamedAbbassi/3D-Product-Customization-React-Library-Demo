import React from "react";
import * as THREE from "three"; // Import Three.js for handling materials

// Interface for CustomizationPanel component props
interface CustomizationPanelProps {
  customizableParts: Record<string, THREE.Material[]>; // Parts with their materials
  selectedPart: string | null; // Currently selected part
  handlePartSelect: (part: string) => void; // Function to handle part selection
  handleMaterialSelect: (material: THREE.Material) => void; // Function to handle material selection
}

// CustomizationPanel component for selecting model parts and materials
const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  customizableParts,
  selectedPart,
  handlePartSelect,
  handleMaterialSelect,
}) => {
  return (
    <div className="w-full md:w-64 h-[460px] max-sm:h-[250px] p-4 bg-white rounded-lg shadow-sm max-h-[460px] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-3">Customize Model</h2>
      <div>
        <h3 className="font-medium">Parts:</h3>
        <div className="flex flex-col gap-2 mt-2">
          {Object.keys(customizableParts).map((part, index) => (
            <div key={index} className="flex flex-col gap-1">
              {/* Button for selecting a part */}
              <button
                onClick={() => handlePartSelect(part)}
                className={`px-4 py-2 rounded-lg text-left transition ${
                  selectedPart === part ? "bg-[#1A4044] text-white" : "bg-gray-200 hover:bg-[#567275]"
                }`}
              >
                {part || `Part ${index + 1}`}
              </button>
              {selectedPart === part && (
                <div className="flex flex-wrap gap-2 mt-2 pl-4">
                  {/* Buttons for selecting materials */}
                  {customizableParts[part].map((material, matIndex) => (
                    <button
                      key={matIndex}
                      onClick={() => handleMaterialSelect(material)}
                      className="w-10 h-10 rounded-full border-2"
                      style={{
                        backgroundColor: (material as THREE.MeshStandardMaterial).color.getStyle(),
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
  );
};

export default CustomizationPanel;