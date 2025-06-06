import React from "react";
import { ThreeElements } from "@react-three/fiber";
import FrogModel from "../../models_build/frog";
import DirectionModel from "../../models_build/direction";

const Player: React.FC<ThreeElements["object3D"]> = (props) => {
  return (
    <object3D position={props.position}>
      <DirectionModel
        rotation={[
          0,
          Array.isArray(props.rotation) ? props.rotation[1] ?? 0 : 0,
          0,
        ]}
      />
      <FrogModel scale={[0.3, 0.3, 0.3]} rotation={[0, Math.PI, 0]} />
    </object3D>
  );
};

export default Player;
