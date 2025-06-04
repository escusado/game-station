import { ThreeElements } from "@react-three/fiber";
import { FC } from "react";
import RoadModel from "../../models_build/roadstraight";

const RoadTile: FC<ThreeElements["object3D"]> = (props) => {
  return (
    <object3D {...props}>
      <RoadModel />
    </object3D>
  );
};

export default RoadTile;
