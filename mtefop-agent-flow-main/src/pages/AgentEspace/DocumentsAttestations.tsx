import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Download, Plus, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AttestationRequest,
  createAttestation,
  downloadAttestation,
  getMyAttestations,
} from "@/api";

const TYPES = [
  { value: "ATTESTATION_DE_TRAVAIL", label: "Attestation de travail" },
  { value: "ATTESTATION_DE_PRESENCE", label: "Attestation de présence" },
  { value: "ATTESTATION_DE_SALAIRE", label: "Attestation (sur demande)" },
];

function statusBadge(status: string) {
  if (status === "APPROUVEE") return <Badge className="bg-green-600">Approuvée</Badge>;
  if (status === "REFUSEE") return <Badge variant="destructive">Refusée</Badge>;
  return <Badge variant="secondary">En attente</Badge>;
}

export default function DocumentsAttestations() {
  const { toast } = useToast();
  const [rows, setRows] = useState<AttestationRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [type, setType] = useState(TYPES[0].value);
  const [motif, setMotif] = useState("");

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getMyAttestations();
      setRows(data);
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger tes demandes." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => b.id - a.id);
  }, [rows]);

  const handleCreate = async () => {
    try {
      const created = await createAttestation({ type, motif: motif.trim() || undefined });
      setRows((prev) => [created, ...prev]);
      setOpen(false);
      setMotif("");
      setType(TYPES[0].value);
      toast({ title: "Demande envoyée", description: "Ton attestation est en attente de validation." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Erreur", description: e?.response?.data?.message || "Création impossible." });
    }
  };

  const handleDownload = async (row: AttestationRequest) => {
    try {
      const blob = await downloadAttestation(row.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${row.request_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur", description: "Téléchargement impossible." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Attestations</h1>
          <p className="text-muted-foreground mt-2">
            Fais une demande, suis le statut, et télécharge ton attestation après validation.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button className="bg-gradient-primary" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Mes demandes</CardTitle>
          <CardDescription>{sorted.length} demande(s)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune demande pour le moment.</p>
          ) : (
            <div className="space-y-2">
              {sorted.map((r) => (
                <div key={r.id} className="rounded-lg border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{r.request_number}</span>
                      {statusBadge(r.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Type: <span className="text-foreground">{r.type}</span>{" "}
                      • Créée: {new Date(r.created_at).toLocaleString()}
                    </div>
                    {r.admin_comment ? (
                      <div className="text-sm">
                        <span className="font-medium">Commentaire admin:</span>{" "}
                        <span className="text-muted-foreground">{r.admin_comment}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      disabled={r.status !== "APPROUVEE"}
                      onClick={() => handleDownload(r)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog création */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouvelle demande d’attestation</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <select
                className="w-full border rounded-md p-2 bg-background"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Motif (optionnel)</Label>
              <Textarea
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                placeholder="Ex: Dossier administratif, banque, concours..."
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={handleCreate}>Envoyer la demande</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
