import "react";
import { create } from "zustand";
const degToRad = Math.PI / 180;

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
    set((store) => ({
      players: store.players.map((p) =>
        p.id === playerId
          ? {
              ...p,
              inputs,
              rotation: [
                inputs.gyroStatus.alpha * degToRad,
                inputs.gyroStatus.beta * degToRad,
                inputs.gyroStatus.gamma * degToRad,
              ],
            }
          : p,
      ),
    }));
  },
}));

export default useGameStore;
