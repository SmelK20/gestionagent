<?php

namespace App\Http\Controllers;

use App\Models\Affectation;
use Illuminate\Http\Request;

class AffectationController extends Controller
{
    public function index()
    {
        return Affectation::with('agent')->orderBy('date_affectation','desc')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'agent_id' => 'required|exists:agents,id',
            'ancienne_direction' => 'nullable|string',
            'ancienne_service' => 'nullable|string',
            'ancienne_fonction' => 'nullable|string',
            'nouvelle_direction' => 'required|string',
            'nouveau_service' => 'required|string',
            'nouvelle_fonction' => 'required|string',
            'date_affectation' => 'required|date',
        ]);

        $affectation = Affectation::create($data);

        return response()->json($affectation, 201);
    }
}
