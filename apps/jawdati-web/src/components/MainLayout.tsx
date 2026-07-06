import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  TestTube2,
  Droplet,
  FolderArchive,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Menu,
  Building2,
  User
} from "lucide-react";

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const {
    language,
    direction,
    theme,
    activeTenant,
    user,
    setLanguage,
    setTheme,
    logout,
    t,
    subscriptions
  } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isModuleSubscribed = (key: string) => {
    if (user?.isPlatformAdmin) return true;
    return subscriptions.some((sub) => sub.moduleKey === key && sub.status === "active");
  };

  const navItems = [
    { path: "/", label: t("home"), icon: LayoutDashboard, color: "text-sky-500 bg-sky-500/10" },
    ...(user?.isPlatformAdmin
      ? [
          {
            path: "/admin-dashboard",
            label: "لوحة الإدارة العامة",
            icon: Building2,
            color: "text-red-500 bg-red-500/10"
          }
        ]
      : [
          {
            path: "/user-dashboard",
            label: "إدارة الحساب والفواتير",
            icon: Building2,
            color: "text-blue-500 bg-blue-500/10"
          }
        ]),
    ...(isModuleSubscribed("jawdati")
      ? [
          {
            path: "/jawdati",
            label: t("jawdati"),
            icon: TestTube2,
            color: "text-emerald-500 bg-emerald-500/10"
          }
        ]
      : []),
    ...(isModuleSubscribed("mahattati")
      ? [
          {
            path: "/mahattati",
            label: t("mahattati"),
            icon: Droplet,
            color: "text-blue-500 bg-blue-500/10"
          }
        ]
      : []),
    ...(isModuleSubscribed("archivi")
      ? [
          {
            path: "/archivi",
            label: t("archivi"),
            icon: FolderArchive,
            color: "text-amber-500 bg-amber-500/10"
          }
        ]
      : [])
  ];

  // Simple Breadcrumbs computation
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === "/") return [t("home")];
    if (path === "/jawdati") return [t("home"), t("jawdati")];
    if (path === "/mahattati") return [t("home"), t("mahattati")];
    if (path === "/archivi") return [t("home"), t("archivi")];
    return [t("home")];
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-200 font-sans">
      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 bottom-0 z-20 flex flex-col border-border bg-card/60 backdrop-blur-md transition-all duration-300 ${
          direction === "rtl" ? "right-0 border-l" : "left-0 border-r"
        } ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* SIDEBAR LOGO BRAND */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20">
                ن
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                {t("appName")}
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white font-bold mx-auto">
              ن
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hidden lg:block"
          >
            {collapsed ? (
              direction === "rtl" ? (
                <ChevronLeft size={16} />
              ) : (
                <ChevronRight size={16} />
              )
            ) : direction === "rtl" ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>

        {/* SIDEBAR NAVIGATION LINKS */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-medium"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors duration-200 ${
                    isActive ? "bg-white/20 text-white" : item.color
                  }`}
                >
                  <IconComponent size={20} />
                </div>
                {!collapsed && (
                  <span className="text-sm truncate transition-opacity duration-300">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* USER PROFILE & LOGOUT BANNER PINNED AT BOTTOM */}
        <div className="p-4 border-t border-border space-y-2">
          {!collapsed && user && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
              <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <User size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{activeTenant}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors duration-200 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm font-medium">{t("logout")}</span>}
          </button>
        </div>
      </aside>

      {/* VIEWPORT LAYOUT WRAPPER */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed
            ? direction === "rtl"
              ? "pr-20"
              : "pl-20"
            : direction === "rtl"
              ? "pr-0 lg:pr-64"
              : "pl-0 lg:pl-64"
        }`}
      >
        {/* HEADER TOP BAR */}
        <header className="h-16 sticky top-0 z-10 border-b border-border bg-card/45 backdrop-blur-md flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb Location Trail */}
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
              {getBreadcrumbs().map((b, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className={idx === arr.length - 1 ? "text-foreground font-semibold" : ""}>
                    {b}
                  </span>
                  {idx < arr.length - 1 && <span className="text-muted-foreground/50">/</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Active Tenant Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold text-xs border border-sky-500/20">
              <Building2 size={13} />
              {activeTenant}
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="px-3 py-1.5 rounded-lg hover:bg-muted border border-border text-sm font-medium transition-colors"
              >
                {language === "ar" ? "العربية" : language === "fr" ? "Français" : "English"}
              </button>
              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangMenuOpen(false)} />
                  <div
                    className={`absolute mt-2 w-32 rounded-xl bg-card border border-border shadow-xl z-20 ${
                      direction === "rtl" ? "left-0" : "right-0"
                    }`}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setLanguage("ar");
                          setLangMenuOpen(false);
                        }}
                        className="w-full text-start px-4 py-2 text-sm hover:bg-muted transition-colors font-medium"
                      >
                        العربية
                      </button>
                      <button
                        onClick={() => {
                          setLanguage("fr");
                          setLangMenuOpen(false);
                        }}
                        className="w-full text-start px-4 py-2 text-sm hover:bg-muted transition-colors font-medium"
                      >
                        Français
                      </button>
                      <button
                        onClick={() => {
                          setLanguage("en");
                          setLangMenuOpen(false);
                        }}
                        className="w-full text-start px-4 py-2 text-sm hover:bg-muted transition-colors font-medium"
                      >
                        English
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle Trigger */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-lg hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        {/* MAIN BODY CONTEXT */}
        <main className="flex-1 p-6 overflow-y-auto max-w-[1440px] mx-auto w-full">{children}</main>
      </div>
    </div>
  );
};
