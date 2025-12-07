<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_id',
        'date',
        'statut',
        'heure_arrivee',
        'heure_depart',
        'motif',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }
}
