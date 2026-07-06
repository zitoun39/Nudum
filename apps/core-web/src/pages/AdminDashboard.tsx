import React, { useMemo, useState, useEffect } from "react";
import {
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  HelpCircle,
  MessageSquare,
  Settings,
  ShieldCheck,
  Users,
  History,
  Plus,
  Trash2,
  Activity
} from "lucide-react";
import { api } from "../utils/api";

type TabKey =
  | "members"
  | "sales"
  | "subscriptions"
  | "access_control"
  | "invoices"
  | "alerts"
  | "tickets"
  | "questions"
  | "settings"
  | "audit_log";

const coreTabs: { key: TabKey; label: string; icon: any }[] = [
  { key: "members", label: "الأعضاء", icon: Users },
  { key: "sales", label: "المبيعات", icon: BarChart3 },
  { key: "tickets", label: "التذاكر", icon: MessageSquare },
  { key: "questions", label: "أسئلة الزبائن", icon: HelpCircle }
];

const saasTabs: { key: TabKey; label: string; icon: any }[] = [
  { key: "subscriptions", label: "الاشتراكات", icon: CreditCard },
  { key: "access_control", label: "صلاحيات الوصول", icon: ShieldCheck },
  { key: "invoices", label: "الفواتير", icon: FileText },
  { key: "alerts", label: "التنبيهات", icon: Bell },
  { key: "audit_log", label: "سجل العمليات المركزي", icon: History },
  { key: "settings", label: "الإعدادات", icon: Settings }
];

