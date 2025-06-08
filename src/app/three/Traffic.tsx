import { ThreeElements, useFrame } from "@react-three/fiber";
import { FC, useRef, useState, useCallback } from "react";
import * as THREE from "three";

import AmbulanceModel from "../../models_build/ambulance";
import FiretruckModel from "../../models_build/firetruck";
import GarbagetruckModel from "../../models_build/garbagetruck";
import PoliceModel from "../../models_build/police";
import RacefutureModel from "../../models_build/racefuture";
import SedanModel from "../../models_build/sedan";
import SuvModel from "../../models_build/suv";
import TaxiModel from "../../models_build/taxi";
import SailBoatAModel from "../../models_build/boatsaila";
import SailBoatBModel from "../../models_build/boatsailb";

const VEHICLE_MODELS = [
  AmbulanceModel,
  FiretruckModel,
  GarbagetruckModel,
  PoliceModel,
  RacefutureModel,
  SedanModel,
  SuvModel,
  TaxiModel,
  SailBoatAModel,
  SailBoatBModel,
];

const getRandomVehicleModel = () => {
  return VEHICLE_MODELS[Math.floor(Math.random() * VEHICLE_MODELS.length)];
};

const SPAWN_RATE_MS = 10000;
const CAR_SPEED = 0.002; // Adjust the speed of the cars
const DESPAWN_DISTANCE = 10; // Distance at which cars are removed
const SPAWN_POSITION_X = -1; // Starting position for new cars

interface Vehicle {
  id: number;
  ModelComponent: FC<ThreeElements["object3D"]>;
  position: [number, number, number];
  speed: number;
}

// Vehicle component with ref for direct position updates
const VehicleInstance: FC<{
  vehicle: Vehicle;
  onUpdate: (id: number, newX: number) => void;
}> = ({ vehicle, onUpdate }) => {
  const meshRef = useRef<THREE.Group>(null);
  const { ModelComponent, position, id, speed } = vehicle;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x += speed;
      onUpdate(id, meshRef.current.position.x);
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <ModelComponent scale={[0.4, 0.4, 0.4]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
};

// Instance one random model every SPAWN_RATE_MS increasing the position on the x axis
const Traffic: FC<ThreeElements["object3D"]> = (props) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const vehicleIdRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  const vehiclePositionsRef = useRef<Map<number, number>>(new Map());

  // Callback to update vehicle positions without causing re-renders
  const handleVehicleUpdate = useCallback((id: number, newX: number) => {
    vehiclePositionsRef.current.set(id, newX);
  }, []);

  // Handle spawning and cleanup in a separate frame loop
  useFrame((state) => {
    const currentTime = state.clock.elapsedTime * 1000;

    // Random chance to spawn new vehicle if enough time has passed
    if (currentTime - lastSpawnTimeRef.current > SPAWN_RATE_MS) {
      if (Math.random() < 0.25) {
        setVehicles((prev) => [
          ...prev,
          {
            id: vehicleIdRef.current++,
            ModelComponent: getRandomVehicleModel(),
            position: [SPAWN_POSITION_X, 0, 0],
            speed: CAR_SPEED,
          },
        ]);
      }
      lastSpawnTimeRef.current = currentTime;
    }

    // Clean up vehicles that are too far away
    const positionsMap = vehiclePositionsRef.current;
    const vehiclesToRemove: number[] = [];

    positionsMap.forEach((x, id) => {
      if (x > DESPAWN_DISTANCE) {
        vehiclesToRemove.push(id);
      }
    });

    if (vehiclesToRemove.length > 0) {
      setVehicles((prev) => {
        const filtered = prev.filter((v) => !vehiclesToRemove.includes(v.id));
        // Clean up position tracking
        vehiclesToRemove.forEach((id) => positionsMap.delete(id));
        return filtered;
      });
    }
  });

  return (
    <object3D {...props}>
      {vehicles.map((vehicle) => (
        <VehicleInstance
          key={vehicle.id}
          vehicle={vehicle}
          onUpdate={handleVehicleUpdate}
        />
      ))}
    </object3D>
  );
};

export default Traffic;
