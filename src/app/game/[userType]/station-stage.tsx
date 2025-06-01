import { RoomContext } from "@livekit/components-react";
import { Participant, TextStreamReader } from "livekit-client";
import { FC, useContext, useEffect } from "react";

type StationStageProps = {
  className?: string;
};

const StationStage: FC<StationStageProps> = ({ className }) => {
  const context = useContext(RoomContext);

  useEffect(() => {
    if (context) {
      context.on("participantConnected", (participant: Participant) => {
        console.log(`Participant connected: ${participant.identity}`);
      });

      context.registerTextStreamHandler(
        "game",
        (reader: TextStreamReader, participantInfo: { identity: string }) => {
          console.log(`Text stream from ${participantInfo.identity}:`);
          reader.readAll().then((message) => {
            console.log("🧀>>> ", message);
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

  return <div className={`${className} bg-red-200`}>StationStage</div>;
};

export default StationStage;
