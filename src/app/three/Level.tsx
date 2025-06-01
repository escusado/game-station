import { useContext, useEffect, type FC } from "react";
import Player from "./Player";
import Terrain from "./Terrain";
import { RoomContext } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";

type LevelProps = {
  className?: string;
};

const playerPositions: [number, number, number][] = [
  [-4, 0.5, -4],
  [4, 0.5, -4],
  [-4, 0.5, 4],
  [4, 0.5, 4],
];

const playerColors = ["red", "blue", "yellow", "purple"];

const Level: FC<LevelProps> = () => {
  const room = useContext(RoomContext);

  return (
    <object3D>
      <Terrain position={[0, 0, 0]} />
      {playerPositions.map((pos, index) => (
        <Player
          key={index}
          position={pos}
          color={playerColors[index % playerColors.length]}
        />
      ))}
    </object3D>
  );
};

export default Level;
