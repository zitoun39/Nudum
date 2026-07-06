import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { api } from "../utils/api";
import {
  TestTube2,
  Plus,
  Filter,
  CheckCircle,
  FlaskConical,
  Beaker,
  User,
  MapPin,
  Calendar,
  X
} from "lucide-react";

export const Jawdati: React.FC = () => {
  const { t, direction } = useApp();
  const [laboratories, setLaboratories] = useState<any[]>([]);
  const [samples, setSamples] = useState<any[]>([]);

  // Filters
  const [selectedLab, setSelectedLab] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modals
  const [addSampleOpen, setAddSampleOpen] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [sampleDetails, setSampleDetails] = useState<any | null>(null);

  // Form Fields
  const [newSample, setNewSample] = useState({
    sampleCode: "",
    laboratoryId: "",
    collectedBy: "",
    collectedAt: new Date().toISOString().substring(0, 16)
  });

  const [newAnalysis, setNewAnalysis] = useState({
    testMethod: "ISO 10523 pH Test",
    analystId: "usr-2"
  });

  const [newResult, setNewResult] = useState({
    analysisId: "",
    parameterName: "pH",
    value: "",
    unit: "pH units",
    isConforming: true
  });

  const loadData = async () => {
    try {
      const labs = await api.getLaboratories();
      setLaboratories(labs);

      // Default the laboratory in form
      if (labs.length > 0 && !newSample.laboratoryId) {
        setNewSample((prev) => ({ ...prev, laboratoryId: labs[0].id }));
      }

      const list = await api.getSamples(selectedLab || undefined, selectedStatus || undefined);
      setSamples(list);

      // Refresh details if open
      if (activeSampleId) {
        const details = await api.getSample(activeSampleId);
        setSampleDetails(details);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedLab, selectedStatus, activeSampleId]);

  const handleCreateSample = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSample({
        sampleCode: newSample.sampleCode,
        laboratoryId: newSample.laboratoryId,
        collectedBy: newSample.collectedBy,
        collectedAt: new Date(newSample.collectedAt).toISOString()
      });
      setAddSampleOpen(false);
      setNewSample((prev) => ({ ...prev, sampleCode: "" }));
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to create sample");
    }
  };

  const handleRequestAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSampleId) return;
    try {
      await api.createAnalysis({
        sampleId: activeSampleId,
        testMethod: newAnalysis.testMethod,
        analystId: newAnalysis.analystId
      });
      loadData();
    } catch (err) {
      alert("Failed to request analysis");
    }
  };

  const handleSubmitResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResult.analysisId) return;
    try {
      await api.createResult({
        analysisId: newResult.analysisId,
        parameterName: newResult.parameterName,
        value: parseFloat(newResult.value),
        unit: newResult.unit,
        isConforming: newResult.isConforming
      });
      setNewResult((prev) => ({ ...prev, value: "" }));
      loadData();
    } catch (err) {
      alert("Failed to submit result");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
            <CheckCircle size={12} />
            {t("statusCompleted")}
          </span>
        );
      case "analyzing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/25">
            <Beaker size={12} className="animate-spin" />
            {t("statusAnalyzing")}
          </span>
        );
      case "collected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25">
            {t("statusCollected")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("jawdatiTitle")}</h1>
          <p className="text-sm text-muted-foreground">
            جدولة التحاليل اليومية للمياه، تسجيل قراءات المختبر والتحقق من المطابقة القياسية
          </p>
        </div>
        <button
          onClick={() => setAddSampleOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
        >
          <Plus size={18} />
          {t("registerSample")}
        </button>
      </div>

      {/* FILTERS AND DATA GRID CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDE FILTER CONTROLS AND LABORATORIES */}
        <div className="space-y-6">
          {/* FILTER PANEL */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Filter size={16} className="text-sky-500" />
              تصفية كشوف العينات
            </h3>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground">
                المختبر التابع
              </label>
              <select
                value={selectedLab}
                onChange={(e) => setSelectedLab(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">كافة المختبرات</option>
                {laboratories.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground">
                حالة الفحص
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">كافة الحالات</option>
                <option value="collected">{t("statusCollected")}</option>
                <option value="analyzing">{t("statusAnalyzing")}</option>
                <option value="completed">{t("statusCompleted")}</option>
              </select>
            </div>
          </div>

          {/* LABORATORIES REGISTER LIST */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <FlaskConical size={16} className="text-emerald-500" />
              {t("laboratories")}
            </h3>
            <div className="space-y-3">
              {laboratories.map((lab) => (
                <div
                  key={lab.id}
                  className="p-3 rounded-xl bg-muted/30 border border-border/50 text-sm space-y-1"
                >
                  <p className="font-semibold">{lab.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin size={12} />
                    {lab.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SAMPLES MAIN TABLE */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-sm font-bold">{t("samples")}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-start">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground text-start">
                    <th className="px-6 py-3 text-start">{t("sampleCode")}</th>
                    <th className="px-6 py-3 text-start">المخبر المعين</th>
                    <th className="px-6 py-3 text-start">{t("collectedBy")}</th>
                    <th className="px-6 py-3 text-start">{t("collectedAt")}</th>
                    <th className="px-6 py-3 text-start">{t("status")}</th>
                    <th className="px-6 py-3 text-start">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {samples.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground font-semibold"
                      >
                        لا توجد عينات مياه مسجلة مطابقة لمعايير التصفية.
                      </td>
                    </tr>
                  ) : (
                    samples.map((sample) => (
                      <tr key={sample.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 font-bold text-primary">{sample.sampleCode}</td>
                        <td className="px-6 py-4 font-medium text-xs max-w-[150px] truncate">
                          {sample.laboratory?.name}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium">{sample.collectedBy}</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground font-bold">
                          {new Date(sample.collectedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(sample.status)}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setActiveSampleId(sample.id)}
                            className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-xs font-bold transition-all border border-border"
                          >
                            عرض التفاصيل والتحاليل
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* SAMPLE DETAILS DRAWER PANEL */}
      {activeSampleId && sampleDetails && (
        <div className="fixed inset-0 z-30 flex justify-end">
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setActiveSampleId(null)}
          />

          <div
            className={`relative w-full max-w-2xl bg-card border-border flex flex-col h-full shadow-2xl z-10 transition-all ${
              direction === "rtl" ? "border-r" : "border-l"
            }`}
          >
            {/* Drawer Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <TestTube2 className="text-primary" />
                <span className="font-extrabold text-base">
                  تفاصيل العينة: {sampleDetails.sampleCode}
                </span>
              </div>
              <button
                onClick={() => setActiveSampleId(null)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Meta Info list */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 text-xs font-medium border border-border/50">
                <p className="flex items-center gap-1.5">
                  <User size={14} className="text-muted-foreground" /> {t("collectedBy")}:{" "}
                  {sampleDetails.collectedBy}
                </p>
                <p className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-muted-foreground" /> {t("collectedAt")}:{" "}
                  {new Date(sampleDetails.collectedAt).toLocaleString()}
                </p>
                <p className="col-span-2 flex items-center gap-1.5">
                  <FlaskConical size={14} className="text-muted-foreground" /> {t("laboratories")}:{" "}
                  {sampleDetails.laboratory?.name}
                </p>
                <div className="col-span-2 pt-1 border-t border-border/40 flex items-center justify-between">
                  <span>حالة العينة الحالية:</span>
                  {getStatusBadge(sampleDetails.status)}
                </div>
              </div>

              {/* ANALYSES REQUESTS LIST */}
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold border-b border-border pb-2 flex items-center gap-2">
                  <FlaskConical size={16} className="text-sky-500" />
                  الفحوصات وجلسات التحليل المطلوبة
                </h3>

                <div className="space-y-3">
                  {sampleDetails.analyses.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4 font-semibold">
                      لم تتم جدولة أي تحاليل كيميائية لهذه العينة بعد.
                    </p>
                  ) : (
                    sampleDetails.analyses.map((an: any) => (
                      <div
                        key={an.id}
                        className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-primary font-bold">{an.testMethod}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              an.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {an.status === "completed" ? "منتهي" : "معلق"}
                          </span>
                        </div>

                        {/* List Results of this analysis */}
                        {an.results.length > 0 && (
                          <div className="text-xs space-y-1 bg-muted/30 p-2.5 rounded-lg border border-border/40">
                            {an.results.map((res: any) => (
                              <div key={res.id} className="flex justify-between font-medium">
                                <span>
                                  {res.parameterName}: {res.value} {res.unit}
                                </span>
                                <span
                                  className={
                                    res.isConforming ? "text-emerald-500" : "text-destructive"
                                  }
                                >
                                  {res.isConforming ? "طبيعي ومطابق" : "خارج المعايير ⚠️"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Form to submit result if pending */}
                        {an.status !== "completed" && (
                          <form
                            onSubmit={(e) => {
                              newResult.analysisId = an.id;
                              handleSubmitResult(e);
                            }}
                            className="flex flex-wrap gap-2 pt-2 border-t border-border/50 items-end"
                          >
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground">
                                البارامتر
                              </label>
                              <input
                                type="text"
                                value={newResult.parameterName}
                                onChange={(e) =>
                                  setNewResult((prev) => ({
                                    ...prev,
                                    parameterName: e.target.value
                                  }))
                                }
                                className="p-1.5 text-xs rounded-lg border border-border bg-muted/30 w-24"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground">
                                القيمة
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="7.2"
                                value={newResult.value}
                                required
                                onChange={(e) =>
                                  setNewResult((prev) => ({ ...prev, value: e.target.value }))
                                }
                                className="p-1.5 text-xs rounded-lg border border-border bg-muted/30 w-20"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground">
                                الوحدة
                              </label>
                              <input
                                type="text"
                                value={newResult.unit}
                                onChange={(e) =>
                                  setNewResult((prev) => ({ ...prev, unit: e.target.value }))
                                }
                                className="p-1.5 text-xs rounded-lg border border-border bg-muted/30 w-20"
                              />
                            </div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold pb-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newResult.isConforming}
                                onChange={(e) =>
                                  setNewResult((prev) => ({
                                    ...prev,
                                    isConforming: e.target.checked
                                  }))
                                }
                              />
                              مطابق
                            </label>
                            <button
                              type="submit"
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/10 ml-auto"
                            >
                              حفظ النتيجة
                            </button>
                          </form>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* ACTION: REQUEST NEW ANALYSIS */}
              <div className="p-4 rounded-xl border border-dashed border-border/80 bg-muted/20 space-y-3">
                <h4 className="text-xs font-bold">جدولة طلب فحص كيميائي إضافي</h4>
                <form onSubmit={handleRequestAnalysis} className="flex gap-3 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground">
                      المواصفة / طريقة التحليل
                    </label>
                    <select
                      value={newAnalysis.testMethod}
                      onChange={(e) =>
                        setNewAnalysis((prev) => ({ ...prev, testMethod: e.target.value }))
                      }
                      className="w-full p-2 text-xs rounded-lg border border-border bg-card focus:outline-none"
                    >
                      <option value="ISO 10523 pH Test">معايرة الحموضة ISO 10523 pH</option>
                      <option value="Turbidity NTU Test">
                        فحص العكارة ومقارنة الضوء Turbidity NTU
                      </option>
                      <option value="Residual Chlorine Titration">
                        تحديد الكلور المتبقي بالمعايرة الحجمية
                      </option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
                  >
                    جدولة الفحص
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD SAMPLE MODAL POPUP */}
      {addSampleOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setAddSampleOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <FlaskConical size={18} className="text-primary" />
                {t("registerSample")}
              </h3>
              <button
                onClick={() => setAddSampleOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSample} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">{t("sampleCode")}</label>
                <input
                  type="text"
                  placeholder="SMP-2026-X"
                  required
                  value={newSample.sampleCode}
                  onChange={(e) =>
                    setNewSample((prev) => ({ ...prev, sampleCode: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">المختبر المستلم</label>
                <select
                  value={newSample.laboratoryId}
                  onChange={(e) =>
                    setNewSample((prev) => ({ ...prev, laboratoryId: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                >
                  {laboratories.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">
                  {t("collectedBy")}
                </label>
                <input
                  type="text"
                  required
                  value={newSample.collectedBy}
                  onChange={(e) =>
                    setNewSample((prev) => ({ ...prev, collectedBy: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">
                  {t("collectedAt")}
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newSample.collectedAt}
                  onChange={(e) =>
                    setNewSample((prev) => ({ ...prev, collectedAt: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddSampleOpen(false)}
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
