import smallTruck from "../../../src/assets/vehicles/smallTruck1.png";
import miniVan from "../../../src/assets/vehicles/miniVan.png";
import largeTruck from "../../../src/assets/vehicles/largeTruck.png";
import boxTruck from "../../../src/assets/vehicles/boxTruck.png";
import containerTruck from "../../../src/assets/vehicles/containerTruck.png";

export const carList = [
  {
    imgUrl: miniVan,
    service: "Small Van",
    multiplier: 1,
  },
  {
    imgUrl: smallTruck,
    service: "Medium Truck",
    multiplier: 1.5,
  },
  {
    imgUrl: largeTruck,
    service: "Large Truck",
    multiplier: 2,
  },
  {
    imgUrl: boxTruck,
    service: "Box Truck",
    multiplier: 2.2,
  },
  {
    imgUrl: containerTruck,
    service: "Container Truck",
    multiplier: 3,
  },
];
