import Game from "@/app/three/Game";
import { emptyPlayerInputs, PlayerInputs } from "@/app/three/useGameState";

import { RoomContext } from "@livekit/components-react";
import { Participant, TextStreamReader } from "livekit-client";
import { FC, useContext, useEffect, useState } from "react";

const style = /* css */ `
        .station-main-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
`;

const StationStage: FC = () => {
  const context = useContext(RoomContext);
  const [latestParticipant, setLatestParticipant] =
    useState<Participant | null>(null);
  const [latestPlayerInput, setLatestPlayerInput] = useState<{
    id: string;
    inputs: PlayerInputs;
  }>({ id: "", inputs: emptyPlayerInputs });

  useEffect(() => {
    if (context) {
      context.registerTextStreamHandler(
        "game",
        (reader: TextStreamReader, participantInfo: Partial<Participant>) => {
          console.log(`Text stream from ${participantInfo.identity}:`);
          reader.readAll().then((message) => {
            try {
              if (message) {
                setLatestParticipant(participantInfo as Participant);
                setLatestPlayerInput({
                  id: participantInfo.identity || "",
                  inputs: JSON.parse(message),
                });
              }
            } catch (error) {
              console.error("Error parsing message:", error);
            }
          });
        },
      );

      return () => {
        context.off("participantConnected", (participant: Participant) => {
          console.log(`Participant disconnected: ${participant.identity}`);
        });
        context.unregisterTextStreamHandler("game");
      };
    }
  }, [context]);

  return (
    <>
      <style>{style}</style>
      <div className={"station-main-container"}>
        <Game
          latestParticipant={latestParticipant}
          latestPlayerInput={latestPlayerInput}
        />
      </div>
    </>
  );
};

export default StationStage;
