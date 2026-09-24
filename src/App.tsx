import { useState, useEffect } from "react";
import EquipmentPage from "./components/EquipmentPage";
import "./App.css";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Activity,
  AlertTriangle,
  Droplets,
  Gauge,
  Server,
  Snowflake,
  Thermometer,
  Wind,
  Zap,
  CheckCircle2,
} from "lucide-react";

interface HVACUnit {
  id: string;
  status: string;
  supply: number;
  returnAir: number;
  humidity: number;
  power: number;
}

function App() {
  const [page, setPage] =
  useState<"dashboard" | "equipment">("dashboard");
  const [power, setPower] = useState(15.8);
  const [energy, setEnergy] = useState(245);
  const [coolingLoad, setCoolingLoad] = useState(120);
  const [time, setTime] = useState(new Date());

  const [history, setHistory] = useState([
    { time: "08:00", power: 11.2 },
    { time: "09:00", power: 13.5 },
    { time: "10:00", power: 15.1 },
    { time: "11:00", power: 16.8 },
    { time: "12:00", power: 18.2 },
    { time: "13:00", power: 17.4 },
    { time: "14:00", power: 16.1 },
    { time: "15:00", power: 15.8 },
  ]);

  const [ahu, setAhu] = useState<HVACUnit[]>([
    {
      id: "AHU-01",
      status: "RUN",
      supply: 14.5,
      returnAir: 24.8,
      humidity: 55,
      power: 3.2,
    },
    {
      id: "AHU-02",
      status: "RUN",
      supply: 15.1,
      returnAir: 25.2,
      humidity: 57,
      power: 3.5,
    },
    {
      id: "AHU-03",
      status: "RUN",
      supply: 13.9,
      returnAir: 24.1,
      humidity: 53,
      power: 3.8,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPower = 14 + Math.random() * 5;
      const newCooling = 110 + Math.random() * 25;

      setPower(Number(newPower.toFixed(1)));
      setCoolingLoad(Number(newCooling.toFixed(1)));
      setEnergy((value) =>
        Number((value + newPower / 3600).toFixed(2))
      );
      setTime(new Date());

      setHistory((old) => [
        ...old,
        {
          time: new Date().toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          power: Number(newPower.toFixed(1)),
        },
      ].slice(-20));

      setAhu((units) =>
        units.map((unit) => ({
          ...unit,
          supply: Number(
            (unit.supply + (Math.random() - 0.5) * 0.3).toFixed(1)
          ),
          returnAir: Number(
            (unit.returnAir + (Math.random() - 0.5) * 0.4).toFixed(1)
          ),
          humidity: Math.round(
            unit.humidity + (Math.random() - 0.5) * 2
          ),
          power: Number(
            (unit.power + (Math.random() - 0.5) * 0.2).toFixed(1)
          ),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">

    <nav className="navigation">

      <button
        className={page === "dashboard" ? "nav-active" : ""}
        onClick={() => setPage("dashboard")}
      >
        DASHBOARD
      </button>

      <button
        className={page === "equipment" ? "nav-active" : ""}
        onClick={() => setPage("equipment")}
      >
        EQUIPMENT
      </button>

    </nav>

    {page === "dashboard" ? (
    <>
    

      {/* HEADER */}
      <header className="topbar">
        <div>
          <div className="brand">
            <Activity />
            SMART BUILDING
          </div>

          <div className="subtitle">
            Energy & HVAC Monitoring System
          </div>
        </div>

        <div className="system-status">
          <span className="status-dot" />
          SYSTEM ONLINE
        </div>
      </header>

      {/* KPI */}
      <section className="kpi-grid">

        <KPI
          title="POWER NOW"
          value={power.toFixed(1)}
          unit="kW"
          icon={<Zap />}
          status="LIVE"
        />

        <KPI
          title="ENERGY TODAY"
          value={energy.toFixed(1)}
          unit="kWh"
          icon={<Gauge />}
          status="TODAY"
        />

        <KPI
          title="COOLING LOAD"
          value={coolingLoad.toFixed(1)}
          unit="TR"
          icon={<Snowflake />}
          status="LIVE"
        />

        <KPI
          title="ACTIVE ALARM"
          value="0"
          unit=""
          icon={<CheckCircle2 />}
          status="NORMAL"
          success
        />

      </section>

      {/* MAIN */}
      <section className="main-grid">

        {/* ENERGY */}
        <div className="panel">

          <div className="panel-header">

            <div>
              <h2>Energy Consumption</h2>
              <p>Real-time electrical power monitoring</p>
            </div>

            <div className="live-badge">
              <span />
              LIVE
            </div>

          </div>

          <div className="chart">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={history}>

                <defs>
                  <linearGradient
                    id="energyGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#263244"
                />

                <XAxis
                  dataKey="time"
                  stroke="#718096"
                />

                <YAxis
                  stroke="#718096"
                />

                <Tooltip
                  contentStyle={{
                    background: "#101827",
                    border: "1px solid #263244",
                    color: "#fff",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="power"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fill="url(#energyGradient)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* SYSTEM */}
        <div className="panel">

          <div className="panel-header">
            <div>
              <h2>System Overview</h2>
              <p>Building monitoring status</p>
            </div>
          </div>

          <SystemRow
            icon={<Server />}
            title="HVAC Units"
            value="3 / 3"
            status="ONLINE"
          />

          <SystemRow
            icon={<Zap />}
            title="Energy Meter"
            value={`${power.toFixed(1)} kW`}
            status="LIVE"
          />

          <SystemRow
            icon={<Snowflake />}
            title="Chiller System"
            value={`${coolingLoad.toFixed(0)} TR`}
            status="RUN"
          />

          <SystemRow
            icon={<AlertTriangle />}
            title="Alarm"
            value="0"
            status="NORMAL"
          />

          <div className="last-update">
            Last update:
            <strong>
              {time.toLocaleTimeString("th-TH")}
            </strong>
          </div>

        </div>

      </section>

      {/* HVAC */}
      <section className="panel hvac-panel">

        <div className="panel-header">

          <div>
            <h2>HVAC Equipment</h2>
            <p>Air Handling Unit monitoring</p>
          </div>

          <div className="equipment-count">
            3 UNITS
          </div>

        </div>

        <div className="ahu-grid">

          {ahu.map((unit) => (

            <div className="ahu-card" key={unit.id}>

              <div className="ahu-header">

                <div>
                  <h3>{unit.id}</h3>
                  <span>Air Handling Unit</span>
                </div>

                <div className="run-status">
                  <span />
                  {unit.status}
                </div>

              </div>

              <div className="metrics">

                <Metric
                  icon={<Thermometer />}
                  title="SUPPLY AIR"
                  value={`${unit.supply} °C`}
                />

                <Metric
                  icon={<Thermometer />}
                  title="RETURN AIR"
                  value={`${unit.returnAir} °C`}
                />

                <Metric
                  icon={<Droplets />}
                  title="HUMIDITY"
                  value={`${unit.humidity} %`}
                />

                <Metric
                  icon={<Wind />}
                  title="POWER"
                  value={`${unit.power} kW`}
                />

              </div>

            </div>

          ))}

        </div>

      </section>

      <footer>
        Smart Building Energy Management System
        <span>•</span>
        Real-time Monitoring
      </footer>
      </>
) : (

  <EquipmentPage />

)}
    </div>
  );
}

function KPI({
  title,
  value,
  unit,
  icon,
  status,
  success = false,
}: {
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  status: string;
  success?: boolean;
}) {
  return (
    <div className="kpi-card">

      <div className="kpi-top">
        <span>{title}</span>

        <div className="kpi-icon">
          {icon}
        </div>
      </div>

      <div className="kpi-value">
        {value}
        <small>{unit}</small>
      </div>

      <div className={success ? "kpi-status success" : "kpi-status"}>
        {status}
      </div>

    </div>
  );
}

function SystemRow({
  icon,
  title,
  value,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  status: string;
}) {
  return (
    <div className="system-row">

      <div className="system-icon">
        {icon}
      </div>

      <div className="system-info">
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

      <div className="system-state">
        {status}
      </div>

    </div>
  );
}

function Metric({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="metric">

      <div className="metric-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

export default App;