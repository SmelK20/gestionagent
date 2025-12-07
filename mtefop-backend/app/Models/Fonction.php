<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fonction extends Model {
    use HasFactory;

    protected $fillable = ['nom', 'description'];

    public function affectations() {
        return $this->hasMany(Affectation::class);
    }
}
