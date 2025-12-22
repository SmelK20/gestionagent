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
  // ✅ Référentiels
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

  // ✅ Profil admin réel (table admins)
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
  // ✅ PROFIL ADMIN (réel)
  // =========================
  const [adminForm, setAdminForm] = useState<AdminProfile>({ nom: "", email: "" });
  const [adminFormTouched, setAdminFormTouched] = useState(false);

  // ✅ Modal changement mdp
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

  // Sync form lorsque le profil arrive
  useEffect(() => {
    if (adminQuery.data && !adminFormTouched) {
      setAdminForm({
        id: adminQuery.data?.id,
        nom: adminQuery.data?.nom ?? "",
        email: adminQuery.data?.email ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminQuery.data]);

  useEffect(() => {
    if (adminQuery.isError) {
      console.error(adminQuery.error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger le profil administrateur.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminQuery.isError]);

  // ✅ Mutation profil (nom/email)
  const updateProfileMutation = useMutation({
    mutationFn: async (payload: { nom: string; email: string }) => updateAdminProfile(payload),
    onSuccess: () => {
      toast({ title: "Succès", description: "Profil administrateur mis à jour." });
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
      setAdminFormTouched(false);
    },
    onError: (err: any) => {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err?.response?.data?.message || "Impossible de mettre à jour le profil.",
      });
    },
  });

  // ✅ Mutation mot de passe (séparée)
  const updatePasswordMutation = useMutation({
    mutationFn: async (payload: {
      current_password: string;
      password: string;
      password_confirmation: string;
    }) => updateAdminProfile(payload as any),
    onSuccess: () => {
      toast({ title: "Succès", description: "Mot de passe mis à jour." });
      setOpenPassword(false);
      setPwd({ current_password: "", password: "", password_confirmation: "" });
    },
    onError: (err: any) => {
      console.error(err);
      // Laravel renvoie parfois {message, errors}
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : null) ||
        "Impossible de modifier le mot de passe.";

      toast({
        variant: "destructive",
        title: "Erreur",
        description: msg,
      });
    },
  });

  // =========================
  // ✅ RÉFÉRENTIELS
  // =========================
  const [tab, setTab] = useState<ResourceKey>("directions");
  const [q, setQ] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);

  const directionsQuery = useQuery<Item[]>({ queryKey: ["directions"], queryFn: getDirections });
  const servicesQuery = useQuery<Item[]>({ queryKey: ["services"], queryFn: getServicesList });
  const fonctionsQuery = useQuery<Item[]>({ queryKey: ["fonctions"], queryFn: getFonctions });

  const current: Item[] = useMemo(() => {
    if (tab === "directions") return directionsQuery.data ?? [];
    if (tab === "services") return servicesQuery.data ?? [];
    return fonctionsQuery.data ?? [];
  }, [tab, directionsQuery.data, servicesQuery.data, fonctionsQuery.data]);

  const filtered = useMemo(() => {
    const term = normalize(q);
    if (!term) return current;
    return current.filter((it) => normalize(it.libelle).includes(term));
  }, [current, q]);

  const isLoading = directionsQuery.isLoading || servicesQuery.isLoading || fonctionsQuery.isLoading;
  const isError = directionsQuery.isError || servicesQuery.isError || fonctionsQuery.isError;

  const title = tab === "directions" ? "Directions" : tab === "services" ? "Services" : "Fonctions";

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
      console.error(err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err?.response?.data?.message || "Création impossible.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: number; libelle: string }) => {
      if (tab === "directions") return updateDirection(payload.id, { libelle: payload.libelle });
      if (tab === "services") return updateService(payload.id, { libelle: payload.libelle });
      return updateFonction(payload.id, { libelle: payload.libelle });
    },
    onSuccess: () => {
      toast({ title: "Modification réussie", description: "Élément mis à jour." });
      queryClient.invalidateQueries({ queryKey: [tab] });
      setOpenEdit(false);
      setSelected(null);
      setValue("");
    },
    onError: (err: any) => {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err?.response?.data?.message || "Modification impossible.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (tab === "directions") return deleteDirection(id);
      if (tab === "services") return deleteService(id);
      return deleteFonction(id);
    },
    onSuccess: () => {
      toast({ title: "Suppression réussie", description: "Élément supprimé." });
      queryClient.invalidateQueries({ queryKey: [tab] });
      setOpenDelete(false);
      setSelected(null);
    },
    onError: (err: any) => {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          err?.response?.data?.message ||
          "Suppression impossible (peut-être utilisé par des agents).",
      });
    },
  });

  function openCreateDialog() {
    setValue("");
    setSelected(null);
    setOpenCreate(true);
  }
  function openEditDialog(item: Item) {
    setSelected(item);
    setValue(item.libelle);
    setOpenEdit(true);
  }
  function openDeleteDialog(item: Item) {
    setSelected(item);
    setOpenDelete(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Paramètres
        </h1>
        <p className="text-muted-foreground mt-2">
          Configuration du système et préférences d'administration
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ✅ Profil administrateur réel */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil administrateur
            </CardTitle>
            <CardDescription>
              Informations du compte administrateur connecté (table admins)
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input
                value={adminForm.nom}
                onChange={(e) => {
                  setAdminFormTouched(true);
                  setAdminForm({ ...adminForm, nom: e.target.value });
                }}
                placeholder={adminQuery.isLoading ? "Chargement..." : "Nom"}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={adminForm.email}
                onChange={(e) => {
                  setAdminFormTouched(true);
                  setAdminForm({ ...adminForm, email: e.target.value });
                }}
                placeholder={adminQuery.isLoading ? "Chargement..." : "Email"}
              />
            </div>

            <div className="flex flex-col gap-2">
              {/* ✅ Bouton 1 : Profil */}
              <Button
                className="w-full bg-gradient-primary text-primary-foreground"
                disabled={updateProfileMutation.isPending || adminQuery.isLoading}
                onClick={() => {
                  if (!adminForm.nom.trim() || !adminForm.email.trim()) {
                    toast({
                      variant: "destructive",
                      title: "Champs incomplets",
                      description: "Nom et email sont obligatoires.",
                    });
                    return;
                  }
                  updateProfileMutation.mutate({
                    nom: adminForm.nom.trim(),
                    email: adminForm.email.trim(),
                  });
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProfileMutation.isPending ? "Sauvegarde..." : "Sauvegarder les modifications"}
              </Button>

              {/* ✅ Bouton 2 : Mot de passe */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setOpenPassword(true)}
                disabled={adminQuery.isLoading}
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Modifier le mot de passe
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configurer les alertes et notifications système
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Nouvelles demandes de congé</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir un email pour chaque nouvelle demande
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Missions en retard</Label>
                <p className="text-sm text-muted-foreground">
                  Alertes pour les missions dépassant leur échéance
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rapports hebdomadaires</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir un résumé d'activité chaque semaine
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ MODAL : CHANGEMENT MOT DE PASSE */}
      <Dialog open={openPassword} onOpenChange={setOpenPassword}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le mot de passe</DialogTitle>
            <DialogDescription>
              Saisis ton mot de passe actuel puis le nouveau mot de passe.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Mot de passe actuel</Label>
              <Input
                type="password"
                value={pwd.current_password}
                onChange={(e) => setPwd({ ...pwd, current_password: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <Input
                type="password"
                value={pwd.password}
                onChange={(e) => setPwd({ ...pwd, password: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Confirmer le nouveau mot de passe</Label>
              <Input
                type="password"
                value={pwd.password_confirmation}
                onChange={(e) => setPwd({ ...pwd, password_confirmation: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpenPassword(false);
                setPwd({ current_password: "", password: "", password_confirmation: "" });
              }}
            >
              Annuler
            </Button>

            <Button
              onClick={() => {
                if (!pwd.current_password || !pwd.password || !pwd.password_confirmation) {
                  toast({
                    variant: "destructive",
                    title: "Champs incomplets",
                    description: "Tous les champs sont obligatoires.",
                  });
                  return;
                }
                if (pwd.password !== pwd.password_confirmation) {
                  toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "La confirmation ne correspond pas.",
                  });
                  return;
                }
                updatePasswordMutation.mutate({
                  current_password: pwd.current_password,
                  password: pwd.password,
                  password_confirmation: pwd.password_confirmation,
                });
              }}
              disabled={updatePasswordMutation.isPending}
            >
              {updatePasswordMutation.isPending ? "Modification..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === ADMINISTRATION → RÉFÉRENTIELS === */}
      <Card className="shadow-soft">
        <CardHeader className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Administration — Référentiels
              </CardTitle>
              <CardDescription>
                Gérer les listes officielles utilisées dans les formulaires (agents, affectations, etc.).
              </CardDescription>
            </div>

            <div className="flex gap-2">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder={`Rechercher dans ${title.toLowerCase()}...`}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>

              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Ajouter
              </Button>
            </div>
          </div>

          <Tabs
            value={tab}
            onValueChange={(v) => {
              setTab(v as ResourceKey);
              setQ("");
            }}
          >
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="directions">Directions</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="fonctions">Fonctions</TabsTrigger>
            </TabsList>

            <TabsContent value={tab} className="mt-4">
              <CardContent className="p-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-muted-foreground">
                    <Badge variant="secondary">{title}</Badge>{" "}
                    • {filtered.length} affiché(s) / {current.length} total
                  </div>
                </div>

                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Chargement...</p>
                ) : isError ? (
                  <p className="text-sm text-red-500">
                    Erreur lors du chargement. Vérifie tes routes API et ton auth (token/cookie).
                  </p>
                ) : filtered.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun élément. Clique sur “Ajouter”.
                  </p>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Libellé</TableHead>
                          <TableHead className="w-[170px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((it) => (
                          <TableRow key={it.id} className="hover:bg-muted/40">
                            <TableCell className="font-medium">{it.libelle}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => openEditDialog(it)}
                                >
                                  <Edit className="w-4 h-4" />
                                  Modifier
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => openDeleteDialog(it)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Supprimer
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* CREATE */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter — {title}</DialogTitle>
            <DialogDescription>Crée un nouvel élément qui sera utilisé dans le système.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Libellé</Label>
            <Input
              placeholder="Ex: DSI, DRH, Support, Technicien..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenCreate(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => {
                if (!value.trim()) {
                  toast({
                    variant: "destructive",
                    title: "Champs incomplet",
                    description: "Le libellé est obligatoire.",
                  });
                  return;
                }
                createMutation.mutate({ libelle: value.trim() });
              }}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier — {title}</DialogTitle>
            <DialogDescription>Modification de l’élément sélectionné.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Libellé</Label>
            <Input value={value} onChange={(e) => setValue(e.target.value)} />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpenEdit(false);
                setSelected(null);
                setValue("");
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                if (!selected) return;
                if (!value.trim()) {
                  toast({
                    variant: "destructive",
                    title: "Champs incomplet",
                    description: "Le libellé est obligatoire.",
                  });
                  return;
                }
                updateMutation.mutate({ id: selected.id, libelle: value.trim() });
              }}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Supprimer — {title}</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Si cet élément est utilisé par des agents, la suppression peut échouer.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border p-3 bg-muted/20 text-sm">
            <span className="text-muted-foreground">Élément :</span>{" "}
            <span className="font-semibold">{selected?.libelle ?? "—"}</span>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpenDelete(false);
                setSelected(null);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!selected) return;
                deleteMutation.mutate(selected.id);
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
