import type { ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  Gauge,
  Thermometer,
  Wind,
  Zap,
  Waves,
} from "lucide-react";

interface EquipmentDetailProps {
  equipment: {
    name: string;
    type: string;
    status: "RUN" | "STOP" | "FAULT";
  };
  onBack: () => void;
}

export default function EquipmentDetail({
  equipment,
  onBack,
}: EquipmentDetailProps) {
  return (
    <div className="equipment-detail">

      <button
        className="back-button"
        onClick={onBack}
      >
        <ArrowLeft size={17} />
        BACK TO EQUIPMENT
      </button>

      <div className="detail-header">

        <div>
          <div className="detail-type">
            {equipment.type}
          </div>

          <h1>{equipment.name}</h1>

          <div className="detail-status">
            <span />
            {equipment.status}
          </div>
        </div>

        <div className="detail-live">
          <Activity size={18} />
          REAL-TIME
        </div>

      </div>

      <div className="detail-grid">

        <DetailMetric
          icon={<Thermometer />}
          label="SUPPLY TEMPERATURE"
          value="6.8"
          unit="°C"
        />

        <DetailMetric
          icon={<Thermometer />}
          label="RETURN TEMPERATURE"
          value="12.4"
          unit="°C"
        />

        <DetailMetric
          icon={<Waves />}
          label="FLOW RATE"
          value="185.2"
          unit="m³/h"
        />

        <DetailMetric
          icon={<Gauge />}
          label="PRESSURE"
          value="3.2"
          unit="bar"
        />

        <DetailMetric
          icon={<Zap />}
          label="POWER"
          value="42.8"
          unit="kW"
        />

        <DetailMetric
          icon={<Wind />}
          label="LOAD"
          value="134.4"
          unit="TR"
        />

      </div>

      <div className="detail-panels">

        <div className="detail-panel">

          <h2>Operating Information</h2>

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

        <div className="detail-panel">

          <h2>Performance</h2>

          <InfoRow
            label="Cooling Load"
            value="134.4 TR"
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
            value="NORMAL"
          />

        </div>

      </div>

    </div>
  );
}

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
        <span>{label}</span>

        <strong>
          {value}
          <small>{unit}</small>
        </strong>
      </div>

    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}