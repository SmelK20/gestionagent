import { useEffect, useState } from "react";
import api from "@/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Agent {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  service_affectation: string;
  corps: string;
  grade: string;
  categorie: string;
  diplome: string;
  specialisation: string;
  sexe: string;
  date_naissance: string;
}

export default function AgentEspace() {
  const [agent, setAgent] = useState<Agent | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token"); // On prend le token unique
      const role = localStorage.getItem("role");   // On vérifie le rôle
      if (!token || role !== "agent") {
        navigate("/login");
        return;
      }

      try {
        // On récupère le profil depuis /agents_nouveau/{id} ou /agents_nouveau via ton API
        // Si tu as l'id de l'agent stocké dans le login, tu peux faire `/agents_nouveau/${id}`
        const agentId = localStorage.getItem("user_id"); 
        const res = await api.get(`/agents_nouveau/${agentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgent(res.data);
      } catch (err) {
        toast.error("Impossible de récupérer le profil.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user_id");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      // Déconnexion côté serveur (optionnel si tu n’as pas d’endpoint logout pour agents)
      await api.post("/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  if (!agent) return <div>Chargement...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Profil de {agent.prenom} {agent.nom}
      </h1>
      <div className="space-y-2">
        <p><strong>Email:</strong> {agent.email}</p>
        <p><strong>Téléphone:</strong> {agent.telephone}</p>
        <p><strong>Sexe:</strong> {agent.sexe}</p>
        <p><strong>Date de naissance:</strong> {agent.date_naissance}</p>
        <p><strong>Corps:</strong> {agent.corps}</p>
        <p><strong>Grade:</strong> {agent.grade}</p>
        <p><strong>Catégorie:</strong> {agent.categorie}</p>
        <p><strong>Diplôme:</strong> {agent.diplome}</p>
        <p><strong>Spécialisation:</strong> {agent.specialisation}</p>
        <p><strong>Service:</strong> {agent.service_affectation}</p>
      </div>
      <Button className="mt-6" onClick={handleLogout}>
        Déconnexion
      </Button>
    </div>
  );
}
