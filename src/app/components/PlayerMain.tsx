import { FC } from "react";
import { ButtonStatus, InputStatus } from "../game/[userType]/PlayerStage";
import ChunkyButton from "./ChunkyButton";

type PlayerMainProps = {
  children: React.ReactNode;
  setInputStatus: (status: InputStatus) => void;
  onStartClick?: () => void;
  hasGameStarted: boolean;
};

const style = /*css*/ `
.player-main{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.body{
  flex: 1;
  padding: 10px;
  display: flex;
}

.debug-container {
  flex:1;
  background-color: #333;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  font-size: 10px;
}
`;

const PlayerMain: FC<PlayerMainProps> = ({
  setInputStatus,
  children,
  onStartClick,
  hasGameStarted,
}) => {
  return (
    <>
      <style>{style}</style>
      <div className="player-main">
        <div className="debug-container">{children}</div>
        <div className="body">
          {hasGameStarted ? (
            <ChunkyButton
              label="JUMP"
              onButtonStatusChange={(status: ButtonStatus) =>
                setInputStatus({ buttons: { jump: status } })
              }
            />
          ) : (
            <ChunkyButton color="#33AA44" label="JOIN" onClick={onStartClick} />
          )}
        </div>
      </div>
    </>
  );
};

export default PlayerMain;
