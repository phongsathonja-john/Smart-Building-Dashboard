import type { Equipment } from "../models/equipment";

/**
 * Mock control service
 *
 * ใช้จำลองการส่งคำสั่งควบคุม AHU
 * ในขั้นตอนถัดไปสามารถเปลี่ยนส่วนนี้
 * เป็น MQTT / WebSocket / API ได้
 */

/**
 * สั่งเปิด AHU
 */
export async function turnOnAHU(
  equipment: Equipment
): Promise<Equipment> {

  console.log(
    `[CONTROL] TURN ON ${equipment.id}`
  );

  return {
    ...equipment,
    status: "RUN",
  };
}


/**
 * สั่งปิด AHU
 */
export async function turnOffAHU(
  equipment: Equipment
): Promise<Equipment> {

  console.log(
    `[CONTROL] TURN OFF ${equipment.id}`
  );

  return {
    ...equipment,
    status: "STOP",
  };
}


/**
 * ตั้งค่าอุณหภูมิ AHU
 */
export async function setAHUTemperature(
  equipment: Equipment,
  temperature: number
): Promise<Equipment> {

  console.log(
    `[CONTROL] ${equipment.id} SET TEMPERATURE = ${temperature}°C`
  );

  return {
    ...equipment,
    setTemperature: temperature,
  };
}


/**
 * ฟังก์ชันกลางสำหรับ Toggle AHU
 */
export async function toggleAHU(
  equipment: Equipment
): Promise<Equipment> {

  if (equipment.status === "RUN") {
    return turnOffAHU(equipment);
  }

  return turnOnAHU(equipment);
}