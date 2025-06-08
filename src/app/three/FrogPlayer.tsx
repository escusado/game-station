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
  const directionModelRef = useRef<ThreeElements["object3D"]>(null);

  useFrame(() => {
    const player: Player = usePlayersStore.getState().players[playerIndex];
    if (!player.inputs) return;
    const {
      gyroStatus: { alpha },
    } = player.inputs || emptyPlayerInputs;

    if (directionModelRef.current && directionModelRef.current!.rotation) {
      (directionModelRef.current.rotation as THREE.Euler).y = degToRad(alpha);
    }
  });

  return (
    <group position={position}>
      <DurectionModel ref={directionModelRef} rotation={[0, 0, 0]} />
      <FrogModel scale={[0.3, 0.3, 0.3]} rotation={[0, Math.PI, 0]} />
    </group>
  );
};

export default FrogPlayer;
