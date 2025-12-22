<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
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

        // Relations (IDs)
        'ministere_id',
        'direction_id',
        'service_id',
        'fonction_id',

        // Mot de passe
        'mot_de_passe',
    ];

    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

    public function setMotDePasseAttribute($value)
    {
        if ($value) {
            $this->attributes['mot_de_passe'] = bcrypt($value);
        }
    }

    // ✅ Relations
    public function direction()
    {
        return $this->belongsTo(Direction::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function fonction()
    {
        return $this->belongsTo(Fonction::class);
    }

    public function ministere()
    {
        return $this->belongsTo(Ministere::class);
    }
}
