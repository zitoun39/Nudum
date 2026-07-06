import React, { useState, useEffect } from "react";

import { ArrowLeft, Lock, ShieldCheck, Archive, FlaskConical, Factory } from "lucide-react";
import { useApp } from "../context/AppContext";
import { api, getModuleUrl } from "../utils/api";

const serviceIcons: Record<string, React.ReactNode> = {
  archivi: <Archive size={26} />,
  jawdati: <FlaskConical size={26} />,
  mahattati: <Factory size={26} />
};

export const AppPortal: React.FC = () => {
  const { user, activeTenant, subscriptions, t } = useApp();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    async function loadServices() {
      try {
        const subs = await api.getSubscriptions();
        const items = [
          {
            key: "mahattati",
            title: t("mahattati"),
            subtitle: t("mahattatiTitle"),
            description: t("mahattatiDesc"),
            path: getModuleUrl("mahattati"),
            icon: "mahattati"
          },
          {
            key: "jawdati",
            title: t("jawdati"),
            subtitle: t("jawdatiTitle"),
            description: t("jawdatiDesc"),
            path: getModuleUrl("jawdati"),
            icon: "jawdati"
          },
          {
            key: "archivi",
            title: t("archivi"),
            subtitle: t("archiviTitle"),
            description: t("archiviDesc"),
            path: getModuleUrl("archivi"),
            icon: "archivi"
          }
        ];

        const mapped = items.map((item) => {
          const sub = subs.find((s) => s.moduleKey === item.key);
          const active = !!sub && sub.status === "active";
          return {
            ...item,
            active,
            status: active ? t("activeLabel") : t("notSubscribed")
          };
        });

        setServices(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, [subscriptions, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-primary-50 px-3 py-1 text-sm font-bold text-primary-700 dark:bg-primary-950/20 dark:text-primary-300">
                <ShieldCheck size={16} />
                {t("saasAccess")}
              </div>
              <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
                {t("subscriberPortal")}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-650 dark:text-slate-300">
                {t("selectServiceDesc")}
              </p>
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
              {activeTenant}
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {services.map((service) => {
            const active = service.active || (user && user.isPlatformAdmin);
            const card = (
              <div
                className={`flex min-h-[250px] flex-col rounded-lg border bg-white p-6 shadow-sm transition-all dark:bg-slate-900 ${
                  active
                    ? "border-slate-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-850"
                    : "border-slate-200 opacity-70 dark:border-slate-850"
                }`}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-900 dark:bg-primary-950/30 dark:text-primary-300">
                    {serviceIcons[service.icon] || <Archive size={26} />}
                  </div>
                  <span
                    className={`rounded-md border px-2 py-1 text-xs font-bold ${
                      active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "border-slate-250 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-450"
                    }`}
                  >
                    {active ? t("activeLabel") : t("notSubscribed")}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                  {service.title}
                </h2>
                <p className="mt-1 text-sm font-bold text-slate-500">{service.subtitle}</p>
                <p className="mt-4 flex-1 text-sm leading-7 text-slate-650 dark:text-slate-300">
                  {service.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary-700 dark:text-primary-300">
                  {active ? t("openAccess") : t("closed")}
                  {active ? <ArrowLeft size={18} /> : <Lock size={18} />}
                </div>
              </div>
            );

            return active ? (
              <a key={service.key} href={service.path} className="transition">
                {card}
              </a>
            ) : (
              <div key={service.key}>{card}</div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
