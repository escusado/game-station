import { RoomContext } from "@livekit/components-react";
import { FC, useContext, useEffect, useState, useRef } from "react";

const styles = /* css */ `
.app-client {
  width: 100%;
  height: 100%;
  background-color: #FF3399;
  display: flex;
  flex-direction: column;
}

.app-client p {
  margin: 0;
}

.button {
  width: 100px;
  height: 50px;
  background-color: #4CAF50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #333;
  justify-content: center;
}

.status {
  fzont-size: 8px;
}
`;

type PlayerStageProps = {
  className?: string;
};

const PlayerStage: FC<PlayerStageProps> = ({ className }) => {
  const room = useContext(RoomContext);

  const [accelerometerStatus, setAccelerometerStatus] = useState({});
  const [gyroStatus, setGyroStatus] = useState({});

  const accelerometerStatusRef = useRef({ x: 0, y: 0, z: 0 });
  const gyroStatusRef = useRef({ alpha: 0, beta: 0, gamma: 0 });

  useEffect(() => {
    if (!room) return;

    const intervalId = setInterval(async () => {
      await room.localParticipant.sendText(
        JSON.stringify({
          accelerometerStatus: accelerometerStatusRef.current,
          gyroStatus: gyroStatusRef.current,
        }),
        {
          topic: "game",
        },
      );
    }, 50);

    return () => clearInterval(intervalId);
  }, [room]);

  const requestDeviceSensorAccess = async () => {
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

  return (
    <div className={`${className} bg-red-200`}>
      PlayerStage
      <>
        <style>{styles}</style>
        <div className="app-client">
          <div className="button" onClick={requestDeviceSensorAccess}>
            Request access
          </div>
          <div className="status">
            <pre>{JSON.stringify(accelerometerStatus, null, 2)}</pre>
          </div>
          <div className="status">
            <pre>{JSON.stringify(gyroStatus, null, 2)}</pre>
          </div>
        </div>
      </>
    </div>
  );
};

export default PlayerStage;
