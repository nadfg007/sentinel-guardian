import { useState } from "react";
import { useLang, type Lang } from "@/context/LangContext";
import { usersStore } from "@/data/usersStore";

type ThemeMode = "dark" | "light";

export function SettingsSection({ theme, setTheme, onLogout, role, currentUser, lang, setLang }: {
  theme: ThemeMode; setTheme: (t: ThemeMode) => void; onLogout: () => void;
  role: string; currentUser: string; lang: Lang; setLang: (l: Lang) => void;
}) {
  const { t } = useLang();
  const [newUser, setNewUser] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newRole, setNewRole] = useState("analyst");
  const [curPass, setCurPass] = useState("");
  const [chPass, setChPass] = useState("");
  const [chPass2, setChPass2] = useState("");

  const inputCls = "w-full p-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="space-y-6">
      <h2 className="font-title text-xl text-primary neon-text">{t.settings}</h2>
      <div className="card-sentinel rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground">🎨 {t.appearance}</h3>
        <div className="flex gap-3">
          <button onClick={() => setTheme("dark")} className={`flex-1 py-3 rounded-lg font-bold transition ${theme === "dark" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>🌙 {t.dark}</button>
          <button onClick={() => setTheme("light")} className={`flex-1 py-3 rounded-lg font-bold transition ${theme === "light" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>☀️ {t.light}</button>
        </div>
      </div>
      <div className="card-sentinel rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground">🌐 {t.language}</h3>
        <div className="flex gap-3">
          <button onClick={() => setLang("es")} className={`flex-1 py-3 rounded-lg font-bold transition ${lang === "es" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>🇪🇸 Español</button>
          <button onClick={() => setLang("en")} className={`flex-1 py-3 rounded-lg font-bold transition ${lang === "en" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>🇺🇸 English</button>
        </div>
      </div>
      <div className="card-sentinel rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground">🔑 {t.changePassword}</h3>
        <input className={inputCls} type="password" placeholder={t.currentPass} value={curPass} onChange={(e) => setCurPass(e.target.value)} />
        <input className={inputCls} type="password" placeholder={t.newPass} value={chPass} onChange={(e) => setChPass(e.target.value)} />
        <input className={inputCls} type="password" placeholder={t.confirmPass} value={chPass2} onChange={(e) => setChPass2(e.target.value)} />
        <button onClick={() => {
          if (chPass !== chPass2) { alert(t.passMismatch); return; }
          if (usersStore[currentUser]?.password !== curPass) { alert(t.wrongCurrentPass); return; }
          usersStore[currentUser].password = chPass;
          setCurPass(""); setChPass(""); setChPass2("");
          alert(t.passUpdated);
        }} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90">{t.updatePass}</button>
      </div>
      {role === "admin" && (
        <div className="card-sentinel rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground">👥 {t.userMgmt}</h3>
          <input className={inputCls} placeholder={t.newUser} value={newUser} onChange={(e) => setNewUser(e.target.value)} />
          <input className={inputCls} type="password" placeholder={t.password} value={newPass} onChange={(e) => setNewPass(e.target.value)} />
          <select className={inputCls} value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={() => {
            if (newUser && newPass) {
              usersStore[newUser.toLowerCase()] = { password: newPass, role: newRole };
              alert(`${t.userCreated}: ${newUser}`);
              setNewUser(""); setNewPass("");
            }
          }} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90">{t.createUser}</button>
        </div>
      )}
      <div className="card-sentinel rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground">📦 {t.agentInstaller}</h3>
        <button onClick={() => {
          const batch = `@echo off\necho SENTINEL AGENT INSTALLER\npause`;
          const blob = new Blob([batch], { type: "application/bat" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = "install_agent.bat";
          document.body.appendChild(a); a.click();
          document.body.removeChild(a); URL.revokeObjectURL(url);
        }} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90">
          {t.downloadInstaller}
        </button>
      </div>
    </div>
  );
}
