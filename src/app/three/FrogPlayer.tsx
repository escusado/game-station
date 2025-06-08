import React, { useEffect } from "react";
import { ThreeElements } from "@react-three/fiber";
import FrogModel from "../../models_build/frog";
import { Player } from "./Game";
import { RigidBody } from "@react-three/rapier";

type PlayerProps = ThreeElements["object3D"] & {
  player: Player;
};

const FrogPlayer: React.FC<PlayerProps> = ({
  position,
  player: { id, inputs },
}) => {
  // const [currentPosition, setCurrentPosition] = useState(position);
  // const colliderRef = useRef<typeof RigidBody>(null);

  useEffect(() => {
    console.log(`Player ${id} initialized at position`, position);
  }, [position]);

  useEffect(() => {
    if (inputs) {
      console.log("🧀>>> inputs", inputs);
    }
  }, [inputs]);

  return (
    <object3D position={position}>
      {/* <DirectionModel
        rotation={[
          0,
          Array.isArray(props.rotation) ? props.rotation[1] ?? 0 : 0,
          0,
        ]}
      /> */}
      <RigidBody colliders={"hull"} type="kinematicPosition" gravityScale={0}>
        <FrogModel scale={[0.3, 0.3, 0.3]} rotation={[0, Math.PI, 0]} />
      </RigidBody>
    </object3D>
  );
};

export default FrogPlayer;
