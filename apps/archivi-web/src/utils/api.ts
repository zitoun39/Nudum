// API Connection Client with LocalStorage Mock Fallback
// Aligned with the Nudum backend routes and entities definitions

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5003/api";

// Mock Database Seed Data
const DEFAULT_LABORATORIES = [
  {
    id: "lab-1",
    name: "مخبر التحليل المركزي - وهران (Central QC Lab)",
    location: "وهران، الجزائر (Oran)"
  },
  {
    id: "lab-2",
    name: "مخبر معالجة المياه - سد بني هارون (Microbiological Lab)",
    location: "ميلة، الجزائر (Mila)"
  }
];

const DEFAULT_SAMPLES = [
  {
    id: "smp-1",
    sampleCode: "SMP-2026-001",
    laboratoryId: "lab-1",
    collectedAt: "2026-07-01T09:30:00Z",
    collectedBy: "أحمد بن ناصر (Ahmed B.)",
    sourceSiteId: "site-1",
    sourceStationId: "st-1",
    status: "completed",
    createdAt: "2026-07-01T09:30:00Z",
    updatedAt: "2026-07-01T14:00:00Z"
  },
  {
    id: "smp-2",
    sampleCode: "SMP-2026-002",
    laboratoryId: "lab-1",
    collectedAt: "2026-07-03T07:15:00Z",
    collectedBy: "فاطمة قدور (Fatima K.)",
    sourceSiteId: "site-1",
    sourceStationId: "st-2",
    status: "collected",
    createdAt: "2026-07-03T07:15:00Z",
    updatedAt: "2026-07-03T07:15:00Z"
  }
];

const DEFAULT_ANALYSES = [
  {
    id: "an-1",
    sampleId: "smp-1",
    testMethod: "ISO 10523 pH Test",
    status: "completed",
    analystId: "usr-2",
    startedAt: "2026-07-01T10:00:00Z",
    completedAt: "2026-07-01T14:00:00Z",
    createdAt: "2026-07-01T10:00:00Z"
  },
  {
    id: "an-2",
    sampleId: "smp-2",
    testMethod: "Turbidity NTU Test",
    status: "pending",
    analystId: "usr-2",
    startedAt: null,
    completedAt: null,
    createdAt: "2026-07-03T07:30:00Z"
  }
];

const DEFAULT_RESULTS = [
  {
    id: "res-1",
    analysisId: "an-1",
    parameterName: "pH",
    value: 7.35,
    unit: "pH units",
    isConforming: true,
    createdAt: "2026-07-01T14:00:00Z"
  }
];

const DEFAULT_SITES = [
  { id: "site-1", name: "سد بني هارون (Béni Haroun Reservoir)", location: "ميلة، الجزائر" },
  { id: "site-2", name: "سد قدّارة (Keddara Dam)", location: "بومرداس، الجزائر" }
];

const DEFAULT_STATIONS = [
  {
    id: "st-1",
    name: "محطة الضخ الرئيسية A (Pumping Station A)",
    siteId: "site-1",
    capacity_m3_day: 150000,
    status: "active"
  },
  {
    id: "st-2",
    name: "محطة التصفية والتطهير B (Filtration Plant B)",
    siteId: "site-1",
    capacity_m3_day: 200000,
    status: "active"
  },
  {
    id: "st-3",
    name: "محطة السحب الأولى (Intake Station 1)",
    siteId: "site-2",
    capacity_m3_day: 80000,
    status: "active"
  }
];

const DEFAULT_EQUIPMENT = [
  {
    id: "eq-1",
    name: "مضخة الطرد المركزي العملاقة A1 (Centrifugal Pump A1)",
    serialNumber: "SN-PUMP-9042",
    stationId: "st-1",
    type: "pump",
    installedAt: "2024-05-12",
    status: "operational"
  },
  {
    id: "eq-2",
    name: "جهاز الكلورة بالغاز C3 (Gas Chlorinator C3)",
    serialNumber: "SN-CHLOR-2831",
    stationId: "st-2",
    type: "chlorinator",
    installedAt: "2025-01-20",
    status: "operational"
  },
  {
    id: "eq-3",
    name: "مرشح الرمل السريع F5 (Rapid Sand Filter F5)",
    serialNumber: "SN-FILTER-1122",
    stationId: "st-2",
    type: "filter",
    installedAt: "2023-11-05",
    status: "under_maintenance"
  }
];

