import React, { Suspense } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import Level from "./Level";

extend({ UnrealBloomPass });

export const FROG_GAME_ROOM_NAME = "FROG_GAME_ROOM";

export type PlayerInputs = {
  accelerometerStatus: { x: number; y: number; z: number };
  gyroStatus: { alpha: number; beta: number; gamma: number };
  buttons: {
    jump: "IDLE" | "PRESSED";
  };
};

export const emptyPlayerInputs: PlayerInputs = {
  accelerometerStatus: { x: 0, y: 0, z: 0 },
  gyroStatus: { alpha: 0, beta: 0, gamma: 0 },
  buttons: {
    jump: "IDLE",
  },
};

export type Player = {
  id: string;
  inputs?: PlayerInputs;
};

const Game: React.FC = () => {
  return (
    <>
      <Canvas
        shadows
        style={{ height: "100%", width: "100%" }}
        dpr={[1, 2]} // Limit pixel ratio for better performance
        performance={{ min: 0.5 }} // Enable performance regression
      >
        <PerspectiveCamera
          makeDefault
          position={[-6, 10, -15]}
          rotation={[-Math.PI / 4, 0, 0]}
          fov={75}
        />
        <OrbitControls enableDamping dampingFactor={0.05} />
        <ambientLight intensity={1} />
        <directionalLight intensity={1.5} position={[5, 10, 7.5]} castShadow />

        <Suspense fallback={null}>
          <Level />
        </Suspense>
      </Canvas>
    </>
  );
};

export default Game;
