import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api";

type Language = "ar" | "fr" | "en";
type Direction = "rtl" | "ltr";
type Theme = "light" | "dark";

interface AppContextType {
  language: Language;
  direction: Direction;
  theme: Theme;
  user: any;
  activeTenant: string;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  login: (orgId: string) => Promise<void>;
  logout: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Core translation strings for high-fidelity UI representation
const translations: Record<Language, Record<string, string>> = {
  ar: {
    appName: "منصة نُظُم",
    appSubName: "نظام إداري متكامل لمؤسسات المياه وجودة المعالجة",
    home: "الرئيسية",
    jawdati: "جودتي (المختبر)",
    mahattati: "محطتي (العمليات)",
    archivi: "أرشيفي (المستندات)",
    settings: "الإعدادات",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    welcome: "مرحباً بك مجدداً",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    selectOrg: "اختر المؤسسة / الولاية",
    loading: "جاري التحميل...",
    save: "حفظ التغييرات",
    cancel: "إلغاء",
    create: "إضافة جديد",
    delete: "حذف",
    edit: "تعديل",
    actions: "الإجراءات",
    status: "الحالة",
    name: "الاسم",
    location: "الموقع",

    // Dashboard
    dashboardTitle: "لوحة التحكم العامة للمؤسسة",
    kpiTotalSamples: "إجمالي العينات المجمعة",
    kpiActiveStations: "المحطات النشطة حالياً",
    kpiPendingDocs: "المراسلات قيد المراجعة",
    recentActivity: "آخر العمليات والأنشطة في المنصة",
    telemetryTrends: "مخطط تدفق المياه عن بعد (Telemetry)",

    // Jawdati (LIMS)
    jawdatiTitle: "مخبر التحاليل وضبط جودة المياه",
    laboratories: "المختبرات والوحدات مخبرية",
    registerLab: "تسجيل مختبر جديد",
    samples: "عينات المياه المجمعة",
    registerSample: "تسجيل عينة مياه جديدة",
    sampleCode: "رمز العينة",
    collectedBy: "اسم جامع العينة",
    collectedAt: "تاريخ الجمع",
    sourceSite: "موقع الجمع (السد/الخزان)",
    sourceStation: "المحطة المصدر",
    statusCollected: "تم الجمع",
    statusAnalyzing: "قيد التحليل",
    statusCompleted: "مكتمل ومطابق",
    statusFailed: "غير مطابق للمواصفات",
    analyses: "التحاليل والبارامترات",
    requestAnalysis: "جدولة تحليل جديد على العينة",
    testMethod: "طريقة الفحص / المواصفة القياسية",
    parameter: "البارامتر",
    value: "القيمة المقاسة",
    unit: "الوحدة",
    isConforming: "مطابقة المواصفة",
    submitResult: "تسجيل نتائج القياس الكيميائي",

    // Mahattati (Ops)
    mahattatiTitle: "عمليات وتشغيل محطات ضخ ومعالجة المياه",
    sites: "المواقع والموارد المائية",
    registerSite: "تسجيل موقع مائي جديد",
    stations: "محطات المعالجة والضخ",
    registerStation: "تسجيل محطة جديدة",
    capacity: "القدرة اليومية (م³/يوم)",
    equipment: "جرد العتاد والمعدات الصناعية",
    registerEquipment: "تسجيل معدّة جديدة",
    serialNumber: "الرقم التسلسلي",
    eqType: "نوع المعدّة",
    statusOperational: "شغالة وبحالة جيدة",
    statusUnderMaintenance: "في الصيانة الدورية",
    statusFaulty: "عاطلة وبحاجة لإصلاح",
    statusDecommissioned: "خارج الخدمة نهائياً",
    measurements: "سجلات القراءات اليومية والقياس عن بعد",
    logMeasurement: "تسجيل قراءة تشغيلية",
    loggedBy: "المسجل",
    loggedAt: "تاريخ القراءة",

    // Archivi (Docs)
    archiviTitle: "الأرشيف الرقمي وإدارة المراسلات الرسمية",
    folders: "شجرة المجلدات والأرشيف",
    registerFolder: "إنشاء مجلد جديد",
    documents: "المستندات والملفات المؤرشفة",
    registerDocument: "أرشفة مستند جديد",
    title: "عنوان المستند",
    description: "شرح/وصف المستند",
    version: "رقم الإصدار",
    fileSize: "حجم الملف",
    download: "تحميل الملف",
    uploadVersion: "رفع نسخة/إصدار جديد",
    correspondences: "دفتر الوارد والصادر الرسمي",
    registerCorrespondence: "تسجيل رسالة رسمية جديدة",
    corType: "نوع الرسالة",
    incoming: "وارد",
    outgoing: "صادر",
    refNumber: "رقم الإرسال / المرجع الرسمي",
    sender: "الجهة المرسِلة",
    recipient: "الجهة المستقبِلة",
    subject: "موضوع الرسالة",
    approve: "اعتماد وموافقة",
    reject: "رفض",
    draft: "مسودة",
    pendingReview: "قيد المراجعة الإدارية"
  },
  fr: {
    appName: "Plateforme Nudum",
    appSubName: "Gestion intégrée de l'eau et de la qualité du traitement",
    home: "Tableau de Bord",
    jawdati: "Jawdati (LIMS)",
    mahattati: "Mahattati (Ops)",
    archivi: "Archivi (Docs)",
    settings: "Paramètres",
    login: "Se connecter",
    logout: "Se déconnecter",
    welcome: "Bon retour",
    username: "Nom d'utilisateur",
    password: "Mot de passe",
    selectOrg: "Sélectionner la Direction / Wilaya",
    loading: "Chargement...",
    save: "Enregistrer",
    cancel: "Annuler",
    create: "Ajouter",
    delete: "Supprimer",
    edit: "Modifier",
    actions: "Actions",
    status: "Statut",
    name: "Nom",
    location: "Emplacement",

    // Dashboard
    dashboardTitle: "Tableau de Bord de l'Entreprise",
    kpiTotalSamples: "Échantillons Collectés",
    kpiActiveStations: "Stations Actives",
    kpiPendingDocs: "Courriers en Révision",
    recentActivity: "Activités Récentes de la Plateforme",
    telemetryTrends: "Télémesures de Débit en Direct (Telemetry)",

    // Jawdati
    jawdatiTitle: "Laboratoire d'Analyses & Contrôle Qualité",
    laboratories: "Laboratoires & Unités",
    registerLab: "Enregistrer un Laboratoire",
    samples: "Échantillons d'Eau",
    registerSample: "Enregistrer un Échantillon",
    sampleCode: "Code Échantillon",
    collectedBy: "Collecté Par",
    collectedAt: "Collecté Le",
    sourceSite: "Site Source (Barrage/Réservoir)",
    sourceStation: "Station Source",
    statusCollected: "Collecté",
    statusAnalyzing: "En Analyse",
    statusCompleted: "Conforme",
    statusFailed: "Non Conforme",
    analyses: "Analyses & Paramètres",
    requestAnalysis: "Planifier une Analyse",
    testMethod: "Méthode d'Essai / Norme",
    parameter: "Paramètre",
    value: "Valeur Mesurée",
    unit: "Unité",
    isConforming: "Conforme aux Normes",
    submitResult: "Enregistrer les Résultats",

    // Mahattati
    mahattatiTitle: "Opérations & Maintenance des Stations",
    sites: "Sites & Ressources en Eau",
    registerSite: "Enregistrer un Site",
    stations: "Stations de Pompage & Traitement",
    registerStation: "Enregistrer une Station",
    capacity: "Capacité Journalière (m³/j)",
    equipment: "Inventaire des Équipements Industriels",
    registerEquipment: "Enregistrer un Équipement",
    serialNumber: "Numéro de Série",
    eqType: "Type d'Équipement",
    statusOperational: "Opérationnel",
    statusUnderMaintenance: "En Maintenance",
    statusFaulty: "En Panne",
    statusDecommissioned: "Hors Service",
    measurements: "Télémesures & Relevés Quotidiens",
    logMeasurement: "Enregistrer un Relevé",
    loggedBy: "Enregistré Par",
    loggedAt: "Enregistré Le",

    // Archivi
    archiviTitle: "Archivage Numérique & Courrier Officiel",
    folders: "Dossiers & Archives",
    registerFolder: "Créer un Dossier",
    documents: "Documents & Fichiers",
    registerDocument: "Archiver un Document",
    title: "Titre du Document",
    description: "Description",
    version: "Version",
    fileSize: "Taille",
    download: "Télécharger",
    uploadVersion: "Nouvelle Version",
    correspondences: "Registre des Courriers",
    registerCorrespondence: "Enregistrer un Courrier",
    corType: "Type",
    incoming: "Arrivée",
    outgoing: "Départ",
    refNumber: "Numéro d'Envoi / Réf",
    sender: "Expéditeur",
    recipient: "Destinataire",
    subject: "Objet",
    approve: "Approuver",
    reject: "Rejeter",
    draft: "Brouillon",
    pendingReview: "En Révision"
  },
  en: {
    appName: "Nudum Platform",
    appSubName: "Integrated System for Water Utilities and Quality Management",
    home: "Dashboard",
    jawdati: "Jawdati (LIMS)",
    mahattati: "Mahattati (Ops)",
    archivi: "Archivi (Docs)",
    settings: "Settings",
    login: "Log In",
    logout: "Log Out",
    welcome: "Welcome Back",
    username: "Username",
    password: "Password",
    selectOrg: "Select Organization / Wilaya",
    loading: "Loading...",
    save: "Save Changes",
    cancel: "Cancel",
    create: "Add New",
    delete: "Delete",
    edit: "Edit",
    actions: "Actions",
    status: "Status",
    name: "Name",
    location: "Location",

    // Dashboard
    dashboardTitle: "Enterprise Overview Dashboard",
    kpiTotalSamples: "Total Collected Samples",
    kpiActiveStations: "Active Stations Now",
    kpiPendingDocs: "Correspondences in Review",
    recentActivity: "Recent System Activity Logs",
    telemetryTrends: "Real-time Telemetry Flow Chart",

    // Jawdati
    jawdatiTitle: "Laboratory Analysis & Water Quality Control",
    laboratories: "Laboratories & Facilities",
    registerLab: "Register Laboratory",
    samples: "Water Specimen Samples",
    registerSample: "Register Water Sample",
    sampleCode: "Sample Code",
    collectedBy: "Collected By",
    collectedAt: "Collected At",
    sourceSite: "Source Site (Reservoir/Dam)",
    sourceStation: "Source Station",
    statusCollected: "Collected",
    statusAnalyzing: "Analyzing",
    statusCompleted: "Conforming",
    statusFailed: "Out of Spec",
    analyses: "Test Runs & Parameters",
    requestAnalysis: "Request Test Analysis",
    testMethod: "Test Method / Standard",
    parameter: "Parameter",
    value: "Measured Value",
    unit: "Unit",
    isConforming: "Satisfies Standards",
    submitResult: "Submit Chemical Results",

    // Mahattati
    mahattatiTitle: "Water Pumping & Treatment Operations",
    sites: "Water Resources & Sites",
    registerSite: "Register Water Site",
    stations: "Processing & Pumping Stations",
    registerStation: "Register Station",
    capacity: "Daily Capacity (m³/day)",
    equipment: "Industrial Equipment & Assets",
    registerEquipment: "Register Equipment",
    serialNumber: "Serial Number",
    eqType: "Equipment Type",
    statusOperational: "Operational",
    statusUnderMaintenance: "Under Maintenance",
    statusFaulty: "Faulty",
    statusDecommissioned: "Decommissioned",
    measurements: "Telemetry & Operator Log Relevés",
    logMeasurement: "Log Measurement",
    loggedBy: "Logged By",
    loggedAt: "Logged At",

    // Archivi
    archiviTitle: "Digital Archiving & Formal Correspondence",
    folders: "Folders Hierarchy Explorer",
    registerFolder: "Create Folder",
    documents: "Archived Documents & Files",
    registerDocument: "Archive Document",
    title: "Document Title",
    description: "Description",
    version: "Version",
    fileSize: "File Size",
    download: "Download",
    uploadVersion: "Upload New Version",
    correspondences: "Letters Register Logs",
    registerCorrespondence: "Log Letter Correspondence",
    corType: "Type",
    incoming: "Incoming",
    outgoing: "Outgoing",
    refNumber: "Reference Number / Ref",
    sender: "Sender",
    recipient: "Recipient",
    subject: "Subject",
    approve: "Approve",
    reject: "Reject",
    draft: "Draft",
    pendingReview: "Pending Review"
  }
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("nudum_lang") as Language) || "ar";
  });

  const [direction, setDirection] = useState<Direction>(() => {
    return language === "ar" ? "rtl" : "ltr";
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem("nudum_theme") as Theme) || "light";
  });

  const [user, setUser] = useState<any>(() => {
    return api.getCurrentUser();
  });

  const [activeTenant, setActiveTenant] = useState<string>("مؤسسة الجزائرية للمياه ADE");

  useEffect(() => {
    // Dynamic document properties binding
    document.documentElement.lang = language;
    document.documentElement.dir = direction;

    // Apply styling tokens classes
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [language, direction, theme]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem("nudum_lang", lang);
    setLanguageState(lang);
    setDirection(lang === "ar" ? "rtl" : "ltr");
  };

  const setTheme = (t: Theme) => {
    localStorage.setItem("nudum_theme", t);
    setThemeState(t);
  };

  const login = async (orgId: string) => {
    const res = await api.login(orgId);
    setUser(res.user);
    if (orgId.includes("oran")) {
      setActiveTenant("مؤسسة المياه الجزائرية - وهران (ADE Oran)");
    } else if (orgId.includes("algiers")) {
      setActiveTenant("مؤسسة سيال الجزائر العاصمة (SEAAL Algiers)");
    } else {
      setActiveTenant("مؤسسة الجزائرية للمياه (ADE General)");
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        direction,
        theme,
        user,
        activeTenant,
        setLanguage,
        setTheme,
        login,
        logout,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppContextProvider");
  }
  return context;
};
