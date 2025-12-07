<?php

namespace App\Http\Controllers;

use App\Models\Conge;
use Illuminate\Http\Request;

class CongeController extends Controller
{
    /**
     * 🔹 Liste des congés pour l'agent connecté
     */
    public function indexAgent(Request $request)
    {
        $agent = $request->user(); // Le guard est déjà 'agent'
        if (!$agent) {
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }

        $conges = Conge::where('agent_id', $agent->id)
            ->orderBy('date_debut', 'desc')
            ->get();

        return response()->json($conges);
    }

    /**
     * 🔹 Créer une demande de congé (agent)
     */
    public function store(Request $request)
    {
        $agent = $request->user();
        if (!$agent) {
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }

        $validated = $request->validate([
            'type' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'motif' => 'required|string',
            'remplacant' => 'nullable|string',
        ]);

        try {
            $duree = (strtotime($validated['date_fin']) - strtotime($validated['date_debut'])) / (60*60*24) + 1;

            $conge = Conge::create([
                'agent_id' => $agent->id,
                'type' => $validated['type'],
                'date_debut' => $validated['date_debut'],
                'date_fin' => $validated['date_fin'],
                'duree' => $duree,
                'motif' => $validated['motif'],
                'remplacant' => $validated['remplacant'] ?? null,
                'statut' => 'en_attente',
            ]);

            return response()->json($conge, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création du congé',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * 🔹 Liste des congés pour l'admin
     */
    public function indexAdmin()
    {
        $conges = Conge::with('agent')
            ->orderBy('date_debut', 'desc')
            ->get();

        return response()->json($conges);
    }

    /**
     * 🔹 Approuver ou refuser un congé (admin)
     */
    public function updateStatut(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:approuve,refuse',
        ]);

        $conge = Conge::findOrFail($id);
        $conge->update(['statut' => $request->statut]);

        return response()->json($conge);
    }
}
