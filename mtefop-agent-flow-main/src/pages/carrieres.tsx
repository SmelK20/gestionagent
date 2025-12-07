import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpCircle, Shuffle } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function Carrieres() {
  const [activeTab, setActiveTab] = useState("affectations");
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Récupération des agents
  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/agents");
      return res.data;
    },
  });

  // Récupération des infos de l'agent sélectionné
  const selectedAgent = agents?.find((a: any) => a.id === selectedAgentId);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Carrières</h1>

      <Tabs defaultValue="affectations" onValueChange={setActiveTab}>
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
                <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
                  <Plus size={16} /> Nouvelle affectation
                </Button>
              </div>

              {showForm && (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Sélection de l'agent */}
                  <div>
                    <label className="text-sm font-medium">Agent</label>
                    <select
                      className="input"
                      value={selectedAgentId || ""}
                      onChange={(e) => setSelectedAgentId(Number(e.target.value))}
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
                        <label className="text-sm font-medium">Direction actuelle</label>
                        <input type="text" className="input" value={selectedAgent.direction} readOnly />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Service actuel</label>
                        <input type="text" className="input" value={selectedAgent.service} readOnly />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Fonction actuelle</label>
                        <input type="text" className="input" value={selectedAgent.fonction} readOnly />
                      </div>
                    </>
                  )}

                  {/* Nouvelles informations */}
                  <div>
                    <label className="text-sm font-medium">Nouvelle direction</label>
                    <input type="text" className="input" placeholder="Nouvelle direction" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nouveau service</label>
                    <input type="text" className="input" placeholder="Nouveau service" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nouvelle fonction</label>
                    <input type="text" className="input" placeholder="Nouvelle fonction" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date d’affectation</label>
                    <input type="date" className="input" />
                  </div>
                  <div className="md:col-span-2 flex justify-end mt-2">
                    <Button>Enregistrer</Button>
                  </div>
                </form>
              )}

              <div className="border rounded-lg p-4 mt-4 text-sm text-muted-foreground">
                Historique des affectations ici...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- PROMOTIONS --- */}
        <TabsContent value="promotions">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ArrowUpCircle size={18} /> Promotions
                </h2>
                <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
                  <Plus size={16} /> Nouvelle promotion
                </Button>
              </div>

              {showForm && (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">Agent</label>
                    <select
                      className="input"
                      value={selectedAgentId || ""}
                      onChange={(e) => setSelectedAgentId(Number(e.target.value))}
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
                    <>
                      <div>
                        <label className="text-sm font-medium">Grade actuel</label>
                        <input type="text" className="input" value={selectedAgent.grade} readOnly />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-sm font-medium">Nouveau grade</label>
                    <input type="text" className="input" placeholder="Nouveau grade" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date de promotion</label>
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
