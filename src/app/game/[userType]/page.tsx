"use client";

import { ConnectionState, RoomContext } from "@livekit/components-react";
import { Room } from "livekit-client";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams, useSearchParams } from "next/navigation";
import PlayerStage from "./PlayerStage";
import StationStage from "./StationStage";
import { FROG_GAME_ROOM_NAME } from "@/app/three/Game";

// let baseUrl = window.location.origin;
const baseUrl = `https://192.168.1.158:8080/`;
const playerPathTemplate = "game/player?roomName={ROOM_NAME}";

export default function Page() {
  const { userType } = useParams();
  const [token, setToken] = useState("");
  const [joinUrl, setJoinUrl] = useState("");
  const userName = `${userType}-user-${uuidv4()}`;
  const [roomInstance] = useState(() => new Room());

  // players ask for specific rooms if not we assume station and generate a new room name
  const roomNameFromUrl = useSearchParams().get("roomName");
  const roomName = roomNameFromUrl ?? `${FROG_GAME_ROOM_NAME}-${uuidv4()}`;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch(
          `/api/token?room=${roomName}&username=${userName}`,
        );
        const data = await resp.json();
        if (!mounted) return;
        if (data.token) {
          await roomInstance.connect(
            "wss://botica-xx5oh8p6.livekit.cloud",
            data.token,
          );

          setJoinUrl(
            baseUrl +
              playerPathTemplate.replace("{ROOM_NAME}", roomInstance.name),
          );
          setToken(data.token);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      mounted = false;
      roomInstance.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomInstance]);

  if (token === "") {
    return <div>Getting token...</div>;
  }

  if (userType !== "player" && userType !== "station") {
    return <div>Invalid user type: {userType}</div>;
  }

  return (
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" style={{ height: "100dvh" }}>
        {userType === "player" ? (
          <PlayerStage />
        ) : (
          <StationStage joinUrl={joinUrl} />
        )}
        <ConnectionState />
      </div>
    </RoomContext.Provider>
  );
}
