<?php

namespace App\Http\Controllers;

use App\Models\Fonction;
use Illuminate\Http\Request;

class FonctionController extends Controller
{
    public function index() {
        return Fonction::all();
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'nom' => 'required|string',
            'description' => 'nullable|string'
        ]);
        return Fonction::create($validated);
    }

    public function update(Request $request, Fonction $fonction) {
        $fonction->update($request->only('nom', 'description'));
        return $fonction;
    }

    public function destroy(Fonction $fonction) {
        $fonction->delete();
        return response()->json(['message' => 'Fonction supprimée']);
    }
}
