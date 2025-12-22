<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        return Service::orderBy('libelle')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'libelle' => 'required|string|max:150|unique:services,libelle',
        ]);

        return Service::create($data);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $data = $request->validate([
            'libelle' => 'required|string|max:150|unique:services,libelle,' . $id,
        ]);

        $service->update($data);

        return $service;
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json(['message' => 'Service supprimé']);
    }
}
