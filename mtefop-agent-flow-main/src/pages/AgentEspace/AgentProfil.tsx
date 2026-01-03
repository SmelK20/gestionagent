"use client";

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
  const [editing, setEditing] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Agent>>({});
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });

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
        setFormData(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Impossible de récupérer votre profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (key: keyof Agent, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await api.patch("/agents/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgent(res.data);
      toast.success("Profil mis à jour avec succès !");
      setEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour du profil.");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error("Le nouveau mot de passe et sa confirmation ne correspondent pas.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await api.post(
        "/agents/change-password",
        { current: passwordData.current, new: passwordData.new },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Mot de passe mis à jour !");
      setPasswordData({ current: "", new: "", confirm: "" });
      setPasswordMode(false);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du changement de mot de passe.");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!agent) return <div>Profil introuvable.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Profil de {agent.prenom} {agent.nom}
      </h1>

      <div className="space-y-3 text-sm bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-primary border-b pb-1">Informations personnelles</h3>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Annuler" : "Modifier"}
            </button>
            <button
              className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
              onClick={() => setPasswordMode(!passwordMode)}
            >
              {passwordMode ? "Annuler" : "Changer le mot de passe"}
            </button>
          </div>
        </div>

        {editing ? (
          <div className="space-y-2 mt-2">
            <input
              className="border rounded px-2 py-1 w-full"
              value={formData.nom || ""}
              onChange={(e) => handleChange("nom", e.target.value)}
              placeholder="Nom"
            />
            <input
              className="border rounded px-2 py-1 w-full"
              value={formData.prenom || ""}
              onChange={(e) => handleChange("prenom", e.target.value)}
              placeholder="Prénom"
            />
            <input
              className="border rounded px-2 py-1 w-full"
              value={formData.telephone || ""}
              onChange={(e) => handleChange("telephone", e.target.value)}
              placeholder="Téléphone"
            />
            <input
              className="border rounded px-2 py-1 w-full"
              value={formData.adresse || ""}
              onChange={(e) => handleChange("adresse", e.target.value)}
              placeholder="Adresse"
            />
            <button
              className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 mt-2"
              onClick={handleSave}
            >
              Sauvegarder
            </button>
          </div>
        ) : (
          <div className="mt-2 space-y-1">
            <p><strong>Immatricule :</strong> {agent.immatricule}</p>
            <p><strong>CIN :</strong> {agent.cin || "—"}</p>
            <p><strong>Email :</strong> {agent.email}</p>
            <p><strong>Téléphone :</strong> {agent.telephone || "—"}</p>
            <p><strong>Adresse :</strong> {agent.adresse || "—"}</p>
            <p><strong>Date de naissance :</strong> {agent.date_naissance || "—"}</p>
            <p><strong>Situation matrimoniale :</strong> {agent.situation_matrimoniale || "—"}</p>
            <p><strong>Sexe :</strong> {agent.sexe || "—"}</p>
          </div>
        )}

        {passwordMode && (
          <div className="mt-4 space-y-2 border-t pt-2">
            <h4 className="font-semibold">Changer le mot de passe</h4>
            <input
              type="password"
              placeholder="Mot de passe actuel"
              value={passwordData.current}
              onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
              className="border rounded px-2 py-1 w-full"
            />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={passwordData.new}
              onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
              className="border rounded px-2 py-1 w-full"
            />
            <input
              type="password"
              placeholder="Confirmer nouveau mot de passe"
              value={passwordData.confirm}
              onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
              className="border rounded px-2 py-1 w-full"
            />
            <button
              className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 mt-2"
              onClick={handleChangePassword}
            >
              Modifier le mot de passe
            </button>
          </div>
        )}

        <hr className="my-4" />

        <h3 className="font-semibold text-primary border-b pb-1">Informations professionnelles</h3>
        <p><strong>Corps :</strong> {agent.corps || "—"}</p>
        <p><strong>Grade :</strong> {agent.grade || "—"}</p>
        <p><strong>Catégorie :</strong> {agent.categorie || "—"}</p>
        <p><strong>Diplôme :</strong> {agent.diplome || "—"}</p>
        <p><strong>Spécialisation :</strong> {agent.specialisation || "—"}</p>
        <p><strong>Service d’affectation :</strong> {agent.service_affectation || "—"}</p>
        <p><strong>Date d’affectation :</strong> {agent.date_affectation || "—"}</p>

        <hr className="my-4" />

        <h3 className="font-semibold text-primary border-b pb-1">Affectation hiérarchique</h3>
        <p><strong>Ministère :</strong> {agent.ministere}</p>
        <p><strong>Direction :</strong> {agent.direction || "—"}</p>
        <p><strong>Service :</strong> {agent.service || "—"}</p>
        <p><strong>Fonction :</strong> {agent.fonction || "—"}</p>
      </div>
    </div>
  );
}
