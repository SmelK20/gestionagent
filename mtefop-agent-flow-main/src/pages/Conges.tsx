"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format, isSameMonth } from "date-fns";

interface DemandeConge {
  id: number;
  agent: string;
  typeConge: string;
  dateDebut: string;
  dateFin: string;
  duree: number;
  statut: "en_attente" | "approuve" | "refuse";
  motif: string;
  remplacant: string;
}

export default function CongesAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [demandesConges, setDemandesConges] = useState<DemandeConge[]>([]);
  const [statutFilter, setStatutFilter] =
    useState<"all" | "en_attente" | "approuve" | "refuse">("all");

  const token = localStorage.getItem("token");
  const API_URL = "http://127.0.0.1:8000/api/admin/conges";

  useEffect(() => {
    const fetchConges = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur lors de la récupération des congés");
        const data = await res.json();
        const mapped = data.map((d: any) => ({
          id: d.id,
          agent: d.agent?.nom + " " + d.agent?.prenom || "—",
          typeConge: d.type,
          dateDebut: d.date_debut,
          dateFin: d.date_fin,
          duree: d.duree,
          statut: d.statut,
          motif: d.motif,
          remplacant: d.remplacant,
        }));
        setDemandesConges(mapped);
      } catch (error) {
        console.error(error);
      }
    };
    fetchConges();
  }, [token]);

  /* =======================
     KPI – STATISTIQUES
  ======================= */

  const stats = useMemo(() => {
    const total = demandesConges.length;

    const enAttente = demandesConges.filter(
      (d) => d.statut === "en_attente"
    ).length;

    const refuses = demandesConges.filter(
      (d) => d.statut === "refuse"
    ).length;

    const approuves = demandesConges.filter(
      (d) => d.statut === "approuve"
    );

    const approuvesCeMois = approuves.filter((d) =>
      isSameMonth(new Date(d.dateDebut), new Date())
    ).length;

    const joursConsommes = approuves.reduce(
      (total, d) => total + d.duree,
      0
    );

    const tauxRefus =
      total === 0 ? 0 : Math.round((refuses / total) * 100);

    return {
      enAttente,
      approuvesCeMois,
      joursConsommes,
      tauxRefus,
    };
  }, [demandesConges]);

  /* =======================
     ACTIONS
  ======================= */

  const handleChangeStatut = async (
    id: number,
    statut: "approuve" | "refuse"
  ) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ statut }),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour du statut");

      const updatedDemande = await res.json();
      setDemandesConges(
        demandesConges.map((d) =>
          d.id === id ? { ...d, statut: updatedDemande.statut } : d
        )
      );
    } catch (error) {
      console.error(error);
      alert("Impossible de mettre à jour le statut.");
    }
  };

  /* =======================
     FILTRES
  ======================= */

  const filteredDemandes = demandesConges.filter((d) => {
    const matchSearch =
      d.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.typeConge.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.motif.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatut =
      statutFilter === "all" ? true : d.statut === statutFilter;

    return matchSearch && matchStatut;
  });

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "approuve":
        return "default";
      case "refuse":
        return "destructive";
      case "en_attente":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "approuve":
        return "Approuvé";
      case "refuse":
        return "Refusé";
      case "en_attente":
        return "En attente";
      default:
        return statut;
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "approuve":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "refuse":
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return <AlertCircle className="h-4 w-4 mr-1" />;
    }
  };

  const statutTabs = [
    { label: "Tous", value: "all" },
    { label: "En attente", value: "en_attente" },
    { label: "Approuvé", value: "approuve" },
    { label: "Refusé", value: "refuse" },
  ];

  const getTabClass = (value: string) => {
    if (statutFilter === value) {
      switch (value) {
        case "en_attente":
          return "bg-yellow-500 text-white";
        case "approuve":
          return "bg-green-500 text-white";
        case "refuse":
          return "bg-red-500 text-white";
        default:
          return "bg-gray-800 text-white";
      }
    }
    return "bg-gray-100 text-gray-700 hover:bg-gray-200";
  };

  return (
    <div className="space-y-6">
      {/* TITRE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Demandes de congés</h1>
        </div>
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Rechercher par agent, type ou motif..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>En attente</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {stats.enAttente}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Approuvés ce mois</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {stats.approuvesCeMois}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Jours consommés</CardDescription>
            <CardTitle className="text-3xl">
              {stats.joursConsommes} j
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Taux de refus</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {stats.tauxRefus} %
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des demandes</CardTitle>
          <CardDescription>
            {filteredDemandes.length} trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            {statutTabs.map((tab) => (
              <button
                key={tab.value}
                className={`px-4 py-2 rounded font-semibold ${getTabClass(
                  tab.value
                )}`}
                onClick={() => setStatutFilter(tab.value as any)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Remplaçant</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDemandes.map((demande) => (
                <TableRow key={demande.id}>
                  <TableCell>{demande.agent}</TableCell>
                  <TableCell>{demande.typeConge}</TableCell>
                  <TableCell>
                    {format(new Date(demande.dateDebut), "dd/MM/yyyy")} →{" "}
                    {format(new Date(demande.dateFin), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{demande.duree} j</TableCell>
                  <TableCell>
                    <Badge variant={getStatutColor(demande.statut)}>
                      {getStatutIcon(demande.statut)}
                      {getStatutLabel(demande.statut)}
                    </Badge>
                  </TableCell>
                  <TableCell>{demande.motif}</TableCell>
                  <TableCell>{demande.remplacant || "—"}</TableCell>
                  <TableCell className="text-right">
                    {demande.statut === "en_attente" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleChangeStatut(demande.id, "approuve")
                          }
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleChangeStatut(demande.id, "refuse")
                          }
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
