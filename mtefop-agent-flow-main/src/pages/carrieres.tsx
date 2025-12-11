import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpCircle, Shuffle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAgentsNouveau, getAffectations, createAffectation } from "@/api";
import { useToast } from "@/hooks/use-toast";

export default function Carrieres() {
  const [activeTab, setActiveTab] = useState("affectations");
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);

  // États pour afficher / cacher les formulaires
  const [showAffectationForm, setShowAffectationForm] = useState(false);
  const [showPromotionForm, setShowPromotionForm] = useState(false);

  // États pour les nouvelles infos d'affectation
  const [newDirection, setNewDirection] = useState("");
  const [newService, setNewService] = useState("");
  const [newFonction, setNewFonction] = useState("");
  const [affectationDate, setAffectationDate] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupération des agents (agents_nouveau)
  const {
    data: agents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agents_nouveau"],
    queryFn: getAgentsNouveau,
  });

  // Récupération des affectations pour l'historique
  const { data: affectations } = useQuery({
    queryKey: ["affectations"],
    queryFn: getAffectations,
  });

  const selectedAgent = agents?.find((a: any) => a.id === selectedAgentId);

  // Mutation pour créer une nouvelle affectation
  const createAffectationMutation = useMutation({
    mutationFn: createAffectation,
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Affectation enregistrée avec succès.",
      });
      // On recharge l'historique
      queryClient.invalidateQueries({ queryKey: ["affectations"] });
      // Reset du formulaire
      setNewDirection("");
      setNewService("");
      setNewFonction("");
      setAffectationDate("");
      setShowAffectationForm(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d’enregistrer l’affectation.",
      });
    },
  });

  const handleSaveAffectation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent || !newDirection || !newService || !newFonction || !affectationDate) {
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    createAffectationMutation.mutate({
      agent_id: selectedAgent.id,
      ancienne_direction: selectedAgent.direction ?? null,
      ancien_service: selectedAgent.service ?? null,
      ancienne_fonction: selectedAgent.fonction ?? null,
      direction: newDirection,
      service: newService,
      fonction: newFonction,
      date_affectation: affectationDate,
      // ancienne_date_affectation: ... (optionnel, tu peux le gérer si tu veux)
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Carrières</h1>

      <Tabs
        defaultValue="affectations"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          // On évite que le même booléen contrôle les deux formulaires
          setShowAffectationForm(false);
          setShowPromotionForm(false);
        }}
      >
        <TabsList className="grid grid-cols-2 w-full lg:w-1/2 mb-6">
          <TabsTrigger value="affectations">Affectations</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>

        {/* --- AFFECTATIONS --- */}
        <TabsContent value="affectations">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Shuffle size={18} /> Affectations
                </h2>
                <Button
                  onClick={() => setShowAffectationForm((prev) => !prev)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} /> Nouvelle affectation
                </Button>
              </div>

              {isLoading && (
                <div className="text-sm text-muted-foreground">
                  Chargement des agents...
                </div>
              )}

              {error && (
                <div className="text-sm text-red-500">
                  Erreur lors du chargement des agents.
                </div>
              )}

              {showAffectationForm && (
                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
                  onSubmit={handleSaveAffectation}
                >
                  {/* Sélection de l'agent */}
                  <div>
                    <label className="text-sm font-medium">Agent</label>
                    <select
                      className="input"
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
                  </div>

                  {/* Infos existantes */}
                  {selectedAgent && (
                    <>
                      <div>
                        <label className="text-sm font-medium">
                          Direction actuelle
                        </label>
                        <input
                          type="text"
                          className="input"
                          value={selectedAgent.direction || ""}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Service actuel
                        </label>
                        <input
                          type="text"
                          className="input"
                          value={selectedAgent.service || ""}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Fonction actuelle
                        </label>
                        <input
                          type="text"
                          className="input"
                          value={selectedAgent.fonction || ""}
                          readOnly
                        />
                      </div>
                    </>
                  )}

                  {/* Nouvelles informations */}
                  <div>
                    <label className="text-sm font-medium">
                      Nouvelle direction
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Nouvelle direction"
                      value={newDirection}
                      onChange={(e) => setNewDirection(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Nouveau service
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Nouveau service"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Nouvelle fonction
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Nouvelle fonction"
                      value={newFonction}
                      onChange={(e) => setNewFonction(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Date d’affectation
                    </label>
                    <input
                      type="date"
                      className="input"
                      value={affectationDate}
                      onChange={(e) => setAffectationDate(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end mt-2">
                    <Button type="submit" disabled={createAffectationMutation.isPending}>
                      {createAffectationMutation.isPending
                        ? "Enregistrement..."
                        : "Enregistrer"}
                    </Button>
                  </div>
                </form>
              )}

              {/* Historique des affectations */}
              <div className="border rounded-lg p-4 mt-4 text-sm">
                <h3 className="font-semibold mb-2">Historique des affectations</h3>
                {!affectations || affectations.length === 0 ? (
                  <p className="text-muted-foreground">
                    Aucun historique d’affectation pour le moment.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {affectations.map((aff: any) => (
                      <div
                        key={aff.id}
                        className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-2 last:border-b-0 last:pb-0"
                      >
                        <div>
                          <div className="font-medium">
                            {aff.agent?.nom} {aff.agent?.prenom}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {aff.ancienne_direction || "—"} /{" "}
                            {aff.ancien_service || "—"} /{" "}
                            {aff.ancienne_fonction || "—"} →{" "}
                            <strong>
                              {aff.direction} / {aff.service} / {aff.fonction}
                            </strong>
                          </div>
                        </div>
                        <div className="text-xs mt-1 md:mt-0 text-muted-foreground">
                          Date : {aff.date_affectation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- PROMOTIONS --- (inchangé, juste showPromotionForm) */}
        <TabsContent value="promotions">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ArrowUpCircle size={18} /> Promotions
                </h2>
                <Button
                  onClick={() => setShowPromotionForm((prev) => !prev)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} /> Nouvelle promotion
                </Button>
              </div>

              {showPromotionForm && (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Tu pourras brancher ce formulaire plus tard comme pour les affectations */}
                  <div>
                    <label className="text-sm font-medium">Agent</label>
                    <select
                      className="input"
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
                  </div>

                  {selectedAgent && (
                    <div>
                      <label className="text-sm font-medium">
                        Grade actuel
                      </label>
                      <input
                        type="text"
                        className="input"
                        value={selectedAgent.grade || ""}
                        readOnly
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium">Nouveau grade</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Nouveau grade"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Date de promotion
                    </label>
                    <input type="date" className="input" />
                  </div>
                  <div className="md:col-span-2 flex justify-end mt-2">
                    <Button>Enregistrer</Button>
                  </div>
                </form>
              )}

              <div className="border rounded-lg p-4 mt-4 text-sm text-muted-foreground">
                Historique des promotions ici...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
