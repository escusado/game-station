"use client";

import { ConnectionState, RoomContext } from "@livekit/components-react";
import { Room } from "livekit-client";
import "@livekit/components-styles";
import { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { useParams } from "next/navigation";
import { FROG_GAME_ROOM_NAME } from "@/app/three/Game";
import PlayerStage from "./PlayerStage";
import StationStage from "./StationStage";

// import dynamic from "next/dynamic";

// const PlayerStage = dynamic(() => import("./PlayerStage"), { ssr: false });
// const StationStage = dynamic(() => import("./StationStage"), { ssr: false });

export default function Page() {
  const { userType } = useParams();
  const [token, setToken] = useState("");
  const room = FROG_GAME_ROOM_NAME;
  const name = `${userType}-user-${uuidv4()}`;
  const [roomInstance] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      }),
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch(`/api/token?room=${room}&username=${name}`);
        const data = await resp.json();
        if (!mounted) return;
        if (data.token) {
          await roomInstance.connect(
            "wss://botica-xx5oh8p6.livekit.cloud",
            data.token,
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
        {userType === "player" ? <PlayerStage /> : <StationStage />}
        <ConnectionState />
      </div>
    </RoomContext.Provider>
  );
}
