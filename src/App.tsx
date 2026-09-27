import { useEffect, useState } from "react";

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
  CheckCircle2,
  Droplets,
  Gauge,
  Minus,
  Plus,
  Power,
  Server,
  Snowflake,
  Thermometer,
  Wind,
  Zap,
} from "lucide-react";

import EquipmentPage from "./components/EquipmentPage";
import "./App.css";


interface HVACUnit {
  id: string;
  status: "RUN" | "STOP";
  supply: number;
  returnAir: number;
  humidity: number;
  power: number;
  setTemperature: number;
}


interface EnergyPoint {
  time: string;
  power: number;
}


/*
 * Dashboard-side AHU controls.
 *
 * This version keeps the ON/OFF state and set temperature inside App.tsx,
 * so the controls work directly from the Dashboard AHU cards.
 *
 * Temperature range:
 *   16 - 30 °C
 *
 * Temperature step:
 *   1 °C
 */


const DASHBOARD_AHU_STYLES = `
.dashboard-ahu-control {
  margin-top: 14px;
  padding-top: 13px;
  border-top: 1px solid #1b2737;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dashboard-ahu-temperature {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.dashboard-ahu-temperature > span {
  color: #64748b;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.dashboard-ahu-temperature-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dashboard-ahu-temperature-row strong {
  min-width: 55px;
  color: #e5edf7;
  font-size: 14px;
  text-align: center;
}

.dashboard-temp-button {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid #28415c;
  border-radius: 7px;
  background: #102238;
  color: #38bdf8;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.15s ease;
}

.dashboard-temp-button:hover {
  background: #16314d;
  border-color: #38bdf8;
}

.dashboard-temp-button:active {
  transform: scale(0.94);
}

.dashboard-temp-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.dashboard-ahu-power {
  width: 100%;
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 7px 12px;
  border-radius: 7px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.15s ease;
}

.dashboard-ahu-power:active {
  transform: scale(0.99);
}

.dashboard-ahu-power.running {
  border: 1px solid #00c878;
  background: rgba(0, 200, 120, 0.1);
  color: #4ade80;
}

.dashboard-ahu-power.running:hover {
  background: rgba(0, 200, 120, 0.18);
}

.dashboard-ahu-power.stopped {
  border: 1px solid #38bdf8;
  background: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
}

.dashboard-ahu-power.stopped:hover {
  background: rgba(56, 189, 248, 0.18);
}

.run-status.stopped {
  color: #94a3b8;
}

.run-status.stopped span {
  background: #64748b;
  box-shadow: none;
}
`;


