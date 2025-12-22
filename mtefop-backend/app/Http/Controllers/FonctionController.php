<?php

namespace App\Http\Controllers;

use App\Models\Fonction;
use Illuminate\Http\Request;

class FonctionController extends Controller
{
    public function index()
    {
        return Fonction::orderBy('libelle')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'libelle' => 'required|string|max:150|unique:fonctions,libelle',
        ]);

        return Fonction::create($data);
    }

    public function update(Request $request, $id)
    {
        $fonction = Fonction::findOrFail($id);

        $data = $request->validate([
            'libelle' => 'required|string|max:150|unique:fonctions,libelle,' . $id,
        ]);

        $fonction->update($data);

        return $fonction;
    }

    public function destroy($id)
    {
        $fonction = Fonction::findOrFail($id);
        $fonction->delete();

        return response()->json(['message' => 'Fonction supprimée']);
    }
}
