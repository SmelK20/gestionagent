<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Affectation extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_id',
        'ancienne_direction',
        'ancien_service',
        'ancienne_fonction',
        'ancienne_date_affectation',
        'direction',
        'service',
        'fonction',
        'date_affectation',
    ];

    public function agent()
    {
        // ⚠️ Si ton modèle d’agent s’appelle autrement, adapte ici
        return $this->belongsTo(AgentNouveau::class, 'agent_id');
    }
}
