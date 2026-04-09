export function AgentsSection() {
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
