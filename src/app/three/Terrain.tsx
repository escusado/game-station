import React from "react";
import { Plane } from "@react-three/drei";

type TerrainProps = {
  position?: [number, number, number];
};

const Terrain: React.FC<TerrainProps> = ({ position = [0, 0, 0] }) => {
  return (
    <Plane
      position={position}
      args={[10, 10]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <meshStandardMaterial attach="material" color="green" />
    </Plane>
  );
};

export default Terrain;
