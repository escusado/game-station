import React from "react";
import { Box } from "@react-three/drei";

interface PlayerProps {
  position: [number, number, number];
  color: string;
}

const Player: React.FC<PlayerProps> = ({ position, color }) => {
  return (
    <Box args={[1, 1, 1]} position={position} castShadow>
      <meshStandardMaterial attach="material" color={color} />
      <axesHelper args={[2]} />
    </Box>
  );
};

export default Player;
