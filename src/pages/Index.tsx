import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───
type Section = "dashboard" | "alerts" | "events" | "threat" | "sentinel" | "agents" | "settings";
type ThemeMode = "dark" | "light";

const NAV_ITEMS: { id: Section; icon: string; label: string }[] = [
  { id: "dashboard", icon: "📊", label: "DASHBOARD" },
  { id: "alerts", icon: "🔔", label: "ALERTS" },
  { id: "events", icon: "📋", label: "EVENTS" },
  { id: "threat", icon: "🌐", label: "THREAT INTEL" },
  { id: "sentinel", icon: "🤖", label: "SENTINEL AI" },
  { id: "agents", icon: "💻", label: "AGENTS" },
  { id: "settings", icon: "⚙️", label: "SETTINGS" },
];

// ─── Login ───
function LoginScreen({ onLogin }: { onLogin: (user: string, role: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const users: Record<string, { password: string; role: string }> = {
    admin: { password: "admin", role: "admin" },
    nadia: { password: "1234", role: "admin" },
  };

  const handleLogin = () => {
    const u = users[username.toLowerCase()];
    if (u && u.password === password) {
      onLogin(username, u.role);
    } else {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card-sentinel rounded-2xl p-10 w-full max-w-md text-center space-y-6"
      >
        <div className="text-6xl font-title font-bold text-primary neon-text">S</div>
        <h1 className="font-title text-2xl text-primary neon-text">SENTINEL AI</h1>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <input
          className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <input
          className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition"
        >
          INICIAR SESIÓN
        </button>
        <p className="text-xs text-muted-foreground">Prueba: nadia/1234 o admin/admin</p>
      </motion.div>
    </div>
  );
}

// ─── Stat Card ───
function StatCard({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <div className="card-sentinel rounded-xl p-5 flex items-center gap-4">
      <span className={`text-3xl ${color}`}>{icon}</span>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

// ─── Dashboard ───
function DashboardSection() {
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

// ─── Alerts ───
function AlertsSection() {
  const alerts = [
    { sev: "CRITICAL", msg: "Brute Force SSH detected - 10.0.1.50", time: "14:32:01", color: "bg-destructive" },
    { sev: "HIGH", msg: "Malware signature - trojan.gen2", time: "14:28:15", color: "bg-warning" },
    { sev: "MEDIUM", msg: "Failed login attempts > 5 - user: admin", time: "14:15:03", color: "bg-warning" },
    { sev: "LOW", msg: "Port scan detected from 192.168.1.100", time: "13:55:22", color: "bg-primary" },
    { sev: "CRITICAL", msg: "Ransomware behavior detected - WIN-SRV01", time: "13:42:10", color: "bg-destructive" },
  ];
  return (
    <div className="space-y-4">
      <h2 className="font-title text-xl text-primary neon-text">Alertas en Tiempo Real</h2>
      {alerts.map((a, i) => (
        <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="card-sentinel rounded-xl p-4 flex items-center gap-4">
          <span className={`${a.color} text-xs font-bold px-2 py-1 rounded text-primary-foreground`}>{a.sev}</span>
          <p className="flex-1 text-sm text-foreground">{a.msg}</p>
          <span className="text-xs text-muted-foreground">{a.time}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Events ───
function EventsSection() {
  const events = [
    { time: "14:32:01", src: "10.0.1.50", dst: "192.168.1.1", type: "SSH Brute Force", sev: "Critical" },
    { time: "14:28:15", src: "172.16.0.25", dst: "10.0.1.100", type: "Malware Download", sev: "High" },
    { time: "14:15:03", src: "192.168.1.45", dst: "10.0.1.10", type: "Failed Auth", sev: "Medium" },
    { time: "13:55:22", src: "192.168.1.100", dst: "10.0.0.0/24", type: "Port Scan", sev: "Low" },
  ];
  return (
    <div className="space-y-4">
      <h2 className="font-title text-xl text-primary neon-text">Eventos de Seguridad</h2>
      <div className="card-sentinel rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary text-muted-foreground">
              <th className="p-3 text-left">Hora</th><th className="p-3 text-left">Origen</th><th className="p-3 text-left">Destino</th><th className="p-3 text-left">Tipo</th><th className="p-3 text-left">Severidad</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/50">
                <td className="p-3 text-muted-foreground">{e.time}</td>
                <td className="p-3 text-foreground">{e.src}</td>
                <td className="p-3 text-foreground">{e.dst}</td>
                <td className="p-3 text-foreground">{e.type}</td>
                <td className="p-3"><span className={`text-xs font-bold px-2 py-1 rounded ${e.sev === "Critical" ? "bg-destructive text-destructive-foreground" : e.sev === "High" ? "bg-warning text-warning-foreground" : e.sev === "Medium" ? "bg-warning/60 text-warning-foreground" : "bg-primary text-primary-foreground"}`}>{e.sev}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Threat Intel ───
function ThreatSection() {
  const iocs = [
    { type: "IP", value: "185.220.101.34", threat: "Tor Exit Node", risk: "High" },
    { type: "Hash", value: "a1b2c3d4e5f6...", threat: "Emotet Malware", risk: "Critical" },
    { type: "Domain", value: "evil-phish.com", threat: "Phishing", risk: "High" },
    { type: "IP", value: "45.33.32.156", threat: "C2 Server", risk: "Critical" },
  ];
  return (
    <div className="space-y-4">
      <h2 className="font-title text-xl text-primary neon-text">Threat Intelligence</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {iocs.map((ioc, i) => (
          <div key={i} className="card-sentinel rounded-xl p-5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded">{ioc.type}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${ioc.risk === "Critical" ? "bg-destructive text-destructive-foreground" : "bg-warning text-warning-foreground"}`}>{ioc.risk}</span>
            </div>
            <p className="text-sm font-mono text-foreground">{ioc.value}</p>
            <p className="text-xs text-muted-foreground">{ioc.threat}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sentinel AI ───
function SentinelAISection() {
  const [aiServer, setAiServer] = useState("http://localhost:5000");
  return (
    <div className="space-y-6">
      <h2 className="font-title text-xl text-primary neon-text">SENTINEL AI</h2>
      <div className="card-sentinel rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground">CONFIGURACIÓN IA</h3>
        <div className="flex gap-3">
          <input className="flex-1 p-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" value={aiServer} onChange={(e) => setAiServer(e.target.value)} placeholder="Server URL" />
          <button onClick={() => alert(`Testing ${aiServer}...`)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90">Test</button>
        </div>
      </div>
      <div className="card-sentinel rounded-xl p-6">
        <h3 className="text-sm font-bold text-muted-foreground mb-3">ANÁLISIS RECIENTE</h3>
        <div className="space-y-3 text-sm text-foreground">
          <p>🟢 Network baseline normal - No anomalies detected</p>
          <p>🟡 Unusual traffic pattern on port 8443 - Investigating</p>
          <p>🔴 Potential data exfiltration - 10.0.1.50 → external IP</p>
        </div>
      </div>
    </div>
  );
}

// ─── Agents ───
function AgentsSection() {
  const agents = [
    { name: "WIN-SRV01", status: "Online" }, { name: "LINUX-AGENT02", status: "Online" },
    { name: "WEB-SRV03", status: "Online" }, { name: "DB-SRV04", status: "Offline" },
    { name: "WORKSTATION-05", status: "Online" }, { name: "FIREWALL-01", status: "Online" },
    { name: "PROXY-02", status: "Online" }, { name: "MAIL-SRV", status: "Online" },
    { name: "DNS-01", status: "Online" },
  ];
  return (
    <div className="space-y-4">
      <h2 className="font-title text-xl text-primary neon-text">Agentes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((a, i) => (
          <div key={i} className="card-sentinel rounded-xl p-5 flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${a.status === "Online" ? "bg-success pulse-dot" : "bg-destructive"}`} />
            <div>
              <p className="font-bold text-foreground">{a.name}</p>
              <p className={`text-xs ${a.status === "Online" ? "text-success" : "text-destructive"}`}>{a.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings ───
function SettingsSection({ theme, setTheme, onLogout }: { theme: ThemeMode; setTheme: (t: ThemeMode) => void; onLogout: () => void }) {
  const [newUser, setNewUser] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newRole, setNewRole] = useState("analyst");

  return (
    <div className="space-y-6">
      <h2 className="font-title text-xl text-primary neon-text">Configuración</h2>

      {/* Theme Toggle */}
      <div className="card-sentinel rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground">🎨 MODO DE APARIENCIA</h3>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme("dark")}
            className={`flex-1 py-3 rounded-lg font-bold transition ${theme === "dark" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            🌙 Oscuro
          </button>
          <button
            onClick={() => setTheme("light")}
            className={`flex-1 py-3 rounded-lg font-bold transition ${theme === "light" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            ☀️ Claro
          </button>
        </div>
      </div>

      {/* User Management */}
      <div className="card-sentinel rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground">👥 GESTIÓN DE USUARIOS</h3>
        <input className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Nuevo usuario" value={newUser} onChange={(e) => setNewUser(e.target.value)} />
        <input className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" type="password" placeholder="Contraseña" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
        <select className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
          <option value="analyst">Analyst</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={() => { if (newUser && newPass) { alert(`Usuario ${newUser} creado`); setNewUser(""); setNewPass(""); } }} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90">Crear Usuario</button>
      </div>

      {/* Agent Installer */}
      <div className="card-sentinel rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground">📦 INSTALADOR DE AGENTE</h3>
        <button onClick={() => {
          const batch = `@echo off\necho SENTINEL AGENT INSTALLER\npause`;
          const blob = new Blob([batch], { type: "application/bat" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = "install_agent.bat";
          document.body.appendChild(a); a.click();
          document.body.removeChild(a); URL.revokeObjectURL(url);
        }} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90">
          Descargar Instalador (.bat)
        </button>
      </div>
    </div>
  );
}

// ─── Main App ───
export default function Index() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [section, setSection] = useState<Section>("dashboard");
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem("sentinel-theme") as ThemeMode) || "dark");
  const [notifications] = useState([
    { time: "14:32", msg: "Brute Force SSH detectado" },
    { time: "14:28", msg: "Firma de malware encontrada" },
  ]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    localStorage.setItem("sentinel-theme", theme);
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  if (!loggedIn) {
    return <LoginScreen onLogin={(u) => { setUser(u); setLoggedIn(true); }} />;
  }

  const renderSection = () => {
    switch (section) {
      case "dashboard": return <DashboardSection />;
      case "alerts": return <AlertsSection />;
      case "events": return <EventsSection />;
      case "threat": return <ThreatSection />;
      case "sentinel": return <SentinelAISection />;
      case "agents": return <AgentsSection />;
      case "settings": return <SettingsSection theme={theme} setTheme={setTheme} onLogout={() => setLoggedIn(false)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar flex flex-col border-r border-sidebar-border shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
          <span className="text-3xl font-title font-bold text-primary neon-text">S</span>
          <div>
            <p className="font-title text-sm font-bold text-primary neon-text">SENTINEL</p>
            <p className="text-xs text-muted-foreground">AI GUARDIAN v2.0</p>
          </div>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full text-left px-6 py-3 text-sm flex items-center gap-3 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${section === item.id ? "nav-item-active" : "text-sidebar-foreground"}`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <button onClick={() => setLoggedIn(false)} className="w-full py-2 rounded-lg bg-destructive/20 text-destructive text-sm font-bold hover:bg-destructive/30 transition">
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
          <p className="text-sm text-muted-foreground">Bienvenido, <span className="text-primary font-bold">{user}</span></p>
          <div className="relative">
            <button onClick={() => setShowNotifs(!showNotifs)} className="relative text-muted-foreground hover:text-primary transition">
              🔔
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-destructive text-destructive-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{notifications.length}</span>
              )}
            </button>
            {showNotifs && (
              <div className="absolute right-0 top-10 w-72 card-sentinel rounded-xl p-4 z-50 space-y-2">
                {notifications.map((n, i) => (
                  <div key={i} className="flex gap-2 text-xs">
                    <span className="text-muted-foreground">{n.time}</span>
                    <span className="text-foreground">{n.msg}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
