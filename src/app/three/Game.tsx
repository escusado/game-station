import React, { Suspense, useEffect } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stage } from "@react-three/drei";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import Level from "./Level";
import { Participant } from "livekit-client";

extend({ UnrealBloomPass });

export const FROG_GAME_ROOM_NAME = "FROG_GAME_ROOM";

export type PlayerInput = {
  identity: string;
  inputs: {
    accelerometerStatus: { x: number; y: number; z: number };
    gyroStatus: { alpha: number; beta: number; gamma: number };
  };
};
export const emptyPlayerInput: PlayerInput = {
  identity: "",
  inputs: {
    accelerometerStatus: { x: 0, y: 0, z: 0 },
    gyroStatus: { alpha: 0, beta: 0, gamma: 0 },
  },
};

type GameProps = {
  latestPlayerInput: PlayerInput;
  latestParticipant?: Participant | null;
};
const Game: React.FC<GameProps> = ({
  latestPlayerInput,
  latestParticipant,
}) => {
  useEffect(() => {
    console.log("🎮>>> ", latestPlayerInput);
  }, [latestPlayerInput]);

  useEffect(() => {
    console.log("Latest participant: ", latestParticipant?.identity);
  }, [latestParticipant]);

  return (
    <Canvas shadows style={{ height: "100%", width: "100%" }}>
      {/* isometric camera */}
      <PerspectiveCamera
        makeDefault
        position={[10, 10, 10]}
        rotation={[-Math.PI / 4, 0, 0]}
        fov={75}
      />
      <OrbitControls />
      {/* <ambientLight intensity={0.5} /> */}
      {/* <directionalLight intensity={1.5} position={[5, 10, 7.5]} castShadow /> */}
      {/* <Environment preset="sunset" /> */}
      <Suspense fallback={null}>
        <Stage
          // adjustCamera
          intensity={0.5}
          shadows="contact"
          // environment="city"
        >
          <Level />
        </Stage>
        {/* <Effects>
          <unrealBloomPass threshold={1} strength={0.5} radius={0.5} />
        </Effects> */}
      </Suspense>
    </Canvas>
  );
};

export default Game;
