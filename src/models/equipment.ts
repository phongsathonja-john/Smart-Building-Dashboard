export type EquipmentStatus =
  | "RUN"
  | "STOP"
  | "FAULT";


export type EquipmentType =
  | "CHILLER"
  | "AHU"
  | "PUMP";



export interface Equipment {

  id: string;

  name: string;


  // CHILLER / AHU / PUMP
  type: EquipmentType;


  // RUN / STOP / FAULT
  status: EquipmentStatus;



  power: number;


  capacity: number;



  supplyTemp?: number;


  returnTemp?: number;



  flow?: number;



  alarm?: number;



  // AHU Temperature Set Point
  setTemperature?: number;



  // AUTO / MANUAL Control
  controlMode?:
    | "AUTO"
    | "MANUAL";



  lastUpdate: string;

}