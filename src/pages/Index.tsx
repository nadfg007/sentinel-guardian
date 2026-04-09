import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LangContext, T, type Lang } from "@/context/LangContext";
import { type Section, NAV_ITEMS } from "@/data/navItems";
import { LoginScreen } from "@/components/sentinel/LoginScreen";
import { DashboardSection } from "@/components/sentinel/DashboardSection";
import { AlertsSection } from "@/components/sentinel/AlertsSection";
import { EventsSection } from "@/components/sentinel/EventsSection";
import { ThreatSection } from "@/components/sentinel/ThreatSection";
import { SentinelAISection } from "@/components/sentinel/SentinelAISection";
import { AgentsSection } from "@/components/sentinel/AgentsSection";
import { RulesSection } from "@/components/sentinel/RulesSection";
import { SettingsSection } from "@/components/sentinel/SettingsSection";

type ThemeMode = "dark" | "light";

export default function Index() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [role, setRole] = useState("");
  const [section, setSection] = useState<Section>("dashboard");
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem("sentinel-theme") as ThemeMode) || "dark");
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("sentinel-lang") as Lang) || "es");
  const [notifications] = useState([
    { time: "14:32", msg: "Brute Force SSH detectado" },
    { time: "14:28", msg: "Firma de malware encontrada" },
  ]);
  const [showNotifs, setShowNotifs] = useState(false);
  const t = T[lang];

  useEffect(() => {
    localStorage.setItem("sentinel-theme", theme);
    document.documentElement.classList.remove("light", "dark");
    if (theme === "light") document.documentElement.classList.add("light");
  }, [theme]);

  useEffect(() => { localStorage.setItem("sentinel-lang", lang); }, [lang]);

  const langCtx = { t, lang };

  if (!loggedIn) {
    return (
      <LangContext.Provider value={langCtx}>
        <LoginScreen onLogin={(u, r) => { setUser(u); setRole(r); setLoggedIn(true); }} />
      </LangContext.Provider>
    );
  }

  const renderSection = () => {
    switch (section) {
      case "dashboard": return <DashboardSection />;
      case "alerts": return <AlertsSection />;
      case "events": return <EventsSection />;
      case "threat": return <ThreatSection />;
      case "sentinel": return <SentinelAISection />;
      case "agents": return <AgentsSection />;
      case "rules": return <RulesSection />;
      case "settings": return <SettingsSection theme={theme} setTheme={setTheme} onLogout={() => setLoggedIn(false)} role={role} currentUser={user} lang={lang} setLang={setLang} />;
    }
  };

  return (
    <LangContext.Provider value={langCtx}>
      <div className="flex min-h-screen bg-background">
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
                <span>{item.icon}</span> {t[item.labelKey]}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-sidebar-border">
            <button onClick={() => setLoggedIn(false)} className="w-full py-2 rounded-lg bg-destructive/20 text-destructive text-sm font-bold hover:bg-destructive/30 transition">
              🚪 {t.logout}
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
            <p className="text-sm text-muted-foreground">{t.welcome}, <span className="text-primary font-bold">{user}</span></p>
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

          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </LangContext.Provider>
  );
}
