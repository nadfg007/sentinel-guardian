export function ThreatSection() {
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
