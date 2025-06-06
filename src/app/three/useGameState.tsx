import "react";
import { create } from "zustand";
import { playerPositions } from "./Level";
const degToRad = Math.PI / 180;

// Helper function to interpolate between two angles, handling wrap-around
const lerpAngle = (from: number, to: number, factor: number): number => {
  const diff = ((to - from + Math.PI) % (2 * Math.PI)) - Math.PI;
  return from + diff * factor;
};

// Helper function to interpolate rotation vectors smoothly
const lerpRotation = (
  from: [number, number, number],
  to: [number, number, number],
  factor: number,
): [number, number, number] => {
  return [
    lerpAngle(from[0], to[0], factor),
    lerpAngle(from[1], to[1], factor),
    lerpAngle(from[2], to[2], factor),
  ];
};

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
  targetRotation?: [number, number, number];
  inputs: PlayerInputs;
};

export interface iGameStore {
  players: Player[];
  roadLength: number;
  roadCount: number;
  addPlayer: (player: { id: string; name: string }) => void;
  updatePlayerInput: (playerId: string, inputs: PlayerInputs) => void;
}

const useGameStore = create<iGameStore>((set) => ({
  players: [],
  roadLength: 8,
  roadCount: 10,
  addPlayer: (player: { id: string; name: string }) =>
    set((store) => {
      const existingPlayer = store.players.find((p) => p.id === player.id);
      if (existingPlayer) {
        return {
          players: store.players.map((p) =>
            p.id === player.id
              ? {
                  ...p,
                  name: player.name,
                  score: p.score + 1,
                  position: playerPositions[store.players.length + 1],
                }
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
            targetRotation: [0, 0, 0],
            inputs: emptyPlayerInputs,
          },
        ],
      };
    }),
  updatePlayerInput: (playerId: string, inputs: PlayerInputs) => {
    set((store) => ({
      players: store.players.map((p) => {
        if (p.id === playerId) {
          const targetRotation: [number, number, number] = [
            inputs.gyroStatus.beta * degToRad,
            inputs.gyroStatus.alpha * degToRad,
            inputs.gyroStatus.gamma * degToRad,
          ];
          const currentRotation = p.rotation || [0, 0, 0];
          const lerpFactor = 0.8;
          const newRotation = lerpRotation(
            currentRotation,
            targetRotation,
            lerpFactor,
          );

          return {
            ...p,
            inputs,
            rotation: newRotation,
            targetRotation,
          };
        }
        return p;
      }),
    }));
  },
}));

export default useGameStore;
