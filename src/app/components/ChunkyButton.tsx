import "ios-vibrator-pro-max";

import { FC } from "react";
import { ButtonStatus } from "../game/[userType]/PlayerStage";

type ChunkyButtonProps = {
  label: string;
  color?: string;
  onClick?: () => void;
  onButtonStatusChange?: (status: ButtonStatus) => void;
};

const ChunkyButton: FC<ChunkyButtonProps> = ({
  label,
  color = "#FF0000",
  onClick,
  onButtonStatusChange = () => {},
}) => {
  return (
    <div
      className="button"
      onTouchStart={() => {
        onButtonStatusChange(ButtonStatus.PRESSED);
        // navigator.vibrate(50);
      }}
      onTouchEnd={() => {
        onButtonStatusChange(ButtonStatus.IDLE);
        if (onClick) onClick();
      }}
      onClick={onClick}
    >
      <div
        className="surface"
        style={{ backgroundColor: DarkenColor(color, 0.2) }}
      >
        <div className="label" style={{ backgroundColor: color }}>
          {label}
        </div>
      </div>
    </div>
  );
};

function DarkenColor(col: string, amt: number): string {
  const hexColor = col.replace("#", "");
  const num = parseInt(hexColor, 16);
  let r = num >> 16;
  let g = (num >> 8) & 0x00ff;
  let b = num & 0x0000ff;
  r = Math.round(r * (1 - amt));
  g = Math.round(g * (1 - amt));
  b = Math.round(b * (1 - amt));
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  const newColor = (r << 16) | (g << 8) | b;
  return `#${newColor.toString(16).padStart(6, "0")}`;
}

export default ChunkyButton;
