import type { ReactNode } from "react";

interface EquipmentCardProps {
  name: string;
  type: string;
  status: "RUN" | "STOP" | "FAULT";
  icon: ReactNode;
  value: string;
  unit: string;
  onClick: () => void;
}

export default function EquipmentCard({
  name,
  type,
  status,
  icon,
  value,
  unit,
  onClick,
}: EquipmentCardProps) {
  return (
    <button className="equipment-card" onClick={onClick}>
      <div className="equipment-card-top">
        <div className="equipment-icon">
          {icon}
        </div>

        <div
          className={`equipment-status ${status.toLowerCase()}`}
        >
          <span />
          {status}
        </div>
      </div>

      <div className="equipment-name">
        {name}
      </div>

      <div className="equipment-type">
        {type}
      </div>

      <div className="equipment-value">
        {value}
        <small>{unit}</small>
      </div>

      <div className="equipment-view">
        VIEW DETAILS →
      </div>
    </button>
  );
}