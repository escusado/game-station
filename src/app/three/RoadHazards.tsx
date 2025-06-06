import { ThreeElements } from "@react-three/fiber";
import { FC } from "react";
import AmbulanceModel from "../../models_build/ambulance";
import FiretruckModel from "../../models_build/firetruck";
import GarbagetruckModel from "../../models_build/garbagetruck";
import PoliceModel from "../../models_build/police";
import RacefutureModel from "../../models_build/racefuture";
import SedanModel from "../../models_build/sedan";
import SuvModel from "../../models_build/suv";
import TaxiModel from "../../models_build/taxi";
import CarModel from "./CarModel";

const availableVehicleModels = [
  AmbulanceModel,
  FiretruckModel,
  GarbagetruckModel,
  PoliceModel,
  RacefutureModel,
  SedanModel,
  SuvModel,
  TaxiModel,
];

const RoadHazards: FC<ThreeElements["object3D"]> = (props) => {
  return (
    <object3D {...props}>
      {Array.from({ length: 8 }).map((_, index) => {
        // randomly select a vehicle model from the available models
        const VehicleModel =
          availableVehicleModels[
            Math.floor(Math.random() * availableVehicleModels.length)
          ];

        return (
          <CarModel
            key={"road-hazard-" + index}
            position={[index + 0.8 * Math.random(), 0, 0]}
          >
            {/* Render the selected vehicle model */}
            <VehicleModel />
          </CarModel>
        );
      })}
    </object3D>
  );
};

export default RoadHazards;
