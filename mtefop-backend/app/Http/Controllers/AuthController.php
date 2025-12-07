<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\AgentNouveau;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // ==========================
    // 🔹 ENREGISTREMENT ADMIN
    // ==========================
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins',
            'password' => 'required|string|min:8',
        ]);

        $admin = Admin::create([
            'nom' => $validated['nom'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Admin créé avec succès',
            'admin' => $admin,
        ]);
    }

    // ==========================
    // 🔹 CONNEXION UNIFIÉE (ADMIN + AGENT)
    // ==========================
    public function universalLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 🧩 1. Vérifier si c’est un administrateur
        $admin = Admin::where('email', $request->email)->first();
        if ($admin && Hash::check($request->password, $admin->password)) {
            $token = $admin->createToken('admin-token', ['role:admin'])->plainTextToken;

            return response()->json([
                'role' => 'admin',
                'token' => $token,
                'user' => $admin,
            ]);
        }

        // 🧩 2. Vérifier si c’est un agent
        $agent = AgentNouveau::where('email', $request->email)->first();
        if ($agent && Hash::check($request->password, $agent->mot_de_passe)) {
            $token = $agent->createToken('agent-token', ['role:agent'])->plainTextToken;

            return response()->json([
                'role' => 'agent',
                'token' => $token,
                'user' => $agent,
            ]);
        }

        // 🚫 Sinon, identifiants incorrects
        return response()->json(['message' => 'Identifiants incorrects'], 401);
    }

    // ==========================
    // 🔹 PROFIL UTILISATEUR CONNECTÉ
    // ==========================
    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    // ==========================
    // 🔹 DÉCONNEXION
    // ==========================
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
