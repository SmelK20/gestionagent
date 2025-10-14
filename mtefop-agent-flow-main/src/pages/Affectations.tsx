import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, User } from "lucide-react";
import { api } from "@/api";
import { toast } from "sonner";

export default function Affectations() {
  const [affectations, setAffectations] = useState([]);
  const [agents, setAgents] = useState([]);
  const [services, setServices] = useState([]);
  const [fonctions, setFonctions] = useState([]);
  const [ministeres, setMinisteres] = useState([]);
  const [directions, setDirections] = useState([]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    agent_id: "",
    ministere_id: "",
    direction_id: "",
    service_id: "",
    fonction_id: "",
    date_debut: "",
    statut: "active",
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [resA, resAg, resMin, resDir, resSer, resFon] = await Promise.all([
        api.get("/affectations"),
        api.get("/agents"),
        api.get("/ministeres"),
        api.get("/directions"),
        api.get("/services"),
        api.get("/fonctions"),
      ]);
      setAffectations(resA.data);
      setAgents(resAg.data);
      setMinisteres(resMin.data);
      setDirections(resDir.data);
      setServices(resSer.data);
      setFonctions(resFon.data);
    } catch (err) {
      toast.error("Erreur de chargement des données");
    }
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post("/affectations", form);
      setAffectations(prev => [res.data, ...prev]);
      setForm({
        agent_id: "",
        ministere_id: "",
        direction_id: "",
        service_id: "",
        fonction_id: "",
        date_debut: "",
        statut: "active",
      });
      setOpen(false);
      toast.success("Affectation ajoutée !");
    } catch (err) {
      toast.error("Erreur lors de l’ajout");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/affectations/${id}`);
      setAffectations(prev => prev.filter(a => a.id !== id));
      toast.success("Affectation supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Affectations</h1>
          <p className="text-muted-foreground mt-2">Gérez les affectations des agents dans les différents services.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle affectation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle affectation</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAdd} className="space-y-4">
              <select className="w-full border p-2 rounded-md" value={form.agent_id} onChange={e => setForm({...form, agent_id: e.target.value})}>
                <option value="">-- Sélectionner un agent --</option>
                {agents.map(a => <option key={a.id} value={a.id}>{a.prenom} {a.nom}</option>)}
              </select>

              <select className="w-full border p-2 rounded-md" value={form.ministere_id} onChange={e => setForm({...form, ministere_id: e.target.value})}>
                <option value="">-- Ministère --</option>
                {ministeres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
              </select>

              <select className="w-full border p-2 rounded-md" value={form.direction_id} onChange={e => setForm({...form, direction_id: e.target.value})}>
                <option value="">-- Direction --</option>
                {directions.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)}
              </select>

              <select className="w-full border p-2 rounded-md" value={form.service_id} onChange={e => setForm({...form, service_id: e.target.value})}>
                <option value="">-- Service --</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
              </select>

              <select className="w-full border p-2 rounded-md" value={form.fonction_id} onChange={e => setForm({...form, fonction_id: e.target.value})}>
                <option value="">-- Fonction --</option>
                {fonctions.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
              </select>

              <Input type="date" value={form.date_debut} onChange={e => setForm({...form, date_debut: e.target.value})} />
              <DialogFooter>
                <Button type="submit">Enregistrer</Button>
                <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Liste des affectations</CardTitle>
          <CardDescription>{affectations.length} enregistrements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Fonction</TableHead>
                <TableHead>Date de début</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affectations.map((a: any) => (
                <TableRow key={a.id}>
                  <TableCell>{a.agent?.prenom} {a.agent?.nom}</TableCell>
                  <TableCell>{a.service?.nom}</TableCell>
                  <TableCell>{a.fonction?.nom}</TableCell>
                  <TableCell>{a.date_debut}</TableCell>
                  <TableCell>{a.statut}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => handleDelete(a.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
