<?php

namespace App\Http\Controllers;

use App\Models\Mission;
use Illuminate\Http\Request;

class MissionController extends Controller
{
    public function index()
    {
        return response()->json(Mission::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date',
            'lieu' => 'nullable|string|max:255',
            'statut' => 'nullable|string|max:50',
            'rapport' => 'nullable|string',
            'cree_par' => 'nullable|string|max:255',
            'service_id' => 'nullable|integer',
            'direction_id' => 'nullable|integer',
        ]);

        $mission = Mission::create($validated);
        return response()->json($mission, 201);
    }

    public function show($id)
    {
        return response()->json(Mission::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $mission = Mission::findOrFail($id);
        $mission->update($request->all());
        return response()->json($mission);
    }

    public function destroy($id)
    {
        Mission::destroy($id);
        return response()->json(['message' => 'Mission supprimée']);
    }
}