const DEFAULT_MEASUREMENTS = [
  {
    id: "ms-1",
    stationId: "st-1",
    equipmentId: "eq-1",
    parameterName: "تدفق المياه (Flow Rate)",
    value: 12450.5,
    unit: "m³/h",
    loggedBy: "أحمد بن ناصر",
    loggedAt: "2026-07-03T18:00:00Z"
  },
  {
    id: "ms-2",
    stationId: "st-2",
    equipmentId: "eq-2",
    parameterName: "الكلور المتبقي (Residual Chlorine)",
    value: 1.25,
    unit: "mg/L",
    loggedBy: "فاطمة قدور",
    loggedAt: "2026-07-03T19:30:00Z"
  }
];

const DEFAULT_FOLDERS = [
  { id: "fld-1", name: "إجراءات التشغيل القياسية (SOPs)", parentId: null },
  { id: "fld-2", name: "معايير جودة المياه ولوائح الوزارة (Standards)", parentId: null },
  { id: "fld-3", name: "التقارير التحليلية الشهرية (Analytical Reports)", parentId: "fld-1" }
];

const DEFAULT_DOCUMENTS = [
  {
    id: "doc-1",
    title: "دليل معايرة أجهزة قياس الحموضة pH",
    description:
      "الدليل القياسي لمعايرة أجهزة الـ pH داخل مختبرات ADE قبل انطلاق التحاليل اليومية.",
    folderId: "fld-1",
    currentVersionId: "ver-1"
  },
  {
    id: "doc-2",
    title: "المرسوم التنفيذي لمعايير مياه الشرب بالجزائر",
    description:
      "المرسوم الرسمي المحدد لمعايير الجودة الفيزيوكيميائية والميكروبيولوجية للمياه الموجهة للاستهلاك البشري.",
    folderId: "fld-2",
    currentVersionId: "ver-2"
  }
];

const DEFAULT_VERSIONS = [
  {
    id: "ver-1",
    documentId: "doc-1",
    versionNumber: 1,
    fileKey: "sops/ph_calibration_v1.pdf",
    fileSize: 1048576,
    mimeType: "application/pdf",
    uploadedBy: "usr-1",
    createdAt: "2026-07-01T09:30:00Z"
  },
  {
    id: "ver-2",
    documentId: "doc-2",
    versionNumber: 1,
    fileKey: "standards/饮用水标准.pdf",
    fileSize: 3145728,
    mimeType: "application/pdf",
    uploadedBy: "usr-1",
    createdAt: "2026-07-02T11:00:00Z"
  }
];

const DEFAULT_CORRESPONDENCES = [
  {
    id: "cor-1",
    type: "incoming",
    referenceNumber: "MWR-2026-904",
    sender: "وزارة الموارد المائية والأمن المائي",
    recipient: "المدير العام للمؤسسة الجزائرية للمياه (ADE)",
    subject: "تعليمات تطبيق معايير المعالجة الكيميائية الجديدة في محطات التصفية",
    status: "approved",
    documentId: "doc-2",
    receivedSentAt: "2026-07-02T08:00:00Z",
    createdAt: "2026-07-02T08:00:00Z"
  },
  {
    id: "cor-2",
    type: "outgoing",
    referenceNumber: "ADE-ORAN-2026-12",
    sender: "مديرية ADE وهران",
    recipient: "المخبر الولائي للتحليل وهران",
    subject: "طلب إرسال كشوف التحاليل الميكروبيولوجية لبلدية قديل",
    status: "pending_review",
    documentId: null,
    receivedSentAt: "2026-07-03T10:00:00Z",
    createdAt: "2026-07-03T10:00:00Z"
  }
];

const DEFAULT_TAGS = [
  { id: "tag-1", name: "معايرة (Calibration)" },
  { id: "tag-2", name: "شرب (Drinking Water)" },
  { id: "tag-3", name: "توجيهات (Directives)" }
];

