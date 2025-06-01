import Game, { emptyPlayerInput, PlayerInput } from "@/app/three/Game";
import { RoomContext } from "@livekit/components-react";
import { Participant, TextStreamReader } from "livekit-client";
import { FC, useContext, useEffect, useState } from "react";

type StationStageProps = {
  className?: string;
};

const StationStage: FC<StationStageProps> = ({ className }) => {
  const context = useContext(RoomContext);
  const [latestParticipant, setLatestParticipant] =
    useState<Participant | null>(null);
  const [latestPlayerInput, setLatestPlayerInput] =
    useState<PlayerInput>(emptyPlayerInput);

  useEffect(() => {
    if (context) {
      context.on("participantConnected", (participant: Participant) => {
        console.log(`Participant connected: ${participant.identity}`);
        setLatestParticipant(participant);
      });

      context.registerTextStreamHandler(
        "game",
        (reader: TextStreamReader, participantInfo: { identity: string }) => {
          console.log(`Text stream from ${participantInfo.identity}:`);
          reader.readAll().then((message) => {
            setLatestPlayerInput({
              identity: participantInfo.identity,
              inputs: JSON.parse(message),
            });
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
    <div className={`${className} bg-red-200`}>
      <Game
        latestParticipant={latestParticipant}
        latestPlayerInput={latestPlayerInput}
      />
    </div>
  );
};

export default StationStage;
