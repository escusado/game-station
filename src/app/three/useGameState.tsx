import "react";
import { create } from "zustand";

export type PlayerInputs = {
  accelerometerStatus: { x: number; y: number; z: number };
  gyroStatus: { alpha: number; beta: number; gamma: number };
};

export const emptyPlayerInputs: PlayerInputs = {
  accelerometerStatus: { x: 0, y: 0, z: 0 },
  gyroStatus: { alpha: 0, beta: 0, gamma: 0 },
};

type Player = {
  id: string;
  name: string;
  score: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  inputs: PlayerInputs;
};

export interface iGameStore {
  players: Player[];
  addPlayer: (player: { id: string; name: string }) => void;
  updatePlayerInput: (playerId: string, inputs: PlayerInputs) => void;
}

const useGameStore = create<iGameStore>((set) => ({
  players: [],
  addPlayer: (player: { id: string; name: string }) =>
    set((store) => {
      const existingPlayer = store.players.find((p) => p.id === player.id);
      if (existingPlayer) {
        return {
          players: store.players.map((p) =>
            p.id === player.id
              ? { ...p, name: player.name, score: p.score + 1 }
              : p,
          ),
        };
      }
      return {
        players: [
          ...store.players,
          {
            id: player.id,
            name: player.name,
            score: 0,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            inputs: emptyPlayerInputs,
          },
        ],
      };
    }),
  updatePlayerInput: (playerId: string, inputs: PlayerInputs) => {
    // Solve rotation based on inputs from a gyroscope or similar device:
    // inputs.gyroStatus.alpha (Device Z-axis rotation, typically Yaw, range [0, 360) degrees)
    // inputs.gyroStatus.beta  (Device X-axis rotation, typically Pitch, range [-180, 180) degrees)
    // inputs.gyroStatus.gamma (Device Y-axis rotation, typically Roll, range [-90, 90) degrees)

    // Convert degrees to radians
    const degToRad = Math.PI / 180;

    const alphaRad = inputs.gyroStatus.alpha * degToRad;
    const betaRad = inputs.gyroStatus.beta * degToRad;
    const gammaRad = inputs.gyroStatus.gamma * degToRad;

    // Map device orientation Euler angles to THREE.js Euler angles.
    // THREE.js Object3D.rotation defaults to 'XYZ' Euler order.
    // This is a common mapping:
    // - Device Beta (pitch around device X-axis) maps to THREE.js X-axis rotation.
    // - Device Alpha (yaw around device Z-axis) maps to THREE.js Y-axis rotation.
    // - Device Gamma (roll around device Y-axis) maps to THREE.js Z-axis rotation.
    //
    // Note: The exact mapping (axes and signs) can depend on:
    // 1. The device's coordinate system and how alpha, beta, gamma are defined.
    // 2. The desired orientation and coordinate system in your THREE.js scene.
    // You might need to experiment and adjust the axes or negate some values.
    // For example, gammaRad might need to be -gammaRad if the device's Y-axis roll
    // is opposite to THREE.js's Z-axis roll convention.
    const rotation = [
      betaRad, // X rotation in THREE.js (Pitch)
      alphaRad, // Y rotation in THREE.js (Yaw)
      gammaRad, // Z rotation in THREE.js (Roll)
    ] as [number, number, number];
    set((store) => ({
      players: store.players.map((p) =>
        p.id === playerId ? { ...p, inputs, rotation } : p,
      ),
    }));
  },
}));

export default useGameStore;
