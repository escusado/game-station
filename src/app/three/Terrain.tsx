import React from "react";
import { Plane } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";

type TerrainProps = ThreeElements["object3D"] & {
  stageSize: number;
  roadCount: number;
};

const Terrain: React.FC<TerrainProps> = ({ stageSize, roadCount }) => {
  return (
    <object3D position={[0, -0.1, 0]}>
      <Plane
        // roads are the length of the stage, and the stage adjusts to
        // accomodate all rows, space between them (*2) and padding for staring
        // and finish line (+2)
        args={[stageSize, roadCount * 2 + 2]}
        // flip stage to be horizontal
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial attach="material" color="green" />
      </Plane>
    </object3D>
  );
};

export default Terrain;
