import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { api } from "../utils/api";
import {
  Plus,
  Compass,
  Wrench,
  Activity,
  CheckCircle,
  AlertTriangle,
  Settings,
  X
} from "lucide-react";

export const Mahattati: React.FC = () => {
  const { t } = useApp();
  const [sites, setSites] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [measurements, setMeasurements] = useState<any[]>([]);

  // Selected contexts
  const [selectedStationId, setSelectedStationId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");

  // Modals
  const [addMeasurementOpen, setAddMeasurementOpen] = useState(false);
  const [addEquipmentOpen, setAddEquipmentOpen] = useState(false);

  // Forms states
  const [newMeasurement, setNewMeasurement] = useState({
    stationId: "",
    parameterName: "flow_rate",
    value: "",
    unit: "m³/h"
  });

  const [newEquipment, setNewEquipment] = useState({
    name: "",
    serialNumber: "",
    stationId: "",
    type: "pump"
  });

  const loadData = async () => {
    try {
      const sitesList = await api.getSites();
      setSites(sitesList);
      if (sitesList.length > 0 && !selectedSiteId) {
        setSelectedSiteId(sitesList[0].id);
      }

      const stationsList = await api.getStations();
      setStations(stationsList);

      const filteredStations = selectedSiteId
        ? stationsList.filter((s) => s.siteId === selectedSiteId)
        : stationsList;

      if (filteredStations.length > 0 && !selectedStationId) {
        setSelectedStationId(filteredStations[0].id);
      }

      const eqList = await api.getEquipment(selectedStationId || undefined);
      setEquipment(eqList);

      const msList = await api.getMeasurements();
      setMeasurements(msList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedSiteId, selectedStationId]);

  const handleCreateMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    const stId = newMeasurement.stationId || selectedStationId;
    if (!stId) return;
    try {
      await api.createMeasurement({
        stationId: stId,
        parameterName:
          newMeasurement.parameterName === "flow_rate"
            ? "تدفق المياه (Flow)"
            : newMeasurement.parameterName === "turbidity"
              ? "درجة العكارة (Turbidity)"
              : "الكلور الحر (Free Chlorine)",
        value: parseFloat(newMeasurement.value),
        unit: newMeasurement.unit,
        loggedBy: "أحمد بن ناصر"
      });
      setAddMeasurementOpen(false);
      setNewMeasurement((prev) => ({ ...prev, value: "" }));
      loadData();
    } catch (err) {
      alert("Failed to log measurement");
    }
  };

  const handleCreateEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    const stId = newEquipment.stationId || selectedStationId;
    if (!stId) return;
    try {
      await api.createEquipment({
        name: newEquipment.name,
        serialNumber: newEquipment.serialNumber,
        stationId: stId,
        type: newEquipment.type
      });
      setAddEquipmentOpen(false);
      setNewEquipment({ name: "", serialNumber: "", stationId: "", type: "pump" });
      loadData();
    } catch (err) {
      alert("Failed to register equipment");
    }
  };

  const handleToggleEquipmentStatus = async (id: string, currentStatus: string) => {
    let nextStatus = "operational";
    if (currentStatus === "operational") nextStatus = "under_maintenance";
    else if (currentStatus === "under_maintenance") nextStatus = "faulty";
    else nextStatus = "operational";

    try {
      await api.updateEquipmentStatus(id, nextStatus);
      loadData();
    } catch (err) {
      alert("Failed to toggle status");
    }
  };

  const getEquipmentBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle size={12} />
            {t("statusOperational")}
          </span>
        );
      case "under_maintenance":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Settings size={12} className="animate-spin" />
            {t("statusUnderMaintenance")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <AlertTriangle size={12} />
            {t("statusFaulty")}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("mahattatiTitle")}</h1>
          <p className="text-sm text-muted-foreground">
            مراقبة محطات ضخ ومعالجة المياه الإقليمية، تتبع صلاحية المعدات وجلسات الصيانة اليومية
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setNewEquipment((prev) => ({ ...prev, stationId: selectedStationId }));
              setAddEquipmentOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-card hover:bg-muted border border-border text-sm font-bold transition-all"
          >
            {t("registerEquipment")}
          </button>
          <button
            onClick={() => {
              setNewMeasurement((prev) => ({ ...prev, stationId: selectedStationId }));
              setAddMeasurementOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
          >
            <Plus size={18} />
            {t("logMeasurement")}
          </button>
        </div>
      </div>

      {/* SITES AND STATIONS TABS */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-1">
        {sites.map((site) => (
          <button
            key={site.id}
            onClick={() => {
              setSelectedSiteId(site.id);
              // Reset station when changing site
              const siteStations = stations.filter((s) => s.siteId === site.id);
              if (siteStations.length > 0) {
                setSelectedStationId(siteStations[0].id);
              }
            }}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${
              selectedSiteId === site.id
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {site.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* STATIONS LIST SIDEBAR */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">
            محطات المعالجة والضخ النشطة
          </h3>
          <div className="space-y-2">
            {stations
              .filter((st) => st.siteId === selectedSiteId)
              .map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStationId(st.id)}
                  className={`w-full text-start p-4 rounded-2xl border transition-all flex flex-col gap-1 shadow-sm ${
                    selectedStationId === st.id
                      ? "bg-primary/5 border-primary/40 text-foreground ring-1 ring-primary/20 font-semibold"
                      : "bg-card border-border hover:bg-muted/40"
                  }`}
                >
                  <span className="text-sm font-bold">{st.name}</span>
                  <span className="text-xs text-muted-foreground">
                    القدرة اليومية: {st.capacity_m3_day?.toLocaleString()} م³/يوم
                  </span>
                </button>
              ))}
          </div>
        </div>

        {/* DETAILED EQUIPMENT & TELEMETRY LISTS */}
        <div className="lg:col-span-3 space-y-6">
          {/* EQUIPMENT GRID */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Compass size={18} className="text-blue-500" />
                جرد العتاد والمضخات الصناعية بالمحطة
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipment.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6 col-span-2 font-semibold">
                  لا توجد معدات مسجلة لهذه المحطة حالياً.
                </p>
              ) : (
                equipment.map((eq) => (
                  <div
                    key={eq.id}
                    className="p-4 rounded-xl border border-border/80 bg-card hover:bg-muted/20 transition-all flex justify-between items-start gap-4"
                  >
                    <div className="space-y-1.5">
                      <p className="font-bold text-sm">{eq.name}</p>
                      <p className="text-xs text-muted-foreground">
                        S/N: {eq.serialNumber || "N/A"}
                      </p>
                      <button
                        onClick={() => handleToggleEquipmentStatus(eq.id, eq.status)}
                        className="text-[10px] px-2 py-1 rounded border hover:bg-muted font-bold flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <Wrench size={10} />
                        تغيير الحالة البرمجية للمضخة
                      </button>
                    </div>
                    {getEquipmentBadge(eq.status)}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RECENT OPERATIONAL LOGS */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/10">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Activity size={18} className="text-sky-500" />
                سجل القراءات اليومية والقياس عن بعد (Telemetry)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-start">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground text-start">
                    <th className="px-6 py-3 text-start">المحطة</th>
                    <th className="px-6 py-3 text-start">{t("parameter")}</th>
                    <th className="px-6 py-3 text-start">{t("value")}</th>
                    <th className="px-6 py-3 text-start">{t("loggedBy")}</th>
                    <th className="px-6 py-3 text-start">{t("loggedAt")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {measurements
                    .filter((m) => !selectedStationId || m.stationId === selectedStationId)
                    .map((m) => {
                      const st = stations.find((x) => x.id === m.stationId);
                      return (
                        <tr key={m.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4 font-bold text-xs">{st?.name}</td>
                          <td className="px-6 py-4 font-medium text-xs">{m.parameterName}</td>
                          <td className="px-6 py-4 text-xs font-extrabold text-blue-600 dark:text-blue-400">
                            {m.value} {m.unit}
                          </td>
                          <td className="px-6 py-4 text-xs text-muted-foreground">{m.loggedBy}</td>
                          <td className="px-6 py-4 text-xs text-muted-foreground font-bold">
                            {new Date(m.loggedAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* LOG MEASUREMENT MODAL */}
      {addMeasurementOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setAddMeasurementOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                {t("logMeasurement")}
              </h3>
              <button
                onClick={() => setAddMeasurementOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateMeasurement} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">
                  نوع البارامتر التشغيلي
                </label>
                <select
                  value={newMeasurement.parameterName}
                  onChange={(e) => {
                    const val = e.target.value;
                    let unit = "m³/h";
                    if (val === "turbidity") unit = "NTU";
                    else if (val === "chlorine") unit = "mg/L";
                    setNewMeasurement((prev) => ({ ...prev, parameterName: val, unit }));
                  }}
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                >
                  <option value="flow_rate">تدفق ضخ المياه (Flow Rate)</option>
                  <option value="turbidity">درجة العكارة البصرية (Turbidity)</option>
                  <option value="chlorine">التركيز الكيميائي للكلور (Chlorine Level)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">
                  القيمة المقاسة للعداد
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={newMeasurement.value}
                  onChange={(e) =>
                    setNewMeasurement((prev) => ({ ...prev, value: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">الوحدة</label>
                <input
                  type="text"
                  disabled
                  value={newMeasurement.unit}
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/20 text-muted-foreground text-sm"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddMeasurementOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-muted hover:bg-muted/80 font-bold text-sm transition-all border border-border"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-sm transition-all shadow-lg shadow-primary/10"
                >
                  {t("create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER EQUIPMENT MODAL */}
      {addEquipmentOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setAddEquipmentOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Compass size={18} className="text-primary" />
                {t("registerEquipment")}
              </h3>
              <button
                onClick={() => setAddEquipmentOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateEquipment} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">
                  اسم المعدة / الرمز الصناعي
                </label>
                <input
                  type="text"
                  required
                  placeholder="مضخة طرد مركزي جديدة"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">
                  {t("serialNumber")}
                </label>
                <input
                  type="text"
                  placeholder="SN-XXXX"
                  value={newEquipment.serialNumber}
                  onChange={(e) =>
                    setNewEquipment((prev) => ({ ...prev, serialNumber: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">نوع الفئة</label>
                <select
                  value={newEquipment.type}
                  onChange={(e) => setNewEquipment((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                >
                  <option value="pump">مضخة (Pump)</option>
                  <option value="chlorinator">حقن كلور (Chlorinator)</option>
                  <option value="filter">فلتر رملي/غشائي (Filter)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddEquipmentOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-muted hover:bg-muted/80 font-bold text-sm transition-all border border-border"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-sm transition-all shadow-lg shadow-primary/10"
                >
                  {t("create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
