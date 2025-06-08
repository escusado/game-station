import Game, { Player } from "@/app/three/Game";

import { RoomContext } from "@livekit/components-react";
import { Participant, TextStreamReader } from "livekit-client";
import { createContext, FC, useContext, useEffect } from "react";
import JoinQrCode from "@/app/components/JoinQrCode";
import { create } from "zustand";

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

// public singleton zustand store for players
type PlayersStore = {
  players: Player[];
  setPlayers: (newPlayers: Player[]) => void;
};

export const usePlayersStore = create<PlayersStore>((set) => ({
  players: [],
  setPlayers: (newPlayers: Player[]) => set({ players: newPlayers }),
}));

const StationStage: FC<{ joinUrl: string }> = ({ joinUrl }) => {
  const context = useContext(RoomContext);
  const players = usePlayersStore((state) => state.players);

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
              if (message && participantInfo.identity) {
                const inputMessage = JSON.parse(message);

                const playerId = participantInfo.identity;
                const { players, setPlayers } = usePlayersStore.getState();
                const existingPlayer = players.find(
                  (player) => player.id === playerId,
                );
                const newPlayer: Player = {
                  id: playerId,
                  inputs: {
                    accelerometerStatus: inputMessage.accelerometerStatus,
                    gyroStatus: inputMessage.gyroStatus,
                    buttons: inputMessage.inputStatus.buttons,
                  },
                };
                if (existingPlayer) {
                  // Update existing player
                  setPlayers(
                    players.map((player) =>
                      player.id === playerId ? newPlayer : player,
                    ),
                  );
                } else {
                  // Add new player
                  setPlayers([...players, newPlayer]);
                }
              }
            } catch (error) {
              console.error("Error parsing message:", error);
            }
          });
        },
      );

      const handleParticipantDisconnected = (participant: Participant) => {
        console.log(`Participant disconnected: ${participant.identity}`);
        usePlayersStore
          .getState()
          .setPlayers(
            usePlayersStore
              .getState()
              .players.filter((player) => player.id !== participant.identity),
          );
      };

      context.on("participantDisconnected", handleParticipantDisconnected);

      return () => {
        context.off("participantDisconnected", handleParticipantDisconnected);
        context.unregisterTextStreamHandler("game");
        // Clean up players when the context is unmounted
        usePlayersStore.getState().setPlayers([]);
      };
    }
  }, []);

  return (
    <>
      <style>{style}</style>
      <div className={"station-main-container"}>
        <JoinQrCode url={joinUrl} />
        <Game />
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
    </>
  );
};

export default StationStage;