// Helper to access LocalStorage database
class MockDB {
  private get(key: string, defaults: any): any[] {
    const data = localStorage.getItem(`nudum_${key}`);
    if (!data) {
      localStorage.setItem(`nudum_${key}`, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  }

  private set(key: string, data: any[]) {
    localStorage.setItem(`nudum_${key}`, JSON.stringify(data));
  }

  get laboratories() {
    return this.get("laboratories", DEFAULT_LABORATORIES);
  }
  set laboratories(val) {
    this.set("laboratories", val);
  }

  get samples() {
    return this.get("samples", DEFAULT_SAMPLES);
  }
  set samples(val) {
    this.set("samples", val);
  }

  get analyses() {
    return this.get("analyses", DEFAULT_ANALYSES);
  }
  set analyses(val) {
    this.set("analyses", val);
  }

  get results() {
    return this.get("results", DEFAULT_RESULTS);
  }
  set results(val) {
    this.set("results", val);
  }

  get sites() {
    return this.get("sites", DEFAULT_SITES);
  }
  set sites(val) {
    this.set("sites", val);
  }

  get stations() {
    return this.get("stations", DEFAULT_STATIONS);
  }
  set stations(val) {
    this.set("stations", val);
  }

  get equipment() {
    return this.get("equipment", DEFAULT_EQUIPMENT);
  }
  set equipment(val) {
    this.set("equipment", val);
  }

  get measurements() {
    return this.get("measurements", DEFAULT_MEASUREMENTS);
  }
  set measurements(val) {
    this.set("measurements", val);
  }

  get folders() {
    return this.get("folders", DEFAULT_FOLDERS);
  }
  set folders(val) {
    this.set("folders", val);
  }

  get documents() {
    return this.get("documents", DEFAULT_DOCUMENTS);
  }
  set documents(val) {
    this.set("documents", val);
  }

  get versions() {
    return this.get("versions", DEFAULT_VERSIONS);
  }
  set versions(val) {
    this.set("versions", val);
  }

  get correspondences() {
    return this.get("correspondences", DEFAULT_CORRESPONDENCES);
  }
  set correspondences(val) {
    this.set("correspondences", val);
  }

  get tags() {
    return this.get("tags", DEFAULT_TAGS);
  }
  set tags(val) {
    this.set("tags", val);
  }
}

export const db = new MockDB();

// Dynamic API fetching helper which handles mock fallback seamlessly
async function request(url: string, method: string = "GET", body?: any) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers,
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new Error(`Unauthorized or Forbidden: ${res.status}`);
      }
      throw new Error(`HTTP error ${res.status}`);
    }
    if (res.status === 204) return null;
    return await res.json();
  } catch (err) {
    console.warn(
      `NestJS API backend is unreachable. Falling back to client-side database. Request details: ${method} ${url}`,
      err
    );
    throw err;
  }
}

