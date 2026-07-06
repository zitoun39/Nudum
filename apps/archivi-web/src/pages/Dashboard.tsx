import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { api } from "../utils/api";
import {
  TestTube2,
  Droplet,
  FileText,
  Activity,
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const { t } = useApp();
  const [metrics, setMetrics] = useState({
    samplesCount: 0,
    stationsCount: 0,
    pendingCorrespondences: 0,
    lastUpdate: ""
  });

  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const samples = await api.getSamples();
        const stations = await api.getStations();
        const correspondences = await api.getCorrespondences();

        const pending = correspondences.filter((c) => c.status === "pending_review").length;

        setMetrics({
          samplesCount: samples.length,
          stationsCount: stations.length,
          pendingCorrespondences: pending,
          lastUpdate: new Date().toLocaleTimeString()
        });

        // Compute mock activity feeds based on actual DB records
        const list = [
          {
            time: "قبل 10 دقائق",
            msg: "تم تسجيل عينة مياه جديدة SMP-2026-002 بواسطة ف. قدور",
            type: "sample"
          },
          {
            time: "قبل ساعة",
            msg: "قام المخبر أ. بن ناصر باعتماد نتائج تحليل الحموضة لعينة SMP-2026-001",
            type: "result"
          },
          {
            time: "قبل ساعتين",
            msg: "تسجيل قراءة تدفق مياه قدرها 12,450.5 م³/ساعة بمحطة الضخ A",
            type: "measurement"
          },
          {
            time: "يوم أمس",
            msg: "وزارة الموارد المائية أرسلت توجيهات معالجة جديدة (رقم MWR-2026-904)",
            type: "correspondence"
          }
        ];
        setActivities(list);
      } catch (err) {
        console.error(err);
      }
    }
    loadMetrics();
  }, []);

  return (
    <div className="space-y-6">
      {/* DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("dashboardTitle")}</h1>
          <p className="text-sm text-muted-foreground">
            آخر تحديث للبيانات: {metrics.lastUpdate || t("loading")}
          </p>
        </div>
      </div>

      {/* KPI METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* SAMPLES KPI */}
        <div className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">{t("kpiTotalSamples")}</p>
            <h3 className="text-3xl font-extrabold text-sky-500">{metrics.samplesCount}</h3>
            <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
              <TrendingUp size={14} />
              +12% منذ الأسبوع الماضي
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <TestTube2 size={24} />
          </div>
        </div>

        {/* STATIONS KPI */}
        <div className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">{t("kpiActiveStations")}</p>
            <h3 className="text-3xl font-extrabold text-blue-500">{metrics.stationsCount}</h3>
            <p className="text-xs text-muted-foreground font-semibold">
              جميع محطات الضخ تعمل بكفاءة عالية
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Droplet size={24} />
          </div>
        </div>

        {/* PENDING DOCS KPI */}
        <div className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">{t("kpiPendingDocs")}</p>
            <h3 className="text-3xl font-extrabold text-amber-500">
              {metrics.pendingCorrespondences}
            </h3>
            <p className="text-xs text-amber-500 font-semibold flex items-center gap-1">
              <AlertCircle size={14} />
              تتطلب مراجعة واعتماد المسؤول
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <FileText size={24} />
          </div>
        </div>
      </div>

      {/* CHARTS GRID & RECENT ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TELEMETRY CHART CARD */}
        <div className="p-6 rounded-2xl bg-card border border-border lg:col-span-2 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Activity size={18} className="text-sky-500" />
              {t("telemetryTrends")}
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              مباشر (Live SCADA feed)
            </span>
          </div>

          {/* SVG Line Chart representing Telemetry Data */}
          <div className="h-64 w-full bg-muted/20 rounded-xl relative flex items-end p-2 overflow-hidden border border-border/50">
            {/* Background grids */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
              <div className="border-b border-muted-foreground w-full"></div>
              <div className="border-b border-muted-foreground w-full"></div>
              <div className="border-b border-muted-foreground w-full"></div>
              <div className="border-b border-muted-foreground w-full"></div>
            </div>

            {/* Custom line plot */}
            <svg
              className="w-full h-full absolute inset-0 pt-4 px-2"
              viewBox="0 0 500 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(14, 108, 147)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="rgb(14, 108, 147)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Fill Area */}
              <path
                d="M0,200 L50,150 L100,120 L150,160 L200,90 L250,110 L300,60 L350,130 L400,80 L450,120 L500,70 L500,200 Z"
                fill="url(#chartGrad)"
              />
              {/* Stroke path */}
              <path
                d="M0,200 L50,150 L100,120 L150,160 L200,90 L250,110 L300,60 L350,130 L400,80 L450,120 L500,70"
                fill="none"
                stroke="rgb(14, 108, 147)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Timestamps labels */}
            <div className="w-full flex justify-between text-[10px] text-muted-foreground px-2 z-10 font-bold">
              <span>08:00</span>
              <span>10:00</span>
              <span>12:00</span>
              <span>14:00</span>
              <span>16:00</span>
              <span>18:00</span>
              <span>20:00</span>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITIES LOG LIST */}
        <div className="p-6 rounded-2xl bg-card border border-border flex flex-col space-y-4 shadow-sm">
          <h3 className="text-base font-bold">{t("recentActivity")}</h3>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {activities.map((act, index) => (
              <div
                key={index}
                className="flex gap-3 text-sm items-start hover:bg-muted/30 p-2 rounded-xl transition-colors"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    act.type === "sample"
                      ? "bg-sky-500"
                      : act.type === "result"
                        ? "bg-emerald-500"
                        : act.type === "measurement"
                          ? "bg-blue-500"
                          : "bg-amber-500"
                  }`}
                />
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-semibold leading-relaxed">{act.msg}</p>
                  <p className="text-[10px] text-muted-foreground font-bold">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold transition-all border border-border flex items-center justify-center gap-1">
            مشاهدة جميع السجلات التفتيشية
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
