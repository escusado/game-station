import { type FC } from "react";
import Player from "./Player";
import Terrain from "./Terrain";
import useGameState, { iGameStore } from "./useGameState";
import Road from "./Road";

type LevelProps = {
  className?: string;
};

export const playerPositions: [number, number, number][] = [
  [-4, 0, 4.5],
  [4, 0, -6],
  [4, 0, -8],
  [4, 0, -20],
];

export const playerColors = ["red", "blue", "yellow", "purple"];

const Level: FC<LevelProps> = () => {
  const players = useGameState((state: iGameStore) => state.players);
  const roadLength = useGameState((state: iGameStore) => state.roadLength);
  const roadCount = useGameState((state: iGameStore) => state.roadCount);
  // road padding (+2) to allow time for the player to see the cars
  const stageSize = roadLength + 2;
  return (
    <object3D>
      <Terrain stageSize={stageSize} roadCount={roadCount} />
      <object3D position={[-(stageSize / 2 - 1), 0, -roadCount]}>
        {players.map((player, index) => (
          <Player
            key={player.id}
            position={[index * 2, 0, 0]}
            rotation={player.rotation}
          />
        ))}
      </object3D>

      <object3D position={[-stageSize / 2, 0, -((roadCount * 2 - 1) / 2)]}>
        {Array.from({ length: roadCount }).map((_, index) => (
          <Road
            key={"road-" + index}
            stageSize={stageSize}
            position={[0, 0, index * 2 + 0.5]}
          />
        ))}
      </object3D>
    </object3D>
  );
};

export default Level;
