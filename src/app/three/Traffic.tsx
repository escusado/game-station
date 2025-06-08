import { ThreeElements, useFrame } from "@react-three/fiber";
import { FC, useRef, useState } from "react";

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

const SPAWN_RATE_MS = 5000;
const CAR_SPEED = 0.002; // Adjust the speed of the cars
const DESPAWN_DISTANCE = 10; // Distance at which cars are removed
const SPAWN_POSITION_X = -1; // Starting position for new cars

interface Vehicle {
  id: number;
  ModelComponent: FC<ThreeElements["object3D"]>;
  position: [number, number, number];
  speed: number;
}

// Instance one random model every SPAWN_RATE_MS increasing the position on the x axis
const Traffic: FC<ThreeElements["object3D"]> = (props) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const vehicleIdRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);

  // Update vehicle positions and handle spawning/despawning
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

    // Update vehicle positions and remove vehicles that are too far
    setVehicles((prev) =>
      prev
        .map((v) => ({
          ...v,
          position: [v.position[0] + v.speed, v.position[1], v.position[2]] as [
            number,
            number,
            number,
          ],
        }))
        .filter((vehicle) => vehicle.position[0] < DESPAWN_DISTANCE),
    );
  });

  return (
    <object3D {...props}>
      {vehicles.map((vehicle) => {
        const ModelComponent = vehicle.ModelComponent;
        return (
          <ModelComponent
            key={vehicle.id}
            position={vehicle.position}
            scale={[0.4, 0.4, 0.4]}
            rotation={[0, Math.PI / 2, 0]}
          />
        );
      })}
    </object3D>
  );
};

export default Traffic;
