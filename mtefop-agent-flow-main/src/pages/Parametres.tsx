// src/pages/Parametres.tsx
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Settings,
  User,
  Bell,
  Save,
  ListChecks,
  Plus,
  Search,
  Edit,
  Trash2,
  KeyRound,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";

import {
  getDirections,
  createDirection,
  updateDirection,
  deleteDirection,
  getServicesList,
  createService,
  updateService,
  deleteService,
  getFonctions,
  createFonction,
  updateFonction,
  deleteFonction,
  getAdminProfile,
  updateAdminProfile,
} from "@/api";

type Item = { id: number; libelle: string };
type ResourceKey = "directions" | "services" | "fonctions";

type AdminProfile = {
  id?: number;
  nom: string;
  email: string;
};

function normalize(s: string) {
  return (s || "").toLowerCase().trim();
}

export default function Parametres() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // =========================
  // PROFIL ADMIN
  // =========================
  const [adminForm, setAdminForm] = useState<AdminProfile>({
    nom: "",
    email: "",
  });
  const [adminFormTouched, setAdminFormTouched] = useState(false);

  const [openPassword, setOpenPassword] = useState(false);
  const [pwd, setPwd] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const adminQuery = useQuery({
    queryKey: ["admin-profile"],
    queryFn: getAdminProfile,
  });

  useEffect(() => {
    if (adminQuery.data && !adminFormTouched) {
      setAdminForm({
        id: adminQuery.data?.id,
        nom: adminQuery.data?.nom ?? "",
        email: adminQuery.data?.email ?? "",
      });
    }
  }, [adminQuery.data, adminFormTouched]);

  useEffect(() => {
    if (adminQuery.isError) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger le profil administrateur.",
      });
    }
  }, [adminQuery.isError, toast]);

  const updateProfileMutation = useMutation({
    mutationFn: (payload: { nom: string; email: string }) =>
      updateAdminProfile(payload),
    onSuccess: () => {
      toast({ title: "Succès", description: "Profil administrateur mis à jour." });
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
      setAdminFormTouched(false);
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          err?.response?.data?.message ||
          "Impossible de mettre à jour le profil.",
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (payload: any) => updateAdminProfile(payload),
    onSuccess: () => {
      toast({ title: "Succès", description: "Mot de passe mis à jour." });
      setOpenPassword(false);
      setPwd({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : "Impossible de modifier le mot de passe.");

      toast({ variant: "destructive", title: "Erreur", description: msg });
    },
  });

  // =========================
  // RÉFÉRENTIELS
  // =========================
  const [tab, setTab] = useState<ResourceKey>("directions");
  const [q, setQ] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);

  const directionsQuery = useQuery({
    queryKey: ["directions"],
    queryFn: getDirections,
  });
  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: getServicesList,
  });
  const fonctionsQuery = useQuery({
    queryKey: ["fonctions"],
    queryFn: getFonctions,
  });

  const current = useMemo(() => {
    if (tab === "directions") return directionsQuery.data ?? [];
    if (tab === "services") return servicesQuery.data ?? [];
    return fonctionsQuery.data ?? [];
  }, [tab, directionsQuery.data, servicesQuery.data, fonctionsQuery.data]);

  const filtered = useMemo(() => {
    const term = normalize(q);
    if (!term) return current;
    return current.filter((it) =>
      normalize(it.libelle).includes(term)
    );
  }, [current, q]);

  const isLoading =
    directionsQuery.isLoading ||
    servicesQuery.isLoading ||
    fonctionsQuery.isLoading;

  const isError =
    directionsQuery.isError ||
    servicesQuery.isError ||
    fonctionsQuery.isError;

  const title =
    tab === "directions"
      ? "Directions"
      : tab === "services"
      ? "Services"
      : "Fonctions";

  const createMutation = useMutation({
    mutationFn: async (payload: { libelle: string }) => {
      if (tab === "directions") return createDirection(payload);
      if (tab === "services") return createService(payload);
      return createFonction(payload);
    },
    onSuccess: () => {
      toast({ title: "Ajout réussi", description: "Élément créé avec succès." });
      queryClient.invalidateQueries({ queryKey: [tab] });
      setOpenCreate(false);
      setValue("");
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          err?.response?.data?.message || "Création impossible.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: number; libelle: string }) => {
      if (tab === "directions")
        return updateDirection(payload.id, { libelle: payload.libelle });
      if (tab === "services")
        return updateService(payload.id, { libelle: payload.libelle });
      return updateFonction(payload.id, { libelle: payload.libelle });
    },
    onSuccess: () => {
      toast({
        title: "Modification réussie",
        description: "Élément mis à jour.",
      });
      queryClient.invalidateQueries({ queryKey: [tab] });
      setOpenEdit(false);
      setSelected(null);
      setValue("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (tab === "directions") return deleteDirection(id);
      if (tab === "services") return deleteService(id);
      return deleteFonction(id);
    },
    onSuccess: () => {
      toast({
        title: "Suppression réussie",
        description: "Élément supprimé.",
      });
      queryClient.invalidateQueries({ queryKey: [tab] });
      setOpenDelete(false);
      setSelected(null);
    },
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Paramètres
        </h1>
        <p className="text-muted-foreground mt-2">
          Configuration du système et préférences d'administration
        </p>
      </div>

      {/* ================= ADMINISTRATION (HAUT) ================= */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            Administration — Référentiels
          </CardTitle>
          <CardDescription>
            Gérer les listes officielles utilisées dans les formulaires.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as ResourceKey)}>
            <TabsList>
              <TabsTrigger value="directions">Directions</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="fonctions">Fonctions</TabsTrigger>
            </TabsList>

            <TabsContent value={tab} className="mt-4">
              <div className="flex justify-between mb-3">
                <div className="relative w-full max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder={`Rechercher dans ${title.toLowerCase()}...`}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>

                <Button onClick={() => setOpenCreate(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              <div className="text-sm text-muted-foreground mb-2">
                <Badge variant="secondary">{title}</Badge> •{" "}
                {filtered.length} / {current.length}
              </div>

              {isLoading ? (
                <p className="text-sm">Chargement...</p>
              ) : isError ? (
                <p className="text-sm text-red-500">
                  Erreur lors du chargement
                </p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Libellé</TableHead>
                        <TableHead className="text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((it) => (
                        <TableRow key={it.id}>
                          <TableCell>{it.libelle}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelected(it);
                                setValue(it.libelle);
                                setOpenEdit(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelected(it);
                                setOpenDelete(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ================= PROFIL + NOTIFICATIONS (BAS) ================= */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil administrateur
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input
                value={adminForm.nom}
                onChange={(e) => {
                  setAdminFormTouched(true);
                  setAdminForm({ ...adminForm, nom: e.target.value });
                }}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={adminForm.email}
                onChange={(e) => {
                  setAdminFormTouched(true);
                  setAdminForm({ ...adminForm, email: e.target.value });
                }}
              />
            </div>

            <Button
              onClick={() =>
                updateProfileMutation.mutate({
                  nom: adminForm.nom.trim(),
                  email: adminForm.email.trim(),
                })
              }
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>

            <Button variant="outline" onClick={() => setOpenPassword(true)}>
              <KeyRound className="w-4 h-4 mr-2" />
              Modifier le mot de passe
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <Label>Nouvelles demandes</Label>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex justify-between">
              <Label>Missions en retard</Label>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================= MODALES ================= */}

      {/* CREATE */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter — {title}</DialogTitle>
          </DialogHeader>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
          <DialogFooter>
            <Button onClick={() => createMutation.mutate({ libelle: value })}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier — {title}</DialogTitle>
          </DialogHeader>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
          <DialogFooter>
            <Button
              onClick={() =>
                selected &&
                updateMutation.mutate({
                  id: selected.id,
                  libelle: value,
                })
              }
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => selected && deleteMutation.mutate(selected.id)}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PASSWORD */}
      <Dialog open={openPassword} onOpenChange={setOpenPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le mot de passe</DialogTitle>
          </DialogHeader>

          <Input
            type="password"
            placeholder="Mot de passe actuel"
            value={pwd.current_password}
            onChange={(e) =>
              setPwd({ ...pwd, current_password: e.target.value })
            }
          />
          <Input
            type="password"
            placeholder="Nouveau mot de passe"
            value={pwd.password}
            onChange={(e) => setPwd({ ...pwd, password: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Confirmation"
            value={pwd.password_confirmation}
            onChange={(e) =>
              setPwd({
                ...pwd,
                password_confirmation: e.target.value,
              })
            }
          />

          <DialogFooter>
            <Button onClick={() => updatePasswordMutation.mutate(pwd)}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
