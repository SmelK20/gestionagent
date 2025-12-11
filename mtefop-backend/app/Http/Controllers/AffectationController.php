<?php

namespace App\Http\Controllers;

use App\Models\Affectation;
use App\Models\AgentNouveau; // <= adapte le namespace si besoin
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AffectationController extends Controller
{
    public function index()
    {
        $affectations = Affectation::with('agent')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($affectations);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'agent_id'         => ['required', 'exists:agents_nouveau,id'],
            'direction'        => ['required', 'string'],
            'service'          => ['required', 'string'],
            'fonction'         => ['required', 'string'],
            'date_affectation' => ['required'],

            'ancienne_direction'        => ['nullable', 'string'],
            'ancien_service'            => ['nullable', 'string'],
            'ancienne_fonction'         => ['nullable', 'string'],
            'ancienne_date_affectation' => ['nullable'],
        ]);

        return DB::transaction(function () use ($data) {
            // 1) On récupère l’agent actuel
            $agent = AgentNouveau::findOrFail($data['agent_id']);

            // 2) On crée l’affectation en utilisant les vraies anciennes valeurs
            $affectation = Affectation::create([
                'agent_id'                 => $agent->id,
                'ancienne_direction'       => $agent->direction,
                'ancien_service'           => $agent->service,
                'ancienne_fonction'        => $agent->fonction,
                'ancienne_date_affectation'=> null, // tu peux la mettre à jour plus tard si tu veux

                'direction'                => $data['direction'],
                'service'                  => $data['service'],
                'fonction'                 => $data['fonction'],
                'date_affectation'         => $data['date_affectation'],
            ]);

            // 3) On met à jour la fiche de l’agent avec la nouvelle affectation
            $agent->update([
                'direction' => $data['direction'],
                'service'   => $data['service'],
                'fonction'  => $data['fonction'],
            ]);

            return response()->json($affectation, 201);
        });
    }
}
