import { useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Droplets,
  Fan,
  Gauge,
  Snowflake,
  Thermometer,
  Waves,
  Wind,
  Zap,
} from "lucide-react";

interface Equipment {
  id: string;
  type: "CHILLER" | "AHU" | "PUMP";
  name: string;
  status: "RUN" | "STOP" | "FAULT";

  power: number;
  capacity: number;
  capacityUnit: string;

  supplyTemp?: number;
  returnTemp?: number;

  humidity?: number;
  flow?: number;

  pressure?: number;
  runtime?: number;
}

const equipmentData: Equipment[] = [
  {
  id: "CH-01",
  type: "CHILLER",
  name: "Water Cooled Chiller",
  status: "RUN",

  power: 134.4,
  capacity: 134.4,
  capacityUnit: "TR",

  supplyTemp: 7.2,
  returnTemp: 12.1,

  flow: 420,
  pressure: 1.82,
  runtime: 8.4,
 },
  {
  id: "CH-02",
  type: "CHILLER",
  name: "Water Cooled Chiller",
  status: "RUN",

  power: 128.7,
  capacity: 128.7,
  capacityUnit: "TR",

  supplyTemp: 7.4,
  returnTemp: 12.3,

  flow: 405,
  pressure: 1.76,
  runtime: 7.9,
 },
  {
  id: "AHU-01",
  type: "AHU",
  name: "Air Handling Unit",
  status: "RUN",

  power: 3.2,
  capacity: 3.2,
  capacityUnit: "kW",

  supplyTemp: 14.8,
  returnTemp: 24.2,

  humidity: 55,
  flow: 8200,

  pressure: 0.42,
  runtime: 12.5,
 },
  {
  id: "AHU-02",
  type: "AHU",
  name: "Air Handling Unit",
  status: "RUN",

  power: 3.5,
  capacity: 3.5,
  capacityUnit: "kW",

  supplyTemp: 15.2,
  returnTemp: 23.9,

  humidity: 57,
  flow: 8500,

  pressure: 0.45,
  runtime: 11.8,
 },
  {
  id: "AHU-03",
  type: "AHU",
  name: "Air Handling Unit",
  status: "RUN",

  power: 3.8,
  capacity: 3.8,
  capacityUnit: "kW",

  supplyTemp: 14.7,
  returnTemp: 24.6,

  humidity: 53,
  flow: 8800,

  pressure: 0.48,
  runtime: 13.2,
},
  {
  id: "P-CHW-01",
  type: "PUMP",
  name: "Chilled Water Pump",
  status: "RUN",

  power: 18.4,
  capacity: 18.4,
  capacityUnit: "kW",

  flow: 380,
  pressure: 2.15,
  runtime: 9.7,
},
  {
  id: "P-CHW-02",
  type: "PUMP",
  name: "Chilled Water Pump",
  status: "STOP",

  power: 0,
  capacity: 0,
  capacityUnit: "kW",

  flow: 0,
  pressure: 0,
  runtime: 0,
},
];

