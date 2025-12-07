<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conge extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_id',
        'type',
        'date_debut',
        'date_fin',
        'duree',
        'statut',
        'motif',
        'remplacant',
    ];

    // 🔹 Relation vers l'agent
    public function agent()
    {
        return $this->belongsTo(\App\Models\AgentNouveau::class, 'agent_id');
    }
}
