<?php

namespace App\Http\Controllers;

use App\Models\Direction;
use Illuminate\Http\Request;

class DirectionController extends Controller
{
    public function index() {
        return Direction::with('ministere')->get();
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'nom' => 'required|string',
            'ministere_id' => 'required|exists:ministeres,id'
        ]);
        return Direction::create($validated);
    }

    public function update(Request $request, Direction $direction) {
        $direction->update($request->only('nom', 'ministere_id'));
        return $direction;
    }

    public function destroy(Direction $direction) {
        $direction->delete();
        return response()->json(['message' => 'Direction supprimée']);
    }
}
