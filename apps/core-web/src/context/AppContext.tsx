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
  subscriptions: any[];
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  login: (email: string, pass: string, orgId: string) => Promise<void>;
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
    emailOrUsername: "البريد الإلكتروني أو اسم المستخدم",
    authError: "خطأ في التحقق من الهوية: يرجى التحقق من البريد الإلكتروني أو كلمة المرور",
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
    pendingReview: "قيد المراجعة الإدارية",
    corePortal: "البوابة المركزية لنظم (Nudum Core Portal)",
    welcomeSaaS: "مرحباً بك في لوحة منصة نُظُم للمؤسسات",
    portalDesc:
      "تحكّم في تفعيل خدمات تشغيل شبكات المياه، مراقبة التحاليل المخبرية والاعتمادات، وتوثيق القرارات الرسمية للمؤسسة.",
    availableServices: "وحدات العمل والخدمات الرقمية المتوفرة",
    activeLabel: "نشط (Active)",
    notSubscribed: "غير مشترك",
    enterModule: "الدخول للوحدة",
    serviceNotActive: "الخدمة غير مفعّلة",
    supportTickets: "طلبات الدعم الفني والصيانة للمؤسسة (Tickets)",
    newTicket: "إنشاء تذكرة جديدة",
    noTickets: "لا توجد طلبات دعم نشطة حالياً لهذه المؤسسة.",
    ticketStatusOpen: "مفتوح",
    ticketStatusProgress: "قيد المعالجة",
    ticketStatusClosed: "مكتمل",
    securitySaaS: "أمان المستأجر ونطاق الترخيص",
    securityDesc1:
      "كل العمليات في هذا النطاق محمية بالكامل بتكنولوجيا عزل الجداول Schema-per-tenant لحماية سرية البيانات الإقليمية للمؤسسة.",
    securityDesc2: "صلاحياتك الحالية:",
    securityDesc3:
      "تواصل مع إدارة نُظُم المركزية عبر تذاكر الدعم المجاورة لجدولة تفعيل وحدات إضافية أو ترقية اشتراك السحابي للمؤسسة.",
    rolePlatformAdmin: "مدير عام المنصة (Platform Admin)",
    roleOrgAdmin: "مشرف المؤسسة (ADE Admin)",
    createSupportTicket: "إنشاء تذكرة دعم فني جديدة",
    subjectLabel: "الموضوع / عنوان البلاغ",
    subjectPlaceholder: "مثال: عطل في سحب بيانات الكلور من المحطة",
    descriptionLabel: "الوصف التفصيلي",
    descriptionPlaceholder:
      "الرجاء تقديم تفاصيل كافية حول العطل أو المساعدة المطلوبة لتسهيل الاستجابة...",
    relatedModule: "الوحدة ذات الصلة",
    generalSupport: "لا يوجد وحدة معينة (دعم عام)",
    sendTicket: "إرسال التذكرة",
    mahattatiDesc: "عمليات وتشغيل محطات الضخ ومعالجة المياه الإقليمية والمراقبة عن بعد",
    jawdatiDesc: "مخبر التحاليل الكيميائية وضبط المعايير والمطابقة البيئية والصحية للمياه",
    archiviDesc: "الأرشيف الرقمي للمستندات والقرارات وسجل المراسلات الرسمية والوارد/الصادر",
    saasAccess: "وصول SaaS",
    subscriberPortal: "بوابة المشترك",
    selectServiceDesc:
      "اختر الخدمة التي تريد الدخول إليها. الخدمات المفعلة فقط هي التي يمكنك الوصول إليها.",
    openAccess: "فتح الوصول",
    closed: "مغلق"
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
    emailOrUsername: "E-mail ou nom d'utilisateur",
    authError: "Erreur d'authentification: veuillez vérifier votre e-mail ou mot de passe",
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
    pendingReview: "En Révision",
    corePortal: "Portail Central Nudum Core",
    welcomeSaaS: "Bienvenue sur le tableau de bord de la plateforme Nudum",
    portalDesc:
      "Gérez l'activation des services d'exploitation du réseau d'eau, le suivi des analyses de laboratoire et des accréditations, et l'archivage des documents officiels.",
    availableServices: "Modules et services numériques disponibles",
    activeLabel: "Actif",
    notSubscribed: "Non abonné",
    enterModule: "Accéder au module",
    serviceNotActive: "Service non activé",
    supportTickets: "Tickets de support technique & maintenance de l'entreprise",
    newTicket: "Nouveau ticket",
    noTickets: "Aucun ticket de support actif pour cette organisation.",
    ticketStatusOpen: "Ouvert",
    ticketStatusProgress: "En cours",
    ticketStatusClosed: "Résolu",
    securitySaaS: "Sécurité des locataires & portée de licence",
    securityDesc1:
      "Toutes les opérations dans ce périmètre sont protégées par une isolation Schema-per-tenant pour préserver la confidentialité des données.",
    securityDesc2: "Vos privilèges actuels :",
    securityDesc3:
      "Contactez l'administration centrale via un ticket de support pour activer des modules ou mettre à niveau votre abonnement.",
    rolePlatformAdmin: "Administrateur de la plateforme",
    roleOrgAdmin: "Administrateur de l'organisation (ADE)",
    createSupportTicket: "Créer un nouveau ticket de support",
    subjectLabel: "Sujet / Titre de la demande",
    subjectPlaceholder: "Ex: Panne de transmission de données de chlore",
    descriptionLabel: "Description détaillée",
    descriptionPlaceholder: "Veuillez fournir suffisamment de détails pour faciliter la réponse...",
    relatedModule: "Module associé",
    generalSupport: "Aucun module spécifique (Support général)",
    sendTicket: "Envoyer le ticket",
    mahattatiDesc: "Opérations de pompage, traitement de l'eau et surveillance à distance",
    jawdatiDesc: "Laboratoire d'analyses chimiques, contrôle de conformité et qualité de l'eau",
    archiviDesc: "Archivage numérique, documents officiels et gestion du courrier",
    saasAccess: "Accès SaaS",
    subscriberPortal: "Portail Abonné",
    selectServiceDesc:
      "Choisissez le service auquel vous souhaitez accéder. Seuls les services activés sont accessibles.",
    openAccess: "Accéder",
    closed: "Fermé"
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
    emailOrUsername: "Email or Username",
    authError: "Authentication error: please check your email or password",
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
    pendingReview: "Pending Review",
    corePortal: "Nudum Core Central Portal",
    welcomeSaaS: "Welcome to Nudum Platform Dashboard",
    portalDesc:
      "Control the activation of water network operations, monitoring of lab analyses and accreditations, and digital archiving of official documents.",
    availableServices: "Available Modules & Digital Services",
    activeLabel: "Active",
    notSubscribed: "Not Subscribed",
    enterModule: "Enter Module",
    serviceNotActive: "Service Inactive",
    supportTickets: "Technical Support & Maintenance Tickets",
    newTicket: "Create New Ticket",
    noTickets: "No active support tickets found for this organization.",
    ticketStatusOpen: "Open",
    ticketStatusProgress: "In Progress",
    ticketStatusClosed: "Resolved",
    securitySaaS: "Tenant Security & License Scope",
    securityDesc1:
      "All operations in this scope are fully isolated using Schema-per-tenant databases to protect organizational confidentiality.",
    securityDesc2: "Your current permissions:",
    securityDesc3:
      "Contact central Nudum administration via support tickets to request new module activations or cloud subscription upgrades.",
    rolePlatformAdmin: "Platform Administrator",
    roleOrgAdmin: "Organization Administrator (ADE Admin)",
    createSupportTicket: "Create New Support Ticket",
    subjectLabel: "Subject / Title",
    subjectPlaceholder: "e.g. Chlorine data sync failure at station",
    descriptionLabel: "Detailed Description",
    descriptionPlaceholder:
      "Please provide enough details about the issue or required assistance...",
    relatedModule: "Related Module",
    generalSupport: "No specific module (General Support)",
    sendTicket: "Send Ticket",
    mahattatiDesc:
      "Operations and maintenance of pumping stations, regional water treatment, and remote monitoring",
    jawdatiDesc:
      "Chemical analysis laboratory, control of environmental and health compliance of water",
    archiviDesc: "Digital archives for documents, decisions, and official correspondence logs",
    saasAccess: "SaaS Access",
    subscriberPortal: "Subscriber Portal",
    selectServiceDesc:
      "Select the service you wish to access. Only active services can be accessed.",
    openAccess: "Open Access",
    closed: "Closed"
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

  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  const [activeTenant, setActiveTenant] = useState<string>("مؤسسة الجزائرية للمياه ADE");

  const loadSubscriptions = async () => {
    try {
      const subs = await api.getSubscriptions();
      setSubscriptions(subs);
    } catch {
      setSubscriptions([]);
    }
  };

  useEffect(() => {
    if (user) {
      loadSubscriptions();
      if (user.organizationId) {
        if (user.organizationId.includes("oran")) {
          setActiveTenant("مؤسسة المياه الجزائرية - وهران (ADE Oran)");
        } else if (user.organizationId.includes("algiers")) {
          setActiveTenant("مؤسسة سيال الجزائر العاصمة (SEAAL Algiers)");
        } else {
          setActiveTenant("مؤسسة الجزائرية للمياه (ADE General)");
        }
      }
    } else {
      setSubscriptions([]);
    }
  }, [user]);

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

  const login = async (email: string, pass: string, orgId: string) => {
    const res = await api.login(email, pass, orgId);
    setUser(res.user);
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
        subscriptions,
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
