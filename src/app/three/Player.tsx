import React from "react";
import { ThreeElements } from "@react-three/fiber";
import FrogModel from "../../models_build/frog";
// import useGameStore from "./useGameState";

const Player: React.FC<ThreeElements["object3D"]> = (props) => {
  return (
    <object3D {...props}>
      <FrogModel scale={[0.3, 0.3, 0.3]} />
    </object3D>
  );
};

export default Player;
