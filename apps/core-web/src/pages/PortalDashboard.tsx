import React, { useEffect, useState } from "react";

import { useApp } from "../context/AppContext";
import { api, getModuleUrl } from "../utils/api";
import {
  Shield,
  Layers,
  Wrench,
  FlaskConical,
  FolderOpen,
  HelpCircle,
  Clock,
  CheckCircle,
  Plus,
  X
} from "lucide-react";

export const PortalDashboard: React.FC = () => {
  const { subscriptions, activeTenant, user, t } = useApp();
  const [tickets, setTickets] = useState<any[]>([]);
  const [addTicketOpen, setAddTicketOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    moduleKey: ""
  });

  const loadTickets = async () => {
    try {
      const list = await api.getSupportTickets();
      setTickets(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSupportTicket({
        subject: newTicket.subject,
        description: newTicket.description,
        moduleKey: newTicket.moduleKey || undefined
      });
      setNewTicket({ subject: "", description: "", moduleKey: "" });
      setAddTicketOpen(false);
      loadTickets();
    } catch (err) {
      alert("Failed to submit support ticket");
    }
  };

  const isModuleSubscribed = (key: string) => {
    return subscriptions.some((sub) => sub.moduleKey === key && sub.status === "active");
  };

  const modules = [
    {
      key: "mahattati",
      title: `${t("mahattati")} (Mahattati)`,
      desc: t("mahattatiDesc"),
      path: getModuleUrl("mahattati"),
      icon: <Wrench size={32} className="text-sky-500" />,
      colorClass: "from-sky-500/10 to-blue-500/5 hover:border-sky-500/40"
    },
    {
      key: "jawdati",
      title: `${t("jawdati")} (Jawdati)`,
      desc: t("jawdatiDesc"),
      path: getModuleUrl("jawdati"),
      icon: <FlaskConical size={32} className="text-emerald-500" />,
      colorClass: "from-emerald-500/10 to-teal-500/5 hover:border-emerald-500/40"
    },
    {
      key: "archivi",
      title: `${t("archivi")} (Archivi)`,
      desc: t("archiviDesc"),
      path: getModuleUrl("archivi"),
      icon: <FolderOpen size={32} className="text-amber-500" />,
      colorClass: "from-amber-500/10 to-orange-500/5 hover:border-amber-500/40"
    }
  ];

  return (
    <div className="space-y-8">
      {/* PORTAL HERO BANNER */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <Layers size={14} />
            {t("corePortal")}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t("welcomeSaaS")}</h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            {activeTenant} · {t("portalDesc")}
          </p>
        </div>
      </div>

      {/* SUBSCRIBED SERVICES GRID */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Layers className="text-primary" size={20} />
          {t("availableServices")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const active = isModuleSubscribed(mod.key);
            return (
              <div
                key={mod.key}
                className={`relative p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between gap-6 bg-gradient-to-b ${
                  active
                    ? `${mod.colorClass} border-border bg-card shadow-sm cursor-pointer`
                    : "bg-muted/10 border-border/40 opacity-70 pointer-events-none"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-2xl bg-muted/40">{mod.icon}</div>
                    {active ? (
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                        {t("activeLabel")}
                      </span>
                    ) : (
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
                        {t("notSubscribed")}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-base">{mod.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{mod.desc}</p>
                  </div>
                </div>

                {active ? (
                  <a
                    href={mod.path}
                    className="w-full text-center py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-lg shadow-primary/10 hover:bg-primary/95 transition-all mt-4"
                  >
                    {t("enterModule")}
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full text-center py-2.5 rounded-xl bg-muted text-muted-foreground font-bold text-xs border border-border mt-4 cursor-not-allowed"
                  >
                    {t("serviceNotActive")}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SUPPORT TICKETS & SLA JOURNAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <h3 className="text-sm font-extrabold flex items-center gap-2">
              <HelpCircle className="text-sky-500" size={18} />
              {t("supportTickets")}
            </h3>
            <button
              onClick={() => setAddTicketOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/95 transition-all"
            >
              <Plus size={14} />
              {t("newTicket")}
            </button>
          </div>

          <div className="space-y-3">
            {tickets.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">{t("noTickets")}</p>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 rounded-2xl bg-muted/20 border border-border flex justify-between items-center gap-4"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-primary">{ticket.subject}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {ticket.description}
                    </p>
                    <span className="text-[9px] text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        ticket.status === "open"
                          ? "bg-amber-500/10 text-amber-600"
                          : ticket.status === "in_progress"
                            ? "bg-sky-500/10 text-sky-600"
                            : "bg-emerald-500/10 text-emerald-600"
                      }`}
                    >
                      {ticket.status === "open" ? (
                        <>
                          <Clock size={10} /> {t("ticketStatusOpen")}
                        </>
                      ) : ticket.status === "in_progress" ? (
                        <>
                          <Clock size={10} /> {t("ticketStatusProgress")}
                        </>
                      ) : (
                        <>
                          <CheckCircle size={10} /> {t("ticketStatusClosed")}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECURITY & DELEGATION CARD */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl -z-10" />
          <h3 className="text-sm font-extrabold flex items-center gap-2">
            <Shield className="text-emerald-400" size={18} />
            {t("securitySaaS")}
          </h3>
          <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-medium">
            <p>• {t("securityDesc1")}</p>
            <p>
              • {t("securityDesc2")}{" "}
              <strong>{user?.isPlatformAdmin ? t("rolePlatformAdmin") : t("roleOrgAdmin")}</strong>.
            </p>
            <p>• {t("securityDesc3")}</p>
          </div>
        </div>
      </div>

      {/* ADD SUPPORT TICKET MODAL */}
      {addTicketOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setAddTicketOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <HelpCircle size={18} className="text-primary" />
                {t("createSupportTicket")}
              </h3>
              <button
                onClick={() => setAddTicketOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">
                  {t("subjectLabel")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t("subjectPlaceholder")}
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket((prev) => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">
                  {t("descriptionLabel")}
                </label>
                <textarea
                  required
                  placeholder={t("descriptionPlaceholder")}
                  value={newTicket.description}
                  onChange={(e) =>
                    setNewTicket((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm h-28 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">
                  {t("relatedModule")}
                </label>
                <select
                  value={newTicket.moduleKey}
                  onChange={(e) => setNewTicket((prev) => ({ ...prev, moduleKey: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none text-sm"
                >
                  <option value="">{t("generalSupport")}</option>
                  <option value="mahattati">{t("mahattati")}</option>
                  <option value="jawdati">{t("jawdati")}</option>
                  <option value="archivi">{t("archivi")}</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddTicketOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-muted hover:bg-muted/80 font-bold text-sm transition-all border border-border"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-sm transition-all shadow-lg shadow-primary/10"
                >
                  {t("sendTicket")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