// REST CLIENT API
export const api = {
  // Authentication & Session
  async login(email: string, pass: string, organizationId: string): Promise<{ user: any }> {
    try {
      const res = await request("/auth/login", "POST", { email, password: pass });
      localStorage.setItem("nudum_user", JSON.stringify(res.user));
      return res;
    } catch (err) {
      // Dev simulation fallback if backend is offline
      console.warn("Falling back to local auth simulation");
      const user = {
        id: "usr-admin",
        email,
        name: "المهندس المشرف (Operator Chef)",
        isPlatformAdmin: true,
        organizationId
      };
      localStorage.setItem("nudum_user", JSON.stringify(user));
      return { user };
    }
  },

  async logout() {
    try {
      await request("/auth/logout", "POST");
    } catch (err) {
      console.warn("Logout request failed, clearing local session", err);
    }
    localStorage.removeItem("nudum_user");
  },

  getCurrentUser() {
    const data = localStorage.getItem("nudum_user");
    return data ? JSON.parse(data) : null;
  },

  async getMe(): Promise<any> {
    try {
      return await request("/auth/me");
    } catch {
      const user = this.getCurrentUser();
      return {
        organization: {
          id: user?.organizationId || "org-ade",
          name: "الجزائرية للمياه (ADE)",
          plan: "Professional",
          status: "نشط",
          renewal: "2027-07-01",
          joinedAt: "2026-07-01",
          monthlyFee: 25000
        }
      };
    }
  },

  async getSubscriptions(): Promise<any[]> {
    try {
      return await request("/platform/subscriptions/me");
    } catch {
      // Local fallback: Org has active subscriptions to all modules
      return [
        {
          moduleKey: "mahattati",
          status: "active",
          expiresAt: new Date(Date.now() + 10000000).toISOString()
        },
        {
          moduleKey: "jawdati",
          status: "active",
          expiresAt: new Date(Date.now() + 10000000).toISOString()
        },
        {
          moduleKey: "archivi",
          status: "active",
          expiresAt: new Date(Date.now() + 10000000).toISOString()
        }
      ];
    }
  },

  async getSupportTickets(): Promise<any[]> {
    try {
      return await request("/platform/support");
    } catch {
      const list = localStorage.getItem("nudum_support_tickets");
      return list ? JSON.parse(list) : [];
    }
  },

  async createSupportTicket(dto: {
    subject: string;
    description: string;
    moduleKey?: string;
  }): Promise<any> {
    try {
      return await request("/platform/support", "POST", dto);
    } catch {
      const list = localStorage.getItem("nudum_support_tickets")
        ? JSON.parse(localStorage.getItem("nudum_support_tickets")!)
        : [];
      const ticket = {
        id: `tkt-${Date.now()}`,
        orgId: "ade_oran",
        userId: "usr-admin",
        ...dto,
        status: "open",
        priority: "medium",
        createdAt: new Date().toISOString()
      };
      list.push(ticket);
      localStorage.setItem("nudum_support_tickets", JSON.stringify(list));
      return ticket;
    }
  },

  // 🧪 Jawdati (LIMS)
  async getLaboratories(): Promise<any[]> {
    try {
      return await request("/laboratories");
    } catch {
      return db.laboratories;
    }
  },

  async createLaboratory(dto: { name: string; location?: string }): Promise<any> {
    try {
      return await request("/laboratories", "POST", dto);
    } catch {
      const list = db.laboratories;
      const lab = { id: `lab-${Date.now()}`, ...dto };
      list.push(lab);
      db.laboratories = list;
      return lab;
    }
  },

  async getSamples(laboratoryId?: string, status?: string): Promise<any[]> {
    try {
      let query = "";
      if (laboratoryId) query += `?laboratoryId=${laboratoryId}`;
      if (status) query += `${query ? "&" : "?"}status=${status}`;
      return await request(`/samples${query}`);
    } catch {
      let list = db.samples;
      if (laboratoryId) list = list.filter((x) => x.laboratoryId === laboratoryId);
      if (status) list = list.filter((x) => x.status === status);
      // Map relations
      const labs = db.laboratories;
      return list.map((s) => ({
        ...s,
        laboratory: labs.find((l) => l.id === s.laboratoryId)
      }));
    }
  },

  async createSample(dto: {
    sampleCode: string;
    laboratoryId: string;
    collectedAt: string;
    collectedBy: string;
    sourceSiteId?: string;
    sourceStationId?: string;
  }): Promise<any> {
    try {
      return await request("/samples", "POST", dto);
    } catch {
      const list = db.samples;
      const sample = {
        id: `smp-${Date.now()}`,
        ...dto,
        status: "collected",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      list.push(sample);
      db.samples = list;
      return sample;
    }
  },

  async getSample(id: string): Promise<any> {
    try {
      return await request(`/samples/${id}`);
    } catch {
      const list = db.samples;
      const s = list.find((x) => x.id === id);
      if (!s) throw new Error("Sample not found");
      const labs = db.laboratories;
      const analyses = db.analyses.filter((a) => a.sampleId === id);
      const results = db.results;
      return {
        ...s,
        laboratory: labs.find((l) => l.id === s.laboratoryId),
        analyses: analyses.map((a) => ({
          ...a,
          results: results.filter((r) => r.analysisId === a.id)
        }))
      };
    }
  },

  async updateSampleStatus(id: string, status: string): Promise<any> {
    try {
      return await request(`/samples/${id}/status`, "PUT", { status });
    } catch {
      const list = db.samples;
      const s = list.find((x) => x.id === id);
      if (!s) throw new Error("Sample not found");
      s.status = status;
      s.updatedAt = new Date().toISOString();
      db.samples = list;
      return s;
    }
  },

  // Analyses & Results
  async getAnalyses(sampleId?: string): Promise<any[]> {
    try {
      const q = sampleId ? `?sampleId=${sampleId}` : "";
      return await request(`/analyses${q}`);
    } catch {
      let list = db.analyses;
      if (sampleId) list = list.filter((x) => x.sampleId === sampleId);
      const results = db.results;
      return list.map((a) => ({
        ...a,
        results: results.filter((r) => r.analysisId === a.id)
      }));
    }
  },

  async createAnalysis(dto: {
    sampleId: string;
    testMethod: string;
    analystId: string;
  }): Promise<any> {
    try {
      return await request("/analyses", "POST", dto);
    } catch {
      const list = db.analyses;
      const item = {
        id: `an-${Date.now()}`,
        ...dto,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      list.push(item);
      db.analyses = list;

      // Update sample status to 'analyzing'
      await this.updateSampleStatus(dto.sampleId, "analyzing");

      return item;
    }
  },

  async createResult(dto: {
    analysisId: string;
    parameterName: string;
    value: number;
    unit: string;
    isConforming: boolean;
  }): Promise<any> {
    try {
      return await request("/results", "POST", dto);
    } catch {
      const list = db.results;
      const res = {
        id: `res-${Date.now()}`,
        ...dto,
        createdAt: new Date().toISOString()
      };
      list.push(res);
      db.results = list;

      // Automatically complete the parent analysis
      const analyses = db.analyses;
      const a = analyses.find((x) => x.id === dto.analysisId);
      if (a) {
        a.status = "completed";
        a.completedAt = new Date().toISOString();
        db.analyses = analyses;

        // Automatically complete the sample lifecycle if all analyses are complete
        const siblingAnalyses = db.analyses.filter((x) => x.sampleId === a.sampleId);
        const allCompleted = siblingAnalyses.every((x) => x.status === "completed");
        if (allCompleted) {
          await this.updateSampleStatus(a.sampleId, "completed");
        }
      }

      return res;
    }
  },

  // 🚰 Mahattati (Plant Operations)
  async getSites(): Promise<any[]> {
    try {
      return await request("/sites");
    } catch {
      return db.sites;
    }
  },

  async createSite(dto: { name: string; location?: string }): Promise<any> {
    try {
      return await request("/sites", "POST", dto);
    } catch {
      const list = db.sites;
      const s = { id: `site-${Date.now()}`, ...dto };
      list.push(s);
      db.sites = list;
      return s;
    }
  },

  async getSite(id: string): Promise<any> {
    try {
      return await request(`/sites/${id}`);
    } catch {
      const list = db.sites;
      const s = list.find((x) => x.id === id);
      if (!s) throw new Error("Site not found");
      const stations = db.stations.filter((x) => x.siteId === id);
      return {
        ...s,
        stations
      };
    }
  },

  async getStations(): Promise<any[]> {
    try {
      return await request("/stations"); // Standard routing
    } catch {
      return db.stations;
    }
  },

  async createStation(dto: {
    name: string;
    siteId: string;
    capacity_m3_day?: number;
  }): Promise<any> {
    try {
      return await request(`/sites/${dto.siteId}/stations`, "POST", dto);
    } catch {
      const list = db.stations;
      const st = { id: `st-${Date.now()}`, ...dto, status: "active" };
      list.push(st);
      db.stations = list;
      return st;
    }
  },

  async getEquipment(stationId?: string): Promise<any[]> {
    try {
      const q = stationId ? `?stationId=${stationId}` : "";
      return await request(`/equipment${q}`);
    } catch {
      let list = db.equipment;
      if (stationId) list = list.filter((x) => x.stationId === stationId);
      return list;
    }
  },

  async createEquipment(dto: {
    name: string;
    serialNumber?: string;
    stationId: string;
    type: string;
  }): Promise<any> {
    try {
      return await request("/equipment", "POST", dto);
    } catch {
      const list = db.equipment;
      const eq = {
        id: `eq-${Date.now()}`,
        ...dto,
        installedAt: new Date().toISOString().split("T")[0],
        status: "operational"
      };
      list.push(eq);
      db.equipment = list;
      return eq;
    }
  },

  async updateEquipmentStatus(id: string, status: string): Promise<any> {
    try {
      return await request(`/equipment/${id}`, "PUT", { status });
    } catch {
      const list = db.equipment;
      const eq = list.find((x) => x.id === id);
      if (!eq) throw new Error("Equipment not found");
      eq.status = status;
      db.equipment = list;
      return eq;
    }
  },

  async getMeasurements(): Promise<any[]> {
    try {
      return await request("/measurements");
    } catch {
      return db.measurements;
    }
  },

  async createMeasurement(dto: {
    stationId: string;
    equipmentId?: string;
    parameterName: string;
    value: number;
    unit: string;
    loggedBy: string;
  }): Promise<any> {
    try {
      return await request("/measurements", "POST", dto);
    } catch {
      const list = db.measurements;
      const item = {
        id: `ms-${Date.now()}`,
        ...dto,
        loggedAt: new Date().toISOString()
      };
      list.push(item);
      db.measurements = list;
      return item;
    }
  },

  // 📁 Archivi (Document Management)
  async getFolders(): Promise<any[]> {
    try {
      return await request("/folders");
    } catch {
      return db.folders;
    }
  },

  async createFolder(dto: { name: string; parentId: string | null }): Promise<any> {
    try {
      return await request("/folders", "POST", dto);
    } catch {
      const list = db.folders;
      const f = { id: `fld-${Date.now()}`, ...dto };
      list.push(f);
      db.folders = list;
      return f;
    }
  },

  async getDocuments(folderId?: string): Promise<any[]> {
    try {
      const q = folderId ? `?folderId=${folderId}` : "";
      return await request(`/documents${q}`);
    } catch {
      let list = db.documents;
      if (folderId) list = list.filter((x) => x.folderId === folderId);
      const versions = db.versions;
      return list.map((d) => ({
        ...d,
        versions: versions.filter((x) => x.documentId === d.id)
      }));
    }
  },

  async createDocument(dto: {
    title: string;
    description?: string;
    folderId?: string;
  }): Promise<any> {
    try {
      return await request("/documents", "POST", dto);
    } catch {
      const list = db.documents;
      const doc = {
        id: `doc-${Date.now()}`,
        ...dto,
        currentVersionId: null
      };
      list.push(doc);
      db.documents = list;
      return doc;
    }
  },

  async uploadDocumentVersion(dto: {
    documentId: string;
    fileKey: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: string;
  }): Promise<any> {
    try {
      return await request(`/documents/${dto.documentId}/versions`, "POST", dto);
    } catch {
      const list = db.versions;
      const verId = `ver-${Date.now()}`;
      const versionNumber = list.filter((x) => x.documentId === dto.documentId).length + 1;
      const ver = {
        id: verId,
        ...dto,
        versionNumber,
        createdAt: new Date().toISOString()
      };
      list.push(ver);
      db.versions = list;

      // Update current version in document
      const docs = db.documents;
      const d = docs.find((x) => x.id === dto.documentId);
      if (d) {
        d.currentVersionId = verId;
        db.documents = docs;
      }
      return ver;
    }
  },

  async getDownloadUrl(documentId: string, versionId: string): Promise<string> {
    try {
      return (await request(`/documents/${documentId}/versions/${versionId}/download`)).downloadUrl;
    } catch {
      const list = db.versions;
      const v = list.find((x) => x.id === versionId);
      return v ? `https://minio-s3.nudum.dz/tenant-bucket/${v.fileKey}?X-Amz-Signature=mock` : "";
    }
  },

  async getCorrespondences(): Promise<any[]> {
    try {
      return await request("/correspondences");
    } catch {
      const list = db.correspondences;
      const docs = db.documents;
      return list.map((c) => ({
        ...c,
        document: c.documentId ? docs.find((d) => d.id === c.documentId) : null
      }));
    }
  },

  async createCorrespondence(dto: {
    type: "incoming" | "outgoing";
    referenceNumber: string;
    sender: string;
    recipient: string;
    subject: string;
    documentId?: string;
  }): Promise<any> {
    try {
      return await request("/correspondences", "POST", dto);
    } catch {
      const list = db.correspondences;
      const cor = {
        id: `cor-${Date.now()}`,
        ...dto,
        status: "draft",
        receivedSentAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      list.push(cor);
      db.correspondences = list;
      return cor;
    }
  },

  async updateCorrespondenceStatus(id: string, status: string): Promise<any> {
    try {
      return await request(`/correspondences/${id}/status`, "PUT", { status });
    } catch {
      const list = db.correspondences;
      const c = list.find((x) => x.id === id);
      if (!c) throw new Error("Correspondence not found");
      c.status = status;
      db.correspondences = list;
      return c;
    }
  },

  // Administrative - Members & Invoices & Subscriptions
  async getMembers(): Promise<any[]> {
    return request("/platform/subscriptions/members");
  },
  async updateMember(id: string, data: any): Promise<any> {
    return request(`/platform/subscriptions/members/${id}`, "PUT", data);
  },
  async deleteMember(id: string): Promise<any> {
    return request(`/platform/subscriptions/members/${id}`, "DELETE");
  },
  async getInvoices(): Promise<any[]> {
    return request("/platform/subscriptions/invoices");
  },
  async createInvoice(dto: any): Promise<any> {
    return request("/platform/subscriptions/invoices", "POST", dto);
  },
  async updateInvoiceStatus(
    id: string,
    status: string,
    paidAt?: string,
    receiptFileId?: string
  ): Promise<any> {
    return request(`/platform/subscriptions/invoices/${id}`, "PUT", {
      status,
      paidAt,
      receiptFileId
    });
  },
  async getSubscriptionRequests(): Promise<any[]> {
    return request("/platform/subscriptions/requests");
  },
  async createSubscriptionRequest(dto: any): Promise<any> {
    return request("/platform/subscriptions/requests", "POST", dto);
  },
  async approveSubscriptionRequest(id: string): Promise<any> {
    return request(`/platform/subscriptions/requests/${id}/approve`, "PUT");
  },
  async rejectSubscriptionRequest(id: string, reason?: string): Promise<any> {
    return request(`/platform/subscriptions/requests/${id}/reject`, "PUT", { reason });
  },
  async getUsers(): Promise<any[]> {
    return request("/platform/subscriptions/users");
  },
  async addUser(dto: any): Promise<any> {
    return request("/platform/subscriptions/users", "POST", dto);
  },
  async deleteUser(id: string): Promise<any> {
    return request(`/platform/subscriptions/users/${id}`, "DELETE");
  },

  // Support, Questions, Alerts, Stats, Audit Logs
  async getAlerts(): Promise<any[]> {
    return request("/platform/support/alerts");
  },
  async markAlertRead(id: string): Promise<any> {
    return request(`/platform/support/alerts/${id}/read`, "PUT");
  },
  async markAllAlertsRead(): Promise<any> {
    return request("/platform/support/alerts/read-all", "PUT");
  },
  async getQuestions(): Promise<any[]> {
    return request("/platform/support/questions");
  },
  async createQuestion(dto: any): Promise<any> {
    return request("/platform/support/questions", "POST", dto);
  },
  async replyToQuestion(id: string, reply: string): Promise<any> {
    return request(`/platform/support/questions/${id}/reply`, "PUT", { reply });
  },
  async markQuestionRead(id: string): Promise<any> {
    return request(`/platform/support/questions/${id}/read`, "PUT");
  },
  async getSalesStats(): Promise<any> {
    return request("/platform/support/stats");
  },
  async getAuditLogs(): Promise<any[]> {
    return request("/platform/support/audit-logs");
  },
  async clearAuditLogs(): Promise<any> {
    return request("/platform/support/audit-logs", "DELETE");
  }
};

export const getModuleUrl = (key: string): string => {
  const { protocol, host } = window.location;
  if (host.includes("localhost")) {
    const portMap: Record<string, string> = {
      mahattati: "5174",
      jawdati: "5175",
      archivi: "5176"
    };
    return `${protocol}//localhost:${portMap[key] || "5173"}`;
  }
  const baseDomain = host.split(".").slice(-2).join(".");
  return `${protocol}//${key}.${baseDomain}`;
};
