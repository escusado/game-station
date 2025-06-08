import Game, { Player } from "@/app/three/Game";

import { RoomContext } from "@livekit/components-react";
import { Participant, TextStreamReader } from "livekit-client";
import { createContext, FC, useContext, useEffect, useState } from "react";
import JoinQrCode from "@/app/components/JoinQrCode";

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

export const PlayersContext = createContext<Player[]>([]);

const StationStage: FC<{ joinUrl: string }> = ({ joinUrl }) => {
  const context = useContext(RoomContext);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (context) {
      context.registerTextStreamHandler(
        "game",
        async (
          reader: TextStreamReader,
          participantInfo: Partial<Participant>,
        ) => {
          await reader.readAll().then((message) => {
            try {
              if (message) {
                const inputMessage = JSON.parse(message);

                setPlayers((prevPlayers) => {
                  const existingPlayerIndex = prevPlayers.findIndex(
                    (p) => p.id === participantInfo.identity,
                  );

                  if (existingPlayerIndex !== -1) {
                    // Update existing player
                    const updatedPlayers = [...prevPlayers];
                    updatedPlayers[existingPlayerIndex] = {
                      ...updatedPlayers[existingPlayerIndex],
                      inputs: inputMessage,
                    };
                    return updatedPlayers;
                  } else {
                    // Add new player
                    return [
                      ...prevPlayers,
                      {
                        id: participantInfo.identity || "",
                        inputs: inputMessage,
                      },
                    ];
                  }
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
          setPlayers((prevPlayers) =>
            prevPlayers.filter((p) => p.id !== participant.identity),
          );
        });
        context.unregisterTextStreamHandler("game");
      };
    }
  }, [context]);

  return (
    <PlayersContext.Provider value={players}>
      <style>{style}</style>
      <div className={"station-main-container"}>
        <JoinQrCode url={joinUrl} />
        <Game players={players} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          fontSize: "8px",
        }}
      >
        <pre>{JSON.stringify(players, null, 2)}</pre>
      </div>
    </PlayersContext.Provider>
  );
};

export default StationStage;
