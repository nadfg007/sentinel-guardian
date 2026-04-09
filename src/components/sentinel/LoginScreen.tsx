import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { usersStore } from "@/data/usersStore";

export function LoginScreen({ onLogin }: { onLogin: (user: string, role: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { t } = useLang();

  const handleLogin = () => {
    const u = usersStore[username.toLowerCase()];
    if (u && u.password === password) {
      onLogin(username.toLowerCase(), u.role);
    } else {
      setError(t.invalidCreds);
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
          placeholder={t.user}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <input
          className="w-full p-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          type="password"
          placeholder={t.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition"
        >
          {t.login}
        </button>
        <p className="text-xs text-muted-foreground">{t.hint}</p>
      </motion.div>
    </div>
  );
}
