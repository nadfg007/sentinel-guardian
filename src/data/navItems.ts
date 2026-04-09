export type Section = "dashboard" | "alerts" | "events" | "threat" | "sentinel" | "agents" | "rules" | "settings";

export const NAV_ITEMS: { id: Section; icon: string; labelKey: string }[] = [
  { id: "dashboard", icon: "📊", labelKey: "dashboard" },
  { id: "alerts", icon: "🔔", labelKey: "alerts" },
  { id: "events", icon: "📋", labelKey: "events" },
  { id: "threat", icon: "🌐", labelKey: "threatIntel" },
  { id: "sentinel", icon: "🤖", labelKey: "sentinelAi" },
  { id: "agents", icon: "💻", labelKey: "agents" },
  { id: "rules", icon: "📜", labelKey: "rules" },
  { id: "settings", icon: "⚙️", labelKey: "settings" },
];
