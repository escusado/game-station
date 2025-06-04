import React from "react";
import { ThreeElements } from "@react-three/fiber";
import FrogModel from "../../models_build/frog";

const Player: React.FC<ThreeElements["object3D"]> = (props) => {
  return (
    <object3D {...props}>
      <FrogModel scale={[0.3, 0.3, 0.3]} rotation={[0, Math.PI, 0]} />
    </object3D>
  );
};

export default Player;
