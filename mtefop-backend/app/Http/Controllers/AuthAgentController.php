<?php

namespace App\Http\Controllers;

use App\Models\AgentNouveau;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthAgentController extends Controller
{
    // 🔹 Connexion d'un agent
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'mot_de_passe' => 'required|string',
        ]);

        $agent = AgentNouveau::where('email', $request->email)->first();

        if (!$agent) {
            return response()->json(['message' => 'Email inconnu'], 404);
        }

        if (!Hash::check($request->mot_de_passe, $agent->mot_de_passe)) {
            return response()->json(['message' => 'Mot de passe incorrect'], 401);
        }

        // Supprimer les anciens tokens
        $agent->tokens()->delete();

        // Générer un nouveau token Sanctum
        $token = $agent->createToken('agent-token', ['role:agent'])->plainTextToken;

        return response()->json([
            'agent' => $agent,
            'token' => $token,
        ]);
    }

    // 🔹 Déconnexion
    public function logout(Request $request)
    {
        $request->user('agent')->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    // 🔹 Profil agent connecté
    public function profile(Request $request)
    {
        return response()->json($request->user('agent'));
    }
}
