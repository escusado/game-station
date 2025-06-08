import React, { useRef } from "react";
import { ThreeElements, useFrame } from "@react-three/fiber";
import DurectionModel from "../../models_build/direction";
import FrogModel from "../../models_build/frog";

import * as THREE from "three";
import { usePlayersStore } from "../game/[userType]/StationStage";
import { emptyPlayerInputs, Player } from "./Game";
import { degToRad } from "three/src/math/MathUtils.js";

type PlayerProps = ThreeElements["object3D"] & {
  playerIndex: number;
};

const FrogPlayer: React.FC<PlayerProps> = ({ position, playerIndex }) => {
  const playerRootRef = useRef<ThreeElements["object3D"]>(null);
  const directionModelRef = useRef<ThreeElements["object3D"]>(null);

  useFrame(() => {
    const player: Player = usePlayersStore.getState().players[playerIndex];
    if (!player.inputs) return;
    const {
      gyroStatus: { alpha },
      buttons: { jump },
    } = player.inputs || emptyPlayerInputs;

    if (
      directionModelRef.current &&
      playerRootRef.current &&
      directionModelRef.current!.rotation &&
      playerRootRef.current!.position
    ) {
      const direction = degToRad(alpha);
      (directionModelRef.current!.rotation as THREE.Euler).y = degToRad(alpha);
      if (jump === "PRESSED") {
        console.log(`Player ${player.id} jumped!`);
        (playerRootRef.current!.position as THREE.Vector3).x +=
          0.1 * Math.sin(direction);
        (playerRootRef.current!.position as THREE.Vector3).z +=
          0.1 * Math.cos(direction);
      }
    }
  });

  return (
    <group ref={playerRootRef} position={position}>
      <DurectionModel ref={directionModelRef} rotation={[0, 0, 0]} />
      <FrogModel scale={[0.3, 0.3, 0.3]} rotation={[0, Math.PI, 0]} />
    </group>
  );
};

export default FrogPlayer;
