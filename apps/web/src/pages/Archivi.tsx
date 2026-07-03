import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { api } from "../utils/api";
import {
  Folder,
  FileText,
  Plus,
  ArrowRight,
  Upload,
  Download,
  Mail,
  CheckCircle,
  XCircle,
  FileCheck,
  ChevronRight,
  FolderOpen,
  X
} from "lucide-react";

export const Archivi: React.FC = () => {
  const { t, direction } = useApp();
  const [folders, setFolders] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [correspondences, setCorrespondences] = useState<any[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Active view: folders explorer or correspondence log
  const [activeTab, setActiveTab] = useState<"explorer" | "correspondence">("explorer");

  // Modals
  const [addFolderOpen, setAddFolderOpen] = useState(false);
  const [addDocumentOpen, setAddDocumentOpen] = useState(false);
  const [addCorrespondenceOpen, setAddCorrespondenceOpen] = useState(false);

  // Forms
  const [newFolderName, setNewFolderName] = useState("");

  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    fileName: "procedure_v1.pdf"
  });

  const [newCor, setNewCor] = useState({
    type: "incoming" as "incoming" | "outgoing",
    referenceNumber: "",
    sender: "",
    recipient: "",
    subject: "",
    documentId: ""
  });

  const loadData = async () => {
    try {
      const fList = await api.getFolders();
      setFolders(fList);

      const dList = await api.getDocuments(selectedFolderId || undefined);
      setDocuments(dList);

      const cList = await api.getCorrespondences();
      setCorrespondences(cList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedFolderId]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createFolder({
        name: newFolderName,
        parentId: selectedFolderId
      });
      setNewFolderName("");
      setAddFolderOpen(false);
      loadData();
    } catch (err) {
      alert("Failed to create folder");
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const doc = await api.createDocument({
        title: newDocument.title,
        description: newDocument.description,
        folderId: selectedFolderId || undefined
      });

      // Upload mock version
      await api.uploadDocumentVersion({
        documentId: doc.id,
        fileKey: `archives/${newDocument.fileName}`,
        fileSize: 2048576,
        mimeType: "application/pdf",
        uploadedBy: "usr-1"
      });

      setNewDocument({ title: "", description: "", fileName: "procedure_v1.pdf" });
      setAddDocumentOpen(false);
      loadData();
    } catch (err) {
      alert("Failed to archive document");
    }
  };

  const handleCreateCorrespondence = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCorrespondence({
        type: newCor.type,
        referenceNumber: newCor.referenceNumber,
        sender: newCor.sender,
        recipient: newCor.recipient,
        subject: newCor.subject,
        documentId: newCor.documentId || undefined
      });
      setAddCorrespondenceOpen(false);
      setNewCor({
        type: "incoming",
        referenceNumber: "",
        sender: "",
        recipient: "",
        subject: "",
        documentId: ""
      });
      loadData();
    } catch (err) {
      alert("Failed to log correspondence");
    }
  };

  const handleReviewCorrespondence = async (id: string, status: "approved" | "rejected") => {
    try {
      await api.updateCorrespondenceStatus(id, status);
      loadData();
    } catch (err) {
      alert("Failed to update correspondence review status");
    }
  };

  const getCorStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle size={12} />
            معتمد
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400">
            <XCircle size={12} />
            مرفوض
          </span>
        );
      case "pending_review":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse">
            {t("pendingReview")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
            مسودة (Draft)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("archiviTitle")}</h1>
          <p className="text-sm text-muted-foreground">
            أرشفة الملفات الرسمية للمؤسسة، تتبع المراسلات الوزارية وتفويض طلبات الاعتماد
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "explorer" ? (
            <>
              <button
                onClick={() => setAddFolderOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-card hover:bg-muted border border-border text-sm font-bold transition-all"
              >
                {t("registerFolder")}
              </button>
              <button
                onClick={() => setAddDocumentOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
              >
                <Plus size={18} />
                {t("registerDocument")}
              </button>
            </>
          ) : (
            <button
              onClick={() => setAddCorrespondenceOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
            >
              <Plus size={18} />
              {t("registerCorrespondence")}
            </button>
          )}
        </div>
      </div>

      {/* WORKSPACE SWITCH TABS */}
      <div className="flex gap-4 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("explorer")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === "explorer"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          مستكشف الملفات والأرشيف
        </button>
        <button
          onClick={() => setActiveTab("correspondence")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === "correspondence"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          سجل المراسلات الرسمية (الصادر والوارد)
        </button>
      </div>

      {activeTab === "explorer" ? (
        /* EXPLORER WORKSPACE GRID */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* FOLDERS DIRECTORY TREE */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <FolderOpen size={18} className="text-amber-500" />
              المجلدات الهيكلية
            </h3>

            {/* Back to Root navigation */}
            {selectedFolderId && (
              <button
                onClick={() => setSelectedFolderId(null)}
                className="w-full py-2 px-3 rounded-lg bg-muted hover:bg-muted/80 text-xs font-bold transition-all border border-border flex items-center gap-1.5"
              >
                <ArrowRight size={14} className={direction === "rtl" ? "" : "rotate-185"} />
                العودة للمجلد الرئيسي (Root)
              </button>
            )}

            <div className="space-y-1">
              {folders
                .filter((f) => f.parentId === selectedFolderId)
                .map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFolderId(f.id)}
                    className="w-full flex items-center gap-2.5 p-3 rounded-xl hover:bg-muted/40 text-sm font-semibold text-start transition-all"
                  >
                    <Folder className="text-amber-400 fill-amber-400/10 shrink-0" size={18} />
                    <span className="truncate">{f.name}</span>
                    <ChevronRight
                      size={14}
                      className={`text-muted-foreground/40 ml-auto ${
                        direction === "rtl" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ))}
              {folders.filter((f) => f.parentId === selectedFolderId).length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  لا توجد مجلدات فرعية هنا.
                </p>
              )}
            </div>
          </div>

          {/* DOCUMENTS GRID */}
          <div className="lg:col-span-3">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
              <h3 className="text-sm font-bold">المستندات المؤرشفة في هذا المجلد</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-muted-foreground space-y-2 border border-dashed border-border rounded-xl">
                    <FileText size={32} className="mx-auto text-muted-foreground/30" />
                    <p className="text-sm font-semibold">المجلد فارغ تماماً.</p>
                    <p className="text-xs text-muted-foreground">
                      اضغط على زر (أرشفة مستند جديد) لرفع الملفات هنا.
                    </p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-xl border border-border/80 bg-card hover:bg-muted/20 transition-all flex flex-col justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <FileText size={18} className="text-amber-500 shrink-0" />
                          <h4 className="font-bold text-sm truncate">{doc.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {doc.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <span className="text-[10px] font-bold text-muted-foreground">
                          الإصدار الحالي: v{doc.versions?.length || 1}
                        </span>
                        <button
                          onClick={async () => {
                            if (doc.versions && doc.versions.length > 0) {
                              const url = await api.getDownloadUrl(doc.id, doc.versions[0].id);
                              window.open(url, "_blank");
                            } else {
                              alert("الملف غير متوفر حالياً.");
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-muted hover:bg-muted/80 text-[10px] font-bold flex items-center gap-1 border border-border"
                        >
                          <Download size={11} />
                          {t("download")}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CORRESPONDENCES JOURNAL TABLE */
        <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-start">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground text-start">
                  <th className="px-6 py-3 text-start">المرجع / الرقم الإداري</th>
                  <th className="px-6 py-3 text-start">{t("corType")}</th>
                  <th className="px-6 py-3 text-start">المرسل والمستقبل</th>
                  <th className="px-6 py-3 text-start">{t("subject")}</th>
                  <th className="px-6 py-3 text-start">{t("status")}</th>
                  <th className="px-6 py-3 text-start">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {correspondences.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground font-semibold"
                    >
                      لا توجد مراسلات إدارية مسجلة حالياً.
                    </td>
                  </tr>
                ) : (
                  correspondences.map((cor) => (
                    <tr key={cor.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-extrabold text-xs text-primary">
                        {cor.referenceNumber}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            cor.type === "incoming"
                              ? "bg-sky-500/10 text-sky-600"
                              : "bg-purple-500/10 text-purple-600"
                          }`}
                        >
                          <Mail size={11} />
                          {cor.type === "incoming" ? t("incoming") : t("outgoing")}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-y-0.5 text-xs font-medium">
                        <p>
                          <span className="text-muted-foreground">من:</span> {cor.sender}
                        </p>
                        <p>
                          <span className="text-muted-foreground">إلى:</span> {cor.recipient}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold max-w-[200px] truncate">
                        {cor.subject}
                      </td>
                      <td className="px-6 py-4">{getCorStatusBadge(cor.status)}</td>
                      <td className="px-6 py-4">
                        {cor.status === "pending_review" ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleReviewCorrespondence(cor.id, "approved")}
                              className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1"
                            >
                              <FileCheck size={11} />
                              {t("approve")}
                            </button>
                            <button
                              onClick={() => handleReviewCorrespondence(cor.id, "rejected")}
                              className="px-2 py-1 rounded bg-destructive hover:bg-destructive/95 text-white font-bold text-[10px]"
                            >
                              {t("reject")}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground font-semibold">
                            مكتمل التدقيق
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE FOLDER MODAL */}
      {addFolderOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setAddFolderOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Folder size={18} className="text-primary" />
                {t("registerFolder")}
              </h3>
              <button
                onClick={() => setAddFolderOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">اسم المجلد الجديد</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تقارير التحاليل الكيميائية 2026"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddFolderOpen(false)}
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

      {/* CREATE DOCUMENT MODAL */}
      {addDocumentOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setAddDocumentOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                {t("registerDocument")}
              </h3>
              <button
                onClick={() => setAddDocumentOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">{t("title")}</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: لوحة معايير الحموضة"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">
                  {t("description")}
                </label>
                <textarea
                  placeholder="أدخل وصفاً مختصراً للملف لسهولة البحث الفهرسي اللاحق..."
                  value={newDocument.description}
                  onChange={(e) =>
                    setNewDocument((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm h-20 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-sky-500 cursor-pointer flex items-center gap-1.5 hover:underline">
                  <Upload size={14} />
                  اختر الملف للرفع الرقمي (أرفق ملف PDF)
                </label>
                <input
                  type="text"
                  value={newDocument.fileName}
                  onChange={(e) =>
                    setNewDocument((prev) => ({ ...prev, fileName: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/20 text-muted-foreground text-xs font-semibold"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddDocumentOpen(false)}
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

      {/* CREATE CORRESPONDENCE MODAL */}
      {addCorrespondenceOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setAddCorrespondenceOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Mail size={18} className="text-primary" />
                {t("registerCorrespondence")}
              </h3>
              <button
                onClick={() => setAddCorrespondenceOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCorrespondence} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">{t("corType")}</label>
                <select
                  value={newCor.type}
                  onChange={(e) => setNewCor((prev) => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                >
                  <option value="incoming">رسالة واردة (Incoming)</option>
                  <option value="outgoing">رسالة صادرة (Outgoing)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">{t("refNumber")}</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: REF-2026-942"
                  value={newCor.referenceNumber}
                  onChange={(e) =>
                    setNewCor((prev) => ({ ...prev, referenceNumber: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">{t("sender")}</label>
                <input
                  type="text"
                  required
                  value={newCor.sender}
                  onChange={(e) => setNewCor((prev) => ({ ...prev, sender: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">{t("recipient")}</label>
                <input
                  type="text"
                  required
                  value={newCor.recipient}
                  onChange={(e) => setNewCor((prev) => ({ ...prev, recipient: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">{t("subject")}</label>
                <input
                  type="text"
                  required
                  value={newCor.subject}
                  onChange={(e) => setNewCor((prev) => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">
                  ربط ملف مرفق (مستند مؤرشف)
                </label>
                <select
                  value={newCor.documentId}
                  onChange={(e) => setNewCor((prev) => ({ ...prev, documentId: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                >
                  <option value="">لا يوجد مرفق حالياً</option>
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddCorrespondenceOpen(false)}
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
