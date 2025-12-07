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
        'ancienne_service',
        'ancienne_fonction',
        'nouvelle_direction',
        'nouveau_service',
        'nouvelle_fonction',
        'date_affectation',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }
}
