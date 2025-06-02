import React from "react";
import { Box } from "@react-three/drei";

interface PlayerProps {
  position: [number, number, number];
  color: string;
  rotation?: [number, number, number];
}

const Player: React.FC<PlayerProps> = ({ position, color, rotation }) => {
  return (
    <Box args={[1, 1, 1]} position={position} rotation={rotation} castShadow>
      <meshStandardMaterial attach="material" color={color} />
      <axesHelper args={[2]} />
    </Box>
  );
};

export default Player;
