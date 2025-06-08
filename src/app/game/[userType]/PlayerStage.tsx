import PlayerMain from "@/app/components/PlayerMain";
import { RoomContext } from "@livekit/components-react";
import { FC, useContext, useEffect, useState, useRef } from "react";

const styles = /* css */ `
.player-stage {
  width: 100%;
  height: 100%;
  background-color: #EEE;
}
`;

export enum ButtonStatus {
  IDLE = "IDLE",
  PRESSED = "PRESSED",
}

export type InputStatus = {
  buttons: {
    jump: ButtonStatus;
  };
};

export const defaultButtonsStatus = {
  buttons: { jump: ButtonStatus.IDLE },
};

const PlayerStage: FC = () => {
  const room = useContext(RoomContext);

  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [accelerometerStatus, setAccelerometerStatus] = useState({});
  const [gyroStatus, setGyroStatus] = useState({});
  const [buttonStatus, setButtonStatus] = useState(
    Object.assign({}, defaultButtonsStatus),
  );

  const accelerometerStatusRef = useRef({ x: 0, y: 0, z: 0 });
  const gyroStatusRef = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const buttonStatusRef = useRef(Object.assign({}, defaultButtonsStatus));

  useEffect(() => {
    if (!room) return;

    const intervalId = setInterval(async () => {
      await room.localParticipant.sendText(
        JSON.stringify({
          accelerometerStatus: accelerometerStatusRef.current,
          gyroStatus: gyroStatusRef.current,
          inputStatus: buttonStatusRef.current,
        }),
        { topic: "game" },
      );
    }, 50);

    return () => clearInterval(intervalId);
  }, [room]);

  // make sure we send the PRESSED status
  useEffect(() => {
    if (room === undefined) return;
    (async () =>
      await room.localParticipant.sendText(
        JSON.stringify({
          accelerometerStatus: accelerometerStatusRef.current,
          gyroStatus: gyroStatusRef.current,
          inputStatus: buttonStatusRef.current,
        }),
        { topic: "game" },
      ))();
  }, [buttonStatus]);

  const requestDeviceSensorAccess = async () => {
    setHasGameStarted(true);
    try {
      // @ts-expect-error DeviceMotionEvent and DeviceOrientationEvent are not defined in all environments
      DeviceMotionEvent.requestPermission();
      // @ts-expect-error DeviceOrientationEvent is not defined in all environments
      DeviceOrientationEvent.requestPermission();

      window.addEventListener("devicemotion", (event) => {
        const { x, y, z } = event.accelerationIncludingGravity || {
          x: 0,
          y: 0,
          z: 0,
        };
        setAccelerometerStatus({ x, y, z });
        // @ts-expect-error DeviceMotionEvent is not defined in all environments
        accelerometerStatusRef.current = { x, y, z };
      });

      window.addEventListener("deviceorientation", ({ alpha, beta, gamma }) => {
        // @ts-expect-error DeviceOrientationEvent is not defined in all environments
        gyroStatusRef.current = { alpha, beta, gamma };
        setGyroStatus({ alpha, beta, gamma });
      });
    } catch (e) {
      console.log("Error requesting access: " + JSON.stringify(e));
      return;
    }
  };

  useEffect(() => {
    buttonStatusRef.current = buttonStatus;
  }, [buttonStatus]);

  return (
    <>
      <style>{styles}</style>
      <div className="player-stage">
        <PlayerMain
          setButtonStatus={setButtonStatus}
          onStartClick={requestDeviceSensorAccess}
          hasGameStarted={hasGameStarted}
        >
          <div className="status">
            <pre>{JSON.stringify(accelerometerStatus, null, 2)}</pre>
          </div>
          <div className="status">
            <pre>{JSON.stringify(gyroStatus, null, 2)}</pre>
          </div>
        </PlayerMain>
      </div>
    </>
  );
};

export default PlayerStage;
