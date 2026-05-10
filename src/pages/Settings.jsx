import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useApp } from "../store/AppContext";

const ACCENT_COLORS = ["#7c6aff", "#22d3a0", "#f59e0b", "#ef4444"];
const DAYS_OPTIONS = [3, 4, 5, 6];
const GOAL_OPTIONS = [
  "Ganar músculo",
  "Perder peso",
  "Mantenimiento",
  "Definición",
];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="w-11 h-6 rounded-full relative transition-colors duration-200"
      style={
        on
          ? { backgroundColor: "rgb(var(--accent))" }
          : {
              backgroundColor: "var(--toggle-off)",
              boxShadow: "0 0 0 1px var(--toggle-off-bd)",
            }
      }
    >
      <span
        className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all duration-200 ${
          on ? "left-[23px]" : "left-[3px]"
        }`}
      />
    </button>
  );
}

function SettingRow({ label, children, border = true }) {
  return (
    <div
      className={`flex items-center justify-between py-[14px] ${border ? "border-b border-border/60" : ""}`}
    >
      <span className="text-[15px] text-[#f0eeff]">{label}</span>
      {children}
    </div>
  );
}

export default function Settings() {
  const { preferences, accentColor, goals, updateState } = useApp();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("fitflow-dark-mode") !== "false",
  );
  const [toast, setToast] = useState(false);

  const prefs = preferences ?? { reminders: false };
  const currentAccent = accentColor ?? "#7c6aff";
  const currentGoals = goals ?? { daysPerWeek: 4, goal: "Ganar músculo" };

  function changeAccent(hex) {
    document.documentElement.style.setProperty("--accent", hexToRgb(hex));
    updateState({ accentColor: hex });
  }

  function toggleDarkMode(val) {
    setDarkMode(val);
    localStorage.setItem("fitflow-dark-mode", String(val));
    const html = document.documentElement;
    if (val) {
      html.removeAttribute("data-theme");
      html.style.setProperty("--color-bg", "#0a0a0f");
      html.style.setProperty("--color-card", "#1e1e2e");
      html.style.setProperty("--color-border", "#2a2a40");
      html.style.setProperty("--color-muted", "#8888aa");
    } else {
      html.setAttribute("data-theme", "light");
      html.style.setProperty("--color-bg", "#f8f8ff");
      html.style.setProperty("--color-card", "#ffffff");
      html.style.setProperty("--color-border", "#c8c8dc");
      html.style.setProperty("--color-muted", "#666680");
    }
  }

  function showProximo() {
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  }

  return (
    <div className="min-h-screen bg-bg pb-24">
      <header className="px-5 pt-[52px] pb-4 bg-gradient-to-b from-accent/[0.09] to-transparent">
        <h1 className="font-display text-[26px] font-extrabold text-[#f0eeff]">
          Configuración
        </h1>
      </header>

      {/* Preferencias */}
      <section className="px-5 mt-2">
        <h2 className="font-display text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-1">
          Preferencias
        </h2>
        <div className="bg-card rounded-2xl border border-border px-4">
          <SettingRow label="Modo oscuro">
            <Toggle on={darkMode} onChange={toggleDarkMode} />
          </SettingRow>
          <SettingRow label="Recordatorios">
            <Toggle
              on={prefs.reminders}
              onChange={(val) =>
                updateState({ preferences: { ...prefs, reminders: val } })
              }
            />
          </SettingRow>
          <SettingRow label="Color de acento" border={false}>
            <div className="flex gap-[10px]">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => changeAccent(color)}
                  className="w-7 h-7 rounded-full active:scale-90 transition-transform"
                  style={{
                    backgroundColor: color,
                    boxShadow:
                      currentAccent === color
                        ? "0 0 0 2px var(--bg), 0 0 0 4px white"
                        : "none",
                  }}
                />
              ))}
            </div>
          </SettingRow>
        </div>
      </section>

      {/* Objetivos */}
      <section className="px-5 mt-5">
        <h2 className="font-display text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-1">
          Objetivos
        </h2>
        <div className="bg-card rounded-2xl border border-border px-4">
          <SettingRow label="Días por semana">
            <div className="flex gap-[6px]">
              {DAYS_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() =>
                    updateState({ goals: { ...currentGoals, daysPerWeek: d } })
                  }
                  className={`w-8 h-8 rounded-xl text-[14px] font-display font-bold transition-colors ${
                    currentGoals.daysPerWeek === d
                      ? "bg-accent text-white"
                      : "bg-white/[0.07] text-muted"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </SettingRow>
          <div className="py-3">
            <p className="text-[13px] text-muted mb-2">Objetivo</p>
            <div className="flex flex-col gap-[6px]">
              {GOAL_OPTIONS.map((g) => (
                <button
                  key={g}
                  onClick={() =>
                    updateState({ goals: { ...currentGoals, goal: g } })
                  }
                  className={`text-left px-4 py-[10px] rounded-xl text-[14px] border transition-colors ${
                    currentGoals.goal === g
                      ? "bg-accent/20 text-[#f0eeff] border-accent/40"
                      : "bg-white/[0.04] text-muted border-transparent"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cuenta */}
      <section className="px-5 mt-5">
        <h2 className="font-display text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-1">
          Cuenta
        </h2>
        <div className="bg-card rounded-2xl border border-border px-4">
          <button
            onClick={showProximo}
            className="w-full flex items-center justify-between py-[14px] border-b border-border/60 active:opacity-60 transition-opacity"
          >
            <span className="text-[15px] text-[#f0eeff]">Exportar datos</span>
            <ChevronRight size={18} className="text-muted" />
          </button>
          <div className="flex items-center justify-between py-[14px]">
            <span className="text-[15px] text-[#f0eeff]">Versión</span>
            <span className="text-[14px] text-muted">FitFlow v1.0.0</span>
          </div>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-[88px] left-1/2 -translate-x-1/2 bg-card border border-border rounded-2xl px-5 py-3 text-[14px] text-[#f0eeff] shadow-lg animate-fade-in z-50 whitespace-nowrap">
          Próximamente
        </div>
      )}
    </div>
  );
}
