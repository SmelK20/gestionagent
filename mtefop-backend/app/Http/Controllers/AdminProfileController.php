<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminProfileController extends Controller
{
    /**
     * Afficher le profil admin connecté
     */
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Mettre à jour le profil admin (nom/email) OU changer le mot de passe
     */
    public function update(Request $request)
    {
        $admin = $request->user();

        // ✅ On rend nom/email optionnels (pour permettre changement mdp seul)
        // ✅ Et on utilise password/password_confirmation (comme ton frontend)
        $validated = $request->validate([
            'nom'   => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', 'unique:admins,email,' . $admin->id],

            // 🔐 changement mdp (optionnel)
            'current_password' => ['required_with:password', 'string'],
            'password' => ['sometimes', 'required', 'string', 'min:8', 'confirmed'],
            // 'confirmed' => attend password_confirmation automatiquement
        ]);

        // ✅ Mise à jour profil si fourni
        if (array_key_exists('nom', $validated)) {
            $admin->nom = $validated['nom'];
        }

        if (array_key_exists('email', $validated)) {
            $admin->email = $validated['email'];
        }

        // ✅ Changement mot de passe si fourni
        if (!empty($validated['password'])) {
            if (!Hash::check($validated['current_password'], $admin->password)) {
                return response()->json([
                    'message' => 'Mot de passe actuel incorrect.',
                    'errors' => [
                        'current_password' => ['Mot de passe actuel incorrect.']
                    ]
                ], 422);
            }

            $admin->password = Hash::make($validated['password']);
        }

        $admin->save();

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'admin' => $admin,
        ]);
    }
}
