import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Building2, KeyRound, ArrowRightLeft } from "lucide-react";

export const Login: React.FC = () => {
  const { login, t, language, setLanguage, direction } = useApp();
  const navigate = useNavigate();
  const [orgId, setOrgId] = useState("ade_oran");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("admin_secret_pass");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(orgId);
      // Wait for session setting simulation
      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 800);
    } catch (err) {
      setLoading(false);
      alert("Authentication error");
    }
  };

  const orgs = [
    { id: "ade_oran", name: "المخبر المركزي الجزائري للمياه - وهران (ADE Oran Lab)" },
    { id: "seaal_algiers", name: "شركة المياه والتطهير للجزائر العاصمة (SEAAL Algiers)" },
    { id: "ade_constantine", name: "الجزائرية للمياه - وحدة قسنطينة (ADE Constantine)" }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400 via-slate-900 to-slate-950 p-6">
      {/* LANGUAGE SELECTOR IN TOP CORNER */}
      <div className={`absolute top-6 ${direction === "rtl" ? "left-6" : "right-6"}`}>
        <button
          onClick={() => setLanguage(language === "ar" ? "fr" : language === "fr" ? "en" : "ar")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold transition-all shadow-md"
        >
          <ArrowRightLeft size={12} />
          {language === "ar"
            ? "Français / English"
            : language === "fr"
              ? "English / العربية"
              : "العربية / Français"}
        </button>
      </div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl border border-white/15 dark:border-slate-800/60 rounded-3xl p-8 shadow-2xl shadow-slate-950/50 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-emerald-400 flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg shadow-sky-500/20 mb-4 animate-pulse">
            ن
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">{t("appName")}</h1>
          <p className="text-xs text-sky-200/65 font-medium max-w-xs mx-auto">{t("appSubName")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ORG SCHEMA SELECT */}
          <div>
            <label className="block text-xs font-bold text-sky-200/80 mb-2 uppercase tracking-wide">
              {t("selectOrg")}
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 flex items-center pointer-events-none text-sky-300/60 ${
                  direction === "rtl" ? "right-3" : "left-3"
                }`}
              >
                <Building2 size={18} />
              </div>
              <select
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
                className={`w-full py-3 px-10 rounded-2xl bg-white/5 dark:bg-slate-950/40 border border-white/10 dark:border-slate-800/85 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium ${
                  direction === "rtl" ? "text-right" : "text-left"
                }`}
              >
                {orgs.map((org) => (
                  <option key={org.id} value={org.id} className="bg-slate-900 text-white">
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs font-bold text-sky-200/80 mb-2 uppercase tracking-wide">
              {t("password")}
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 flex items-center pointer-events-none text-sky-300/60 ${
                  direction === "rtl" ? "right-3" : "left-3"
                }`}
              >
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full py-3 px-10 rounded-2xl bg-white/5 dark:bg-slate-950/40 border border-white/10 dark:border-slate-800/85 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-white/30 ${
                  direction === "rtl" ? "text-right" : "text-left"
                }`}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-slate-950 font-bold text-sm shadow-xl shadow-sky-500/25 hover:shadow-sky-500/35 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            {loading ? t("loading") : t("login")}
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] text-sky-200/40 font-medium border-t border-white/5 pt-4">
          Nudum Enterprise Modular SaaS · v1.0.0
        </div>
      </div>
    </div>
  );
};