function EquipmentPage() {
  const [filter, setFilter] = useState<
    "ALL" | "CHILLER" | "AHU" | "PUMP"
  >("ALL");

  const [selectedEquipment, setSelectedEquipment] =
    useState<Equipment | null>(null);

  const filteredEquipment = useMemo(() => {
    if (filter === "ALL") {
      return equipmentData;
    }

    return equipmentData.filter(
      (equipment) => equipment.type === filter
    );
  }, [filter]);

  const totalEquipment = equipmentData.length;

  const runningEquipment = equipmentData.filter(
    (equipment) => equipment.status === "RUN"
  ).length;

  const stoppedEquipment = equipmentData.filter(
    (equipment) => equipment.status === "STOP"
  ).length;

  const faultEquipment = equipmentData.filter(
    (equipment) => equipment.status === "FAULT"
  ).length;

  /*
   * ==========================================
   * EQUIPMENT DETAIL
   * ==========================================
   */

  if (selectedEquipment) {
    return (
      <div className="equipment-page">

        <button
          className="back-button"
          onClick={() => setSelectedEquipment(null)}
        >
          <ArrowLeft size={16} />
          BACK TO EQUIPMENT
        </button>

        <div className="detail-header">

          <div>
            <div className="detail-type">
              {selectedEquipment.type}
            </div>

            <h1 className="equipment-title">
              {selectedEquipment.id}
            </h1>

            <p className="equipment-subtitle">
              {selectedEquipment.name}
            </p>
          </div>

          <div
            className={`equipment-status ${
              selectedEquipment.status === "RUN"
                ? "status-run"
                : selectedEquipment.status === "STOP"
                ? "status-stop"
                : "status-fault"
            }`}
          >
            <span className="equipment-status-dot" />
            {selectedEquipment.status}
          </div>

        </div>

        {/* STATUS */}

        <div className="detail-status-card">

          <div>
            <span className="detail-label">
              CURRENT STATUS
            </span>

            <strong>
              {selectedEquipment.status === "RUN"
                ? "SYSTEM RUNNING"
                : selectedEquipment.status === "STOP"
                ? "SYSTEM STOPPED"
                : "SYSTEM FAULT"}
            </strong>
          </div>

          <Activity size={32} />

        </div>

        {/* MAIN METRICS */}

        <div className="detail-metrics">

          <DetailMetric
            icon={<Zap />}
            title="POWER"
            value={`${selectedEquipment.power.toFixed(1)} kW`}
          />

          <DetailMetric
            icon={<Gauge />}
            title="CAPACITY"
            value={`${selectedEquipment.capacity.toFixed(1)} ${
              selectedEquipment.capacityUnit
            }`}
          />

          {selectedEquipment.supplyTemp !== undefined && (
            <DetailMetric
              icon={<Thermometer />}
              title="SUPPLY TEMPERATURE"
              value={`${selectedEquipment.supplyTemp.toFixed(1)} °C`}
            />
          )}

          {selectedEquipment.returnTemp !== undefined && (
            <DetailMetric
              icon={<Thermometer />}
              title="RETURN TEMPERATURE"
              value={`${selectedEquipment.returnTemp.toFixed(1)} °C`}
            />
          )}

          {selectedEquipment.humidity !== undefined && (
            <DetailMetric
              icon={<Droplets />}
              title="HUMIDITY"
              value={`${selectedEquipment.humidity}%`}
            />
          )}

          {selectedEquipment.flow !== undefined && (
            <DetailMetric
              icon={
                selectedEquipment.type === "AHU"
                  ? <Wind />
                  : <Waves />
              }
              title="FLOW"
              value={`${selectedEquipment.flow.toLocaleString()} ${
                selectedEquipment.type === "AHU"
                  ? "m³/h"
                  : "m³/h"
              }`}
            />
          )}
            {selectedEquipment.pressure !== undefined && (
             <DetailMetric
                icon={<Gauge />}
                title="PRESSURE"
                 value={`${selectedEquipment.pressure.toFixed(2)} bar`}
            />
          )}

            {selectedEquipment.runtime !== undefined && (
            <DetailMetric
                icon={<Activity />}
                title="RUNTIME TODAY"
                value={`${selectedEquipment.runtime.toFixed(1)} h`}
             />
        )}

        </div>

        {/* TREND */}
        <div className="detail-alarm">

  <div>
    <span className="detail-label">
      ALARM STATUS
    </span>

    <strong>
      NORMAL
    </strong>
  </div>

  <div className="alarm-normal">
    <span />
    NO ACTIVE ALARM
  </div>

</div>
        <div className="panel detail-trend">

          <div className="panel-header">

            <div>
              <h2>{selectedEquipment.id} Trend</h2>

              <p>Power and operating condition trend</p>
              
            </div>

            <div className="live-badge">
              <span />
              LIVE
            </div>

          </div>

          <div className="fake-trend">

            <div className="trend-line">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

          </div>

        </div>

      </div>
    );
  }

  /*
   * ==========================================
   * EQUIPMENT LIST
   * ==========================================
   */

  return (
    <div className="equipment-page">

      {/* HEADER */}

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

        <div className="equipment-online">
          <span />
          SYSTEM ONLINE
        </div>

      </header>

      {/* FILTER */}

      <div className="equipment-toolbar">

        <div className="equipment-filters">

          {(
            ["ALL", "CHILLER", "AHU", "PUMP"] as const
          ).map((item) => (

            <button
              key={item}
              className={`equipment-filter ${
                filter === item ? "active" : ""
              }`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* SUMMARY */}

      <section className="equipment-summary">

        <SummaryCard
          label="TOTAL EQUIPMENT"
          value={totalEquipment}
          status="TOTAL UNITS"
        />

        <SummaryCard
          label="RUNNING"
          value={runningEquipment}
          status="ONLINE"
        />

        <SummaryCard
          label="STOPPED"
          value={stoppedEquipment}
          status="STANDBY"
        />

        <SummaryCard
          label="FAULT"
          value={faultEquipment}
          status={
            faultEquipment === 0
              ? "NORMAL"
              : "CHECK REQUIRED"
          }
        />

      </section>

      {/* EQUIPMENT GRID */}

      <section className="equipment-grid">

        {filteredEquipment.map((equipment) => (

          <EquipmentCard
            key={equipment.id}
            equipment={equipment}
            onClick={() =>
              setSelectedEquipment(equipment)
            }
          />

        ))}

      </section>

    </div>
  );
}


/*
 * ==========================================
 * SUMMARY CARD
 * ==========================================
 */

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


/*
 * ==========================================
 * EQUIPMENT CARD
 * ==========================================
 */

function EquipmentCard({
  equipment,
  onClick,
}: {
  equipment: Equipment;
  onClick: () => void;
}) {
  return (
    <div className="equipment-card">

      <div className="equipment-card-header">

        <div className="equipment-icon">
          {equipment.type === "CHILLER" && (
            <Snowflake />
          )}

          {equipment.type === "AHU" && (
            <Fan />
          )}

          {equipment.type === "PUMP" && (
            <Waves />
          )}
        </div>

        <div
          className={`equipment-status ${
            equipment.status === "RUN"
              ? "status-run"
              : equipment.status === "STOP"
              ? "status-stop"
              : "status-fault"
          }`}
        >
          <span className="equipment-status-dot" />
          {equipment.status}
        </div>

      </div>

      <div className="equipment-name">
        {equipment.id}
      </div>

      <div className="equipment-type">
        {equipment.name}
      </div>

      <div className="equipment-metrics">

        <div className="equipment-metric">

          <div className="equipment-metric-label">
            POWER
          </div>

          <div className="equipment-metric-value">
            {equipment.power.toFixed(1)} kW
          </div>

        </div>

        <div className="equipment-metric">

          <div className="equipment-metric-label">
            CAPACITY
          </div>

          <div className="equipment-metric-value">
            {equipment.capacity.toFixed(1)}{" "}
            {equipment.capacityUnit}
          </div>

        </div>

        {equipment.supplyTemp !== undefined && (
          <div className="equipment-metric">

            <div className="equipment-metric-label">
              SUPPLY
            </div>

            <div className="equipment-metric-value">
              {equipment.supplyTemp.toFixed(1)} °C
            </div>

          </div>
        )}

        {equipment.returnTemp !== undefined && (
          <div className="equipment-metric">

            <div className="equipment-metric-label">
              RETURN
            </div>

            <div className="equipment-metric-value">
              {equipment.returnTemp.toFixed(1)} °C
            </div>

          </div>
        )}

      </div>

      <button
        className="equipment-details"
        onClick={onClick}
      >
        VIEW DETAILS →
      </button>

    </div>
  );
}


/*
 * ==========================================
 * DETAIL METRIC
 * ==========================================
 */

function DetailMetric({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="detail-metric">

      <div className="detail-metric-icon">
        {icon}
      </div>

      <div>
        <div className="detail-metric-label">
          {title}
        </div>

        <div className="detail-metric-value">
          {value}
        </div>
      </div>

    </div>
  );
}

export default EquipmentPage;