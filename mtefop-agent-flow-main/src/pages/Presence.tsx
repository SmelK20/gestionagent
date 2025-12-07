// src/pages/Admin/Presences.tsx
import { useEffect, useState } from "react";
import api from "@/api";
import { toast } from "sonner";

interface Agent {
  id: number;
  nom: string;
  prenom: string;
}

interface Presence {
  id: number;
  agent: Agent;
  date: string;
  statut: "present" | "absent" | "retard" | "permission";
  heure_arrivee?: string;
  heure_depart?: string;
  motif?: string;
}

export default function Presences() {
  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    statut: "present",
    heure_arrivee: "",
    heure_depart: "",
    motif: "",
  });

  const token = localStorage.getItem("token");

  // 🔹 Récupérer toutes les présences
  const fetchPresences = async () => {
    if (!token) return;
    try {
      const res = await api.get("/admin/presences", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPresences(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de récupérer les présences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresences();
  }, []);

  // 🔹 Commencer l’édition
  const startEdit = (p: Presence) => {
    setEditingId(p.id);
    setForm({
      statut: p.statut,
      heure_arrivee: p.heure_arrivee || "",
      heure_depart: p.heure_depart || "",
      motif: p.motif || "",
    });
  };

  // 🔹 Sauvegarder les modifications
  const saveEdit = async () => {
    if (!token || editingId === null) return;
    try {
      const res = await api.put(
        `/admin/presences/${editingId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPresences((prev) =>
        prev.map((p) => (p.id === editingId ? res.data : p))
      );
      setEditingId(null);
      toast.success("Présence mise à jour !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  // 🔹 Supprimer une présence
  const deletePresence = async (id: number) => {
    if (!token) return;
    if (!confirm("Voulez-vous vraiment supprimer cette présence ?")) return;
    try {
      await api.delete(`/admin/presences/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPresences((prev) => prev.filter((p) => p.id !== id));
      toast.success("Présence supprimée !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression.");
    }
  };

  if (loading) return <div>Chargement des présences...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-6">
      <h1 className="text-2xl font-bold mb-4">Toutes les présences</h1>

      {presences.length === 0 ? (
        <p>Aucune présence enregistrée.</p>
      ) : (
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Agent</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Heure arrivée</th>
              <th className="px-4 py-2">Heure départ</th>
              <th className="px-4 py-2">Motif</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {presences.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">{p.agent.nom} {p.agent.prenom}</td>
                <td className="px-4 py-2">{p.date}</td>
                <td className="px-4 py-2">
                  {editingId === p.id ? (
                    <select
                      value={form.statut}
                      onChange={(e) => setForm({ ...form, statut: e.target.value })}
                    >
                      <option value="present">Présent</option>
                      <option value="absent">Absent</option>
                      <option value="retard">Retard</option>
                      <option value="permission">Permission</option>
                    </select>
                  ) : (
                    p.statut
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingId === p.id ? (
                    <input
                      type="time"
                      value={form.heure_arrivee}
                      onChange={(e) => setForm({ ...form, heure_arrivee: e.target.value })}
                    />
                  ) : (
                    p.heure_arrivee || "—"
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingId === p.id ? (
                    <input
                      type="time"
                      value={form.heure_depart}
                      onChange={(e) => setForm({ ...form, heure_depart: e.target.value })}
                    />
                  ) : (
                    p.heure_depart || "—"
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingId === p.id ? (
                    <input
                      type="text"
                      value={form.motif}
                      onChange={(e) => setForm({ ...form, motif: e.target.value })}
                    />
                  ) : (
                    p.motif || "—"
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  {editingId === p.id ? (
                    <>
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={saveEdit}
                      >
                        Sauvegarder
                      </button>
                      <button
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                        onClick={() => setEditingId(null)}
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => startEdit(p)}
                      >
                        Modifier
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => deletePresence(p.id)}
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
