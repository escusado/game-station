import { FC } from "react";
import { ThreeElements } from "@react-three/fiber";

const CarModel: FC<
  ThreeElements["object3D"] & { children: React.ReactNode }
> = (props) => {
  return (
    <>
      <object3D
        {...props}
        rotation={[0, Math.PI / 2, 0]}
        scale={[0.3, 0.3, 0.3]}
      >
        {props.children}
      </object3D>
    </>
  );
};

export default CarModel;
