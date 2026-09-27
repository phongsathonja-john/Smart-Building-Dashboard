import { useState } from "react";

import {
  mockEquipment,
} from "../data/mockEquipment";

import type {
  Equipment,
} from "../models/equipment";


export function useEquipment() {

  const [
    equipments,
    setEquipments,
  ] = useState<Equipment[]>(
    mockEquipment
  );


  /*
   * =====================================================
   * UPDATE EQUIPMENT
   * =====================================================
   *
   * ใช้สำหรับอัปเดต Equipment จากหน้า Detail
   *
   * ตัวอย่าง:
   *
   * AHU-01
   * status: RUN -> STOP
   *
   * หรือ
   *
   * setTemperature:
   * 24 -> 25
   *
   */

  const updateEquipment = (
    updatedEquipment: Equipment
  ) => {

    setEquipments(
      (currentEquipments) => {

        return currentEquipments.map(
          (equipment) => {

            if (
              equipment.id ===
              updatedEquipment.id
            ) {

              return updatedEquipment;

            }

            return equipment;

          }
        );

      }
    );

  };


  /*
   * =====================================================
   * GET EQUIPMENT
   * =====================================================
   */

  const getEquipment = (
    id: string
  ): Equipment | undefined => {

    return equipments.find(
      (equipment) =>
        equipment.id === id
    );

  };


  return {

    equipments,

    setEquipments,

    updateEquipment,

    getEquipment,

  };

}