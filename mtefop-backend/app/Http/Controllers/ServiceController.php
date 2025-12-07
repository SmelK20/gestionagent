<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index() {
        return Service::with('direction')->get();
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'nom' => 'required|string',
            'direction_id' => 'required|exists:directions,id'
        ]);
        return Service::create($validated);
    }

    public function update(Request $request, Service $service) {
        $service->update($request->only('nom', 'direction_id'));
        return $service;
    }

    public function destroy(Service $service) {
        $service->delete();
        return response()->json(['message' => 'Service supprimé']);
    }
}
