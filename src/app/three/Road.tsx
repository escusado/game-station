import { FC } from "react";
import { TerrainElementPaths, TerrainElements } from "./Terrain";
import { Gltf } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";

const Road: FC<ThreeElements["object3D"]> = (props) => {
  return (
    <object3D {...props}>
      {Array.from({ length: 10 }).map((_, index) => (
        <Gltf
          key={`road-tile-${index}`}
          position={[index, 0, 0]} // Adjust the position for each segment
          src={TerrainElementPaths[TerrainElements.ROAD_STRAIGHT]}
        />
      ))}
    </object3D>
  );
};

export default Road;
