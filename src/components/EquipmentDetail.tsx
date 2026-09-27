import { useEffect, useState, type ReactNode } from "react";

import {
  Activity,
  ArrowLeft,
  Gauge,
  Thermometer,
  Wind,
  Zap,
  Waves,
  Power,
  Plus,
  Minus,
} from "lucide-react";

import type { Equipment } from "../models/equipment";

import {
  toggleAHU,
  setAHUTemperature,
} from "../services/controlService";


interface EquipmentDetailProps {
  equipment: Equipment;
  onBack: () => void;
  onUpdate: (equipment: Equipment) => void;
}


export default function EquipmentDetail({
  equipment,
  onBack,
  onUpdate,
}: EquipmentDetailProps) {

  // =====================================================
  // AHU SET TEMPERATURE
  // =====================================================

  const [setTemp, setSetTemp] = useState(
    equipment.setTemperature ?? 24
  );


  // =====================================================
  // SYNC TEMPERATURE WHEN EQUIPMENT CHANGES
  // =====================================================

  useEffect(() => {

    setSetTemp(
      equipment.setTemperature ?? 24
    );

  }, [
    equipment.id,
    equipment.setTemperature
  ]);


  // =====================================================
  // AHU TEMPERATURE LIMIT
  // =====================================================

  const MIN_TEMPERATURE = 16;
  const MAX_TEMPERATURE = 30;


  // =====================================================
  // DECREASE TEMPERATURE
  // =====================================================

  const handleDecreaseTemperature = async () => {

    const newTemp = Math.max(
      MIN_TEMPERATURE,
      setTemp - 1
    );


    if (newTemp === setTemp) {
      return;
    }


    const updatedEquipment =
      await setAHUTemperature(
        equipment,
        newTemp
      );


    setSetTemp(newTemp);

    onUpdate(updatedEquipment);

  };


  // =====================================================
  // INCREASE TEMPERATURE
  // =====================================================

  const handleIncreaseTemperature = async () => {

    const newTemp = Math.min(
      MAX_TEMPERATURE,
      setTemp + 1
    );


    if (newTemp === setTemp) {
      return;
    }


    const updatedEquipment =
      await setAHUTemperature(
        equipment,
        newTemp
      );


    setSetTemp(newTemp);

    onUpdate(updatedEquipment);

  };


  // =====================================================
  // TOGGLE AHU
  // =====================================================

  const handleToggleAHU = async () => {

    const updatedEquipment =
      await toggleAHU(equipment);


    onUpdate(updatedEquipment);

  };


  // =====================================================
  // CURRENT AHU STATUS
  // =====================================================

  const isRunning =
    equipment.status === "RUN";


  return (

    <div className="equipment-detail">


      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >

        <ArrowLeft size={17} />

        BACK TO EQUIPMENT

      </button>


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="detail-header">

        <div>

          <div className="detail-type">
            {equipment.type}
          </div>


          <h1>
            {equipment.name}
          </h1>


          <div
            className={`detail-status ${
              equipment.status === "FAULT"
                ? "status-fault"
                : isRunning
                  ? "status-run"
                  : "status-stop"
            }`}
          >

            <span />

            {equipment.status}

          </div>

        </div>


        <div className="detail-live">

          <Activity size={18} />

          REAL-TIME

        </div>

      </div>


      {/* =================================================
          EQUIPMENT METRICS
      ================================================= */}

      <div className="detail-grid">


        {/* SUPPLY TEMPERATURE */}

        <DetailMetric
          icon={<Thermometer />}
          label="SUPPLY TEMPERATURE"
          value="6.8"
          unit="°C"
        />


        {/* RETURN TEMPERATURE */}

        <DetailMetric
          icon={<Thermometer />}
          label="RETURN TEMPERATURE"
          value="12.4"
          unit="°C"
        />


        {/* FLOW RATE */}

        <DetailMetric
          icon={<Waves />}
          label="FLOW RATE"
          value="185.2"
          unit="m³/h"
        />


        {/* PRESSURE */}

        <DetailMetric
          icon={<Gauge />}
          label="PRESSURE"
          value="3.2"
          unit="bar"
        />


        {/* POWER */}

        <DetailMetric
          icon={<Zap />}
          label="POWER"
          value={equipment.power.toFixed(1)}
          unit="kW"
        />


        {/* LOAD */}

        <DetailMetric
          icon={<Wind />}
          label="LOAD"
          value={equipment.capacity.toFixed(1)}
          unit="TR"
        />

      </div>


      {/* =================================================
          AHU CONTROL PANEL
      ================================================= */}

      <div className="control-panel">


        <h2>
          AHU CONTROL
        </h2>


        {/* =================================================
            TEMPERATURE CONTROL
        ================================================= */}

        <div className="temperature-control">


          {/* MINUS BUTTON */}

          <button
            type="button"
            onClick={handleDecreaseTemperature}
            disabled={setTemp <= MIN_TEMPERATURE}
            aria-label="Decrease AHU temperature"
          >

            <Minus size={20} />

          </button>


          {/* CURRENT SET TEMPERATURE */}

          <div className="temperature-value">

            <strong>
              {setTemp} °C
            </strong>


            <span>
              SET TEMPERATURE
            </span>

          </div>


          {/* PLUS BUTTON */}

          <button
            type="button"
            onClick={handleIncreaseTemperature}
            disabled={setTemp >= MAX_TEMPERATURE}
            aria-label="Increase AHU temperature"
          >

            <Plus size={20} />

          </button>

        </div>


        {/* =================================================
            AHU POWER BUTTON
        ================================================= */}

        <button
          type="button"

          className={
            isRunning
              ? "power-button running"
              : "power-button stop"
          }

          onClick={handleToggleAHU}

          disabled={equipment.status === "FAULT"}

        >

          <Power size={18} />


          {isRunning
            ? "TURN OFF AHU"
            : "TURN ON AHU"}

        </button>


      </div>


      {/* =================================================
          INFORMATION PANELS
      ================================================= */}

      <div className="detail-panels">


        {/* =================================================
            OPERATING INFORMATION
        ================================================= */}

        <div className="detail-panel">

          <h2>
            Operating Information
          </h2>


          <InfoRow
            label="Running Hours"
            value="1,248 h"
          />


          <InfoRow
            label="Start Count"
            value="342"
          />


          <InfoRow
            label="Operating Mode"
            value="AUTO"
          />


          <InfoRow
            label="Communication"
            value="ONLINE"
          />

        </div>


        {/* =================================================
            PERFORMANCE
        ================================================= */}

        <div className="detail-panel">

          <h2>
            Performance
          </h2>


          <InfoRow
            label="Cooling Load"
            value={`${equipment.capacity.toFixed(1)} TR`}
          />


          <InfoRow
            label="COP"
            value="3.14"
          />


          <InfoRow
            label="Efficiency"
            value="87 %"
          />


          <InfoRow
            label="Alarm"
            value={
              equipment.status === "FAULT"
                ? "FAULT"
                : "NORMAL"
            }
          />

        </div>

      </div>


    </div>

  );
}


/* =========================================================
   DETAIL METRIC
   ========================================================= */

function DetailMetric({
  icon,
  label,
  value,
  unit,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  unit: string;
}) {

  return (

    <div className="detail-metric">


      <div className="detail-metric-icon">

        {icon}

      </div>


      <div>

        <span>
          {label}
        </span>


        <strong>

          {value}

          <small>
            {unit}
          </small>

        </strong>

      </div>


    </div>

  );
}


/* =========================================================
   INFORMATION ROW
   ========================================================= */

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div className="info-row">

      <span>
        {label}
      </span>


      <strong>
        {value}
      </strong>

    </div>

  );
}