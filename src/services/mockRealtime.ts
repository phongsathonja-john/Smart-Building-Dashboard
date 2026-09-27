import type { Equipment } from "../models/equipment";


export function generateRealtimeUpdate(
  equipment: Equipment
): Partial<Equipment> {

  const random = (value: number, range: number) =>
    Number(
      (value + (Math.random() - 0.5) * range)
      .toFixed(1)
    );


  return {

    power:
      random(equipment.power, 5),

    supplyTemp:
      equipment.supplyTemp
        ? random(equipment.supplyTemp, 0.8)
        : undefined,

    returnTemp:
      equipment.returnTemp
        ? random(equipment.returnTemp, 0.8)
        : undefined,

    flow:
      equipment.flow
        ? random(equipment.flow, 10)
        : undefined,

    lastUpdate:
      new Date().toISOString()

  };

}