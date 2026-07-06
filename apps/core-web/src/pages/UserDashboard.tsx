import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Send,
  User,
  Sparkles,
  Crown,
  Zap,
  X,
  Check,
  AlertTriangle,
  Archive,
  FlaskConical,
  Factory,
  Package
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { api, getModuleUrl } from "../utils/api";

const planIcons: Record<string, React.ReactNode> = {
  Starter: <Zap size={20} />,
  Professional: <Sparkles size={20} />,
  Enterprise: <Crown size={20} />
};

const planColors: Record<string, string> = {
  Starter: "text-sky-600 bg-sky-50 dark:text-sky-300 dark:bg-sky-950/40",
  Professional: "text-violet-600 bg-violet-50 dark:text-violet-300 dark:bg-violet-950/40",
  Enterprise: "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40"
};

const PLAN_PRICING: Record<string, { price: number; features: string[] }> = {
  Starter: {
    price: 8000,
    features: ["محطة مياه واحدة", "مخبر تحاليل كيميائية مبسط", "تخزين مستندات 5GB"]
  },
  Professional: {
    price: 25000,
    features: ["5 محطات مياه", "مخبر تحاليل ميكروبيولوجية وكيميائية", "تخزين مستندات 50GB"]
  },
  Enterprise: {
    price: 95000,
    features: ["محطات مياه غير محدودة", "مخابر تحليل متعددة ومعتمدة", "تخزين مستندات 1TB"]
  }
};

