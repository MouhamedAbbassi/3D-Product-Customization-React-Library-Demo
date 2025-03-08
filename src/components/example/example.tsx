import React from "react";
import "../../index.css"
interface ExampleProps {
  className?: string;
  label: string;
  onClick: () => void;
}
 const Example: React.FC<ExampleProps> = ({ className="text-center text-green-600 m-52",label, onClick }) => {
  return <div className={className} onClick={onClick} >Hello from 3D Configurator React Library !<br/> {label}</div>;
};

export default Example;
