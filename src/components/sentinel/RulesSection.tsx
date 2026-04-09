import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";

export type Rule = {
  id: string; desc: string; level: number; group: string; enabled: boolean;
  decoded_as?: string; match?: string; if_sid?: string;
  frequency?: number; timeframe?: number; options?: string;
};

const defaultRules: Rule[] = [
  { id: "100001", desc: "SSH Brute Force - Multiple failed authentication attempts", level: 10, group: "authentication", enabled: true, decoded_as: "sshd", match: "Failed password", frequency: 8, timeframe: 120 },
  { id: "100002", desc: "Malware signature detected in network traffic", level: 12, group: "malware", enabled: true, decoded_as: "snort", match: "MALWARE-CNC" },
  { id: "100003", desc: "Privilege escalation attempt detected", level: 14, group: "privilege_escalation", enabled: true, decoded_as: "syslog", match: "sudo.*FAILED|su.*failed" },
  { id: "100004", desc: "Port scan detected from external source", level: 6, group: "network_scan", enabled: true, decoded_as: "firewall", match: "DROP.*SRC" },
  { id: "100005", desc: "Unauthorized file modification in /etc", level: 10, group: "file_integrity", enabled: true, decoded_as: "syscheck", options: "no_email_alert" },
  { id: "100006", desc: "SQL injection attempt on web application", level: 12, group: "web_attack", enabled: false, decoded_as: "apache", match: "select.*from|union.*select|drop.*table" },
  { id: "100007", desc: "Rootkit behavior detected on endpoint", level: 15, group: "rootkit", enabled: true, decoded_as: "rootcheck" },
  { id: "100008", desc: "DNS exfiltration pattern detected", level: 8, group: "data_exfiltration", enabled: true, decoded_as: "named", match: "query.*TXT.*long" },
  { id: "100009", desc: "Failed sudo attempt by non-privileged user", level: 5, group: "authentication", enabled: true, decoded_as: "sudo", match: "NOT in sudoers", if_sid: "100001" },
  { id: "100010", desc: "Ransomware file encryption behavior", level: 15, group: "malware", enabled: true, decoded_as: "syscheck", match: "encrypted|.locked|.crypto", options: "alert_by_email" },
];

