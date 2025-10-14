import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Briefcase, 
  MapPin,
  Plus,
  Edit,
  Trash2,
  Settings
} from "lucide-react";
import { api } from "@/api"; // ton fichier api.ts
import { toast } from "sonner";

export default function Administration() {
  // États pour stocker les données
  const [ministeres, setMinisteres] = useState([]);
  const [directions, setDirections] = useState([]);
  const [services, setServices] = useState([]);
  const [fonctions, setFonctions] = useState([]);
  
  // Nouveaux inputs
  const [newMinistere, setNewMinistere] = useState("");
  const [newDirection, setNewDirection] = useState("");
  const [newService, setNewService] = useState("");
  const [newFonction, setNewFonction] = useState("");

  // Charger les données depuis le backend
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [resMin, resDir, resServ, resFon] = await Promise.all([
        api.get("/ministeres"),
        api.get("/directions"),
        api.get("/services"),
        api.get("/fonctions"),
      ]);
      setMinisteres(resMin.data);
      setDirections(resDir.data);
      setServices(resServ.data);
      setFonctions(resFon.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des données");
    }
  };

  // Ajouter un élément
  const handleAdd = async (type: string, value: string) => {
    if (!value) return;
    try {
      let res;
      switch(type) {
        case "ministere":
          res = await api.post("/ministeres", { nom: value });
          setMinisteres(prev => [...prev, res.data]);
          setNewMinistere("");
          break;
        case "direction":
          res = await api.post("/directions", { nom: value });
          setDirections(prev => [...prev, res.data]);
          setNewDirection("");
          break;
        case "service":
          res = await api.post("/services", { nom: value });
          setServices(prev => [...prev, res.data]);
          setNewService("");
          break;
        case "fonction":
          res = await api.post("/fonctions", { nom: value });
          setFonctions(prev => [...prev, res.data]);
          setNewFonction("");
          break;
      }
      toast.success("Ajout réussi !");
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  // Supprimer un élément
  const handleDelete = async (type: string, id: string) => {
    try {
      await api.delete(`/${type}/${id}`);
      switch(type) {
        case "ministeres": setMinisteres(prev => prev.filter(m => m.id !== id)); break;
        case "directions": setDirections(prev => prev.filter(d => d.id !== id)); break;
        case "services": setServices(prev => prev.filter(s => s.id !== id)); break;
        case "fonctions": setFonctions(prev => prev.filter(f => f.id !== id)); break;
      }
      toast.success("Suppression réussie !");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Administration</h1>
        <p className="text-muted-foreground mt-2">
          Gestion de la hiérarchie administrative et des structures organisationnelles
        </p>
      </div>

      {/* Structure hiérarchique */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ministères */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Ministères
            </CardTitle>
            <CardDescription>
              Gestion des ministères de l'administration publique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nom du ministère"
                value={newMinistere}
                onChange={e => setNewMinistere(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={() => handleAdd("ministere", newMinistere)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {ministeres.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{m.nom}</h4>
                    <p className="text-sm text-muted-foreground">{m.description || ""}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete("ministeres", m.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Directions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Directions
            </CardTitle>
            <CardDescription>
              Directions rattachées aux ministères
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nom de la direction"
                value={newDirection}
                onChange={e => setNewDirection(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={() => handleAdd("direction", newDirection)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {directions.map(d => (
                <div key={d.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{d.nom}</h4>
                    <Badge variant="secondary" className="text-xs">{d.ministere?.nom}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete("directions", d.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Services
            </CardTitle>
            <CardDescription>
              Services au sein des directions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nom du service"
                value={newService}
                onChange={e => setNewService(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={() => handleAdd("service", newService)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {services.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{s.nom}</h4>
                    <Badge variant="outline" className="text-xs">{s.direction?.nom}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete("services", s.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fonctions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Fonctions
            </CardTitle>
            <CardDescription>
              Définition des fonctions et postes disponibles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nom de la fonction"
                value={newFonction}
                onChange={e => setNewFonction(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={() => handleAdd("fonction", newFonction)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {fonctions.map(f => (
                <div key={f.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{f.nom}</h4>
                    <p className="text-sm text-muted-foreground">{f.description || ""}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete("fonctions", f.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration système */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration organisationnelle
          </CardTitle>
          <CardDescription>
            Paramètres généraux de l'organisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-code">Code organisation</Label>
                <Input id="org-code" defaultValue="MTEFOP-2024" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hierarchy-levels">Niveaux hiérarchiques</Label>
                <Input id="hierarchy-levels" defaultValue="4" type="number" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="approval-workflow">Workflow d'approbation</Label>
                <Input id="approval-workflow" defaultValue="Chef → Directeur → Ministre" disabled />
              </div>
              <Button className="w-full bg-gradient-primary text-primary-foreground">
                Sauvegarder la configuration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
