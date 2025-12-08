<?php

namespace App\Http\Controllers;

use App\Models\AgentNouveau;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\AgentWelcomeMail;

class AgentNouveauController extends Controller
{
    /**
     * Lister tous les agents
     */
    public function index()
    {
        return response()->json(AgentNouveau::all());
    }

    /**
     * Créer un nouvel agent
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'immatricule' => 'required|string|max:255|unique:agents_nouveau,immatricule',
                'cin' => 'nullable|string|max:20',
                'nom' => 'required|string|max:100',
                'prenom' => 'required|string|max:100',
                'date_naissance' => 'nullable|date',
                'adresse' => 'nullable|string|max:255',
                'situation_matrimoniale' => 'nullable|string|max:50',
                'sexe' => 'nullable|string|max:10',
                'email' => 'nullable|email|max:150|unique:agents_nouveau,email',
                'telephone' => 'nullable|string|max:30',
                'corps' => 'nullable|string|max:100',
                'grade' => 'nullable|string|max:100',
                'categorie' => 'nullable|string|max:50',
                'diplome' => 'nullable|string|max:150',
                'specialisation' => 'nullable|string|max:150',
                'service_affectation' => 'nullable|string|max:150',
                'date_affectation' => 'nullable|date',
                'direction' => 'nullable|string|max:150',
                'service' => 'nullable|string|max:150',
                'fonction' => 'nullable|string|max:150',
            ]);

            $validated['ministere'] = 'MTEFOP';

            // Génération du mot de passe
            $plainPassword = Str::random(12);
            $validated['mot_de_passe'] = $plainPassword;

            // Création de l'agent
            $agent = AgentNouveau::create($validated);

            // Envoi du mail si email fourni
            if (!empty($agent->email)) {
                Mail::to($agent->email)->send(new AgentWelcomeMail($agent, $plainPassword));
            }

            return response()->json([
                'message' => 'Agent créé avec succès',
                'agent' => $agent
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'validation_error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la création de l’agent',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un agent précis
     */
    public function show($id)
    {
        $agent = AgentNouveau::findOrFail($id);
        return response()->json($agent);
    }

    /**
     * Mettre à jour un agent
     */
    public function update(Request $request, $id)
    {
        $agent = AgentNouveau::findOrFail($id);

        $validated = $request->validate([
            'immatricule' => 'sometimes|string|max:255|unique:agents_nouveau,immatricule,' . $id,
            'cin' => 'nullable|string|max:20',
            'nom' => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'date_naissance' => 'nullable|date',
            'adresse' => 'nullable|string|max:255',
            'situation_matrimoniale' => 'nullable|string|max:50',
            'sexe' => 'nullable|string|max:10',
            'email' => 'nullable|email|max:150|unique:agents_nouveau,email,' . $id,
            'telephone' => 'nullable|string|max:30',
            'corps' => 'nullable|string|max:100',
            'grade' => 'nullable|string|max:100',
            'categorie' => 'nullable|string|max:50',
            'diplome' => 'nullable|string|max:150',
            'specialisation' => 'nullable|string|max:150',
            'service_affectation' => 'nullable|string|max:150',
            'date_affectation' => 'nullable|date',
            'direction' => 'nullable|string|max:150',
            'service' => 'nullable|string|max:150',
            'fonction' => 'nullable|string|max:150',
        ]);

        $validated['ministere'] = 'MTEFOP';

        $agent->update($validated);

        return response()->json($agent);
    }

    /**
     * Supprimer un agent
     */
    public function destroy($id)
    {
        AgentNouveau::destroy($id);
        return response()->json(['message' => 'Agent supprimé avec succès']);
    }
}
