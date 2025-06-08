import { FC } from "react";
import { ThreeElements } from "@react-three/fiber";
import RoadTile from "./RoadTile";
import Traffic from "./Traffic";

const Road: FC<ThreeElements["object3D"] & { stageSize: number }> = (props) => {
  return (
    <object3D {...props}>
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.2, 0.5, 3]} />
        <meshStandardMaterial color="yellow" />
      </mesh>

      {Array.from({ length: props.stageSize }).map((_, index) => (
        <RoadTile key={"road-tile-" + index} position={[index, 0, 0]} />
      ))}

      <mesh position={[props.stageSize, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
      <Traffic />
    </object3D>
  );
};

export default Road;
