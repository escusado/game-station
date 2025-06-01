import { RoomContext } from "@livekit/components-react";
import { FC, useContext, useEffect } from "react";

type PlayerStageProps = {
  className?: string;
};

const PlayerStage: FC<PlayerStageProps> = ({ className }) => {
  const context = useContext(RoomContext);

  useEffect(() => {
    if (context) {
      setInterval(async () => {
        console.log("PlayerStage is running");
        await context.localParticipant.sendText("wazzup", {
          topic: "game",
        });
      }, 1000);

      return () => {};
    }
  }, [context]);

  return <div className={`${className} bg-red-200`}>PlayerStage</div>;
};

export default PlayerStage;
