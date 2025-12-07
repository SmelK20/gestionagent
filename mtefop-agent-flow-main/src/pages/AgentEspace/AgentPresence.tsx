import { useEffect, useState } from "react";
import api from "@/api";
import { toast } from "sonner";

interface Presence {
  id: number;
  date: string;
  statut: "present" | "absent" | "retard" | "permission";
  heure_arrivee?: string | null;
  heure_depart?: string | null;
  motif?: string | null;
}

export default function AgentPresence() {
  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // 🔹 Récupérer les présences de l'agent
  const fetchPresences = async () => {
    if (!token) return;
    try {
      const res = await api.get("/agent/presences", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPresences(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de récupérer vos présences.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Pointer l'arrivée ou le départ
  const pointerPresence = async () => {
    if (!token) return;
    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

    // Vérifie si l’agent a déjà pointé aujourd’hui
    const todayPresence = presences.find((p) => p.date === today);

    try {
      if (!todayPresence) {
        // ✅ Première fois : pointer l'arrivée
        const res = await api.post(
          "/agent/presences",
          {
            date: today,
            statut: "present",
            heure_arrivee: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Heure d'arrivée enregistrée !");
        setPresences((prev) => [res.data, ...prev]);
      } else if (!todayPresence.heure_depart) {
        // ✅ Deuxième fois : pointer le départ
        const res = await api.put(
          `/agent/presences/${todayPresence.id}`,
          {
            heure_depart: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Heure de départ enregistrée !");
        setPresences((prev) =>
          prev.map((p) => (p.id === todayPresence.id ? res.data : p))
        );
      } else {
        toast.info("Vous avez déjà pointé votre départ aujourd'hui !");
      }
    } catch (error: any) {
      console.error(error.response?.data);
      if (error.response?.status === 409) {
        toast.error("Présence déjà enregistrée pour aujourd'hui !");
      } else if (error.response?.status === 422) {
        toast.error("Données invalides.");
      } else {
        toast.error("Erreur lors de l'enregistrement du pointage.");
      }
    }
  };

  useEffect(() => {
    fetchPresences();
  }, []);

  if (loading) return <div>Chargement des présences...</div>;

  // 🔹 Trouver la présence du jour
  const today = new Date().toISOString().split("T")[0];
  const todayPresence = presences.find((p) => p.date === today);

  const buttonLabel = !todayPresence
    ? "Pointer mon arrivée"
    : todayPresence && !todayPresence.heure_depart
    ? "Pointer mon départ"
    : "Pointage complété ✅";

  const buttonDisabled = !!(todayPresence && todayPresence.heure_depart);

  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-6">
      <h1 className="text-2xl font-bold mb-4">📅 Mes présences</h1>

      <button
        onClick={pointerPresence}
        disabled={buttonDisabled}
        className={`px-4 py-2 rounded text-white ${
          buttonDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-primary hover:bg-primary/80"
        }`}
      >
        {buttonLabel}
      </button>

      {presences.length === 0 ? (
        <p className="mt-4 text-gray-600">Aucune présence enregistrée.</p>
      ) : (
        <table className="w-full text-left border mt-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Heure d’arrivée</th>
              <th className="px-4 py-2">Heure de départ</th>
              <th className="px-4 py-2">Motif</th>
            </tr>
          </thead>
          <tbody>
            {presences.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">{p.date}</td>
                <td className="px-4 py-2 capitalize">{p.statut}</td>
                <td className="px-4 py-2">{p.heure_arrivee || "—"}</td>
                <td className="px-4 py-2">{p.heure_depart || "—"}</td>
                <td className="px-4 py-2">{p.motif || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