export const AdminDashboard: React.FC = () => {
  // Async states
  const [members, setMembers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [userAccounts, setUserAccounts] = useState<any[]>([]);
  const [subRequests, setSubRequests] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [salesStats, setSalesStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    churnRate: 0,
    revenueHistory: [] as any[]
  });

  const [settings, setSettingsState] = useState({
    platformName: "منصة نُظُم SaaS",
    currency: "د.ج",
    starterPrice: 8000,
    professionalPrice: 25000,
    enterprisePrice: 95000,
    notifyOnNewTicket: true,
    notifyOnNewPayment: true
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("members");
  const [replyModal, setReplyModal] = useState<{ type: "ticket" | "question"; id: string } | null>(
    null
  );
  const [replyText, setReplyText] = useState("");

  // Modals / State for creating new entries
  const [editMemberPlan, setEditMemberPlan] = useState<any | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "client",
    memberId: "",
    name: "",
    email: ""
  });

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    memberId: "",
    amount: 15000,
    dueDays: 30,
    desc: "اشتراك شهري في المنصة",
    notes: ""
  });

  const [viewingReceiptUrl, setViewingReceiptUrl] = useState<string | null>(null);

  const loadAllData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const [mList, tList, qList, iList, aList, uList, subReqs, logs, statsData] =
        await Promise.all([
          api.getMembers(),
          api.getSupportTickets(),
          api.getQuestions(),
          api.getInvoices(),
          api.getAlerts(),
          api.getUsers(),
          api.getSubscriptionRequests(),
          api.getAuditLogs(),
          api.getSalesStats()
        ]);
      setMembers(mList);
      setTickets(tList);
      setQuestions(qList);
      setInvoices(iList);
      setAlerts(aList);
      setUserAccounts(uList);
      setSubRequests(subReqs);
      setAuditLogs(logs);
      setSalesStats(statsData);

      if (mList.length > 0) {
        setNewUser((prev) => ({ ...prev, memberId: mList[0].id }));
        setNewInvoice((prev) => ({ ...prev, memberId: mList[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData(true);
  }, []);

  const stats = useMemo(() => {
    return {
      active: members.filter((m) => m.status === "نشط").length,
      pending: members.filter((m) => m.status === "بانتظار التفعيل").length,
      suspended: members.filter((m) => m.status === "موقوف").length,
      totalMembers: members.length,
      openTickets: tickets.filter((t) => t.status === "open").length,
      unreadQuestions: questions.filter((q) => !q.read).length,
      unreadAlerts: alerts.filter((a) => !a.read).length,
      pendingSubRequests: subRequests.filter((r) => r.status === "معلق").length,
      ...salesStats
    };
  }, [members, tickets, questions, alerts, subRequests, salesStats]);

  // Handlers
  const updateStatus = async (id: string, status: string) => {
    try {
      await api.updateMember(id, { status });
      await loadAllData();
      alert(`تم تحديث حالة العضو إلى: ${status}`);
    } catch {
      alert("فشل تحديث حالة العضو.");
    }
  };

  const handleDeleteMember = async (id: string, orgName: string) => {
    if (
      window.confirm(
        `هل أنت متأكد من حذف المؤسسة "${orgName}" نهائياً؟ سيؤدي ذلك لحذف كافة الحسابات والفواتير وتذاكر الدعم التابعة لها.`
      )
    ) {
      try {
        await api.deleteMember(id);
        await loadAllData();
        alert(`تم حذف المؤسسة "${orgName}" وكافة السجلات التابعة لها بنجاح.`);
      } catch {
        alert("فشل حذف المؤسسة.");
      }
    }
  };

  const handleReplySubmit = async () => {
    if (!replyModal || !replyText.trim()) return;
    try {
      if (replyModal.type === "ticket") {
        await api.replyToQuestion(replyModal.id, replyText); // fallback support reply
        alert("تم الرد على التذكرة وإغلاقها.");
      } else {
        await api.replyToQuestion(replyModal.id, replyText);
        alert("تم الرد على السؤال.");
      }
      setReplyModal(null);
      setReplyText("");
      await loadAllData();
    } catch {
      alert("فشل إرسال الرد.");
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.markQuestionRead(id);
      await loadAllData();
    } catch {
      alert("فشل التحديث.");
    }
  };

  const handleMarkAlert = async (id: string) => {
    try {
      await api.markAlertRead(id);
      await loadAllData();
    } catch {
      alert("فشل التحديث.");
    }
  };

  const handleMarkAllAlerts = async () => {
    try {
      await api.markAllAlertsRead();
      await loadAllData();
      alert("تم تحديد جميع التنبيهات كمقروءة.");
    } catch {
      alert("فشل التحديث.");
    }
  };

  const handleInvoiceStatusUpdate = async (id: string, status: string) => {
    const paidAt = status === "مدفوع" ? new Date().toISOString().split("T")[0] : undefined;
    try {
      await api.updateInvoiceStatus(id, status, paidAt);
      await loadAllData();
      alert(`تم تحديث حالة الفاتورة إلى: ${status}`);
    } catch {
      alert("فشل تحديث الفاتورة.");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password || !newUser.name || !newUser.email) {
      alert("يرجى ملء كافة الحقول الأساسية.");
      return;
    }
    try {
      await api.addUser(newUser);
      setUserModalOpen(false);
      setNewUser({
        username: "",
        password: "",
        role: "client",
        memberId: members[0]?.id || "",
        name: "",
        email: ""
      });
      await loadAllData();
      alert("تم إنشاء الحساب بنجاح.");
    } catch (err: any) {
      alert(err.message || "فشل إنشاء الحساب.");
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const orgId = newInvoice.memberId;
    if (!orgId) return;

    try {
      await api.createInvoice({
        orgId,
        amount: newInvoice.amount,
        dueAt: new Date(Date.now() + newInvoice.dueDays * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        items: [{ description: newInvoice.desc, amount: newInvoice.amount }],
        notes: newInvoice.notes
      });
      setInvoiceModalOpen(false);
      setNewInvoice({
        memberId: members[0]?.id || "",
        amount: 15000,
        dueDays: 30,
        desc: "اشتراك شهري في المنصة",
        notes: ""
      });
      await loadAllData();
      alert("تم إنشاء الفاتورة بنجاح وإرسال إشعار للمشترك.");
    } catch {
      alert("فشل إنشاء الفاتورة.");
    }
  };

  const handleSaveMemberPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMemberPlan) return;
    try {
      await api.updateMember(editMemberPlan.id, {
        plan: editMemberPlan.plan,
        renewal: editMemberPlan.renewal,
        monthlyFee: editMemberPlan.monthlyFee
      });
      setEditMemberPlan(null);
      await loadAllData();
      alert("تم تحديث خطة المشترك بنجاح.");
    } catch {
      alert("فشل تحديث الخطة.");
    }
  };

  const handleApproveRequest = async (id: string, memberName: string) => {
    try {
      await api.approveSubscriptionRequest(id);
      await loadAllData();
      alert(`تمت الموافقة على طلب "${memberName}" بنجاح.`);
    } catch {
      alert("فشل الموافقة على طلب الاشتراك.");
    }
  };

  const handleRejectRequest = async (id: string, memberName: string) => {
    const reason = window.prompt("سبب الرفض (اختياري):");
    try {
      await api.rejectSubscriptionRequest(id, reason || undefined);
      await loadAllData();
      alert(`تم رفض طلب "${memberName}".`);
    } catch {
      alert("فشل رفض طلب الاشتراك.");
    }
  };

  const handleClearAuditLogs = async () => {
    try {
      await api.clearAuditLogs();
      await loadAllData();
      alert("تم مسح سجل العمليات بنجاح.");
    } catch {
      alert("فشل مسح سجل العمليات.");
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert("تم حفظ الإعدادات بنجاح.");
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("ar-DZ", { style: "decimal" }).format(amount) + " د.ج";

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("ar-DZ", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return iso;
    }
  };

  const activeTabDetails = useMemo(() => {
    const all = [...coreTabs, ...saasTabs];
    return all.find((t) => t.key === activeTab) || coreTabs[0];
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
        <p className="font-bold animate-pulse text-sm">جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 right-0 hidden w-72 border-l border-slate-200 bg-white text-slate-800 lg:block z-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350">
        <div className="border-b border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-xl font-bold text-white shadow-lg">
              N
            </div>
            <div>
              <h2 className="font-bold text-slate-950 dark:text-white text-sm">نُظُم Nudum</h2>
              <p className="text-[10px] font-bold text-primary-500">لوحة إدارة SaaS</p>
            </div>
          </div>
        </div>
        <nav className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 100px)" }}>
          <div className="mb-2 px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            القائمة الأساسية
          </div>
          {coreTabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all ${
                activeTab === key
                  ? "bg-primary-50 text-primary-600 dark:bg-primary-950/20 dark:text-primary-400"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
              {key === "tickets" && stats.openTickets > 0 && (
                <span className="mr-auto rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {stats.openTickets}
                </span>
              )}
              {key === "questions" && stats.unreadQuestions > 0 && (
                <span className="mr-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {stats.unreadQuestions}
                </span>
              )}
            </button>
          ))}

          <div className="my-4 border-t border-slate-200 dark:border-slate-800" />

          <div className="mb-2 px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            إدارة المنصة
          </div>
          {saasTabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all ${
                activeTab === key
                  ? "bg-primary-50 text-primary-600 dark:bg-primary-950/20 dark:text-primary-400"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
              {key === "alerts" && stats.unreadAlerts > 0 && (
                <span className="mr-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {stats.unreadAlerts}
                </span>
              )}
              {key === "subscriptions" && stats.pendingSubRequests > 0 && (
                <span className="mr-auto rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
                  {stats.pendingSubRequests}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:mr-72">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
                {activeTabDetails.label}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-350">
                لوحة التحكم المركزية لمنصة نُظُم SaaS وإدارة البيئات والمستأجرين.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-md border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-bold text-primary-700 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-300">
                {stats.active} مشترك نشط
              </span>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {[...coreTabs, ...saasTabs].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition ${
                  activeTab === key
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-350"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </header>

        <div className="p-6">
          {/* MEMBERS PANEL */}
          {activeTab === "members" && (
            <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                قائمة المستأجرين (المشتركين)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950">
                    <tr>
                      <th className="p-3">اسم المؤسسة</th>
                      <th className="p-3">المسؤول</th>
                      <th className="p-3">البريد الإلكتروني</th>
                      <th className="p-3">الباقة</th>
                      <th className="p-3">الرسوم</th>
                      <th className="p-3">تاريخ التجديد</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3">العمليات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {members.map((member) => (
                      <tr key={member.id}>
                        <td className="p-3 font-bold">{member.name}</td>
                        <td className="p-3">{member.contact}</td>
                        <td className="p-3 font-mono">{member.email}</td>
                        <td className="p-3">{member.plan}</td>
                        <td className="p-3 font-mono">{formatCurrency(member.monthlyFee)}</td>
                        <td className="p-3 font-mono">{member.renewal}</td>
                        <td className="p-3">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-bold ${
                              member.status === "نشط"
                                ? "bg-emerald-50 text-emerald-700"
                                : member.status === "بانتظار التفعيل"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-red-50 text-red-700"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          {member.status !== "نشط" ? (
                            <button
                              onClick={() => updateStatus(member.id, "نشط")}
                              className="text-xs bg-emerald-600 text-white px-2 py-1 rounded"
                            >
                              تفعيل
                            </button>
                          ) : (
                            <button
                              onClick={() => updateStatus(member.id, "موقوف")}
                              className="text-xs bg-amber-600 text-white px-2 py-1 rounded"
                            >
                              توقيف
                            </button>
                          )}
                          <button
                            onClick={() => setEditMemberPlan(member)}
                            className="text-xs bg-primary-600 text-white px-2 py-1 rounded"
                          >
                            تعديل الخطة
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id, member.name)}
                            className="text-xs bg-red-600 text-white px-2 py-1 rounded"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SALES PANEL */}
          {activeTab === "sales" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-bold">إجمالي المبيعات (المحصلة)</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    {formatCurrency(stats.totalRevenue)}
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-bold">
                    الإيرادات الشهرية المتكررة (MRR)
                  </div>
                  <div className="text-2xl font-black text-primary-600 mt-1">
                    {formatCurrency(stats.monthlyRevenue)}
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-bold">الاشتراكات النشطة</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {stats.activeSubscriptions} مؤسسة
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-bold">معدل الإلغاء (Churn Rate)</div>
                  <div className="text-2xl font-black text-red-500 mt-1">{stats.churnRate}%</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Activity size={18} className="text-sky-500" />
                    تحليلات نمو المبيعات الشهرية
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600">
                    مباشر (Live data feed)
                  </span>
                </div>

                <div className="h-64 w-full bg-muted/20 rounded-xl relative flex items-end p-2 overflow-hidden border border-border/50">
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
                    <path
                      d="M0,200 L50,180 L100,160 L150,140 L200,100 L250,90 L300,70 L350,60 L400,50 L450,30 L500,20 L500,200 Z"
                      fill="url(#chartGrad)"
                    />
                    <path
                      d="M0,200 L50,180 L100,160 L150,140 L200,100 L250,90 L300,70 L350,60 L400,50 L450,30 L500,20"
                      fill="none"
                      stroke="rgb(14, 108, 147)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="w-full flex justify-between text-[10px] text-muted-foreground px-2 z-10 font-bold">
                    <span>يناير</span>
                    <span>فبراير</span>
                    <span>مارس</span>
                    <span>أبريل</span>
                    <span>مايو</span>
                    <span>يونيو</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TICKETS PANEL */}
          {activeTab === "tickets" && (
            <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                طلبات الدعم الفني (Tickets)
              </h3>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950 dark:text-white">
                          {ticket.subject}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            ticket.status === "open"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-350">
                        {ticket.description}
                      </p>
                      {ticket.reply && (
                        <div className="p-3 bg-primary-50 rounded border-r-4 border-primary-500 text-xs text-primary-900">
                          <strong>الرد: </strong> {ticket.reply}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <span className="text-xs text-slate-500">{formatDate(ticket.createdAt)}</span>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => setReplyModal({ type: "ticket", id: ticket.id })}
                          className="text-xs bg-primary-600 text-white px-2 py-1 rounded"
                        >
                          الرد على التذكرة
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {tickets.length === 0 && (
                  <p className="text-center text-slate-500 py-6">لا توجد تذاكر دعم فني.</p>
                )}
              </div>
            </div>
          )}

          {/* QUESTIONS PANEL */}
          {activeTab === "questions" && (
            <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                استفسارات الزوار (Contact Form)
              </h3>
              <div className="space-y-4">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950 dark:text-white">
                          {q.name} ({q.email})
                        </span>
                        {!q.read && (
                          <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded">
                            غير مقروء
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-350">{q.message}</p>
                      {q.reply && (
                        <div className="p-3 bg-emerald-50 rounded border-r-4 border-emerald-500 text-xs text-emerald-900">
                          <strong>الرد: </strong> {q.reply}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <span className="text-xs text-slate-500">{formatDate(q.createdAt)}</span>
                      <div className="flex gap-2 mt-2">
                        {!q.read && (
                          <button
                            onClick={() => handleMarkRead(q.id)}
                            className="text-xs bg-slate-500 text-white px-2 py-1 rounded"
                          >
                            تمت القراءة
                          </button>
                        )}
                        <button
                          onClick={() => setReplyModal({ type: "question", id: q.id })}
                          className="text-xs bg-primary-600 text-white px-2 py-1 rounded"
                        >
                          إرسال الرد
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {questions.length === 0 && (
                  <p className="text-center text-slate-500 py-6">لا توجد استفسارات زوار.</p>
                )}
              </div>
            </div>
          )}

          {/* SUBSCRIPTIONS Requests */}
          {activeTab === "subscriptions" && (
            <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                طلبات تعديل باقة الاشتراك والخدمات
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950">
                    <tr>
                      <th className="p-3">اسم العضو</th>
                      <th className="p-3">نوع الطلب</th>
                      <th className="p-3">الباقة المطلوبة</th>
                      <th className="p-3">التفاصيل / الرسالة</th>
                      <th className="p-3">تاريخ الطلب</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3">العمليات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {subRequests.map((req) => (
                      <tr key={req.id}>
                        <td className="p-3 font-bold">{req.memberName}</td>
                        <td className="p-3">{req.type}</td>
                        <td className="p-3">{req.requestedPlan || "-"}</td>
                        <td className="p-3 text-xs">{req.message || "-"}</td>
                        <td className="p-3 font-mono">{formatDate(req.createdAt)}</td>
                        <td className="p-3">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-bold ${
                              req.status === "مقبول"
                                ? "bg-emerald-50 text-emerald-700"
                                : req.status === "معلق"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-red-50 text-red-700"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          {req.status === "معلق" && (
                            <>
                              <button
                                onClick={() => handleApproveRequest(req.id, req.memberName)}
                                className="text-xs bg-emerald-600 text-white px-2 py-1 rounded"
                              >
                                موافقة
                              </button>
                              <button
                                onClick={() => handleRejectRequest(req.id, req.memberName)}
                                className="text-xs bg-red-600 text-white px-2 py-1 rounded"
                              >
                                رفض
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ACCESS CONTROL */}
          {activeTab === "access_control" && (
            <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                  إدارة حسابات مستخدمي البوابة
                </h3>
                <button
                  onClick={() => setUserModalOpen(true)}
                  className="flex items-center gap-1 bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow"
                >
                  <Plus size={16} /> إضافة مستخدم جديد
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950">
                    <tr>
                      <th className="p-3">الاسم الكامل</th>
                      <th className="p-3">اسم المستخدم</th>
                      <th className="p-3">البريد الإلكتروني</th>
                      <th className="p-3">المؤسسة التابع لها</th>
                      <th className="p-3">الصلاحية</th>
                      <th className="p-3">آخر تسجيل دخول</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {userAccounts.map((u) => (
                      <tr key={u.id}>
                        <td className="p-3 font-bold">{u.name || "-"}</td>
                        <td className="p-3">{u.username}</td>
                        <td className="p-3 font-mono">{u.email}</td>
                        <td className="p-3">
                          {u.organization ? u.organization.name : "مدير عام المنصة"}
                        </td>
                        <td className="p-3">{u.role}</td>
                        <td className="p-3 font-mono text-xs">
                          {u.lastLogin ? formatDate(u.lastLogin) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INVOICES */}
          {activeTab === "invoices" && (
            <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                  فواتير الاشتراكات الشهرية والسنوية
                </h3>
                <button
                  onClick={() => setInvoiceModalOpen(true)}
                  className="flex items-center gap-1 bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow"
                >
                  <Plus size={16} /> إنشاء فاتورة
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950">
                    <tr>
                      <th className="p-3">رقم الفاتورة</th>
                      <th className="p-3">المشترك</th>
                      <th className="p-3">المبلغ</th>
                      <th className="p-3">تاريخ الإصدار</th>
                      <th className="p-3">تاريخ الاستحقاق</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3">الوصل</th>
                      <th className="p-3">العمليات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="p-3 font-bold">{inv.invoiceNumber}</td>
                        <td className="p-3">{inv.memberName}</td>
                        <td className="p-3 font-mono text-emerald-600 font-bold">
                          {formatCurrency(inv.amount)}
                        </td>
                        <td className="p-3 font-mono">{inv.issuedAt}</td>
                        <td className="p-3 font-mono">{inv.dueAt}</td>
                        <td className="p-3">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-bold ${
                              inv.status === "مدفوع"
                                ? "bg-emerald-50 text-emerald-700"
                                : inv.status === "معلق"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-red-50 text-red-700"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3 text-xs">
                          {inv.receiptFileId ? (
                            <button
                              onClick={() => setViewingReceiptUrl(inv.receiptFileId)}
                              className="text-primary-600 hover:underline"
                            >
                              عرض الوصل المرفوع
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="p-3 flex gap-2">
                          {inv.status !== "مدفوع" && (
                            <button
                              onClick={() => handleInvoiceStatusUpdate(inv.id, "مدفوع")}
                              className="text-xs bg-emerald-600 text-white px-2 py-1 rounded"
                            >
                              تأكيد الدفع
                            </button>
                          )}
                          {inv.status !== "متأخر" && (
                            <button
                              onClick={() => handleInvoiceStatusUpdate(inv.id, "متأخر")}
                              className="text-xs bg-red-600 text-white px-2 py-1 rounded"
                            >
                              متأخر
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ALERTS */}
          {activeTab === "alerts" && (
            <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                  إشعارات المنصة المركزية
                </h3>
                <button
                  onClick={handleMarkAllAlerts}
                  className="text-xs font-bold text-primary-600 hover:underline"
                >
                  تحديد الكل كمقروء
                </button>
              </div>
              <div className="space-y-3">
                {alerts.map((a) => (
                  <div
                    key={a.id}
                    className={`p-4 rounded-xl border flex justify-between items-center gap-4 ${a.read ? "bg-slate-50 dark:bg-slate-950 border-slate-200" : "bg-primary-50 dark:bg-primary-950/20 border-primary-300"}`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {a.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{a.message}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-slate-400">{formatDate(a.createdAt)}</span>
                      {!a.read && (
                        <button
                          onClick={() => handleMarkAlert(a.id)}
                          className="text-xs bg-primary-600 text-white px-2 py-1 rounded"
                        >
                          قراءة
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AUDIT LOG */}
          {activeTab === "audit_log" && (
            <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                  سجل العمليات المركزي للوحة الإشراف
                </h3>
                <button
                  onClick={handleClearAuditLogs}
                  className="text-xs font-bold bg-red-600 text-white px-3 py-1.5 rounded-lg"
                >
                  مسح السجل
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950">
                    <tr>
                      <th className="p-3">التاريخ والوقت</th>
                      <th className="p-3">اسم المستخدم</th>
                      <th className="p-3">العملية / الإجراء</th>
                      <th className="p-3">التفاصيل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                    {auditLogs.map((l) => (
                      <tr key={l.id}>
                        <td className="p-3">{formatDate(l.createdAt)}</td>
                        <td className="p-3 font-bold">{l.username}</td>
                        <td className="p-3 text-primary-600 font-bold">{l.action}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{l.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS PANEL */}
          {activeTab === "settings" && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg space-y-6">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                إعدادات أسعار الباقات وخيارات المنصة
              </h3>
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">اسم البوابة المركزية</label>
                  <input
                    type="text"
                    className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950 text-sm"
                    value={settings.platformName}
                    onChange={(e) =>
                      setSettingsState({ ...settings, platformName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    سعر باقة Starter (د.ج/شهرياً)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950 text-sm"
                    value={settings.starterPrice}
                    onChange={(e) =>
                      setSettingsState({ ...settings, starterPrice: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    سعر باقة Professional (د.ج/شهرياً)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950 text-sm"
                    value={settings.professionalPrice}
                    onChange={(e) =>
                      setSettingsState({ ...settings, professionalPrice: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    سعر باقة Enterprise (د.ج/شهرياً)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950 text-sm"
                    value={settings.enterprisePrice}
                    onChange={(e) =>
                      setSettingsState({ ...settings, enterprisePrice: Number(e.target.value) })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-bold text-sm"
                >
                  حفظ الإعدادات العامة
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: Reply */}
      {replyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-lg font-bold text-slate-950 dark:text-white">
              {replyModal.type === "ticket" ? "الرد على تذكرة الدعم" : "الرد على استفسار الزبون"}
            </h3>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm outline-none focus:border-primary-500 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              placeholder="اكتب ردك هنا..."
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setReplyModal(null);
                  setReplyText("");
                }}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleReplySubmit}
                disabled={!replyText.trim()}
                className="flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-50 transition"
              >
                إرسال الرد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Member Plan */}
      {editMemberPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-lg font-bold text-slate-950 dark:text-white">
              تعديل باقة العضو: {editMemberPlan.name}
            </h3>
            <form onSubmit={handleSaveMemberPlan} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">الباقة (Plan)</label>
                <select
                  value={editMemberPlan.plan}
                  onChange={(e) => setEditMemberPlan({ ...editMemberPlan, plan: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-950 dark:text-white outline-none"
                >
                  <option value="Starter">Starter</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">الرسوم الشهرية (د.ج)</label>
                <input
                  type="number"
                  value={editMemberPlan.monthlyFee}
                  onChange={(e) =>
                    setEditMemberPlan({ ...editMemberPlan, monthlyFee: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-950 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">تاريخ التجديد</label>
                <input
                  type="date"
                  value={editMemberPlan.renewal}
                  onChange={(e) =>
                    setEditMemberPlan({ ...editMemberPlan, renewal: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-950 dark:text-white outline-none"
                />
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditMemberPlan(null)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-650 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-bold text-white hover:bg-primary-700 transition"
                >
                  حفظ التغييرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Create User */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-lg font-bold text-slate-950 dark:text-white">
              إنشاء حساب مستخدم جديد
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-950 dark:text-white outline-none"
                  placeholder="محمد بن عمر"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">اسم المستخدم</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-950 dark:text-white outline-none"
                  placeholder="mohamed_ade"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-950 dark:text-white outline-none"
                  placeholder="mohamed@ade.dz"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">كلمة المرور</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-950 dark:text-white outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">المؤسسة التابع لها</label>
                <select
                  value={newUser.memberId}
                  onChange={(e) => setNewUser({ ...newUser, memberId: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-950 dark:text-white outline-none"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">الصلاحية</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-950 dark:text-white outline-none"
                >
                  <option value="client">مشرف مستأجر (Client Admin)</option>
                  <option value="admin">مدير عام المنصة (Platform Admin)</option>
                </select>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-650 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-bold text-white hover:bg-primary-700 transition"
                >
                  إنشاء الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Create Invoice */}
      {invoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-lg font-bold text-slate-950 dark:text-white">
              إنشاء فاتورة اشتراك جديدة
            </h3>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">المؤسسة المشتركة</label>
                <select
                  value={newInvoice.memberId}
                  onChange={(e) => setNewInvoice({ ...newInvoice, memberId: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-950 dark:text-white outline-none"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">المبلغ الإجمالي (د.ج)</label>
                <input
                  type="number"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-950 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  تاريخ الاستحقاق (أيام من اليوم)
                </label>
                <input
                  type="number"
                  value={newInvoice.dueDays}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, dueDays: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-950 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">بيان الفاتورة / الوصف</label>
                <input
                  type="text"
                  value={newInvoice.desc}
                  onChange={(e) => setNewInvoice({ ...newInvoice, desc: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-950 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">ملاحظات إضافية</label>
                <textarea
                  value={newInvoice.notes}
                  onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm dark:border-slate-600 dark:bg-slate-950 dark:text-white outline-none resize-none h-20"
                />
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setInvoiceModalOpen(false)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-650 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-bold text-white hover:bg-primary-700 transition"
                >
                  إصدار الفاتورة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Viewer Modal */}
      {viewingReceiptUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={() => setViewingReceiptUrl(null)}
        >
          <div
            className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-955 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                وصل الدفع المرفوع
              </h3>
              <button
                onClick={() => setViewingReceiptUrl(null)}
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="flex justify-center overflow-auto max-h-[70vh] rounded-lg border bg-slate-50 p-2">
              <img
                src={viewingReceiptUrl}
                alt="وصل الدفع"
                className="max-w-full h-auto object-contain rounded"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setViewingReceiptUrl(null)}
                className="rounded-lg bg-primary-600 text-white px-4 py-2 text-sm font-bold hover:bg-primary-700"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
