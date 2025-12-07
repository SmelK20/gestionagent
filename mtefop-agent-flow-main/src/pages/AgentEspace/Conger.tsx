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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface DemandeConge {
  id: number;
  typeConge: string;
  dateDebut: string;
  dateFin: string;
  duree: number;
  statut: "en_attente" | "approuve" | "refuse";
  motif: string;
  remplacant: string;
}

export default function CongesAgent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [demandesConges, setDemandesConges] = useState<DemandeConge[]>([]);
  const [formData, setFormData] = useState({
    typeConge: "",
    motif: "",
    remplacant: "",
  });
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [openModal, setOpenModal] = useState(false);

  const typesConge = ["Congés payés", "Maladie", "Sans solde", "Formation"];
  const token = localStorage.getItem("token");
  const API_URL = "http://127.0.0.1:8000/api/agent/conges";

  // 🔹 Récupération des congés
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
        console.error("Erreur fetchConges:", error);
      }
    };
    fetchConges();
  }, [token]);

  // 🔹 Ajout d'une demande avec debug complet
  const handleAddDemande = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      type: formData.typeConge,
      date_debut: dateRange[0].startDate.toISOString().split("T")[0],
      date_fin: dateRange[0].endDate.toISOString().split("T")[0],
      motif: formData.motif,
      remplacant: formData.remplacant || null,
    };

    console.log("🟢 Envoi payload :", payload);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Erreur parsing JSON :", jsonErr);
        throw new Error(`Erreur backend non JSON, status ${res.status}`);
      }

      if (!res.ok) {
        console.error("❌ Erreur backend :", data);
        throw new Error(data.message || `Erreur serveur ${res.status}`);
      }

      console.log("✅ Réponse backend :", data);

      const mapped = {
        id: data.id,
        typeConge: data.type,
        dateDebut: data.date_debut,
        dateFin: data.date_fin,
        duree: data.duree,
        statut: data.statut,
        motif: data.motif,
        remplacant: data.remplacant,
      };
      setDemandesConges([mapped, ...demandesConges]);
      setFormData({ typeConge: "", motif: "", remplacant: "" });
      setDateRange([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
      setOpenModal(false);
    } catch (error: any) {
      console.error("🔥 Erreur handleAddDemande :", error);
      alert(`Impossible d'ajouter la demande : ${error.message}`);
    }
  };

  const filteredDemandes = demandesConges
    .filter(
      (d) =>
        d.typeConge.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.motif.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime());

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

  const getStatutIcon = (statut: string) => <AlertCircle className="h-4 w-4 mr-1" />;

  const soldeConges = {
    total: 30,
    utilise: demandesConges
      .filter((d) => d.statut === "approuve")
      .reduce((acc, d) => acc + d.duree, 0),
    restant:
      30 -
      demandesConges
        .filter((d) => d.statut === "approuve")
        .reduce((acc, d) => acc + d.duree, 0),
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mes Congés</h1>
          <p className="text-muted-foreground mt-2">
            Suivi de mes demandes et solde de congés
          </p>
        </div>

        {/* Bouton + Modal */}
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-primary-foreground hover:scale-105 transition-transform shadow-soft">
              <Plus className="h-4 w-4 mr-2" /> Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle demande de congé</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddDemande} className="space-y-4">
              <div>
                <Label>Type de congé</Label>
                <select
                  className="w-full border rounded p-2"
                  value={formData.typeConge}
                  onChange={(e) =>
                    setFormData({ ...formData, typeConge: e.target.value })
                  }
                  required
                >
                  <option value="">Sélectionner un type</option>
                  {typesConge.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Période</Label>
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setDateRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                />
              </div>
              <div>
                <Label>Motif</Label>
                <Textarea
                  rows={3}
                  required
                  value={formData.motif}
                  onChange={(e) =>
                    setFormData({ ...formData, motif: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Remplaçant (facultatif)</Label>
                <Input
                  placeholder="Nom du remplaçant"
                  value={formData.remplacant}
                  onChange={(e) =>
                    setFormData({ ...formData, remplacant: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-white">
                Envoyer la demande
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Solde de congés */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{soldeConges.total}</div>
            <p>Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-destructive">
            <div className="text-2xl font-bold">{soldeConges.utilise}</div>
            <p>Utilisés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-default">
            <div className="text-2xl font-bold">{soldeConges.restant}</div>
            <p>Restant</p>
          </CardContent>
        </Card>
      </div>

      {/* Recherche historique */}
      <Card className="shadow-soft">
        <CardContent className="p-6 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Rechercher par type de congé ou motif..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Tableau historique */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Historique de mes demandes</CardTitle>
          <CardDescription>{filteredDemandes.length} trouvée(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Remplaçant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDemandes.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.typeConge}</TableCell>
                  <TableCell>
                    {format(new Date(d.dateDebut), "dd/MM/yyyy")} →{" "}
                    {format(new Date(d.dateFin), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{d.duree} j</TableCell>
                  <TableCell>
                    <Badge variant={getStatutColor(d.statut)}>
                      {getStatutIcon(d.statut)}
                      {getStatutLabel(d.statut)}
                    </Badge>
                  </TableCell>
                  <TableCell>{d.motif}</TableCell>
                  <TableCell>{d.remplacant || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
