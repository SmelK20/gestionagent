"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarDays,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { format } from "date-fns";

/* =====================
   TYPES
===================== */

interface RawConge {
  id: number;
  statut: string;
  date_debut: string;
  duree: number;
}

interface RawAgent {
  id: number;
  service_affectation?: string;
}

/* =====================
   COULEURS
===================== */

const PIE_COLORS = ["#16a34a", "#eab308", "#dc2626"];

export default function AdminDashboard() {
  const [rawConges, setRawConges] = useState<RawConge[]>([]);
  const [agents, setAgents] = useState<RawAgent[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* =====================
     FETCH
  ===================== */

  useEffect(() => {
    async function fetchAll() {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const congesRes = await fetch(
        "http://127.0.0.1:8000/api/admin/conges",
        { headers }
      );
      const agentsRes = await fetch(
        "http://127.0.0.1:8000/api/agents_nouveau",
        { headers }
      );

      const congesJson = await congesRes.json();
      const agentsJson = await agentsRes.json();

      const congesData = Array.isArray(congesJson)
        ? congesJson
        : congesJson.data || [];

      const agentsData = Array.isArray(agentsJson)
        ? agentsJson
        : agentsJson.data || [];

      setRawConges(congesData);
      setAgents(agentsData);
    }

    if (token) fetchAll();
  }, [token]);

  /* =====================
     NORMALISATION (CLÉ)
  ===================== */

  const conges = useMemo(() => {
    return rawConges.map((c) => ({
      id: c.id,
      statut: String(c.statut).toLowerCase(),
      date: c.date_debut,
      duree: Number(c.duree) || 0,
    }));
  }, [rawConges]);

  /* =====================
     KPI
  ===================== */

  const stats = useMemo(() => {
    const total = conges.length;

    const enAttente = conges.filter((c) =>
      c.statut.includes("attente")
    ).length;

    const approuves = conges.filter((c) =>
      c.statut.includes("approuv")
    ).length;

    const refuses = conges.filter((c) =>
      c.statut.includes("refus")
    ).length;

    const joursConsommes = conges
      .filter((c) => c.statut.includes("approuv"))
      .reduce((sum, c) => sum + c.duree, 0);

    return {
      enAttente,
      approuves,
      refuses,
      tauxRefus: total ? Math.round((refuses / total) * 100) : 0,
      joursConsommes,
      totalAgents: agents.length,
    };
  }, [conges, agents]);

  /* =====================
     GRAPH 1 : CONGÉS / MOIS
  ===================== */

  const congesParMois = useMemo(() => {
    const map: Record<string, number> = {};

    conges.forEach((c) => {
      if (!c.date) return;
      const d = new Date(c.date);
      if (isNaN(d.getTime())) return;

      const key = format(d, "MMM yyyy");
      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([mois, total]) => ({
      mois,
      total,
    }));
  }, [conges]);

  /* =====================
     GRAPH 2 : STATUT
  ===================== */

  const congesParStatut = [
    { name: "Approuvé", value: stats.approuves },
    { name: "En attente", value: stats.enAttente },
    { name: "Refusé", value: stats.refuses },
  ];

  /* =====================
     GRAPH 3 : AGENTS / SERVICE
  ===================== */

  const agentsParService = useMemo(() => {
    const map: Record<string, number> = {};

    agents.forEach((a) => {
      const s = a.service_affectation || "Non affecté";
      map[s] = (map[s] || 0) + 1;
    });

    return Object.entries(map).map(([service, total]) => ({
      service,
      total,
    }));
  }, [agents]);

  /* =====================
     RENDER
  ===================== */

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Dashboard RH</h1>
        <p className="text-muted-foreground">
          Vue globale des congés et des agents
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Kpi title="En attente" value={stats.enAttente} icon={<AlertCircle />} />
        <Kpi title="Approuvés" value={stats.approuves} icon={<CheckCircle />} />
        <Kpi title="Taux refus" value={`${stats.tauxRefus}%`} icon={<XCircle />} />
        <Kpi
          title="Jours consommés"
          value={`${stats.joursConsommes} j`}
          icon={<CalendarDays />}
        />
        <Kpi
          title="Agents"
          value={stats.totalAgents}
          icon={<Users />}
        />
      </div>

      {/* GRAPHIQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Congés par mois</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={congesParMois}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des congés</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={congesParStatut}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  label
                >
                  {congesParStatut.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Agents par service</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentsParService}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* =====================
   KPI CARD
===================== */

function Kpi({
  title,
  value,
  icon,
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-gradient-to-br from-slate-50 to-white">
      <CardHeader>
        <CardDescription className="uppercase text-xs">
          {title}
        </CardDescription>
        <CardTitle className="flex items-center gap-2 text-3xl">
          {icon} {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
