import React, { useState } from "react";
import * as THREE from "three"; // Import Three.js for handling materials

// Define the expected props for the CustomizationPanel component
interface CustomizationPanelProps {
  customizableParts: Record<string, THREE.Material[]>; // List of parts and their available materials
  handlePartSelect: (part: string) => void; // Function to handle part selection
  handleMaterialSelect: (material: THREE.Material) => void; // Function to handle material selection
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  customizableParts,
  handlePartSelect,
  handleMaterialSelect,
}) => {
  const [expandedPart, setExpandedPart] = useState<string | null>(null); // Track expanded part

  // Function to toggle the expansion of a part
  const togglePart = (part: string) => {
    if (expandedPart === part) {
      setExpandedPart(null); // Collapse the part if it's already expanded
      handlePartSelect(""); // Reset selected part
    } else {
      setExpandedPart(part); // Expand the part
      handlePartSelect(part); // Set selected part
    }
  };

  return (
    <div className="w-72 max-lg:w-full h-[460px] max-lg:h-[250px] p-4 bg-white rounded-lg shadow-sm max-h-[460px] overflow-y-auto">
      <div>
        <h3 className="flex justify-start font-extrabold">Model parts:</h3>
        <div className="flex flex-col gap-2 mt-2">
          {/* Iterate through each part */}
          {Object.keys(customizableParts).map((part, index) => (
            <div key={index} className="flex flex-col gap-2">
              {/* Button to toggle the part */}
              <button
                onClick={() => togglePart(part)} // Toggle part on click
                className={`flex items-center justify-between font-bold text-[#1A4044]  w-fit px-4 py-2 my-2 rounded-lg text-left cursor-pointer transition ${ 
                  expandedPart === part
                    ? "bg-[#bfcccd] hover:bg-gray-100 scale-110"
                    : "bg-[#f1f1f1] hover:bg-[#bfcccd] hover:scale-110"
                }`}
              >
                {part || `Part ${index + 1}`} {/* Display part name */}
                <span
                  className={`ml-2 transition-transform duration-500 transform origin-bottom ${
                    expandedPart === part ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ⮭ {/* Arrow to indicate expand/collapse */}
                </span>
              </button>

              {/* Show materials only when part is expanded */}
              {expandedPart === part && (
                <div className="flex flex-wrap gap-2 mt-2 pl-4">
                  {/* Buttons for each material */}
                  {customizableParts[part].map((material, matIndex) => (
                    <button
                      key={matIndex}
                      onClick={() => handleMaterialSelect(material)} // Handle material selection
                      className="w-10 h-10 rounded-b-full rounded-r-full border-l-2 cursor-pointer hover:scale-105"
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
  );
};

export default CustomizationPanel;