function escapeXML(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function ruleToXML(r: Rule): string {
  let xml = `<group name="${r.group}">\n  <rule id="${r.id}" level="${r.level}"`;
  if (r.frequency) xml += ` frequency="${r.frequency}" timeframe="${r.timeframe || 0}"`;
  xml += `>\n`;
  if (r.decoded_as) xml += `    <decoded_as>${r.decoded_as}</decoded_as>\n`;
  if (r.match) xml += `    <match>${escapeXML(r.match)}</match>\n`;
  if (r.if_sid) xml += `    <if_sid>${r.if_sid}</if_sid>\n`;
  if (r.options) xml += `    <options>${r.options}</options>\n`;
  xml += `    <description>${escapeXML(r.desc)}</description>\n`;
  xml += `  </rule>\n</group>`;
  return xml;
}

function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

export function RulesSection() {
  const { t } = useLang();
  const [rules, setRules] = useState<Rule[]>(defaultRules);
  const [showAdd, setShowAdd] = useState(false);
  const [newRule, setNewRule] = useState<Partial<Rule>>({ id: "", desc: "", level: 5, group: "", enabled: true, decoded_as: "", match: "", if_sid: "", options: "" });
  const [filter, setFilter] = useState("");
  const [viewingRule, setViewingRule] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  const inputCls = "w-full p-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

  const toggleRule = (id: string) => setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  const deleteRule = (id: string) => {
    if (confirm(t.confirmDelete)) {
      setRules(rules.filter(r => r.id !== id));
      if (viewingRule === id) setViewingRule(null);
    }
  };

  const filteredRules = rules.filter(r =>
    r.id.includes(filter) || r.desc.toLowerCase().includes(filter.toLowerCase()) || r.group.toLowerCase().includes(filter.toLowerCase())
  );

  const levelColor = (lvl: number) =>
    lvl >= 12 ? "bg-destructive text-destructive-foreground" :
    lvl >= 8 ? "bg-warning text-warning-foreground" :
    "bg-primary text-primary-foreground";

  // Detail view
  if (viewingRule) {
    const r = rules.find(x => x.id === viewingRule);
    if (!r) { setViewingRule(null); return null; }
    return (
      <div className="space-y-4">
        <button onClick={() => setViewingRule(null)} className="text-sm text-primary hover:underline">← {t.backToRules}</button>
        <div className="card-sentinel rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-xl text-primary neon-text">{t.ruleDetails}: {r.id}</h2>
            <div className="flex gap-2">
              <button onClick={() => { setEditingRule({ ...r }); setViewingRule(null); }} className="px-3 py-1 rounded bg-warning/20 text-warning text-xs font-bold">✏️ {t.editRule}</button>
              <button onClick={() => deleteRule(r.id)} className="px-3 py-1 rounded bg-destructive/20 text-destructive text-xs font-bold">🗑️ {t.deleteRule}</button>
              <button onClick={() => toggleRule(r.id)} className={`px-3 py-1 rounded text-xs font-bold ${r.enabled ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
                {r.enabled ? t.ruleEnabled : t.ruleDisabled}
              </button>
              <button onClick={() => downloadJSON({ ...r, xml: ruleToXML(r) }, `rule_${r.id}.json`)} className="px-3 py-1 rounded bg-primary/20 text-primary text-xs font-bold">📥 {t.exportJson}</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">{t.ruleDesc}:</span><p className="text-foreground">{r.desc}</p></div>
            <div><span className="text-muted-foreground">{t.ruleLevel}:</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden"><div className={`h-full ${lvl >= 12 ? "bg-destructive" : lvl >= 8 ? "bg-warning" : "bg-primary"}`} style={{ width: `${(r.level / 15) * 100}%` }} /></div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${levelColor(r.level)}`}>{r.level}</span>
              </div>
            </div>
            <div><span className="text-muted-foreground">{t.ruleGroup}:</span><p className="mt-1"><span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded">{r.group}</span></p></div>
            {r.decoded_as && <div><span className="text-muted-foreground">{t.decodedAs}:</span><p className="text-foreground font-mono text-xs mt-1">{r.decoded_as}</p></div>}
            {r.match && <div><span className="text-muted-foreground">{t.match}:</span><p className="text-foreground font-mono text-xs mt-1">{r.match}</p></div>}
            {r.if_sid && <div><span className="text-muted-foreground">{t.ifSid}:</span><p className="text-foreground font-mono text-xs mt-1">{r.if_sid}</p></div>}
            {r.frequency && <div><span className="text-muted-foreground">{t.frequency}:</span><p className="text-foreground mt-1">{r.frequency} / {r.timeframe}s</p></div>}
            {r.options && <div><span className="text-muted-foreground">{t.options}:</span><p className="text-foreground font-mono text-xs mt-1">{r.options}</p></div>}
          </div>

          <div>
            <h3 className="text-sm font-bold text-muted-foreground mb-2">📄 {t.xmlSource}</h3>
            <pre className="code-block text-xs p-4 rounded-lg overflow-x-auto">{ruleToXML(r)}</pre>
          </div>
        </div>
      </div>
    );
  }

  // Edit form
  if (editingRule) {
    return (
      <div className="space-y-4">
        <button onClick={() => setEditingRule(null)} className="text-sm text-primary hover:underline">← {t.backToRules}</button>
        <div className="card-sentinel rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground">✏️ {t.editRule}: {editingRule.id}</h3>
          <input className={inputCls} placeholder={t.ruleDesc} value={editingRule.desc} onChange={e => setEditingRule({ ...editingRule, desc: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t.ruleLevel} (0-15)</label>
              <input className={inputCls} type="number" min={0} max={15} value={editingRule.level} onChange={e => setEditingRule({ ...editingRule, level: Number(e.target.value) })} />
            </div>
            <input className={inputCls} placeholder={t.ruleGroup} value={editingRule.group} onChange={e => setEditingRule({ ...editingRule, group: e.target.value })} />
            <input className={inputCls} placeholder={t.decodedAs} value={editingRule.decoded_as || ""} onChange={e => setEditingRule({ ...editingRule, decoded_as: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className={inputCls} placeholder={t.match} value={editingRule.match || ""} onChange={e => setEditingRule({ ...editingRule, match: e.target.value })} />
            <input className={inputCls} placeholder={t.ifSid} value={editingRule.if_sid || ""} onChange={e => setEditingRule({ ...editingRule, if_sid: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className={inputCls} placeholder={t.frequency} type="number" value={editingRule.frequency || ""} onChange={e => setEditingRule({ ...editingRule, frequency: Number(e.target.value) || undefined })} />
            <input className={inputCls} placeholder={t.timeframe} type="number" value={editingRule.timeframe || ""} onChange={e => setEditingRule({ ...editingRule, timeframe: Number(e.target.value) || undefined })} />
            <input className={inputCls} placeholder={t.options} value={editingRule.options || ""} onChange={e => setEditingRule({ ...editingRule, options: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => {
              setRules(rules.map(r => r.id === editingRule.id ? editingRule : r));
              setEditingRule(null);
            }} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition">{t.update}</button>
            <button onClick={() => setEditingRule(null)} className="px-6 py-3 rounded-lg bg-secondary text-muted-foreground font-bold hover:opacity-90 transition">{t.cancel}</button>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-title text-xl text-primary neon-text">{t.rulesTitle}</h2>
        <div className="flex gap-2">
          <button onClick={() => downloadJSON(rules.map(r => ({ ...r, xml: ruleToXML(r) })), "sentinel_rules.json")} className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground font-bold text-sm hover:text-foreground transition">
            📥 {t.exportAll}
          </button>
          <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition">
            + {t.addRule}
          </button>
        </div>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="card-sentinel rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground">➕ {t.addRule}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className={inputCls} placeholder={t.ruleId} value={newRule.id} onChange={e => setNewRule({ ...newRule, id: e.target.value })} />
            <input className={inputCls} placeholder={t.ruleGroup} value={newRule.group} onChange={e => setNewRule({ ...newRule, group: e.target.value })} />
          </div>
          <input className={inputCls} placeholder={t.ruleDesc} value={newRule.desc} onChange={e => setNewRule({ ...newRule, desc: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t.ruleLevel} (0-15)</label>
              <input className={inputCls} type="number" min={0} max={15} value={newRule.level} onChange={e => setNewRule({ ...newRule, level: Number(e.target.value) })} />
            </div>
            <input className={inputCls} placeholder={t.decodedAs} value={newRule.decoded_as} onChange={e => setNewRule({ ...newRule, decoded_as: e.target.value })} />
            <input className={inputCls} placeholder={t.match} value={newRule.match} onChange={e => setNewRule({ ...newRule, match: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className={inputCls} placeholder={t.ifSid} value={newRule.if_sid} onChange={e => setNewRule({ ...newRule, if_sid: e.target.value })} />
            <input className={inputCls} placeholder={t.frequency} type="number" value={newRule.frequency || ""} onChange={e => setNewRule({ ...newRule, frequency: Number(e.target.value) || undefined })} />
            <input className={inputCls} placeholder={t.options} value={newRule.options} onChange={e => setNewRule({ ...newRule, options: e.target.value })} />
          </div>
          <button onClick={() => {
            if (newRule.id && newRule.desc && newRule.group) {
              setRules([...rules, { id: newRule.id!, desc: newRule.desc!, level: newRule.level || 5, group: newRule.group!, enabled: true, decoded_as: newRule.decoded_as, match: newRule.match, if_sid: newRule.if_sid, frequency: newRule.frequency, timeframe: newRule.timeframe, options: newRule.options }]);
              setNewRule({ id: "", desc: "", level: 5, group: "", enabled: true, decoded_as: "", match: "", if_sid: "", options: "" });
              setShowAdd(false);
            }
          }} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition">
            {t.save}
          </button>
        </motion.div>
      )}

      <input className={inputCls} placeholder="🔍 Filter rules..." value={filter} onChange={e => setFilter(e.target.value)} />

      <div className="card-sentinel rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary text-muted-foreground">
              <th className="p-3 text-left">{t.ruleId}</th>
              <th className="p-3 text-left">{t.ruleDesc}</th>
              <th className="p-3 text-left">{t.ruleLevel}</th>
              <th className="p-3 text-left">{t.ruleGroup}</th>
              <th className="p-3 text-center">{t.ruleStatus}</th>
              <th className="p-3 text-center">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredRules.map(r => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/50 cursor-pointer" onClick={() => setViewingRule(r.id)}>
                <td className="p-3 font-mono text-primary">{r.id}</td>
                <td className="p-3 text-foreground">{r.desc}</td>
                <td className="p-3"><span className={`text-xs font-bold px-2 py-1 rounded ${levelColor(r.level)}`}>{r.level}</span></td>
                <td className="p-3"><span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded">{r.group}</span></td>
                <td className="p-3 text-center">
                  <button onClick={(e) => { e.stopPropagation(); toggleRule(r.id); }} className={`text-xs font-bold px-3 py-1 rounded transition ${r.enabled ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
                    {r.enabled ? t.enabled : t.disabled}
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button onClick={(e) => { e.stopPropagation(); setEditingRule({ ...r }); }} className="text-xs px-2 py-1 hover:bg-warning/20 rounded transition" title={t.editRule}>✏️</button>
                  <button onClick={(e) => { e.stopPropagation(); deleteRule(r.id); }} className="text-xs px-2 py-1 hover:bg-destructive/20 rounded transition" title={t.deleteRule}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
