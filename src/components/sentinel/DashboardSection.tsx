import { useEffect, useRef } from "react";
import { StatCard } from "./StatCard";

export function DashboardSection() {
  const alertChartRef = useRef<HTMLCanvasElement>(null);
  const severityChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let c1: any, c2: any;
    const loadChart = async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);
      if (alertChartRef.current) {
        c1 = new Chart(alertChartRef.current, {
          type: "line",
          data: {
            labels: ["05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16"],
            datasets: [{ data: [18, 37, 12, 29, 34, 17, 31, 15, 28, 12, 35, 25], borderColor: "#22d3ee", tension: 0.4, fill: false }],
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: "#94a3b8" } }, y: { ticks: { color: "#94a3b8" } } } },
        });
      }
      if (severityChartRef.current) {
        c2 = new Chart(severityChartRef.current, {
          type: "doughnut",
          data: {
            labels: ["Low", "Medium", "High", "Critical"],
            datasets: [{ data: [63, 21, 11, 5], backgroundColor: ["#22d3ee", "#eab308", "#f59e0b", "#ef4444"] }],
          },
          options: { responsive: true, cutout: "72%", plugins: { legend: { labels: { color: "#94a3b8" } } } },
        });
      }
    };
    loadChart();
    return () => { c1?.destroy(); c2?.destroy(); };
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="font-title text-xl text-primary neon-text">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🔔" value="247" label="Alertas Totales" color="text-primary" />
        <StatCard icon="⚠️" value="12" label="Críticas" color="text-destructive" />
        <StatCard icon="💻" value="9" label="Agentes Activos" color="text-success" />
        <StatCard icon="🔍" value="1,847" label="Eventos/hora" color="text-warning" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-sentinel rounded-xl p-6">
          <h3 className="text-sm font-bold text-muted-foreground mb-4">ALERTAS (24H)</h3>
          <canvas ref={alertChartRef} />
        </div>
        <div className="card-sentinel rounded-xl p-6">
          <h3 className="text-sm font-bold text-muted-foreground mb-4">SEVERIDAD</h3>
          <canvas ref={severityChartRef} />
        </div>
      </div>
    </div>
  );
}