export const UserDashboard: React.FC = () => {
  const { user, t } = useApp();
  const [client, setClient] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clientRequests, setClientRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState("");
  const [viewingReceiptUrl, setViewingReceiptUrl] = useState<string | null>(null);

  const loadDashboardData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      // Get current logged in user details including organization
      const profile = await api.getMe();
      setClient(profile.organization);
      setSelectedNewPlan(profile.organization.plan);

      const [invList, reqList] = await Promise.all([
        api.getInvoices(),
        api.getSubscriptionRequests()
      ]);
      setInvoices(invList);
      setClientRequests(reqList.filter((r: any) => r.orgId === profile.organization.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData(true);
  }, []);

  const handleRequestActivation = async (serviceName: string, serviceKey: string) => {
    if (!client) return;
    const alreadyPending = pendingRequests.some(
      (r) => r.type === "service_activation" && r.requestedServices?.includes(serviceKey)
    );
    if (alreadyPending) {
      alert(`طلب تفعيل ${serviceName} مُرسل مسبقاً وقيد المراجعة.`);
      return;
    }
    try {
      await api.createSubscriptionRequest({
        orgId: client.id,
        type: "service_activation",
        requestedServices: [serviceKey],
        message: `طلب تفعيل خدمة ${serviceName} لمؤسسة "${client.name}".`
      });
      alert(`تم إرسال طلب تفعيل ${serviceName} بنجاح! سيتم مراجعته من الإدارة.`);
      await loadDashboardData();
    } catch {
      alert("فشل إرسال طلب التفعيل.");
    }
  };

  const handlePlanChangeRequest = async () => {
    if (!client) return;
    if (selectedNewPlan === client.plan) {
      alert("أنت مشترك بالفعل في هذه الباقة.");
      return;
    }
    const alreadyPending = pendingRequests.some(
      (r) => r.type === "upgrade" || r.type === "downgrade"
    );
    if (alreadyPending) {
      alert("لديك طلب تغيير باقة معلق بالفعل.");
      return;
    }
    const currentPrice = PLAN_PRICING[client.plan]?.price || 0;
    const newPrice = PLAN_PRICING[selectedNewPlan]?.price || 0;
    const type = newPrice > currentPrice ? "upgrade" : "downgrade";

    try {
      await api.createSubscriptionRequest({
        orgId: client.id,
        type,
        currentPlan: client.plan,
        requestedPlan: selectedNewPlan,
        message: `طلب ${type === "upgrade" ? "ترقية" : "تخفيض"} من باقة ${client.plan} إلى باقة ${selectedNewPlan}.`
      });
      setShowPlanModal(false);
      alert(`تم إرسال طلب تغيير الباقة بنجاح! سيتم مراجعته من الإدارة.`);
      await loadDashboardData();
    } catch {
      alert("فشل إرسال طلب تغيير الباقة.");
    }
  };

  const handleUploadReceipt = (invoiceId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        await api.updateInvoiceStatus(invoiceId, "معلق", undefined, base64String);
        alert(`تم رفع وصل الدفع بنجاح!`);
        await loadDashboardData();
      } catch {
        alert("حدث خطأ أثناء رفع الوصل.");
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading || !client) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
        <p className="font-bold animate-pulse text-sm">جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  const activeServices = user?.services || {};
  const services = [
    {
      key: "mahattati",
      title: t("mahattati"),
      subtitle: "تسيير ومراقبة محطات المياه والضخ",
      path: getModuleUrl("mahattati"),
      icon: Factory,
      active: !!activeServices.mahattati
    },
    {
      key: "jawdati",
      title: t("jawdati"),
      subtitle: "مخبر التحاليل وضبط جودة المياه",
      path: getModuleUrl("jawdati"),
      icon: FlaskConical,
      active: !!activeServices.jawdati
    },
    {
      key: "archivi",
      title: t("archivi"),
      subtitle: "الأرشيف الرقمي وإدارة المراسلات",
      path: getModuleUrl("archivi"),
      icon: Archive,
      active: !!activeServices.archivi
    }
  ];

  const pendingRequests = clientRequests.filter((r) => r.status === "معلق");

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("ar-DZ", { style: "decimal" }).format(amount) + " د.ج";

  const getRequestTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      registration: "تسجيل جديد",
      upgrade: "ترقية باقة",
      downgrade: "تخفيض باقة",
      service_activation: "تفعيل خدمة",
      service_deactivation: "إلغاء خدمة"
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "معلق":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
      case "مقبول":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
      case "مرفوض":
        return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-primary-50 px-3 py-1 text-sm font-bold text-primary-700 dark:bg-primary-950/40 dark:text-primary-300">
                <User size={16} />
                حساب مشترك
              </div>
              <h1 className="text-3xl font-bold text-slate-950 dark:text-white font-sans">
                لوحة الزبون
              </h1>
              <p className="mt-2 text-sm text-slate-650 dark:text-slate-300">
                مرحباً بك في لوحة التحكم الخاصة بمؤسستك. يمكنك إدارة اشتراكك والخدمات والفواتير.
              </p>
            </div>
            <div
              className={`rounded-md border px-3 py-2 text-sm font-bold ${
                client.status === "نشط"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : client.status === "بانتظار التفعيل"
                    ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                    : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
              }`}
            >
              {client.status === "نشط"
                ? "✓ اشتراك نشط"
                : client.status === "بانتظار التفعيل"
                  ? "⏳ بانتظار التفعيل"
                  : "✗ " + client.status}
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Pending Activation Notice */}
        {client.status === "بانتظار التفعيل" && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
            <AlertTriangle className="text-amber-600 shrink-0" size={22} />
            <div>
              <p className="font-bold text-amber-800 dark:text-amber-200">حسابك قيد المراجعة</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                تم استلام طلب اشتراكك وهو بانتظار موافقة الإدارة. ستتمكن من الوصول للخدمات فور
                التفعيل.
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          <StatCard title="المؤسسة" value={client.name} icon={<FileText size={22} />} />
          <div
            className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setShowPlanModal(true)}
          >
            <div
              className={`mb-3 inline-flex rounded-md p-2 ${planColors[client.plan] || "bg-primary-50 text-primary-700"}`}
            >
              {planIcons[client.plan] || <CreditCard size={22} />}
            </div>
            <div className="text-xs font-bold text-slate-500">الباقة الحالية</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-bold text-slate-950 dark:text-white">
                {client.plan}
              </span>
              <span className="text-xs text-primary-650 font-bold">تغيير ↗</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {formatCurrency(client.monthlyFee)}/شهر
            </div>
          </div>
          <StatCard
            title="التجديد القادم"
            value={client.renewal || "-"}
            icon={<Clock size={22} />}
          />
          <StatCard
            title="الخدمات المفعلة"
            value={`${Object.values(activeServices).filter(Boolean).length} من 3`}
            icon={<CheckCircle2 size={22} />}
          />
        </div>

        {/* Services Section */}
        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">الخدمات المتاحة</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            الخدمات المفعلة يمكنك الدخول إليها مباشرة. للخدمات غير المفعلة يمكنك طلب التفعيل.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              const isPending = pendingRequests.some(
                (r) => r.type === "service_activation" && r.requestedServices?.includes(service.key)
              );
              const body = (
                <div
                  className={`min-h-[220px] rounded-lg border p-5 transition-all flex flex-col justify-between ${
                    service.active
                      ? "border-slate-200 bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                      : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="rounded-md bg-primary-50 p-3 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300">
                        <Icon size={24} />
                      </div>
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-bold ${
                          service.active
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : isPending
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                              : "bg-slate-200 text-slate-550 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {service.active ? "مفعّل" : isPending ? "قيد المراجعة" : "غير مفعّل"}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{service.subtitle}</p>
                  </div>
                  <div className="pt-4 mt-auto">
                    {service.active ? (
                      <Link
                        to={service.path}
                        className="flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800 dark:text-primary-300"
                      >
                        <CheckCircle2 size={16} />
                        دخول
                      </Link>
                    ) : isPending ? (
                      <span className="flex items-center gap-2 text-sm font-bold text-amber-600">
                        <Clock size={16} />
                        بانتظار موافقة الإدارة
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRequestActivation(service.title, service.key)}
                        className="flex items-center gap-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-bold text-white hover:bg-primary-700"
                      >
                        <Send size={14} />
                        طلب التفعيل
                      </button>
                    )}
                  </div>
                </div>
              );

              return service.active ? (
                <a key={service.key} href={service.path}>
                  {body}
                </a>
              ) : (
                <div key={service.key}>{body}</div>
              );
            })}
          </div>
        </section>

        {/* My Requests Section */}
        {clientRequests.length > 0 && (
          <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-2">
              <Package size={20} className="inline ml-2" />
              طلباتي
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              متابعة حالة طلبات الاشتراك والخدمات الخاصة بمؤسستك.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 text-slate-550 dark:bg-slate-950">
                  <tr>
                    <th className="p-3">النوع</th>
                    <th className="p-3">التفاصيل</th>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {clientRequests.slice(0, 10).map((req) => (
                    <tr key={req.id}>
                      <td className="p-3 font-bold">{getRequestTypeLabel(req.type)}</td>
                      <td className="p-3 text-slate-650 dark:text-slate-300 max-w-xs truncate">
                        {req.message || "-"}
                        {req.rejectionReason && (
                          <span className="block text-xs text-red-500 mt-1">
                            سبب الرفض: {req.rejectionReason}
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-xs">
                        {new Date(req.createdAt).toLocaleDateString("ar-DZ")}
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-bold ${getStatusBadge(req.status)}`}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Invoices Section */}
        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-2 font-sans">
            الفواتير وتتبع المدفوعات
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            قائمة الفواتير الصادرة لمؤسستك. يمكنك رفع وصل الدفع للفواتير المعلقة لتأكيد اشتراكك.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-slate-550 dark:bg-slate-950">
                <tr>
                  <th className="p-3">رقم الفاتورة</th>
                  <th className="p-3">المبلغ</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">تاريخ الاستحقاق</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3">الوصل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="p-3 font-bold">{invoice.invoiceNumber}</td>
                    <td className="p-3 font-mono text-emerald-600 dark:text-emerald-450 font-bold">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="p-3 font-mono">{invoice.issuedAt}</td>
                    <td className="p-3 font-mono">{invoice.dueAt}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-bold ${
                          invoice.status === "مدفوع"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : invoice.status === "متأخر"
                              ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {invoice.status === "مدفوع" ? (
                        <span className="text-xs text-slate-500">تم الدفع والتأكيد</span>
                      ) : invoice.receiptFileId ? (
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-primary-50 px-2 py-1 text-xs font-bold text-primary-700 dark:bg-primary-950/40 dark:text-primary-300">
                            مرفوع وبانتظار المراجعة
                          </span>
                          <button
                            onClick={() => setViewingReceiptUrl(invoice.receiptFileId)}
                            className="text-xs text-primary-600 hover:underline font-bold"
                          >
                            عرض الوصل
                          </button>
                        </div>
                      ) : (
                        <label className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-primary-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-700">
                          <span>رفع وصل الدفع</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUploadReceipt(invoice.id, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-550">
                      لا توجد فواتير صادرة لمؤسستك حالياً.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Plan Change Modal */}
      {showPlanModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowPlanModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">تغيير الباقة</h3>
              <button
                onClick={() => setShowPlanModal(false)}
                className="text-slate-400 hover:text-slate-655"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-500 mb-4 font-medium">
                باقتك الحالية:{" "}
                <strong className="text-slate-900 dark:text-white">{client.plan}</strong> (
                {formatCurrency(client.monthlyFee)}/شهر)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(PLAN_PRICING).map(([key, plan]) => {
                  const isCurrent = key === client.plan;
                  const isSelected = key === selectedNewPlan;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedNewPlan(key)}
                      disabled={isCurrent}
                      className={`relative p-4 rounded-xl border-2 text-right transition-all flex flex-col ${
                        isCurrent
                          ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900 opacity-60 cursor-not-allowed"
                          : isSelected
                            ? "border-primary-400 bg-primary-50 dark:border-primary-600 dark:bg-primary-950/30 shadow-md"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {isCurrent && (
                        <span className="absolute top-2 left-2 rtl:right-2 rtl:left-auto text-xs bg-slate-200 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded font-bold">
                          الحالية
                        </span>
                      )}
                      {isSelected && !isCurrent && (
                        <div className="absolute top-2 left-2 rtl:right-2 rtl:left-auto w-5 h-5 rounded-full bg-primary-500 text-white flex items-center justify-center">
                          <Check size={12} />
                        </div>
                      )}
                      <div className={`mb-2 ${planColors[key] || ""} inline-flex rounded-lg p-2`}>
                        {planIcons[key]}
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{key}</h4>
                      <div className="text-sm font-black text-primary-600 dark:text-primary-400 mt-1">
                        {formatCurrency(plan.price)}/شهر
                      </div>
                      <ul className="mt-2 space-y-1 text-xs text-slate-500">
                        {plan.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <Check size={10} className="text-emerald-500" /> {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-slate-650 bg-slate-105 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  onClick={handlePlanChangeRequest}
                  disabled={selectedNewPlan === client.plan}
                  className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 animate-pulse"
                >
                  {(PLAN_PRICING[selectedNewPlan]?.price || 0) >
                  (PLAN_PRICING[client.plan]?.price || 0) ? (
                    <>
                      <ArrowUpCircle size={16} /> طلب ترقية
                    </>
                  ) : (
                    <>
                      <ArrowDownCircle size={16} /> طلب تخفيض
                    </>
                  )}
                </button>
              </div>
            </div>
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
            className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                وصل الدفع المرفوع
              </h3>
              <button
                onClick={() => setViewingReceiptUrl(null)}
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-805"
              >
                ✕
              </button>
            </div>
            <div className="flex justify-center overflow-auto max-h-[70vh] rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-550 p-2">
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

const StatCard = ({
  title,
  value,
  icon
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-3 inline-flex rounded-md bg-primary-50 p-2 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300">
      {icon}
    </div>
    <div className="text-xs font-bold text-slate-500">{title}</div>
    <div className="mt-1 text-lg font-bold text-slate-950 dark:text-white">{value}</div>
  </div>
);
