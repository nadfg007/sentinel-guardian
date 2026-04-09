import { useState } from "react";

export function SentinelAISection() {
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
