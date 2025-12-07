<?php

namespace App\Http\Controllers;

use App\Models\Presence;
use App\Models\AgentNouveau;
use Illuminate\Http\Request;

class PresenceController extends Controller
{
    // ✅ Liste des présences (admin)
    public function index()
    {
        $presences = Presence::with('agent')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($presences);
    }

    // ✅ Liste des présences d’un agent connecté
    public function indexAgent(Request $request)
    {
        $agent = $request->user();
        $presences = Presence::where('agent_id', $agent->id)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($presences);
    }

    // ✅ Système de pointage intelligent (Check-in / Check-out)
    public function store(Request $request)
    {
        $agent = $request->user();

        // 🔹 Vérifie que l’agent existe dans agents_nouveau
        $agentRecord = AgentNouveau::find($agent->id);
        if (!$agentRecord) {
            return response()->json(['message' => 'Agent non trouvé dans la base.'], 404);
        }

        $today = now()->toDateString();

        // 🔹 Recherche une présence déjà enregistrée aujourd’hui
        $presence = Presence::where('agent_id', $agent->id)
            ->where('date', $today)
            ->first();

        // 1️⃣ Si aucune présence → création = pointage d'arrivée
        if (!$presence) {
            $presence = Presence::create([
                'agent_id' => $agent->id,
                'date' => $today,
                'statut' => now()->format('H:i') > '08:00' ? 'retard' : 'present',
                'heure_arrivee' => now()->format('H:i'),
            ]);

            return response()->json([
                'message' => '✅ Heure d’arrivée enregistrée avec succès.',
                'presence' => $presence,
            ], 201);
        }

        // 2️⃣ Si présence existe mais pas encore d’heure de départ → pointage départ
        if ($presence->heure_depart === null) {
            $presence->update([
                'heure_depart' => now()->format('H:i'),
            ]);

            return response()->json([
                'message' => '🏁 Heure de départ enregistrée avec succès.',
                'presence' => $presence,
            ]);
        }

        // 3️⃣ Si déjà pointé arrivée + départ → refus d’un 3e pointage
        return response()->json([
            'message' => '⚠️ Pointage déjà complété pour aujourd’hui.',
        ], 409);
    }

    // ✅ Mise à jour (admin)
    public function update(Request $request, $id)
    {
        $presence = Presence::findOrFail($id);
        $presence->update($request->only(['statut', 'heure_arrivee', 'heure_depart', 'motif']));
        return response()->json($presence);
    }

    // ✅ Mise à jour (agent pour heure de départ)
    public function updateAgent(Request $request, $id)
    {
        $agent = $request->user();

        // Vérifie que la présence appartient à cet agent
        $presence = Presence::where('id', $id)
                            ->where('agent_id', $agent->id)
                            ->firstOrFail();

        $validated = $request->validate([
            'heure_depart' => 'required|date_format:H:i',
        ]);

        $presence->update([
            'heure_depart' => $validated['heure_depart'],
        ]);

        return response()->json($presence);
    }

    // ✅ Suppression (admin)
    public function destroy($id)
    {
        Presence::destroy($id);
        return response()->json(['message' => 'Présence supprimée avec succès']);
    }
}
