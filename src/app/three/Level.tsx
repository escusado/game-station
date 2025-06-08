import { useContext, type FC } from "react";
import Terrain from "./Terrain";
import Road from "./Road";
import { Physics } from "@react-three/rapier";
import { PlayersContext } from "../game/[userType]/StationStage";
import FrogPlayer from "./FrogPlayer";
import GateModel from "../../models_build/gate";

type LevelProps = {
  className?: string;
};

export const playerPositions: [number, number, number][] = [
  [-4, 0, 4.5],
  [4, 0, -6],
  [4, 0, -8],
  [4, 0, -20],
];

const roadLength = 8;
const roadCount = 9;

const Level: FC<LevelProps> = () => {
  const players = useContext(PlayersContext);

  const stageSize = roadLength + 2; // road padding (+2) to allow time for the player to see the cars
  return (
    <Physics debug>
      <Terrain stageSize={stageSize} roadCount={roadCount} />
      <object3D position={[-(stageSize / 2 - 1), 0, -roadCount]}>
        {players.map((player, index) => (
          <FrogPlayer
            key={player.id}
            player={player}
            position={[index * 2, 0, 0]}
          />
        ))}
      </object3D>

      <object3D
        position={[-stageSize / 2 + 0.5, 0, -((roadCount * 2 - 1) / 2)]}
      >
        {Array.from({ length: roadCount }).map((_, index) => (
          <Road
            key={"road-" + index}
            stageSize={stageSize}
            position={[0, 0, index * 2 + 0.5]}
          />
        ))}
      </object3D>
      <GateModel
        position={[0, 0, roadCount + 0.5]}
        rotation={[0, Math.PI, 0]}
        scale={[2.5, 2, 1]}
      />
    </Physics>
  );
};

export default Level;
