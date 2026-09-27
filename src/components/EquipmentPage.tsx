import { useMemo, useState } from "react";

import {
  Activity,
  Minus,
  Plus,
  Power,
} from "lucide-react";

import { useEquipment } from "../hooks/useEquipment";
import type { Equipment } from "../models/equipment";

import EquipmentDetail from "./EquipmentDetail";


/* =====================================================
   TYPES
===================================================== */

interface DashboardAHU {

  id: string;

  status: "RUN" | "STOP";

  supply: number;

  returnAir: number;

  humidity: number;

  power: number;

  setTemperature: number;

}


interface EquipmentPageProps {

  ahu: DashboardAHU[];

  onToggleAHU: (
    id: string
  ) => void;

  onChangeAHUTemperature: (
    id: string,
    amount: number
  ) => void;

  onUpdateAHU: (
    id: string,
    updates: {
      status?: "RUN" | "STOP";
      setTemperature?: number;
    }
  ) => void;

}


/* =====================================================
   CONSTANTS
===================================================== */

const MIN_TEMPERATURE = 16;

const MAX_TEMPERATURE = 30;


/* =====================================================
   EQUIPMENT PAGE
===================================================== */

function EquipmentPage({

  ahu,

  onToggleAHU,

  onChangeAHUTemperature,

  onUpdateAHU,

}: EquipmentPageProps) {


  /* ===================================================
     EQUIPMENT DATA
  =================================================== */

  const {
    equipments,
    setEquipments,
  } = useEquipment();


  /* ===================================================
     FILTER
  =================================================== */

  const [filter, setFilter] = useState<
    "ALL" | "CHILLER" | "AHU" | "PUMP"
  >("ALL");


  /* ===================================================
     DETAIL
  =================================================== */

  const [selectedEquipment, setSelectedEquipment] =
    useState<Equipment | null>(null);


  /* ===================================================
     MERGE DASHBOARD AHU STATE
     
     สำคัญ:
     Equipment data อาจมี status/setTemperature
     ของตัวเอง

     แต่ AHU จริง ๆ ให้ยึดข้อมูลจาก App.tsx
     ซึ่งเป็น source of truth
  =================================================== */

  const synchronizedEquipments = useMemo(() => {

    return equipments.map((equipment) => {

      if (equipment.type !== "AHU") {
        return equipment;
      }


      const dashboardAHU =
        ahu.find(
          (unit) =>
            unit.id === equipment.id
        );


      if (!dashboardAHU) {
        return equipment;
      }


      return {
        ...equipment,

        status:
          dashboardAHU.status,

        setTemperature:
          dashboardAHU.setTemperature,

        supplyTemp:
          dashboardAHU.supply,

        returnTemp:
          dashboardAHU.returnAir,

        humidity:
          dashboardAHU.humidity,

        power:
          dashboardAHU.power,

      };

    });

  }, [
    equipments,
    ahu,
  ]);


  /* ===================================================
     FILTERED EQUIPMENT
  =================================================== */

  const filteredEquipment =
    useMemo(() => {

      if (filter === "ALL") {
        return synchronizedEquipments;
      }


      return synchronizedEquipments.filter(
        (equipment: Equipment) =>
          equipment.type === filter
      );

    }, [
      filter,
      synchronizedEquipments,
    ]);


  /* ===================================================
     SUMMARY
  =================================================== */

  const totalEquipment =
    synchronizedEquipments.length;


  const runningEquipment =
    synchronizedEquipments.filter(
      (equipment) =>
        equipment.status === "RUN"
    ).length;


  const stoppedEquipment =
    synchronizedEquipments.filter(
      (equipment) =>
        equipment.status === "STOP"
    ).length;


  const faultEquipment =
    synchronizedEquipments.filter(
      (equipment) =>
        equipment.status === "FAULT"
    ).length;


  /* ===================================================
     UPDATE EQUIPMENT
     
     ใช้เมื่อ EquipmentDetail มีการเปลี่ยนค่า
  =================================================== */

  const updateEquipment = (
    updatedEquipment: Equipment
  ) => {


    /* -----------------------------------------------
       Update Equipment local state
    ------------------------------------------------ */

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


    /* -----------------------------------------------
       Sync AHU กลับไป Dashboard
    ------------------------------------------------ */

    if (
      updatedEquipment.type === "AHU"
    ) {

      const updates: {
        status?: "RUN" | "STOP";
        setTemperature?: number;
      } = {};


      if (
        updatedEquipment.status === "RUN" ||
        updatedEquipment.status === "STOP"
      ) {

        updates.status =
          updatedEquipment.status;

      }


      if (
        typeof updatedEquipment.setTemperature ===
        "number"
      ) {

        updates.setTemperature =
          updatedEquipment.setTemperature;

      }


      if (
        updates.status !== undefined ||
        updates.setTemperature !== undefined
      ) {

        onUpdateAHU(
          updatedEquipment.id,
          updates
        );

      }

    }


    /* -----------------------------------------------
       Update selected detail
    ------------------------------------------------ */

    setSelectedEquipment(
      updatedEquipment
    );

  };


  /* ===================================================
     DETAIL PAGE
  =================================================== */

  if (selectedEquipment) {

    return (

      <EquipmentDetail

        equipment={
          selectedEquipment
        }

        onBack={() => {

          setSelectedEquipment(
            null
          );

        }}

        onUpdate={
          updateEquipment
        }

      />

    );

  }


  /* ===================================================
     PAGE
  =================================================== */

  return (

    <div className="equipment-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="equipment-header">

        <div>

          <div className="brand">

            <Activity />

            SMART BUILDING

          </div>


          <h1 className="equipment-title">

            Equipment Monitoring

          </h1>


          <p className="equipment-subtitle">

            Real-time monitoring of building mechanical equipment

          </p>

        </div>

      </header>


      {/* =================================================
          FILTER
      ================================================= */}

      <div className="equipment-toolbar">

        <div className="equipment-filters">


          {(
            [
              "ALL",
              "CHILLER",
              "AHU",
              "PUMP",
            ] as const
          ).map(
            (item) => (

              <button

                key={item}

                type="button"

                className={
                  `equipment-filter ${
                    filter === item
                      ? "active"
                      : ""
                  }`
                }

                onClick={() => {

                  setFilter(item);

                }}

              >

                {item}

              </button>

            )
          )}


        </div>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <section className="equipment-summary">


        <SummaryCard

          label="TOTAL EQUIPMENT"

          value={
            totalEquipment
          }

          status="TOTAL UNITS"

        />


        <SummaryCard

          label="RUNNING"

          value={
            runningEquipment
          }

          status="ONLINE"

        />


        <SummaryCard

          label="STOPPED"

          value={
            stoppedEquipment
          }

          status="STANDBY"

        />


        <SummaryCard

          label="FAULT"

          value={
            faultEquipment
          }

          status={
            faultEquipment === 0
              ? "NORMAL"
              : "CHECK REQUIRED"
          }

        />


      </section>


      {/* =================================================
          EQUIPMENT GRID
      ================================================= */}

      <section className="equipment-grid">


        {filteredEquipment.map(
          (equipment: Equipment) => (

            <EquipmentCard

              key={
                equipment.id
              }

              equipment={
                equipment
              }

              onClick={() => {

                setSelectedEquipment(
                  equipment
                );

              }}

              onToggleAHU={
                onToggleAHU
              }

              onChangeAHUTemperature={
                onChangeAHUTemperature
              }

            />

          )
        )}


      </section>


    </div>

  );

}


