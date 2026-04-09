import { motion } from "framer-motion";

export function AlertsSection() {
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
