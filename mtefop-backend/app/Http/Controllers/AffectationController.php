<?php

namespace App\Http\Controllers;

use App\Models\Affectation;
use Illuminate\Http\Request;

class AffectationController extends Controller
{
    public function index()
    {
        // On charge l'agent lié pour l'historique
        // et on évite tout accès à une colonne qui n'existe pas
        $affectations = Affectation::with('agent')
            ->orderBy('date_affectation', 'desc')
            ->get();

        return response()->json($affectations);
    }

    public function store(Request $request)
    {
        // 🔍 Validation simple et alignée avec ce qu'envoie le front
        $data = $request->validate([
            'agent_id'          => ['required', 'exists:agents_nouveau,id'],
            'direction'         => ['required', 'string'],
            'service'           => ['required', 'string'],
            'fonction'          => ['required', 'string'],
            'date_affectation'  => ['required', 'date'],

            // Ces champs sont optionnels
            'ancienne_direction'        => ['nullable', 'string'],
            'ancien_service'            => ['nullable', 'string'],
            'ancienne_fonction'         => ['nullable', 'string'],
            'ancienne_date_affectation' => ['nullable', 'date'],
        ]);

        $affectation = Affectation::create($data);

        return response()->json($affectation, 201);
    }
}
