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
      <div>
        <h3 className="flex justify-start font-extrabold">Parts:</h3>
        <div className="flex flex-col gap-2 mt-2">
          {Object.keys(customizableParts).map((part, index) => (
            <div key={index} className="flex flex-col gap-2">
              {/* Button for selecting a part */}
              <button
                onClick={() => handlePartSelect(part)}
                className={` font-bold text-[#1A4044] bg-gray-50 w-fit px-4 py-2 my-2 rounded-lg text-left transition ${
                  selectedPart === part ? "bg-gray-100 hover:bg-[#bfcccd]" : " hover:bg-[#bfcccd]"
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
                      className="w-10 h-10 rounded-b-full rounded-r-full border-l-2"
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