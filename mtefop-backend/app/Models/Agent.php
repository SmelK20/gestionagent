<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'poste',
        'service',
        'telephone',
        'statut',
        'dateentree',
        'mission',
    ];

    public function affectations()
    {
        return $this->hasMany(Affectation::class);
    }

    public function affectationActive()
    {
        return $this->hasOne(Affectation::class)->where('statut', 'active');
    }
}
