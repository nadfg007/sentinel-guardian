export function EventsSection() {
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
