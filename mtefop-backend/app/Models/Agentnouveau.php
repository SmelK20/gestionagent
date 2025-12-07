<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // Pour Auth
use Laravel\Sanctum\HasApiTokens;

class AgentNouveau extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $table = 'agents_nouveau';

    protected $fillable = [
        // Informations personnelles
        'immatricule',
        'cin',
        'nom',
        'prenom',
        'date_naissance',
        'adresse',
        'situation_matrimoniale',
        'sexe',
        'email',
        'telephone',

        // Informations professionnelles
        'corps',
        'grade',
        'categorie',
        'diplome',
        'specialisation',
        'service_affectation',
        'date_affectation',

        // Relations / hiérarchie
        'ministere',
        'direction',
        'service',
        'fonction',

        // 🔹 Nouveau champ pour mot de passe
        'mot_de_passe',
    ];

    protected $hidden = [
        'mot_de_passe', // On cache le mot de passe
        'remember_token',
    ];

    // 🔹 Mutator pour hasher automatiquement le mot de passe
    public function setMotDePasseAttribute($value)
    {
        if ($value) {
            $this->attributes['mot_de_passe'] = bcrypt($value);
        }
    }
}
