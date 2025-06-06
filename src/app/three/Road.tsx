import { FC } from "react";

import { ThreeElements } from "@react-three/fiber";
import RoadTile from "./RoadTile";
import RoadHazards from "./RoadHazards";

const Road: FC<ThreeElements["object3D"] & { stageSize: number }> = (props) => {
  return (
    <>
      <object3D {...props}>
        {Array.from({ length: props.stageSize }).map((_, index) => (
          <RoadTile key={"road-tile-" + index} position={[index + 0.5, 0, 0]} />
        ))}
        <RoadHazards />
      </object3D>
    </>
  );
};

export default Road;
