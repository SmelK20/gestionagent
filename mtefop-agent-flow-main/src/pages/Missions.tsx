import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Calendar } from "lucide-react";
import { getMissions, addMission } from "@/api";

interface Mission {
  id: number;
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
  lieu: string;
  statut: string;
  rapport: string;
  cree_par: string;
  service_id: number | null;
  direction_id: number | null;
}

export default function Missions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    lieu: "",
    statut: "planifie",
    rapport: "",
    cree_par: "",
    service_id: "",
    direction_id: "",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchMissions() {
      const data = await getMissions();
      setMissions(data);
    }
    fetchMissions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMission = await addMission(formData);
    setMissions([...missions, newMission]);
    setOpen(false);
    setFormData({
      titre: "",
      description: "",
      date_debut: "",
      date_fin: "",
      lieu: "",
      statut: "planifie",
      rapport: "",
      cree_par: "",
      service_id: "",
      direction_id: "",
    });
  };

  const filteredMissions = missions.filter((m) =>
    m.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Missions</h1>
          <p className="text-muted-foreground">Ajoutez et suivez les missions en cours</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-white">
              <Plus className="mr-2 h-4 w-4" /> Nouvelle mission
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle mission</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3 mt-4">
              <Input name="titre" placeholder="Titre" value={formData.titre} onChange={handleChange} required />
              <Textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" name="date_debut" value={formData.date_debut} onChange={handleChange} />
                <Input type="date" name="date_fin" value={formData.date_fin} onChange={handleChange} />
              </div>
              <Input name="lieu" placeholder="Lieu" value={formData.lieu} onChange={handleChange} />
              <Input name="cree_par" placeholder="Créé par" value={formData.cree_par} onChange={handleChange} />
              <Button type="submit" className="w-full mt-2">Enregistrer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une mission..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Liste */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des missions</CardTitle>
          <CardDescription>{filteredMissions.length} mission(s) trouvée(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Début</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créé par</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMissions.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.titre}</TableCell>
                  <TableCell>{m.lieu}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {m.date_debut ? new Date(m.date_debut).toLocaleDateString("fr-FR") : "-"}
                    </div>
                  </TableCell>
                  <TableCell>{m.date_fin ? new Date(m.date_fin).toLocaleDateString("fr-FR") : "-"}</TableCell>
                  <TableCell>{m.statut}</TableCell>
                  <TableCell>{m.cree_par}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
