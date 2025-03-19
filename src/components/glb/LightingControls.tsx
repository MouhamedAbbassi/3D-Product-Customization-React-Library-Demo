// Import necessary React libraries
import React from "react";

// Interface for LightingControls component props
interface LightingControlsProps {
  ambientLightIntensity: number; // Intensity of ambient light
  setAmbientLightIntensity: (value: number) => void; // Function to update ambient light intensity
  directionalLightIntensity: number; // Intensity of directional light
  setDirectionalLightIntensity: (value: number) => void; // Function to update directional light intensity
}

// LightingControls component to adjust light intensities
const LightingControls: React.FC<LightingControlsProps> = ({
  ambientLightIntensity,
  setAmbientLightIntensity,
  directionalLightIntensity,
  setDirectionalLightIntensity,
}) => {
  return (
    <div>
      {/* Lighting control sliders */}
      <div className="flex flex-row justify-center gap-32 mt-4 max-sm:gap-2 max-sm:mt-8 ">
        <div className="flex flex-col">
          <label className="font-light text-[#1A4044] mb-1">
            Ambient Light: {ambientLightIntensity}
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={ambientLightIntensity}
            defaultValue={1}
            onChange={(e) =>
              setAmbientLightIntensity(parseFloat(e.target.value))
            }
            className="h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-light text-[#1A4044] mb-1">
            Directional Light: {directionalLightIntensity}
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={directionalLightIntensity}
            defaultValue={1}
            onChange={(e) =>
              setDirectionalLightIntensity(parseFloat(e.target.value))
            }
            className="h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer "
          />
        </div>
      </div>
    </div>
  );
};

export default LightingControls;
