import React, { Suspense, useEffect } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import Level from "./Level";
import { Participant } from "livekit-client";
import { iGameStore, PlayerInputs } from "./useGameState";

import useGameState from "./useGameState";

extend({ UnrealBloomPass });

export const FROG_GAME_ROOM_NAME = "FROG_GAME_ROOM";

type GameProps = {
  latestPlayerInput: { id: string; inputs: PlayerInputs };
  latestParticipant?: Participant | null;
};
const Game: React.FC<GameProps> = ({
  latestPlayerInput,
  latestParticipant,
}) => {
  const addPlayer = useGameState((state: iGameStore) => state.addPlayer);
  const players = useGameState((state: iGameStore) => state.players);
  const updatePlayerInput = useGameState(
    (state: iGameStore) => state.updatePlayerInput,
  );

  useEffect(() => {
    if (!latestPlayerInput) return;
    updatePlayerInput(latestPlayerInput.id, latestPlayerInput.inputs);
  }, [latestPlayerInput, updatePlayerInput]);

  useEffect(() => {
    if (!latestParticipant) return;
    addPlayer({
      id: latestParticipant?.identity || "",
      name: latestParticipant?.identity || "Unknown Player",
    });
  }, [addPlayer, latestParticipant]);

  return (
    <>
      <Canvas shadows style={{ height: "100%", width: "100%" }}>
        <PerspectiveCamera
          makeDefault
          position={[-6, 10, -15]}
          rotation={[-Math.PI / 4, 0, 0]}
          fov={75}
        />
        <OrbitControls />
        <ambientLight intensity={1} />
        <directionalLight intensity={1.5} position={[5, 10, 7.5]} castShadow />

        <Suspense fallback={null}>
          <Level />
        </Suspense>
      </Canvas>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          fontSize: "8px",
        }}
      >
        <pre>{JSON.stringify(players, null, 2)}</pre>
      </div>
    </>
  );
};

export default Game;
