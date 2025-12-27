import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
});

// === AGENTS ===
export async function getAgents() {
  const res = await api.get("/agents");
  return res.data;
}
export async function addAgent(data: any) {
  const res = await api.post("/agents", data);
  return res.data;
}

// === MISSIONS ===
export async function getMissions() {
  const res = await api.get("/missions");
  return res.data;
}
export async function addMission(data: any) {
  const res = await api.post("/missions", data);
  return res.data;
}

// === AUTH ADMIN ===
export async function loginAdmin(email: string, password: string) {
  // ⚠️ Vérifie que ta route côté backend est bien /admin/login ou /login
  const res = await api.post("/admin/login", { email, password });
  // Ici normalement tu récupères un token et tu le stockes
  // ex: localStorage.setItem("token", res.data.token);
  return res.data;
}

export async function logoutAdmin() {
  await api.post(
    "/admin/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  localStorage.removeItem("token");
}

// === AGENTS NOUVEAU ===
export async function getAgentsNouveau() {
  const res = await api.get("/agents_nouveau"); // ✅ underscore ici
  return res.data;
}

export async function addAgentNouveau(data: any) {
  const res = await api.post("/agents_nouveau", data); // ✅ idem ici
  return res.data;
}

// === AFFECTATIONS ===
export async function getAffectations() {
  const token = localStorage.getItem("token");
  const res = await api.get("/affectations", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function createAffectation(data: any) {
  const token = localStorage.getItem("token");
  const res = await api.post("/affectations", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export default api;

// === PRESENCES ===
export async function getAgentPresences() {
  const token = localStorage.getItem("token");
  const res = await api.get("/agent/presences", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function pointerPresence(type: "arrivee" | "depart") {
  const token = localStorage.getItem("token");
  const res = await api.post(
    "/agent/presences",
    { type },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

// === IMPORT / EXPORT AGENTS_NOUVEAU ===
export async function exportAgentsNouveau() {
  const token = localStorage.getItem("token");
  const res = await api.get("/agents_nouveau/export", {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob", // important pour télécharger un fichier
  });
  return res.data;
}

export async function importAgentsNouveau(file: File) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/agents_nouveau/import", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}
function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getDirections() {
  const res = await api.get("/directions", { headers: authHeaders() });
  return res.data;
}
export async function createDirection(data: { libelle: string }) {
  const res = await api.post("/directions", data, { headers: authHeaders() });
  return res.data;
}
export async function updateDirection(id: number, data: { libelle: string }) {
  const res = await api.put(`/directions/${id}`, data, { headers: authHeaders() });
  return res.data;
}
export async function deleteDirection(id: number) {
  const res = await api.delete(`/directions/${id}`, { headers: authHeaders() });
  return res.data;
}

export async function getServicesList() {
  const res = await api.get("/services", { headers: authHeaders() });
  return res.data;
}
export async function createService(data: { libelle: string }) {
  const res = await api.post("/services", data, { headers: authHeaders() });
  return res.data;
}
export async function updateService(id: number, data: { libelle: string }) {
  const res = await api.put(`/services/${id}`, data, { headers: authHeaders() });
  return res.data;
}
export async function deleteService(id: number) {
  const res = await api.delete(`/services/${id}`, { headers: authHeaders() });
  return res.data;
}

export async function getFonctions() {
  const res = await api.get("/fonctions", { headers: authHeaders() });
  return res.data;
}
export async function createFonction(data: { libelle: string }) {
  const res = await api.post("/fonctions", data, { headers: authHeaders() });
  return res.data;
}
export async function updateFonction(id: number, data: { libelle: string }) {
  const res = await api.put(`/fonctions/${id}`, data, { headers: authHeaders() });
  return res.data;
}
export async function deleteFonction(id: number) {
  const res = await api.delete(`/fonctions/${id}`, { headers: authHeaders() });
  return res.data;
}

// === PROFIL ADMIN ===
export type AdminProfile = {
  id: number;
  nom: string;
  email: string;
};

// ✅ payload flexible: soit nom/email, soit mdp, soit les deux
export type UpdateAdminProfilePayload = {
  nom?: string;
  email?: string;

  current_password?: string;
  password?: string;
  password_confirmation?: string;
};

export async function getAdminProfile(): Promise<AdminProfile> {
  const token = localStorage.getItem("token");
  const res = await api.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateAdminProfile(
  data: UpdateAdminProfilePayload
): Promise<AdminProfile> {
  const token = localStorage.getItem("token");

  const res = await api.put("/admin/profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}


export type AttestationStatus = "EN_ATTENTE" | "APPROUVEE" | "REFUSEE";

export type AttestationRequest = {
  id: number;
  request_number: string;
  type: string;
  motif: string | null;
  status: AttestationStatus;
  admin_comment: string | null;
  reviewed_at: string | null;
  generated_at: string | null;
  pdf_path: string | null;
  created_at: string;
  agent?: any; // pour admin list
};

export async function getMyAttestations() {
  const res = await api.get("/v1/attestations/my");
  return res.data as AttestationRequest[];
}

export async function createAttestation(payload: { type: string; motif?: string }) {
  const res = await api.post("/v1/attestations", payload);
  return res.data as AttestationRequest;
}

export async function downloadAttestation(id: number) {
  const res = await api.get(`/v1/attestations/${id}/download`, {
    responseType: "blob",
  });
  return res.data as Blob;
}

// ADMIN
export async function getAdminAttestations() {
  const res = await api.get("/v1/admin/attestations");
  return res.data as AttestationRequest[];
}

export async function reviewAttestation(id: number, payload: { action: "APPROUVER" | "REFUSER"; admin_comment?: string }) {
  const res = await api.post(`/v1/admin/attestations/${id}/review`, payload);
  return res.data as AttestationRequest;
}
