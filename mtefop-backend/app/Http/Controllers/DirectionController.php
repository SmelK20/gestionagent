<?php

namespace App\Http\Controllers;

use App\Models\Direction;
use Illuminate\Http\Request;

class DirectionController extends Controller
{
    public function index()
    {
        return Direction::orderBy('libelle')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'libelle' => 'required|string|max:150|unique:directions,libelle',
        ]);

        return Direction::create($data);
    }

    public function update(Request $request, $id)
    {
        $direction = Direction::findOrFail($id);

        $data = $request->validate([
            'libelle' => 'required|string|max:150|unique:directions,libelle,' . $id,
        ]);

        $direction->update($data);

        return $direction;
    }

    public function destroy($id)
    {
        $direction = Direction::findOrFail($id);
        $direction->delete();

        return response()->json(['message' => 'Direction supprimée']);
    }
}
