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

  const accelerometerStatusRef = useRef<DeviceMotionEventAcceleration>({
    x: 0,
    y: 0,
    z: 0,
  });
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
      // Check if we're on iOS and if permission request is available
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (
        isIOS &&
        typeof DeviceMotionEvent !== "undefined" &&
        "requestPermission" in DeviceMotionEvent
      ) {
        // iOS 13+ requires explicit permission
        // @ts-expect-error DeviceMotionEvent.requestPermission is iOS-specific
        const motionPermission = await DeviceMotionEvent.requestPermission();
        const orientationPermission =
          // @ts-expect-error DeviceOrientationEvent.requestPermission is iOS-specific
          await DeviceOrientationEvent.requestPermission();

        if (
          motionPermission !== "granted" ||
          orientationPermission !== "granted"
        ) {
          console.log("Device sensor permissions denied");
          return;
        }
      }

      // Add event listeners for both iOS and Android
      window.addEventListener("devicemotion", (event) => {
        const accelerometerStatus = event.accelerationIncludingGravity || {
          x: 0,
          y: 0,
          z: 0,
        };
        setAccelerometerStatus(accelerometerStatus);
        accelerometerStatusRef.current = accelerometerStatus;
      });

      window.addEventListener("deviceorientation", (event) => {
        const { alpha, beta, gamma } = event;
        const safeAlpha = alpha ?? 0;
        const safeBeta = beta ?? 0;
        const safeGamma = gamma ?? 0;

        gyroStatusRef.current = {
          alpha: safeAlpha,
          beta: safeBeta,
          gamma: safeGamma,
        };
        setGyroStatus({
          alpha: safeAlpha,
          beta: safeBeta,
          gamma: safeGamma,
        });
      });

      console.log("Device sensor access initialized successfully");
    } catch (e) {
      console.log("Error requesting sensor access: " + JSON.stringify(e));
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
