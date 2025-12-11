import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpCircle, Shuffle, UserCircle2, Building2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAgentsNouveau, getAffectations, createAffectation } from "@/api";
import { useToast } from "@/hooks/use-toast";

export default function Carrieres() {
  const [activeTab, setActiveTab] = useState("affectations");
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);

  const [showAffectationForm, setShowAffectationForm] = useState(false);
  const [showPromotionForm, setShowPromotionForm] = useState(false);

  const [newDirection, setNewDirection] = useState("");
  const [newService, setNewService] = useState("");
  const [newFonction, setNewFonction] = useState("");
  const [affectationDate, setAffectationDate] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Agents
  const {
    data: agents,
    isLoading: isLoadingAgents,
    error: agentsError,
  } = useQuery({
    queryKey: ["agents_nouveau"],
    queryFn: getAgentsNouveau,
  });

  // Affectations (historique)
  const {
    data: affectations,
    isLoading: isLoadingAffectations,
  } = useQuery({
    queryKey: ["affectations"],
    queryFn: getAffectations,
  });

  const selectedAgent = agents?.find((a: any) => a.id === selectedAgentId);

  const createAffectationMutation = useMutation({
    mutationFn: createAffectation,
    onSuccess: () => {
      toast({
        title: "Affectation enregistrée",
        description: "La fiche de l’agent a été mise à jour.",
      });
      queryClient.invalidateQueries({ queryKey: ["affectations"] });
      queryClient.invalidateQueries({ queryKey: ["agents_nouveau"] });

      setNewDirection("");
      setNewService("");
      setNewFonction("");
      setAffectationDate("");
      setShowAffectationForm(false);
      setSelectedAgentId(null);
    },
    onError: (error: any) => {
      console.error("Erreur création affectation:", error?.response?.data || error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          error?.response?.data?.message ||
          "Impossible d’enregistrer l’affectation.",
      });
    },
  });

  const handleSaveAffectation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentId || !newDirection || !newService || !newFonction || !affectationDate) {
      toast({
        variant: "destructive",
        title: "Champs incomplets",
        description: "Sélectionne un agent et remplis tous les champs obligatoires.",
      });
      return;
    }

    const agent = agents?.find((a: any) => a.id === selectedAgentId);
    if (!agent) return;

    createAffectationMutation.mutate({
      agent_id: agent.id,
      ancienne_direction: agent.direction ?? null,
      ancienne_service: agent.service ?? null,
      ancienne_fonction: agent.fonction ?? null,
      direction: newDirection,
      service: newService,
      fonction: newFonction,
      date_affectation: affectationDate,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Carrières</h1>
          <p className="text-sm text-muted-foreground">
            Suivi des affectations et promotions des agents du MTEFOP.
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="affectations"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setShowAffectationForm(false);
          setShowPromotionForm(false);
        }}
      >
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="affectations">Affectations</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>

        {/* === AFFECTATIONS === */}
        <TabsContent value="affectations" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Colonne gauche : formulaire */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shuffle className="w-4 h-4" />
                    Nouvelle affectation
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Modifier le service ou la fonction d’un agent en gardant l’historique.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={showAffectationForm ? "outline" : "default"}
                  onClick={() => setShowAffectationForm((prev) => !prev)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {showAffectationForm ? "Fermer" : "Nouvelle"}
                </Button>
              </CardHeader>

              <CardContent>
                {isLoadingAgents && (
                  <p className="text-sm text-muted-foreground">
                    Chargement des agents...
                  </p>
                )}

                {agentsError && (
                  <p className="text-sm text-red-500">
                    Erreur lors du chargement des agents.
                  </p>
                )}

                {showAffectationForm && (
                  <form
                    className="space-y-4 mt-2"
                    onSubmit={handleSaveAffectation}
                  >
                    {/* Agent + situation actuelle */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Agent</label>
                      <select
                        className="input w-full rounded-md border px-3 py-2 text-sm"
                        value={selectedAgentId || ""}
                        onChange={(e) =>
                          setSelectedAgentId(
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                      >
                        <option value="">Sélectionnez un agent</option>
                        {agents?.map((agent: any) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.nom} {agent.prenom}
                          </option>
                        ))}
                      </select>

                      {selectedAgent && (
                        <div className="rounded-md bg-slate-50 border px-3 py-2 text-xs text-slate-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <UserCircle2 className="w-4 h-4" />
                            <span className="font-medium">
                              {selectedAgent.nom} {selectedAgent.prenom}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-[11px] mt-1">
                            <span>
                              <span className="font-semibold">Direction :</span>{" "}
                              {selectedAgent.direction || "—"}
                            </span>
                            <span>
                              <span className="font-semibold">Service :</span>{" "}
                              {selectedAgent.service || "—"}
                            </span>
                            <span>
                              <span className="font-semibold">Fonction :</span>{" "}
                              {selectedAgent.fonction || "—"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Nouvelles infos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">
                          Nouvelle direction
                        </label>
                        <input
                          type="text"
                          className="input w-full rounded-md border px-3 py-2 text-sm"
                          placeholder="Ex : DSI, DRH..."
                          value={newDirection}
                          onChange={(e) => setNewDirection(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">
                          Nouveau service
                        </label>
                        <input
                          type="text"
                          className="input w-full rounded-md border px-3 py-2 text-sm"
                          placeholder="Ex : Support, Développement..."
                          value={newService}
                          onChange={(e) => setNewService(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">
                          Nouvelle fonction
                        </label>
                        <input
                          type="text"
                          className="input w-full rounded-md border px-3 py-2 text-sm"
                          placeholder="Ex : Technicien, Chef de service..."
                          value={newFonction}
                          onChange={(e) => setNewFonction(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">
                          Date d’affectation
                        </label>
                        <input
                          type="date"
                          className="input w-full rounded-md border px-3 py-2 text-sm"
                          value={affectationDate}
                          onChange={(e) => setAffectationDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        type="submit"
                        disabled={createAffectationMutation.isPending}
                      >
                        {createAffectationMutation.isPending
                          ? "Enregistrement..."
                          : "Enregistrer l’affectation"}
                      </Button>
                    </div>
                  </form>
                )}

                {!showAffectationForm && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Clique sur “Nouvelle” pour créer une affectation.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Colonne droite : historique */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="w-4 h-4" />
                  Historique des affectations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[460px] overflow-y-auto">
                {isLoadingAffectations ? (
                  <p className="text-sm text-muted-foreground">
                    Chargement de l’historique...
                  </p>
                ) : !affectations || affectations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucune affectation enregistrée pour le moment.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {affectations.map((aff: any) => (
                      <div
                        key={aff.id}
                        className="flex flex-col gap-1 border-b pb-2 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            {aff.agent
                              ? `${aff.agent.nom} ${aff.agent.prenom}`
                              : "Agent inconnu"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Date : {aff.date_affectation}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-semibold">Avant :</span>{" "}
                          direction : {aff.ancienne_direction || "—"} /
                          {" "}service : {aff.ancien_service || "—"} /
                          {" "}fonction : {aff.ancienne_fonction || "—"}
                        </div>
                        <div className="text-xs">
                          <span className="font-semibold">Après :</span>{" "}
                          direction :{" "}
                          <span className="font-semibold text-primary">
                            {aff.direction}
                          </span>
                          {" "} / service :{" "}
                          <span className="font-semibold text-primary">
                            {aff.service}
                          </span>
                          {" "} / fonction :{" "}
                          <span className="font-semibold text-primary">
                            {aff.fonction}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* === PROMOTIONS === */}
        <TabsContent value="promotions" className="mt-4">
          {/* Tu pourras appliquer la même logique ici plus tard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ArrowUpCircle className="w-4 h-4" />
                Promotions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Module de gestion des promotions à implémenter.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