/* =====================================================
   SUMMARY CARD
===================================================== */

function SummaryCard({

  label,

  value,

  status,

}: {

  label: string;

  value: number;

  status: string;

}) {

  return (

    <div className="summary-card">


      <div className="summary-label">

        {label}

      </div>


      <div className="summary-value">

        {value}

      </div>


      <div className="summary-status">

        {status}

      </div>


    </div>

  );

}


/* =====================================================
   EQUIPMENT CARD
===================================================== */

function EquipmentCard({

  equipment,

  onClick,

  onToggleAHU,

  onChangeAHUTemperature,

}: {

  equipment: Equipment;

  onClick: () => void;

  onToggleAHU: (
    id: string
  ) => void;

  onChangeAHUTemperature: (
    id: string,
    amount: number
  ) => void;

}) {


  const isAHU =
    equipment.type === "AHU";


  const setTemperature =
    equipment.setTemperature ?? 24;


  const isRunning =
    equipment.status === "RUN";


  const isFault =
    equipment.status === "FAULT";


  /* ===================================================
     TEMPERATURE -1
  =================================================== */

  const handleDecreaseTemperature = (
    event: React.MouseEvent
  ) => {

    event.stopPropagation();


    if (!isAHU) {
      return;
    }


    if (
      setTemperature <=
      MIN_TEMPERATURE
    ) {

      return;

    }


    onChangeAHUTemperature(
      equipment.id,
      -1
    );

  };


  /* ===================================================
     TEMPERATURE +1
  =================================================== */

  const handleIncreaseTemperature = (
    event: React.MouseEvent
  ) => {

    event.stopPropagation();


    if (!isAHU) {
      return;
    }


    if (
      setTemperature >=
      MAX_TEMPERATURE
    ) {

      return;

    }


    onChangeAHUTemperature(
      equipment.id,
      1
    );

  };


  /* ===================================================
     AHU ON / OFF
  =================================================== */

  const handleToggleAHU = (
    event: React.MouseEvent
  ) => {

    event.stopPropagation();


    if (
      !isAHU ||
      isFault
    ) {

      return;

    }


    onToggleAHU(
      equipment.id
    );

  };


  /* ===================================================
     CARD
  =================================================== */

  return (

    <div className="equipment-card">


      {/* =================================================
          CARD HEADER
      ================================================= */}

      <div className="equipment-card-top">


        <div className="equipment-name">

          {equipment.id}

        </div>


        <div
          className={
            `equipment-status ${
              equipment.status.toLowerCase()
            }`
          }
        >

          <span />

          {equipment.status}

        </div>


      </div>


      {/* =================================================
          EQUIPMENT TYPE
      ================================================= */}

      <div className="equipment-type">

        {equipment.name}

      </div>


      {/* =================================================
          AHU CONTROL
      ================================================= */}

      {isAHU && (

        <div
          className="ahu-card-control"

          onClick={(event) => {

            event.stopPropagation();

          }}

        >


          {/* =============================================
              TEMPERATURE LABEL
          ============================================= */}

          <div className="ahu-temperature-label">

            SET TEMPERATURE

          </div>


          {/* =============================================
              TEMPERATURE CONTROL
          ============================================= */}

          <div className="ahu-temperature-control">


            <button

              type="button"

              onClick={
                handleDecreaseTemperature
              }

              disabled={
                setTemperature <=
                MIN_TEMPERATURE
              }

              aria-label={
                `Decrease ${equipment.id} temperature`
              }

            >

              <Minus size={17} />

            </button>


            <div className="ahu-temperature-value">

              <strong>

                {setTemperature} °C

              </strong>

            </div>


            <button

              type="button"

              onClick={
                handleIncreaseTemperature
              }

              disabled={
                setTemperature >=
                MAX_TEMPERATURE
              }

              aria-label={
                `Increase ${equipment.id} temperature`
              }

            >

              <Plus size={17} />

            </button>


          </div>


          {/* =============================================
              POWER BUTTON
          ============================================= */}

          <button

            type="button"

            className={
              isRunning
                ? "ahu-power-button running"
                : "ahu-power-button stop"
            }

            onClick={
              handleToggleAHU
            }

            disabled={
              isFault
            }

          >

            <Power size={16} />


            {isRunning

              ? "TURN OFF AHU"

              : "TURN ON AHU"

            }

          </button>


        </div>

      )}


      {/* =================================================
          VIEW DETAILS
      ================================================= */}

      <button

        type="button"

        className="equipment-details"

        onClick={(event) => {

          event.stopPropagation();

          onClick();

        }}

      >

        VIEW DETAILS →

      </button>


    </div>

  );

}


export default EquipmentPage;