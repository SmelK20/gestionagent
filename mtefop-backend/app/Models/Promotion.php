<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_id',
        'ancien_grade',
        'nouveau_grade',
        'date_promotion',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }
}
