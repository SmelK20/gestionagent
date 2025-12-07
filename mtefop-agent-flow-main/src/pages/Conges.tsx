"use client";

import { useState, useEffect } from "react";
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
import { format } from "date-fns";

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

  const token = localStorage.getItem("token");
  const API_URL = "http://127.0.0.1:8000/api/admin/conges"; // ⚡ Fix URL dev local

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

  const handleChangeStatut = async (id: number, statut: "approuve" | "refuse") => {
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
      alert("Impossible de mettre à jour le statut, vérifie le backend.");
    }
  };

  const filteredDemandes = demandesConges.filter(
    (d) =>
      d.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.typeConge.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.motif.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Demandes de congés</h1>
          <p className="text-muted-foreground mt-2">
            Approuver ou refuser les demandes des agents
          </p>
        </div>
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Rechercher par agent, type ou motif..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Historique des demandes</CardTitle>
          <CardDescription>{filteredDemandes.length} trouvée(s)</CardDescription>
        </CardHeader>
        <CardContent>
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
                          className="text-success border-success"
                          onClick={() => handleChangeStatut(demande.id, "approuve")}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive"
                          onClick={() => handleChangeStatut(demande.id, "refuse")}
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