function App() {

  const [page, setPage] =
    useState<"dashboard" | "equipment">("dashboard");


  const [power, setPower] =
    useState(15.8);


  const [energy, setEnergy] =
    useState(245);


  const [coolingLoad, setCoolingLoad] =
    useState(120);


  const [time, setTime] =
    useState(new Date());


  const [history, setHistory] =
    useState<EnergyPoint[]>([
      { time: "08:00", power: 11.2 },
      { time: "09:00", power: 13.5 },
      { time: "10:00", power: 15.1 },
      { time: "11:00", power: 16.8 },
      { time: "12:00", power: 18.2 },
      { time: "13:00", power: 17.4 },
      { time: "14:00", power: 16.1 },
      { time: "15:00", power: 15.8 },
    ]);


  const [ahu, setAhu] =
    useState<HVACUnit[]>([
      {
        id: "AHU-01",
        status: "RUN",
        supply: 14.5,
        returnAir: 24.8,
        humidity: 55,
        power: 3.2,
        setTemperature: 24,
      },
      {
        id: "AHU-02",
        status: "RUN",
        supply: 15.1,
        returnAir: 25.2,
        humidity: 57,
        power: 3.5,
        setTemperature: 24,
      },
      {
        id: "AHU-03",
        status: "RUN",
        supply: 13.9,
        returnAir: 24.1,
        humidity: 53,
        power: 3.8,
        setTemperature: 24,
      },
    ]);


  /*
   * Mock real-time data.
   *
   * Important:
   * This updater changes only live sensor values.
   * It does NOT overwrite:
   *   - status
   *   - setTemperature
   *
   * Therefore a manual ON/OFF or temperature command remains in place.
   */

  useEffect(() => {

    const interval = window.setInterval(() => {

      const newPower =
        14 + Math.random() * 5;

      const newCooling =
        110 + Math.random() * 25;

      setPower(
        Number(newPower.toFixed(1))
      );

      setCoolingLoad(
        Number(newCooling.toFixed(1))
      );

      setEnergy((current) =>
        Number(
          (current + newPower / 3600).toFixed(2)
        )
      );

      const now = new Date();

      setTime(now);

      const timeLabel =
        now.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

      setHistory((current) =>
        [
          ...current,
          {
            time: timeLabel,
            power: Number(newPower.toFixed(1)),
          },
        ].slice(-20)
      );


      setAhu((units) =>
        units.map((unit) => ({
          ...unit,

          supply: Number(
            (
              unit.supply +
              (Math.random() - 0.5) * 0.3
            ).toFixed(1)
          ),

          returnAir: Number(
            (
              unit.returnAir +
              (Math.random() - 0.5) * 0.4
            ).toFixed(1)
          ),

          humidity: Math.max(
            0,
            Math.min(
              100,
              Math.round(
                unit.humidity +
                (Math.random() - 0.5) * 2
              )
            )
          ),

          power: Number(
            (
              unit.power +
              (Math.random() - 0.5) * 0.2
            ).toFixed(1)
          ),
        }))
      );

    }, 1000);


    return () =>
      window.clearInterval(interval);

  }, []);


  /*
   * Increase / decrease AHU set temperature.
   *
   * Range: 16 - 30 °C
   * Step: 1 °C
   */

  const changeAHUTemperature = (
    id: string,
    amount: number
  ) => {

    setAhu((units) =>
      units.map((unit) => {

        if (unit.id !== id) {
          return unit;
        }

        const nextTemperature =
          unit.setTemperature + amount;

        const limitedTemperature =
          Math.max(
            16,
            Math.min(
              30,
              nextTemperature
            )
          );

        return {
          ...unit,
          setTemperature: limitedTemperature,
        };

      })
    );

  };


  /*
   * AHU ON / OFF command.
   *
   * This is currently a local/mock command.
   * It can later be replaced with MQTT / WebSocket / API.
   */

  const toggleAHU = (id: string) => {

    setAhu((units) =>
      units.map((unit) => {

        if (unit.id !== id) {
          return unit;
        }

        return {
          ...unit,
          status:
            unit.status === "RUN"
              ? "STOP"
              : "RUN",
        };

      })
    );

  };
/**
 * Sync AHU state from Equipment page
 *
 * ใช้ทำให้ Dashboard และ Equipment
 * ใช้สถานะ AHU ชุดเดียวกัน
 */
const updateAHUFromEquipment = (
  id: string,
  updates: {
    status?: "RUN" | "STOP";
    setTemperature?: number;
  }
) => {

  setAhu((units) =>
    units.map((unit) => {

      if (unit.id !== id) {
        return unit;
      }

      return {
        ...unit,
        ...updates,
      };

    })
  );

};

  const runningAHU =
    ahu.filter(
      (unit) => unit.status === "RUN"
    ).length;


  const alarmCount = 0;


  return (

    <div className="dashboard">

      <style>{DASHBOARD_AHU_STYLES}</style>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="navigation">

        <button
          type="button"
          className={
            page === "dashboard"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            setPage("dashboard")
          }
        >
          DASHBOARD
        </button>


        <button
          type="button"
          className={
            page === "equipment"
              ? "nav-active"
              : ""
          }
          onClick={() =>
            setPage("equipment")
          }
        >
          EQUIPMENT
        </button>

      </nav>


      {page === "equipment" ? (

        <EquipmentPage
    ahu={ahu}
    onToggleAHU={toggleAHU}
    onChangeAHUTemperature={changeAHUTemperature}
    onUpdateAHU={updateAHUFromEquipment}
  />

      ) : (

        <>

          {/* =====================================================
              HEADER
          ===================================================== */}

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



          {/* =====================================================
              KPI
          ===================================================== */}

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
              value={String(alarmCount)}
              unit=""
              icon={<CheckCircle2 />}
              status="NORMAL"
              success
            />

          </section>



          {/* =====================================================
              ENERGY + SYSTEM OVERVIEW
          ===================================================== */}

          <section className="main-grid">


            <div className="panel">

              <div className="panel-header">

                <div>

                  <h2>
                    Energy Consumption
                  </h2>

                  <p>
                    Real-time electrical power monitoring
                  </p>

                </div>


                <div className="live-badge">

                  <span />

                  LIVE

                </div>

              </div>


              <div className="chart">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

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



            <div className="panel">

              <div className="panel-header">

                <div>

                  <h2>
                    System Overview
                  </h2>

                  <p>
                    Building monitoring status
                  </p>

                </div>

              </div>


              <SystemRow
                icon={<Server />}
                title="HVAC Units"
                value={`${runningAHU} / ${ahu.length}`}
                status={
                  runningAHU === ahu.length
                    ? "ONLINE"
                    : "PARTIAL"
                }
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
                value={String(alarmCount)}
                status={
                  alarmCount === 0
                    ? "NORMAL"
                    : "CHECK"
                }
              />


              <div className="last-update">

                Last update:

                <strong>
                  {time.toLocaleTimeString("th-TH")}
                </strong>

              </div>

            </div>

          </section>



          {/* =====================================================
              HVAC EQUIPMENT
          ===================================================== */}

          <section className="panel hvac-panel">

            <div className="panel-header">

              <div>

                <h2>
                  HVAC Equipment
                </h2>

                <p>
                  Air Handling Unit monitoring
                </p>

              </div>


              <div className="equipment-count">
                {ahu.length} UNITS
              </div>

            </div>


            <div className="ahu-grid">

              {ahu.map((unit) => (

                <div
                  className="ahu-card"
                  key={unit.id}
                >


                  {/* =================================================
                      AHU HEADER
                  ================================================= */}

                  <div className="ahu-header">

                    <div>

                      <h3>
                        {unit.id}
                      </h3>

                      <span>
                        Air Handling Unit
                      </span>

                    </div>


                    <div
                      className={
                        unit.status === "RUN"
                          ? "run-status"
                          : "run-status stopped"
                      }
                    >

                      <span />

                      {unit.status}

                    </div>

                  </div>



                  {/* =================================================
                      SENSOR METRICS
                  ================================================= */}

                  <div className="metrics">

                    <Metric
                      icon={<Thermometer />}
                      title="SUPPLY AIR"
                      value={`${unit.supply.toFixed(1)} °C`}
                    />


                    <Metric
                      icon={<Thermometer />}
                      title="RETURN AIR"
                      value={`${unit.returnAir.toFixed(1)} °C`}
                    />


                    <Metric
                      icon={<Droplets />}
                      title="HUMIDITY"
                      value={`${unit.humidity} %`}
                    />


                    <Metric
                      icon={<Wind />}
                      title="POWER"
                      value={`${unit.power.toFixed(1)} kW`}
                    />

                  </div>



                  {/* =================================================
                      AHU CONTROL
                  ================================================= */}

                  <div className="dashboard-ahu-control">


                    <div className="dashboard-ahu-temperature">

                      <span>
                        SET TEMPERATURE
                      </span>


                      <div className="dashboard-ahu-temperature-row">


                        <button
                          type="button"
                          className="dashboard-temp-button"
                          onClick={() =>
                            changeAHUTemperature(
                              unit.id,
                              -1
                            )
                          }
                          disabled={
                            unit.setTemperature <= 16
                          }
                          aria-label={
                            `Decrease ${unit.id} set temperature`
                          }
                          title="Decrease temperature"
                        >

                          <Minus size={16} />

                        </button>


                        <strong>
                          {unit.setTemperature} °C
                        </strong>


                        <button
                          type="button"
                          className="dashboard-temp-button"
                          onClick={() =>
                            changeAHUTemperature(
                              unit.id,
                              1
                            )
                          }
                          disabled={
                            unit.setTemperature >= 30
                          }
                          aria-label={
                            `Increase ${unit.id} set temperature`
                          }
                          title="Increase temperature"
                        >

                          <Plus size={16} />

                        </button>

                      </div>

                    </div>



                    <button
                      type="button"
                      className={
                        unit.status === "RUN"
                          ? "dashboard-ahu-power running"
                          : "dashboard-ahu-power stopped"
                      }
                      onClick={() =>
                        toggleAHU(unit.id)
                      }
                      aria-label={
                        unit.status === "RUN"
                          ? `Turn off ${unit.id}`
                          : `Turn on ${unit.id}`
                      }
                    >

                      <Power size={16} />

                      {unit.status === "RUN"
                        ? "TURN OFF AHU"
                        : "TURN ON AHU"
                      }

                    </button>


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

      )}

    </div>

  );
}


/* =====================================================
   KPI
===================================================== */

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

        <span>
          {title}
        </span>


        <div className="kpi-icon">
          {icon}
        </div>

      </div>


      <div className="kpi-value">

        {value}

        <small>
          {unit}
        </small>

      </div>


      <div
        className={
          success
            ? "kpi-status success"
            : "kpi-status"
        }
      >
        {status}
      </div>

    </div>

  );
}


/* =====================================================
   SYSTEM ROW
===================================================== */

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

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

      </div>


      <div className="system-state">
        {status}
      </div>

    </div>

  );
}


/* =====================================================
   METRIC
===================================================== */

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

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>

  );
}


export default App;
