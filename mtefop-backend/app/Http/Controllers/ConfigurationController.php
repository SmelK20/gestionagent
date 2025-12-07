<?php

namespace App\Http\Controllers;

use App\Models\Configuration;
use Illuminate\Http\Request;

class ConfigurationController extends Controller
{
    public function index() {
        return Configuration::first(); // Il n’y aura généralement qu’une seule configuration
    }

    public function update(Request $request, Configuration $configuration) {
        $validated = $request->validate([
            'code' => 'required|string',
            'niveaux_hiérarchiques' => 'required|integer|min:1',
            'workflow' => 'required|string'
        ]);
        $configuration->update($validated);
        return $configuration;
    }
}
