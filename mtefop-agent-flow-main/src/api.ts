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
