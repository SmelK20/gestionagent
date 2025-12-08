<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    /**
     * Middleware pour protéger les routes.
     */
    public function __construct()
    {
        // Toutes les routes nécessitent l'authentification Sanctum
        $this->middleware('auth:sanctum')->except([]);
    }

    /**
     * Retourne le profil complet de l'agent connecté.
     */
    public function profile(Request $request)
    {
        $agent = $request->user();

        if (!$agent) {
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }

        return response()->json([
            'id' => $agent->id,
            'immatricule' => $agent->immatricule,
            'cin' => $agent->cin,
            'nom' => $agent->nom,
            'prenom' => $agent->prenom,
            'email' => $agent->email,
            'telephone' => $agent->telephone,
            'adresse' => $agent->adresse,
            'date_naissance' => $agent->date_naissance,
            'situation_matrimoniale' => $agent->situation_matrimoniale,
            'sexe' => $agent->sexe,
            'corps' => $agent->corps,
            'grade' => $agent->grade,
            'categorie' => $agent->categorie,
            'diplome' => $agent->diplome,
            'specialisation' => $agent->specialisation,
            'service_affectation' => $agent->service_affectation,
            'date_affectation' => $agent->date_affectation,
            'ministere' => $agent->ministere,
            'direction' => $agent->direction,
            'service' => $agent->service,
            'fonction' => $agent->fonction,
        ]);
    }

    /**
     * Lister tous les agents.
     */
    public function index()
    {
        return response()->json(Agent::all());
    }

    /**
     * Créer un nouvel agent.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'immatricule' => 'required|string|max:255|unique:agents,immatricule',
            'cin' => 'nullable|string|max:20',
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'email' => 'required|email|unique:agents,email',
            'telephone' => 'nullable|string|max:30',
            'adresse' => 'nullable|string|max:255',
            'date_naissance' => 'nullable|date',
            'situation_matrimoniale' => 'nullable|string|max:50',
            'sexe' => 'nullable|string|max:10',
            'corps' => 'nullable|string|max:100',
            'grade' => 'nullable|string|max:100',
            'categorie' => 'nullable|string|max:50',
            'diplome' => 'nullable|string|max:150',
            'specialisation' => 'nullable|string|max:150',
            'service_affectation' => 'nullable|string|max:150',
            'date_affectation' => 'nullable|date',
            'ministere' => 'nullable|string|max:150',
            'direction' => 'nullable|string|max:150',
            'service' => 'nullable|string|max:150',
            'fonction' => 'nullable|string|max:150',
        ]);

        $agent = Agent::create($validated);

        return response()->json($agent, 201);
    }

    /**
     * Afficher un agent précis.
     */
    public function show($id)
    {
        $agent = Agent::find($id);

        if (!$agent) {
            return response()->json(['message' => 'Agent non trouvé'], 404);
        }

        return response()->json($agent);
    }

    /**
     * Mettre à jour un agent.
     */
    public function update(Request $request, $id)
    {
        $agent = Agent::find($id);

        if (!$agent) {
            return response()->json(['message' => 'Agent non trouvé'], 404);
        }

        $validated = $request->validate([
            'immatricule' => 'sometimes|string|max:255|unique:agents,immatricule,' . $id,
            'cin' => 'nullable|string|max:20',
            'nom' => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:agents,email,' . $id,
            'telephone' => 'nullable|string|max:30',
            'adresse' => 'nullable|string|max:255',
            'date_naissance' => 'nullable|date',
            'situation_matrimoniale' => 'nullable|string|max:50',
            'sexe' => 'nullable|string|max:10',
            'corps' => 'nullable|string|max:100',
            'grade' => 'nullable|string|max:100',
            'categorie' => 'nullable|string|max:50',
            'diplome' => 'nullable|string|max:150',
            'specialisation' => 'nullable|string|max:150',
            'service_affectation' => 'nullable|string|max:150',
            'date_affectation' => 'nullable|date',
            'ministere' => 'nullable|string|max:150',
            'direction' => 'nullable|string|max:150',
            'service' => 'nullable|string|max:150',
            'fonction' => 'nullable|string|max:150',
        ]);

        $agent->update($validated);

        return response()->json($agent);
    }

    /**
     * Supprimer un agent.
     */
    public function destroy($id)
    {
        $agent = Agent::find($id);

        if (!$agent) {
            return response()->json(['message' => 'Agent non trouvé'], 404);
        }

        $agent->delete();

        return response()->json(['message' => 'Agent supprimé avec succès']);
    }
}
