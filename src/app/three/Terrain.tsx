import React from "react";
import { Plane } from "@react-three/drei";
import Road from "./Road";

type TerrainProps = {
  position?: [number, number, number];
};

export enum TerrainElements {
  ROAD_STRAIGHT = "road-straight",
}

export const TerrainElementPaths = {
  [TerrainElements.ROAD_STRAIGHT]: "/obj/road-straight.glb",
};

const Terrain: React.FC<TerrainProps> = ({ position = [0, 0, 0] }) => {
  return (
    <object3D>
      <Plane
        position={position}
        args={[10, 11]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial attach="material" color="green" />
      </Plane>
      <object3D position={[-4.5, 0, -3.25]}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Road
            key={`road-${index}`}
            position={[0, 0, index * 2.2]} // Adjust the position for each segment
          />
        ))}
      </object3D>
    </object3D>
  );
};

export default Terrain;
