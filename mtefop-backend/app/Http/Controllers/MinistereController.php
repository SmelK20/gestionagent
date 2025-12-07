<?php

namespace App\Http\Controllers;

use App\Models\Ministere;
use Illuminate\Http\Request;

class MinistereController extends Controller {
    public function index() {
        return Ministere::all();
    }

    public function store(Request $request) {
        $validated = $request->validate(['nom' => 'required|unique:ministeres', 'description' => 'nullable']);
        return Ministere::create($validated);
    }

    public function update(Request $request, Ministere $ministere) {
        $ministere->update($request->only('nom', 'description'));
        return $ministere;
    }

    public function destroy(Ministere $ministere) {
        $ministere->delete();
        return response()->json(['message' => 'Ministère supprimé']);
    }
}
