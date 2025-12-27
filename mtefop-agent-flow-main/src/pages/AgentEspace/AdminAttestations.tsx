import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Search, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AttestationRequest, getAdminAttestations, reviewAttestation } from "@/api";

function statusBadge(status: string) {
  if (status === "APPROUVEE") return <Badge className="bg-green-600">Approuvée</Badge>;
  if (status === "REFUSEE") return <Badge variant="destructive">Refusée</Badge>;
  return <Badge variant="secondary">En attente</Badge>;
}

export default function AdminAttestations() {
  const { toast } = useToast();
  const [rows, setRows] = useState<AttestationRequest[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AttestationRequest | null>(null);
  const [comment, setComment] = useState("");
  const [action, setAction] = useState<"APPROUVER" | "REFUSER">("APPROUVER");

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getAdminAttestations();
      setRows(data);
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les demandes." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, []);

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return rows;
    return rows.filter((r) => {
      const a: any = r.agent || {};
      return (
        r.request_number?.toLowerCase().includes(term) ||
        r.type?.toLowerCase().includes(term) ||
        a.nom?.toLowerCase().includes(term) ||
        a.prenom?.toLowerCase().includes(term) ||
        a.immatricule?.toLowerCase().includes(term)
      );
    });
  }, [rows, q]);

  const openReview = (r: AttestationRequest, nextAction: "APPROUVER" | "REFUSER") => {
    setSelected(r);
    setAction(nextAction);
    setComment("");
    setOpen(true);
  };

  const submit = async () => {
    if (!selected) return;
    try {
      const updated = await reviewAttestation(selected.id, { action, admin_comment: comment.trim() || undefined });
      setRows((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setOpen(false);
      toast({ title: "Traitement effectué", description: action === "APPROUVER" ? "Demande approuvée + PDF généré." : "Demande refusée." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Erreur", description: e?.response?.data?.message || "Action impossible." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Validation des attestations</h1>
          <p className="text-muted-foreground mt-2">Valide ou refuse les demandes. Un PDF est généré automatiquement si validé.</p>
        </div>

        <div className="flex gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input className="pl-9" placeholder="Rechercher (nom, immatricule, numéro...)" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" /> Actualiser
          </Button>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Demandes</CardTitle>
          <CardDescription>{filtered.length} demande(s)</CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune demande.</p>
          ) : (
            filtered.map((r) => {
              const a: any = r.agent || {};
              return (
                <div key={r.id} className="rounded-lg border p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{r.request_number}</span>
                      {statusBadge(r.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Agent: <span className="text-foreground">{a.prenom} {a.nom}</span> • Immatricule: {a.immatricule || "—"} • Type: {r.type}
                    </div>
                    {r.motif ? <div className="text-sm"><span className="font-medium">Motif:</span> <span className="text-muted-foreground">{r.motif}</span></div> : null}
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      className="gap-2"
                      disabled={r.status !== "EN_ATTENTE"}
                      onClick={() => openReview(r, "REFUSER")}
                    >
                      <XCircle className="h-4 w-4" /> Refuser
                    </Button>
                    <Button
                      className="gap-2"
                      disabled={r.status !== "EN_ATTENTE"}
                      onClick={() => openReview(r, "APPROUVER")}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Approuver
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{action === "APPROUVER" ? "Approuver la demande" : "Refuser la demande"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Commentaire (optionnel). Ex: pièce manquante, erreur d’informations..."
            />
            <p className="text-xs text-muted-foreground">
              Conseil : ajoute un commentaire clair surtout en cas de refus.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button variant={action === "REFUSER" ? "destructive" : "default"} onClick={submit}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
