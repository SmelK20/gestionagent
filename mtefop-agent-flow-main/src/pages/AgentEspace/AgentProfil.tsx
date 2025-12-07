import { useEffect, useState } from "react";
import api from "@/api";
import { toast } from "sonner";

interface Agent {
  id: number;
  immatricule: string;
  cin: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  date_naissance: string;
  situation_matrimoniale: string;
  sexe: string;
  corps: string;
  grade: string;
  categorie: string;
  diplome: string;
  specialisation: string;
  service_affectation: string;
  date_affectation: string;
  ministere: string;
  direction: string | null;
  service: string | null;
  fonction: string | null;
}

export default function AgentProfil() {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Token manquant. Veuillez vous reconnecter.");
          setLoading(false);
          return;
        }

        const res = await api.get("/agents/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgent(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Impossible de récupérer votre profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (!agent) return <div>Profil introuvable.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Profil de {agent.prenom} {agent.nom}
      </h1>

      <div className="space-y-3 text-sm bg-white p-6 rounded-lg shadow">
        {/* Informations personnelles */}
        <h3 className="font-semibold text-primary border-b pb-1">
          Informations personnelles
        </h3>
        <p><strong>Immatricule :</strong> {agent.immatricule}</p>
        <p><strong>CIN :</strong> {agent.cin || "—"}</p>
        <p><strong>Email :</strong> {agent.email}</p>
        <p><strong>Téléphone :</strong> {agent.telephone || "—"}</p>
        <p><strong>Adresse :</strong> {agent.adresse || "—"}</p>
        <p><strong>Date de naissance :</strong> {agent.date_naissance || "—"}</p>
        <p><strong>Situation matrimoniale :</strong> {agent.situation_matrimoniale || "—"}</p>
        <p><strong>Sexe :</strong> {agent.sexe || "—"}</p>

        <hr />

        {/* Informations professionnelles */}
        <h3 className="font-semibold text-primary border-b pb-1">
          Informations professionnelles
        </h3>
        <p><strong>Corps :</strong> {agent.corps || "—"}</p>
        <p><strong>Grade :</strong> {agent.grade || "—"}</p>
        <p><strong>Catégorie :</strong> {agent.categorie || "—"}</p>
        <p><strong>Diplôme :</strong> {agent.diplome || "—"}</p>
        <p><strong>Spécialisation :</strong> {agent.specialisation || "—"}</p>
        <p><strong>Service d’affectation :</strong> {agent.service_affectation || "—"}</p>
        <p><strong>Date d’affectation :</strong> {agent.date_affectation || "—"}</p>

        <hr />

        {/* Affectation hiérarchique */}
        <h3 className="font-semibold text-primary border-b pb-1">
          Affectation hiérarchique
        </h3>
        <p><strong>Ministère :</strong> {agent.ministere}</p>
        <p><strong>Direction :</strong> {agent.direction || "—"}</p>
        <p><strong>Service :</strong> {agent.service || "—"}</p>
        <p><strong>Fonction :</strong> {agent.fonction || "—"}</p>
      </div>
    </div>
  );
}
